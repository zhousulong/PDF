import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ModePicker.module.css';

interface Props {
  onConfirm: (qfz: boolean, yz: boolean) => void;
}

function flyTransform(from: HTMLElement, to: HTMLElement): string {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const scale = Math.max(0.12, Math.min(b.width / a.width, b.height / a.height) * 0.92);
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}

export default function ModePicker({ onConfirm }: Props) {
  const { t } = useTranslation();
  const [qfz, setQfz] = useState(true);
  const [yz, setYz] = useState(false);
  const [phase, setPhase] = useState<'pick' | 'fly'>('pick');
  const [fly, setFly] = useState<{ qfz?: string; yz?: string }>({});
  const qfzRef = useRef<HTMLButtonElement>(null);
  const yzRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    if (!qfz && !yz) return;

    const next: { qfz?: string; yz?: string } = {};
    const tabQfz = document.getElementById('tab-qfz');
    const tabYz = document.getElementById('tab-yz');
    if (qfz && qfzRef.current && tabQfz) next.qfz = flyTransform(qfzRef.current, tabQfz);
    if (yz && yzRef.current && tabYz) next.yz = flyTransform(yzRef.current, tabYz);
    setFly(next);
    setPhase('fly');
    tabQfz?.classList.add('tab-inbound');
    tabYz?.classList.add('tab-inbound');

    window.setTimeout(() => {
      onConfirm(qfz, yz);
      tabQfz?.classList.remove('tab-inbound');
      tabYz?.classList.remove('tab-inbound');
    }, 680);
  };

  return (
    <div
      className={`${styles.overlay} ${phase === 'fly' ? styles.overlayFly : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mode-picker-title"
    >
      <div className={`${styles.panel} ${phase === 'fly' ? styles.panelFly : ''}`}>
        <p className={styles.kicker}>{t('onboard.kicker')}</p>
        <h2 id="mode-picker-title" className={styles.title}>{t('onboard.title')}</h2>
        <p className={styles.sub}>{t('onboard.sub')}</p>

        <div className={styles.cards}>
          <button
            ref={qfzRef}
            type="button"
            className={`${styles.card} ${qfz ? styles.cardOn : ''} ${phase === 'fly' && qfz ? styles.cardFly : ''} ${phase === 'fly' && !qfz ? styles.cardFade : ''}`}
            style={phase === 'fly' && fly.qfz ? { transform: fly.qfz } : undefined}
            onClick={() => phase === 'pick' && setQfz(v => !v)}
            aria-pressed={qfz}
          >
            <span className={styles.icon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 1"/>
                <line x1="4" y1="1" x2="4" y2="13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1.5"/>
              </svg>
            </span>
            <strong>{t('tabs.qfz')}</strong>
            <em>{t('onboard.qfz_desc')}</em>
            <span className={styles.check}>{qfz ? '✓' : ''}</span>
          </button>

          <button
            ref={yzRef}
            type="button"
            className={`${styles.card} ${yz ? styles.cardOn : ''} ${phase === 'fly' && yz ? styles.cardFly : ''} ${phase === 'fly' && !yz ? styles.cardFade : ''}`}
            style={phase === 'fly' && fly.yz ? { transform: fly.yz } : undefined}
            onClick={() => phase === 'pick' && setYz(v => !v)}
            aria-pressed={yz}
          >
            <span className={styles.icon} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1"/>
                <line x1="3" y1="12" x2="11" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <strong>{t('tabs.yz')}</strong>
            <em>{t('onboard.yz_desc')}</em>
            <span className={styles.check}>{yz ? '✓' : ''}</span>
          </button>
        </div>

        <button
          type="button"
          className={styles.confirm}
          disabled={(!qfz && !yz) || phase === 'fly'}
          onClick={handleConfirm}
        >
          {t('onboard.confirm')}
        </button>
        <p className={styles.hint}>{t('onboard.hint')}</p>
      </div>
    </div>
  );
}
