import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PdfFile } from '../../hooks/usePdfFiles';
import type { YzConfig, QfzConfig } from '../../lib/pdfProcessor';
import MultiFilePreviewGrid from './MultiFilePreviewGrid';
import styles from './PdfPreview.module.css';

interface Props {
  files: PdfFile[];
  password?: string;
  /** Called when user clicks on a page in YZ mode. fileId identifies which file. */
  onPageClick?: (xRatio: number, yRatio: number, pageNum: number, fileId: string) => void;
  onRemoveStamp?: (pageNum: number, stampIndex: number | undefined, fileId: string) => void;
  clickable?: boolean;
  stampUrl?: string | null;
  yzConfig?: YzConfig;
  qfzConfig?: QfzConfig;
}

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjsLib() {
  if (!pdfjsLib) {
    const lib = await import('pdfjs-dist');
    lib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.js',
      import.meta.url
    ).href;
    pdfjsLib = lib;
  }
  return pdfjsLib;
}

export type PdfDocEntry = {
  pdfFile: PdfFile;
  doc: import('pdfjs-dist').PDFDocumentProxy;
  pageCount: number;
};

export default function PdfPreview({ files, password, onPageClick, onRemoveStamp, clickable, stampUrl, yzConfig, qfzConfig }: Props) {
  const { t } = useTranslation();
  const [docEntries, setDocEntries] = useState<PdfDocEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Track doc refs so we can cancel stale loads
  const loadedFilesRef = useRef<string>('');

  useEffect(() => {
    if (!files.length) {
      setDocEntries([]);
      return;
    }

    const key = files.map(f => f.id + f.file.size).join('|');
    if (loadedFilesRef.current === key) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const lib = await getPdfjsLib();
        const entries: PdfDocEntry[] = [];
        for (const pdfFile of files) {
          if (cancelled) break;
          try {
            const arrayBuffer = await pdfFile.file.arrayBuffer();
            const loadingTask = lib.getDocument({
              data: arrayBuffer,
              password: password || undefined,
            });
            const doc = await loadingTask.promise;
            entries.push({ pdfFile, doc, pageCount: doc.numPages });
          } catch (e) {
            console.error('PDF load error for', pdfFile.name, e);
          }
        }
        if (!cancelled) {
          setDocEntries(entries);
          loadedFilesRef.current = key;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [files, password]);

  if (!files.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="4" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
            <path d="M12 13h12M12 17h12M12 21h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
        <p>{t('preview.no_file')}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.canvasWrap}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <span>{t('preview.loading')}</span>
          </div>
        )}
        {!loading && docEntries.length > 0 && (
          <MultiFilePreviewGrid
            docEntries={docEntries}
            qfzConfig={qfzConfig}
            yzConfig={yzConfig}
            stampUrl={stampUrl ?? null}
            clickable={clickable}
            onPageClick={onPageClick}
            onRemoveStamp={onRemoveStamp}
          />
        )}
      </div>
    </div>
  );
}
