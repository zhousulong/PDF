import { useEffect, useRef, useState } from 'react';
import type { QfzConfig, YzConfig } from '../../lib/pdfProcessor';
import { calcQfzPageList, calcQfzGroups } from '../../lib/stampAlgorithm';
import styles from './PdfPreview.module.css';

interface Props {
  pdfDoc: import('pdfjs-dist').PDFDocumentProxy | null;
  qfzConfig?: QfzConfig;
  yzConfig?: YzConfig;
  totalPages: number;
  stampUrl: string | null;
  clickable?: boolean;
  onPageClick?: (xRatio: number, yRatio: number, pageNum: number) => void;
  onRemoveStamp?: (pageNum: number, stampIndex?: number) => void;
}

export default function PreviewGridView({
  pdfDoc, qfzConfig, yzConfig, totalPages, stampUrl, clickable, onPageClick, onRemoveStamp
}: Props) {
  const [pageList, setPageList] = useState<number[]>([]);

  useEffect(() => {
    if (qfzConfig || yzConfig) {
      // Since they can be layered, and YZ needs all pages, or QFZ might need specific pages.
      // Actually, if we show YZ, we usually show all pages. If only QFZ, we only need qfz pages.
      // But it's safest to just show all pages if YZ is enabled, or if QFZ is enabled alone, use QFZ list.
      if (yzConfig) {
        const list = [];
        for (let i = 1; i <= totalPages; i++) list.push(i);
        setPageList(list);
      } else if (qfzConfig) {
        setPageList(calcQfzPageList(totalPages, qfzConfig.mode));
      }
    } else {
      setPageList([]);
    }
  }, [totalPages, qfzConfig, yzConfig]);

  if (!pdfDoc) return null;

  return (
    <div className={styles.qfzGrid}>
      {pageList.map(pageNum => (
        <PreviewGridItem
          key={pageNum}
          pageNum={pageNum}
          pdfDoc={pdfDoc}
          qfzConfig={qfzConfig}
          yzConfig={yzConfig}
          totalPages={totalPages}
          stampUrl={stampUrl}
          clickable={clickable}
          onPageClick={onPageClick}
          onRemoveStamp={onRemoveStamp}
        />
      ))}
    </div>
  );
}

function PreviewGridItem({
  pageNum, pdfDoc, qfzConfig, yzConfig, totalPages, stampUrl, clickable, onPageClick, onRemoveStamp
}: {
  pageNum: number; pdfDoc: import('pdfjs-dist').PDFDocumentProxy;
  qfzConfig?: QfzConfig; yzConfig?: YzConfig; totalPages: number; stampUrl: string | null;
  clickable?: boolean;
  onPageClick?: (xRatio: number, yRatio: number, pageNum: number) => void;
  onRemoveStamp?: (pageNum: number, stampIndex?: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);
  // 印章图片真实宽高比（H/W），用于骑缝章预览高度计算
  const [stampAspect, setStampAspect] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;
    const taskRef: { current: import('pdfjs-dist').RenderTask | null } = { current: null };

    (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;
        
        // Scale up for high-res view (Retina display support)
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
  }, [pageNum, pdfDoc]);

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
    onPageClick(x, y, pageNum);
  };

  const overlay = (() => {
    if (!stampUrl || !canvasSize) return null;

    let qfzOverlay = null;
    let yzOverlay = null;

    if (qfzConfig) {
      const pageList = calcQfzPageList(totalPages, qfzConfig.mode);
      const groups = calcQfzGroups(pageList, qfzConfig.maxfgs);
      let sliceIndex = -1;
      let sliceCount = 1;
      for (const group of groups) {
        const idx = group.pageIndices.indexOf(pageNum);
        if (idx !== -1) {
          sliceIndex = idx;
          sliceCount = group.sliceCount;
          break;
        }
      }
      if (sliceIndex === -1) return null;

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

      if (sliceIndex !== -1) {
        qfzOverlay = (
          <div style={wrapStyle} className={styles.stampOverlayWrap}>
            <img src={stampUrl} style={imgStyle} alt="qfz preview" />
          </div>
        );
      }
    }

    if (yzConfig) {
      let isCustom = false;
      let positions: Array<{ posX: number, posY: number }> = [];

      if (yzConfig.pages === 'custom') {
        isCustom = true;
        const posArr = yzConfig.customPositions[pageNum];
        if (Array.isArray(posArr)) {
          positions = posArr;
        }
      } else {
        if ((yzConfig.pages === 'first' && pageNum === 1) ||
            (yzConfig.pages === 'last' && pageNum === totalPages) ||
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
                    pointerEvents: 'none', // 不阻碍画布点击
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
                        onRemoveStamp?.(pageNum, idx);
                      }}
                      style={{ pointerEvents: 'auto' }} // 按钮需要响应
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

  return (
    <div className={styles.qfzGridItemWrap} ref={containerRef}>
      <div className={styles.canvasInner}>
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${clickable ? styles.clickable : ''}`}
          onClick={handleCanvasClick}
        />
        {overlay}
      </div>
      <div className={styles.qfzGridPageNum}>{pageNum}</div>
    </div>
  );
}
