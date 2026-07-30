import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StampUploader.module.css';

interface Props {
  stampUrl: string | null;
  stampName: string;
  onLoad: (file: File) => void;
  onClear: () => void;
}

export default function StampUploader({ stampUrl, stampName, onLoad, onClear }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.type.startsWith('image/') || f.name.match(/\.(png|jpg|jpeg)$/i))) {
        onLoad(f);
      }
    },
    [onLoad]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { onLoad(f); e.target.value = ''; }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !stampUrl && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        id="stamp-drop-zone"
        onKeyDown={e => e.key === 'Enter' && !stampUrl && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          className={styles.hiddenInput}
          onChange={handleInputChange}
          id="stamp-file-input"
        />

        {stampUrl ? (
          <div className={styles.preview}>
            <img
              src={stampUrl}
              alt="stamp preview"
              className={styles.previewImg}
            />
            <div className={styles.previewOverlay}>
              <span className={styles.previewName}>{stampName}</span>
              <div className={styles.previewActions}>
                <button
                  className={styles.changeBtn}
                  onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                  id="change-stamp"
                >
                  {t('upload.stamp.change')}
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={e => { e.stopPropagation(); onClear(); }}
                  id="remove-stamp"
                >
                  {t('upload.stamp.remove')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.stampIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="12" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="14" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
                <path d="M7 22h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M11 19v3M17 19v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <p className={styles.hint}>{t('upload.stamp.hint')}</p>
            <p className={styles.hint2}>{t('upload.stamp.hint2')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
