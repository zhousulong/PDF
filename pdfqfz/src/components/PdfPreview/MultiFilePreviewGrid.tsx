/**
 * MultiFilePreviewGrid.tsx
 *
 * 展示多个 PDF 文件的所有页面：
 *  - 骑缝章：将所有文件的页面合并连续编号，按全局 pageList 计算骑缝章分组
 *  - 普通章：每个文件独立，通过 fileId 区分 customPositions
 */
import { useEffect, useRef, useState } from 'react';
import type { QfzConfig, YzConfig } from '../../lib/pdfProcessor';
import { calcQfzPageList, calcQfzGroups } from '../../lib/stampAlgorithm';
import type { PdfDocEntry } from './PdfPreview';
import styles from './PdfPreview.module.css';

interface Props {
  docEntries: PdfDocEntry[];
  qfzConfig?: QfzConfig;
  yzConfig?: YzConfig;
  stampUrl: string | null;
  clickable?: boolean;
  onPageClick?: (xRatio: number, yRatio: number, pageNum: number, fileId: string) => void;
  onRemoveStamp?: (pageNum: number, stampIndex: number | undefined, fileId: string) => void;
}

/** A single page descriptor in the merged global page list */
interface GlobalPage {
  fileId: string;
  fileIndex: number;
  localPageNum: number;    // 1-indexed within the file
  globalPageNum: number;   // 1-indexed across all files
  pdfDoc: import('pdfjs-dist').PDFDocumentProxy;
  localTotalPages: number;
}

export default function MultiFilePreviewGrid({
  docEntries, qfzConfig, yzConfig, stampUrl, clickable, onPageClick, onRemoveStamp,
}: Props) {
  // Build a flat list of all pages across all files
  const globalPages: GlobalPage[] = [];
  let globalPageNum = 0;
  let totalGlobalPages = 0;
  for (const entry of docEntries) totalGlobalPages += entry.pageCount;
  for (let fi = 0; fi < docEntries.length; fi++) {
    const entry = docEntries[fi];
    for (let p = 1; p <= entry.pageCount; p++) {
      globalPageNum++;
      globalPages.push({
        fileId: entry.pdfFile.id,
        fileIndex: fi,
        localPageNum: p,
        globalPageNum,
        pdfDoc: entry.doc,
        localTotalPages: entry.pageCount,
      });
    }
  }

  // Pre-compute QFZ groups across all global pages
  const qfzPageList = qfzConfig ? calcQfzPageList(totalGlobalPages, qfzConfig.mode) : [];
  const qfzGroups = qfzConfig ? calcQfzGroups(qfzPageList, qfzConfig.maxfgs) : [];

  return (
    <div className={styles.qfzGrid}>
      {globalPages.map((gp) => (
        <PreviewGridItem
          key={`${gp.fileId}-${gp.localPageNum}`}
          globalPage={gp}
          docEntries={docEntries}
          qfzConfig={qfzConfig}
          qfzGroups={qfzGroups}
          yzConfig={yzConfig}
          stampUrl={stampUrl}
          clickable={clickable}
          onPageClick={onPageClick}
          onRemoveStamp={onRemoveStamp}
          showFileLabel={docEntries.length > 1}
        />
      ))}
    </div>
  );
}

interface ItemProps {
  globalPage: GlobalPage;
  docEntries: PdfDocEntry[];
  qfzConfig?: QfzConfig;
  qfzGroups: import('../../lib/stampAlgorithm').QfzGroup[];
  yzConfig?: YzConfig;
  stampUrl: string | null;
  clickable?: boolean;
  onPageClick?: (xRatio: number, yRatio: number, pageNum: number, fileId: string) => void;
  onRemoveStamp?: (pageNum: number, stampIndex: number | undefined, fileId: string) => void;
  showFileLabel: boolean;
}

function PreviewGridItem({
  globalPage, docEntries, qfzConfig, qfzGroups, yzConfig, stampUrl,
  clickable, onPageClick, onRemoveStamp, showFileLabel,
}: ItemProps) {
  const { fileId, fileIndex, localPageNum, globalPageNum, pdfDoc, localTotalPages } = globalPage;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  // 印章图片真实宽高比（H/W），用于骑缝章预览高度计算
  const [stampAspect, setStampAspect] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;
    const taskRef: { current: import('pdfjs-dist').RenderTask | null } = { current: null };

    (async () => {
      try {
        const page = await pdfDoc.getPage(localPageNum);
        if (cancelled) return;

        const scale = typeof window !== 'undefined' ? window.devicePixelRatio * 1.5 : 3.0;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        taskRef.current = page.render({ canvasContext: ctx, viewport });
        await taskRef.current.promise;

        if (!cancelled) {
          setCanvasSize({ w: viewport.width, h: viewport.height });
        }
      } catch (e: any) {
        if (e.name !== 'RenderingCancelledException') {
          console.error(e);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (taskRef.current) taskRef.current.cancel();
    };
  }, [localPageNum, pdfDoc]);

  useEffect(() => {
    if (!stampUrl) { setStampAspect(1); return; }
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0) setStampAspect(img.naturalHeight / img.naturalWidth);
    };
    img.src = stampUrl;
  }, [stampUrl]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!clickable || !onPageClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPageClick(x, y, localPageNum, fileId);
  };

  // ── QFZ overlay (uses globalPageNum) ──────────────────────────────────────
  const overlay = (() => {
    if (!stampUrl || !canvasSize) return null;

    let qfzOverlay = null;
    let yzOverlay = null;

    if (qfzConfig) {
      let sliceIndex = -1;
      let sliceCount = 1;
      for (const group of qfzGroups) {
        const idx = group.pageIndices.indexOf(globalPageNum);
        if (idx !== -1) {
          sliceIndex = idx;
          sliceCount = group.sliceCount;
          break;
        }
      }
      if (sliceIndex === -1) {
        // This global page is not in the QFZ page list → no QFZ stamp
      } else {
        let sliceWidthRatio = 1;
        let offsetRatio = 0;
        if (sliceCount > 1) {
          const w1 = 1 / 3;
          const wRest = (1 - w1) / (sliceCount - 1);
          if (sliceIndex === 0) {
            sliceWidthRatio = w1;
            offsetRatio = 0;
          } else if (sliceIndex === sliceCount - 1) {
            sliceWidthRatio = 1 - w1 - wRest * (sliceCount - 2);
            offsetRatio = w1 + wRest * (sliceIndex - 1);
          } else {
            sliceWidthRatio = wRest;
            offsetRatio = w1 + wRest * (sliceIndex - 1);
          }
        }

        const basePct = (qfzConfig.sizeMm / 210) * 100;
        const wrapStyle: React.CSSProperties = {
          position: 'absolute',
          overflow: 'hidden',
          opacity: qfzConfig.opacity / 100,
          pointerEvents: 'none',
        };
        const imgStyle: React.CSSProperties = {
          position: 'absolute',
          maxWidth: 'none',
          mixBlendMode: qfzConfig.multiply ? 'multiply' : 'normal',
        };

        if (qfzConfig.side === 'right' || qfzConfig.side === 'left') {
          wrapStyle.width = `${basePct * sliceWidthRatio}%`;
          // sizeMm 代表印章总宽度，高度 = sizeMm × (H/W) / 297
          wrapStyle.height = `${(qfzConfig.sizeMm * stampAspect / 297) * 100}%`;
          wrapStyle.top = `${qfzConfig.verticalPos}%`;
          wrapStyle.transform = `translateY(-${qfzConfig.verticalPos}%)`;
          imgStyle.width = `${100 / sliceWidthRatio}%`;
          imgStyle.height = 'auto'; // 让图片宽高比自然保持
          if (qfzConfig.side === 'right') {
            wrapStyle.right = 0;
            imgStyle.right = `${-(100 - (offsetRatio + sliceWidthRatio) * 100) / sliceWidthRatio}%`;
          } else {
            wrapStyle.left = 0;
            imgStyle.left = `${-(offsetRatio * 100) / sliceWidthRatio}%`;
          }
        } else {
          wrapStyle.height = `${(basePct * sliceWidthRatio * 210) / 297}%`;
          wrapStyle.width = `${(qfzConfig.sizeMm / 210) * 100}%`;
          wrapStyle.left = `${qfzConfig.verticalPos}%`;
          wrapStyle.transform = `translateX(-${qfzConfig.verticalPos}%)`;
          imgStyle.width = '100%';
          imgStyle.height = `${100 / sliceWidthRatio}%`;
          if (qfzConfig.side === 'top') {
            wrapStyle.top = 0;
            imgStyle.top = `${-(offsetRatio * 100) / sliceWidthRatio}%`;
          } else {
            wrapStyle.bottom = 0;
            imgStyle.bottom = `${-(100 - (offsetRatio + sliceWidthRatio) * 100) / sliceWidthRatio}%`;
          }
        }

        qfzOverlay = (
          <div style={wrapStyle} className={styles.stampOverlayWrap}>
            <img src={stampUrl} style={imgStyle} alt="qfz preview" />
          </div>
        );
      }
    }

    // ── YZ overlay (per-file, uses localPageNum) ────────────────────────────
    if (yzConfig) {
      let isCustom = false;
      let positions: Array<{ posX: number, posY: number }> = [];

      if (yzConfig.pages === 'custom') {
        isCustom = true;
        const filePosMap = yzConfig.customPositions[fileId] ?? {};
        const posArr = filePosMap[localPageNum];
        if (Array.isArray(posArr)) {
          positions = posArr;
        }
      } else {
        if ((yzConfig.pages === 'first' && localPageNum === 1) ||
            (yzConfig.pages === 'last' && localPageNum === localTotalPages) ||
            yzConfig.pages === 'all') {
          positions = [{ posX: yzConfig.posX, posY: yzConfig.posY }];
        }
      }

      if (positions.length > 0) {
        const stampWidthPct = (yzConfig.sizeMm / 210) * 100;
        yzOverlay = (
          <>
            {positions.map((pos, idx) => {
              const leftPct = pos.posX * 100;
              const topPct  = pos.posY * 100;
              return (
                <div
                  key={idx}
                  className={styles.stampOverlayWrap}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top:  `${topPct}%`,
                    width: `${stampWidthPct}%`,
                    transform: `translate(-50%, -50%)`,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  <img
                    src={stampUrl}
                    className={styles.stampOverlay}
                    style={{
                      width: '100%',
                      opacity: yzConfig.opacity / 100,
                      transform: `rotate(${yzConfig.rotation}deg)`,
                      mixBlendMode: yzConfig.multiply ? 'multiply' : 'normal',
                    }}
                    alt="stamp preview"
                    draggable={false}
                  />
                  {isCustom && (
                    <button
                      className={styles.closeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStamp?.(localPageNum, idx, fileId);
                      }}
                      style={{ pointerEvents: 'auto' }}
                      title="Remove stamp"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </>
        );
      }
    }

    return (
      <>
        {qfzOverlay}
        {yzOverlay}
      </>
    );
  })();

  // File separator label (shown above the first page of each file when multiple files)
  const isFirstPageOfFile = localPageNum === 1;
  const fileName = docEntries[fileIndex]?.pdfFile.name ?? '';

  return (
    <div className={styles.qfzGridItemWrap}>
      {showFileLabel && isFirstPageOfFile && (
        <div className={styles.fileLabel}>
          <span className={styles.fileLabelIcon}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1.5" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
            </svg>
          </span>
          <span className={styles.fileLabelText} title={fileName}>{fileName}</span>
          <span className={styles.fileLabelPages}>{docEntries[fileIndex]?.pageCount}p</span>
        </div>
      )}
      <div className={styles.canvasInner}>
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${clickable ? styles.clickable : ''}`}
          onClick={handleCanvasClick}
        />
        {overlay}
      </div>
      <div className={styles.qfzGridPageNum}>
        {showFileLabel ? `p${localPageNum}` : localPageNum}
        {showFileLabel && (
          <span className={styles.globalPageBadge}> · #{globalPageNum}</span>
        )}
      </div>
    </div>
  );
}
