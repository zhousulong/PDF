import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeMode } from '../../hooks/useTheme';
import { CHANGELOG } from '../../changelog';
import styles from './Header.module.css';

// Read version from changelog (first entry = latest)
const APP_VERSION = CHANGELOG[0]?.version ?? '1.0.0';

// ── 主题图标 ──────────────────────────────────────────────
function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M10.89 4.11l1.06-1.06M3.05 11.95l1.06-1.06"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function IconSystem() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 13h6M7 10v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Changelog 图标 ────────────────────────────────────────
function IconChangelog() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1" width="11" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="11" cy="11" r="2.5" fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth="1"/>
      <path d="M11 9.8v1.2l.8.8" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const THEME_CYCLE: ThemeMode[] = ['dark', 'light', 'system'];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { mode, setTheme } = useTheme();
  const [changelogOpen, setChangelogOpen] = useState(false);
  const changelogRef = useRef<HTMLDivElement>(null);

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(mode);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  // Close changelog panel when clicking outside
  useEffect(() => {
    if (!changelogOpen) return;
    const handler = (e: MouseEvent) => {
      if (changelogRef.current && !changelogRef.current.contains(e.target as Node)) {
        setChangelogOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [changelogOpen]);

  const themeKey = mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : 'system';
  const themeLabel = t(`header.theme.${themeKey}`);
  const ThemeIcon = mode === 'dark' ? IconMoon : mode === 'light' ? IconSun : IconSystem;

  return (
    <header className={styles.header}>
      {/* ── Logo ── */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="18" height="18" rx="3" stroke="var(--color-accent)" strokeWidth="1.5"/>
            <path d="M6 8h10M6 11h10M6 14h6" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="16" cy="14" r="3" fill="var(--color-accent-glow)" stroke="var(--color-accent)" strokeWidth="1.2"/>
            <path d="M14.5 14h3M16 12.5v3" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </span>
        <div className={styles.logoText}>
          <div className={styles.logoTitleRow}>
            <span className={styles.logoName}>{t('app.title')}</span>
            <span className={styles.versionBadge}>v{APP_VERSION}</span>
          </div>
          <span className={styles.logoSub}>{t('app.subtitle')}</span>
        </div>
      </div>

      <div className={styles.center}>
        <span className={styles.tagline}>{t('app.tagline')}</span>
      </div>

      <div className={styles.actions}>
        {/* Changelog 按钮 */}
        <div className={styles.changelogWrap} ref={changelogRef}>
          <button
            id="changelog-btn"
            className={`${styles.changelogBtn} ${changelogOpen ? styles.changelogBtnActive : ''}`}
            onClick={() => setChangelogOpen(v => !v)}
            aria-label={t('header.changelog_view')}
            title={t('header.changelog')}
          >
            <IconChangelog />
            <span className={styles.changelogBtnLabel}>{t('header.changelog')}</span>
          </button>

          {changelogOpen && (
            <div className={styles.changelogPanel} role="dialog" aria-label={t('header.changelog')}>
              <div className={styles.changelogHeader}>
                <span className={styles.changelogTitle}>{t('header.changelog')}</span>
                <button
                  className={styles.changelogClose}
                  onClick={() => setChangelogOpen(false)}
                  aria-label={t('header.close')}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className={styles.changelogList}>
                {CHANGELOG.map((entry, i) => (
                  <div key={entry.version} className={`${styles.changelogEntry} ${i === 0 ? styles.changelogLatest : ''}`}>
                    <div className={styles.changelogEntryHeader}>
                      <span className={styles.changelogVersion}>v{entry.version}</span>
                      {i === 0 && <span className={styles.latestBadge}>{t('header.latest')}</span>}
                      <span className={styles.changelogDate}>{entry.date}</span>
                    </div>
                    <ul className={styles.changelogChanges}>
                      {((i18n.language === 'en' && entry.changesEn) ? entry.changesEn : entry.changes).map((c, ci) => (
                        <li key={ci}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 主题切换 */}
        <button
          className={styles.themeBtn}
          onClick={cycleTheme}
          aria-label={t('header.theme.aria_label', { label: themeLabel })}
          id="theme-switcher"
          title={themeLabel}
        >
          <ThemeIcon />
          <span className={styles.themeBtnLabel}>{themeLabel}</span>
        </button>

        {/* 语言切换 */}
        <button
          className={styles.langBtn}
          onClick={toggleLang}
          aria-label="Switch language"
          id="lang-switcher"
        >
          <span className={i18n.language === 'zh' ? styles.langActive : ''}>中</span>
          <span className={styles.langDivider}>/</span>
          <span className={i18n.language === 'en' ? styles.langActive : ''}>EN</span>
        </button>
      </div>
    </header>
  );
}
