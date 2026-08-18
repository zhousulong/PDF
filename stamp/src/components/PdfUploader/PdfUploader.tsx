import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { PdfFile } from '../../hooks/usePdfFiles';
import type { SourceKind } from '../../lib/documentToPdf';
import styles from './PdfUploader.module.css';

function sourceKey(kind: SourceKind): string {
  if (kind === 'image' || kind === 'docx' || kind === 'xlsx' || kind === 'txt' || kind === 'pdf') {
    return kind;
  }
  return 'other';
}

function formatFileError(error: string, t: TFunction): string {
  if (error === 'legacy_office') return t('file.err_legacy');
  if (error === 'unsupported_format') return t('file.err_unsupported');
  return t('file.err_convert');
}

interface Props {
  files: PdfFile[];
  password: string;
  onPasswordChange: (p: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}

export default function PdfUploader({
  files,
  password,
  onPasswordChange,
  onAddFiles,
  onRemoveFile,
  onClearAll,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      onAddFiles(dropped);
    },
    [onAddFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${files.length > 0 ? styles.hasFiles : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        id="pdf-drop-zone"
        onKeyDown={e => e.key === 'Enter' && handleClick()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.svg,.docx,.xlsx,.xlsm,.csv,.txt,.doc,.xls,application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
          multiple
          className={styles.hiddenInput}
          onChange={handleInputChange}
          id="pdf-file-input"
        />

        {files.length === 0 ? (
          <div className={styles.placeholder}>
            <div className={styles.uploadIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 4v14M7 11l7-7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 21h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <p className={styles.hint}>{t('upload.pdf.hint')}</p>
            <p className={styles.hintSub}>{t('upload.pdf.multi')}</p>
            <p className={styles.formats}>{t('upload.pdf.formats')}</p>
          </div>
        ) : (
          <div className={styles.fileCountBadge} onClick={e => e.stopPropagation()}>
            <span className={`badge badge-accent`}>
              {t('file.files_selected', { count: files.length })}
            </span>
            <span className={styles.addMore}>+ {t('upload.pdf.hint')}</span>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          <div className={styles.fileListHeader}>
            <span className={styles.fileListTitle}>{t('file.file_list')}</span>
            <button className={styles.clearBtn} onClick={onClearAll} id="clear-all-pdfs">
              {t('file.clear_all')}
            </button>
          </div>
          <div className={styles.fileItems}>
            {files.map(f => (
              <div key={f.id} className={`${styles.fileItem} ${f.error ? styles.fileItemError : ''}`}>
                <span className={styles.fileIcon}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 5h6M4 7h6M4 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                </span>
                <span className={styles.fileMeta}>
                  <span className={styles.fileName} title={f.originalName}>{f.originalName}</span>
                  <span className={styles.fileStatus}>
                    <span className={styles.sourceBadge}>{t(`file.source_${sourceKey(f.sourceKind)}`)}</span>
                    {f.converting && <span className={styles.converting}>{t('file.converting')}</span>}
                    {!f.converting && !f.error && f.sourceKind !== 'pdf' && (
                      <span className={styles.converted}>{t('file.converted')}</span>
                    )}
                    {f.error && <span className={styles.fileError}>{formatFileError(f.error, t)}</span>}
                  </span>
                </span>
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemoveFile(f.id)}
                  aria-label={`Remove ${f.originalName}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password */}
      <div className={styles.passwordRow}>
        <label htmlFor="pdf-password">{t('upload.pdf.password')}</label>
        <input
          id="pdf-password"
          type="password"
          placeholder={t('upload.pdf.password_placeholder')}
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
