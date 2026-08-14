import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PdfFile } from '../../hooks/usePdfFiles';
import type { QfzConfig, YzConfig } from '../../lib/pdfProcessor';
import { addQfzStamp, addNormalStamp, normalizeToA4 } from '../../lib/pdfProcessor';
import JSZip from 'jszip';
import styles from './ProcessPanel.module.css';

interface LogEntry {
  id: string;
  name: string;
  status: 'processing' | 'done' | 'error';
  message?: string;
  blob?: Blob;
}

interface Props {
  pdfFiles: PdfFile[];
  stampBlob: Blob | null;
  password: string;
  qfzConfig: QfzConfig;
  yzConfig: YzConfig;
  normalizeA4: boolean;
}

export default function ProcessPanel({ pdfFiles, stampBlob, password, qfzConfig, yzConfig, normalizeA4 }: Props) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const cancelRef = useRef(false);

  const updateLog = (id: string, update: Partial<LogEntry>) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, ...update } : l));
  };

  const handleProcess = async () => {
    if (!pdfFiles.length) { alert(t('process.no_pdf')); return; }
    if (!stampBlob) { alert(t('process.no_stamp')); return; }

    cancelRef.current = false;
    setProcessing(true);

    const initialLogs: LogEntry[] = pdfFiles.map(f => ({
      id: f.id,
      name: f.name,
      status: 'processing',
    }));
    setLogs(initialLogs);

    for (const f of pdfFiles) {
      if (cancelRef.current) break;

      try {
        // 读取原始 PDF 字节
        let pdfBytes: ArrayBuffer | Uint8Array = await f.file.arrayBuffer();

        // 盖章前将页面统一归一化为 A4 画布（扫描件页面尺寸可能远大于/小于 A4，
        // 若不归一化，按 mm 计算的印章在非 A4 页面上视觉比例会失真）
        if (normalizeA4) {
          pdfBytes = await normalizeToA4(pdfBytes);
        }

        let result: Uint8Array | undefined;

        if (!qfzConfig.enabled && !yzConfig.enabled) {
          throw new Error('No task enabled');
        }

        if (qfzConfig.enabled) {
          result = await addQfzStamp(pdfBytes, stampBlob, qfzConfig, password || undefined);
        }

        if (yzConfig.enabled) {
          result = await addNormalStamp(
            result ?? pdfBytes,
            stampBlob,
            yzConfig,
            f.id,
            password || undefined
          );
        }

        if (!result) {
          throw new Error('Process failed');
        }

        const blob = new Blob([result.buffer as ArrayBuffer], { type: 'application/pdf' });
        updateLog(f.id, { status: 'done', blob });
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        const displayMsg = errMsg === 'single_page_qfz'
          ? t('process.single_page_qfz')
          : errMsg;
        updateLog(f.id, { status: 'error', message: displayMsg });
      }
    }

    setProcessing(false);
  };

  const handleDownload = (log: LogEntry) => {
    if (!log.blob) return;
    const url = URL.createObjectURL(log.blob);
    const a = document.createElement('a');
    const baseName = log.name.replace(/\.pdf$/i, '');
    a.href = url;
    a.download = `${baseName}_stamped.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const done = logs.filter(l => l.status === 'done' && l.blob);
    if (!done.length) return;

    if (done.length === 1) {
      handleDownload(done[0]);
      return;
    }

    const zip = new JSZip();
    for (const log of done) {
      if (log.blob) {
        const baseName = log.name.replace(/\.pdf$/i, '');
        zip.file(`${baseName}_stamped.pdf`, log.blob);
      }
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stamped_pdfs.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = logs.filter(l => l.status === 'done').length;
  const hasResults = logs.length > 0;

  return (
    <div className={styles.container}>
      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          id="start-process"
          className={`${styles.startBtn} ${processing ? styles.processing : ''}`}
          onClick={handleProcess}
          disabled={processing}
        >
          {processing ? (
            <>
              <span className={styles.spinnerSm} />
              {t('process.processing')}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 8c0 2.76-2.24 5-5 5S3 10.76 3 8s2.24-5 5-5c1.23 0 2.36.45 3.23 1.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="8" r="2" fill="currentColor"/>
                <path d="M11 3l.5 2.5-2.5-.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('process.start')}
            </>
          )}
        </button>

        {processing && (
          <button
            className={styles.cancelBtn}
            onClick={() => { cancelRef.current = true; }}
            id="cancel-process"
          >
            {t('process.cancel')}
          </button>
        )}

        {hasResults && doneCount > 0 && !processing && (
          <button
            className={styles.downloadAllBtn}
            onClick={handleDownloadAll}
            id="download-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v7M4.5 7l2.5 2.5L9.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {doneCount > 1 ? t('process.download_all') : t('process.download')}
          </button>
        )}
      </div>

      {/* Log */}
      {hasResults && (
        <div className={styles.logPanel}>
          <div className={styles.logTitle}>{t('process.log_title')}</div>
          <div className={styles.logItems}>
            {logs.map(log => (
              <div key={log.id} className={`${styles.logItem} ${styles[log.status]}`}>
                <span className={styles.logIcon}>
                  {log.status === 'processing' && <span className={styles.spinnerXs} />}
                  {log.status === 'done' && '✓'}
                  {log.status === 'error' && '✗'}
                </span>
                <span className={styles.logName} title={log.name}>{log.name}</span>
                {log.status === 'error' && (
                  <span className={styles.logErr}>{log.message}</span>
                )}
                {log.status === 'done' && log.blob && (
                  <button
                    className={styles.dlBtn}
                    onClick={() => handleDownload(log)}
                  >
                    ↓
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
