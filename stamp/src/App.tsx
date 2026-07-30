import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header/Header';
import PdfUploader from './components/PdfUploader/PdfUploader';
import StampUploader from './components/StampUploader/StampUploader';
import StampConfig, { Toggle } from './components/StampConfig/StampConfig';
import PdfPreview from './components/PdfPreview/PdfPreview';
import ProcessPanel from './components/ProcessPanel/ProcessPanel';
import SeoSection from './components/SeoSection/SeoSection';
import { usePdfFiles } from './hooks/usePdfFiles';
import { useStamp } from './hooks/useStamp';
import styles from './App.module.css';

type Mode = 'qfz' | 'yz';

export default function App() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('qfz');
  const [mobilePanel, setMobilePanel] = useState<'config' | 'preview'>('config');

  const { files, password, setPassword, addFiles, removeFile, clearAll } = usePdfFiles();
  const {
    stampBlob, stampUrl, stampName,
    qfzConfig, yzConfig,
    loadStamp, clearStamp, updateQfz, updateYz,
  } = useStamp();

  /**
   * 普通章模式点击预览页面 → 设置该文件对应页面上的印章位置
   */
  const handlePreviewClick = (x: number, y: number, pageNum: number, fileId: string) => {
    if (mode === 'yz') {
      const safeX = Math.min(1, Math.max(0, x));
      const safeY = Math.min(1, Math.max(0, y));

      if (yzConfig.pages === 'custom') {
        const filePosMap = yzConfig.customPositions[fileId] ?? {};
        const current = filePosMap[pageNum];
        const arr = Array.isArray(current) ? current : [];
        updateYz('customPositions', {
          ...yzConfig.customPositions,
          [fileId]: {
            ...filePosMap,
            [pageNum]: [...arr, { posX: safeX, posY: safeY }],
          },
        });
      } else {
        updateYz('posX', safeX);
        updateYz('posY', safeY);
      }
    }
  };

  /**
   * 普通章自定义模式下移除某页上的某个印章
   */
  const handleRemoveStamp = (pageNum: number, stampIndex: number | undefined, fileId: string) => {
    if (yzConfig.enabled && yzConfig.pages === 'custom') {
      const filePosMap = { ...(yzConfig.customPositions[fileId] ?? {}) };
      if (filePosMap[pageNum]) {
        const arr = [...filePosMap[pageNum]];
        if (stampIndex !== undefined) {
          arr.splice(stampIndex, 1);
          if (arr.length === 0) delete filePosMap[pageNum];
          else filePosMap[pageNum] = arr;
        } else {
          delete filePosMap[pageNum];
        }
        updateYz('customPositions', {
          ...yzConfig.customPositions,
          [fileId]: filePosMap,
        });
      }
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        {/* ── 左侧配置区 ── */}
        <aside className={`${styles.sidebar} ${mobilePanel === 'config' ? styles.mobileActive : styles.mobileHidden}`}>
          {/* Mode Tabs */}
          <div className={styles.tabBar}>
            <div
              id="tab-qfz"
              role="button"
              tabIndex={0}
              className={`${styles.tab} ${mode === 'qfz' ? styles.tabActive : ''}`}
              onClick={() => setMode('qfz')}
              onKeyDown={e => e.key === 'Enter' && setMode('qfz')}
            >
              <div className={styles.tabToggleWrap} onClick={e => e.stopPropagation()}>
                <Toggle 
                  checked={qfzConfig.enabled} 
                  onChange={v => { updateQfz('enabled', v); if (v) setMode('qfz'); }} 
                />
              </div>
              <span className={styles.tabIcon}>
                {/* 骑缝章图标 */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1"/>
                  <line x1="4" y1="1" x2="4" y2="13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1.5"/>
                </svg>
              </span>
              {t('tabs.qfz')}
            </div>
            <div
              id="tab-yz"
              role="button"
              tabIndex={0}
              className={`${styles.tab} ${mode === 'yz' ? styles.tabActive : ''}`}
              onClick={() => setMode('yz')}
              onKeyDown={e => e.key === 'Enter' && setMode('yz')}
            >
              <div className={styles.tabToggleWrap} onClick={e => e.stopPropagation()}>
                <Toggle 
                  checked={yzConfig.enabled} 
                  onChange={v => { updateYz('enabled', v); if (v) setMode('yz'); }} 
                />
              </div>
              <span className={styles.tabIcon}>
                {/* 印章图标 */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1"/>
                  <line x1="3" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              {t('tabs.yz')}
            </div>
          </div>

          <div className={styles.sidebarContent}>
            {/* PDF Upload */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('upload.pdf.title')}</h2>
              <PdfUploader
                files={files}
                password={password}
                onPasswordChange={setPassword}
                onAddFiles={addFiles}
                onRemoveFile={removeFile}
                onClearAll={clearAll}
              />
            </section>

            <hr className="divider" />

            {/* Stamp Upload */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('upload.stamp.title')}</h2>
              <StampUploader
                stampUrl={stampUrl}
                stampName={stampName}
                onLoad={loadStamp}
                onClear={clearStamp}
              />
            </section>

            <hr className="divider" />

            {/* Config */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {mode === 'qfz' ? t('config.qfz.title') : t('config.yz.title')}
              </h2>
              <StampConfig
                mode={mode}
                qfzConfig={qfzConfig}
                yzConfig={yzConfig}
                onQfzChange={updateQfz}
                onYzChange={updateYz}
              />
            </section>

            <hr className="divider" />

            {/* Process */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('process.title')}</h2>
              <ProcessPanel
                pdfFiles={files}
                stampBlob={stampBlob}
                password={password}
                qfzConfig={qfzConfig}
                yzConfig={yzConfig}
              />
            </section>
          </div>
        </aside>

        {/* ── 右侧预览区 ── */}
        <section className={`${styles.preview} ${mobilePanel === 'preview' ? styles.mobileActive : styles.mobileHidden}`} aria-label={t('preview.title')}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>{t('preview.title')}</h2>
            {mode === 'yz' && files.length > 0 && (
              <span className={`badge badge-accent ${styles.clickBadge}`}>
                {t('config.yz.pos_hint')}
              </span>
            )}
          </div>
          <div className={styles.previewBody}>
            <PdfPreview
              files={files}
              password={password}
              onPageClick={handlePreviewClick}
              onRemoveStamp={handleRemoveStamp}
              clickable={mode === 'yz'}
              stampUrl={stampUrl}
              yzConfig={yzConfig.enabled ? yzConfig : undefined}
              qfzConfig={qfzConfig.enabled ? qfzConfig : undefined}
            />
          </div>
        </section>
      </main>

      {/* Mobile Bottom TabBar */}
      <nav className={styles.mobileTabBar} aria-label="Panel navigation">
        <button
          className={`${styles.mobileTab} ${mobilePanel === 'config' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobilePanel('config')}
          aria-pressed={mobilePanel === 'config'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span>{t('tabs.qfz') === '骑缝章' ? '配置' : 'Config'}</span>
        </button>
        <button
          className={`${styles.mobileTab} ${mobilePanel === 'preview' ? styles.mobileTabActive : ''}`}
          onClick={() => setMobilePanel('preview')}
          aria-pressed={mobilePanel === 'preview'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 9C1 9 4 3 9 3s8 6 8 6-3 6-8 6S1 9 1 9Z" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
          <span>{t('preview.title')}</span>
        </button>
      </nav>

      {/* SEO & FAQ Landing Section */}
      <SeoSection />

      {/* Footer — desktop only */}
      <footer className={styles.footer}>
        <span>PDF骑缝章工具 · {new Date().getFullYear()}</span>
        <span className={styles.footerSep}>·</span>
        <span>{t('app.tagline')}</span>
      </footer>
    </div>
  );
}
