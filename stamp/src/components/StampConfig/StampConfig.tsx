import { useTranslation } from 'react-i18next';
import type { QfzConfig, YzConfig } from '../../lib/pdfProcessor';
import styles from './StampConfig.module.css';

interface Props {
  mode: 'qfz' | 'yz';
  qfzConfig: QfzConfig;
  yzConfig: YzConfig;
  onQfzChange: <K extends keyof QfzConfig>(key: K, val: QfzConfig[K]) => void;
  onYzChange: <K extends keyof YzConfig>(key: K, val: YzConfig[K]) => void;
  onPreviewClick?: (xRatio: number, yRatio: number) => void;
  /** 盖章前将 PDF 页面统一归一化为 A4 画布 */
  normalizeA4?: boolean;
  onNormalizeA4Change?: (v: boolean) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.toggleThumb} />
      {label && <span className={styles.toggleLabel}>{label}</span>}
    </button>
  );
}

export default function StampConfig({
  mode, qfzConfig, yzConfig, onQfzChange, onYzChange, normalizeA4, onNormalizeA4Change
}: Props) {
  const { t } = useTranslation();

  const numInput = (
    id: string,
    value: number,
    onChange: (n: number) => void,
    min?: number,
    max?: number,
    step?: number
  ) => (
    <input
      id={id}
      type="number"
      value={value}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={e => onChange(Number(e.target.value))}
    />
  );

  /**
   * 统一的设置开关行：左侧开关 + 右侧两行（标题 / 描述）。
   * 所有高级选项均使用此布局，保持视觉一致。
   */
  const settingToggle = (
    checked: boolean,
    onChange: (v: boolean) => void,
    title: string,
    desc: string
  ) => (
    <div className={styles.settingRow}>
      <Toggle checked={checked} onChange={onChange} />
      <div className={styles.settingText}>
        <span className={styles.settingTitle}>{title}</span>
        <span className={styles.settingDesc}>{desc}</span>
      </div>
    </div>
  );

  // A4 归一化开关（与模式无关，两种模式下均展示）
  const normalizeToggle = (normalizeA4 !== undefined && onNormalizeA4Change) ? (
    settingToggle(
      normalizeA4,
      onNormalizeA4Change,
      t('config.normalize_a4'),
      t('config.normalize_a4_hint')
    )
  ) : null;

  if (mode === 'qfz') {
    return (
      <div className={styles.container} key="qfz">
        <div className={`${styles.innerContainer} ${!qfzConfig.enabled ? styles.disabledSection : ''}`}>
          {/* 模式 */}
        <Field label={t('config.qfz.mode')}>
          <select
            id="qfz-mode"
            value={qfzConfig.mode}
            onChange={e => onQfzChange('mode', Number(e.target.value) as 0 | 2 | 3)}
          >
            <option value={0}>{t('config.qfz.mode_all')}</option>
            <option value={2}>{t('config.qfz.mode_odd')}</option>
            <option value={3}>{t('config.qfz.mode_even')}</option>
          </select>
        </Field>

        {/* 位置 */}
        <Field label={t('config.qfz.side')}>
          <div className={styles.btnGroup}>
            {(['right', 'left', 'top', 'bottom'] as const).map(s => (
              <button
                key={s}
                id={`qfz-side-${s}`}
                className={`${styles.segBtn} ${qfzConfig.side === s ? styles.segActive : ''}`}
                onClick={() => onQfzChange('side', s)}
              >
                {t(`config.qfz.side_${s}`)}
              </button>
            ))}
          </div>
        </Field>

        {/* 纵向位置 */}
        <Field label={`${t('config.qfz.pos')} — ${qfzConfig.verticalPos}%`} hint={t('config.qfz.pos_hint')}>
          <div className={styles.rangeRow}>
            <input
              id="qfz-vpos"
              type="range"
              min={0}
              max={100}
              step={1}
              value={qfzConfig.verticalPos}
              onChange={e => onQfzChange('verticalPos', Number(e.target.value))}
              className={styles.range}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={qfzConfig.verticalPos}
              onChange={e => onQfzChange('verticalPos', Number(e.target.value))}
              className={styles.rangeNum}
            />
          </div>
        </Field>

        {/* 尺寸 */}
        <Field label={t('config.qfz.size')} hint={t('config.qfz.size_hint')}>
          {numInput('qfz-size', qfzConfig.sizeMm, v => onQfzChange('sizeMm', v), 5, 200)}
        </Field>

        {/* 透明度 */}
        <Field label={`${t('config.qfz.opacity')} — ${qfzConfig.opacity}%`}>
          <div className={styles.rangeRow}>
            <input
              id="qfz-opacity"
              type="range"
              min={1}
              max={100}
              step={1}
              value={qfzConfig.opacity}
              onChange={e => onQfzChange('opacity', Number(e.target.value))}
              className={styles.range}
            />
            <input
              type="number"
              min={1}
              max={100}
              value={qfzConfig.opacity}
              onChange={e => onQfzChange('opacity', Number(e.target.value))}
              className={styles.rangeNum}
            />
          </div>
        </Field>

        {/* 最大分割数 */}
        <Field label={t('config.qfz.maxfgs')} hint={t('config.qfz.maxfgs_hint')}>
          {numInput('qfz-maxfgs', qfzConfig.maxfgs, v => onQfzChange('maxfgs', v), 2, 100)}
        </Field>

        {/* 高级选项 */}
        <div className={styles.toggleGroup}>
          {settingToggle(
            qfzConfig.removeWhite,
            v => onQfzChange('removeWhite', v),
            t('config.stamp.remove_white'),
            t('config.stamp.remove_white_hint')
          )}
          {settingToggle(
            qfzConfig.multiply,
            v => onQfzChange('multiply', v),
            t('config.stamp.multiply'),
            t('config.stamp.multiply_hint')
          )}
          {normalizeToggle}
        </div>
        </div>
      </div>
    );
  }

  // YZ mode
  return (
    <div className={styles.container} key="yz">
      <div className={`${styles.innerContainer} ${!yzConfig.enabled ? styles.disabledSection : ''}`}>
        {/* 盖章页面 */}
      <Field label={t('config.yz.pages')}>
        <div className={styles.btnGroup}>
          {(['first', 'last', 'all', 'custom'] as const).map(p => (
            <button
              key={p}
              id={`yz-pages-${p}`}
              className={`${styles.segBtn} ${yzConfig.pages === p ? styles.segActive : ''}`}
              onClick={() => onYzChange('pages', p)}
            >
              {t(`config.yz.pages_${p}`)}
            </button>
          ))}
        </div>
        {yzConfig.pages === 'custom' && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            <div className={styles.hint} style={{ color: 'var(--color-accent)' }}>
              {t('config.yz.custom_hint')}
            </div>
            {Object.values(yzConfig.customPositions).some(
              filePosMap => Object.values(filePosMap).some(arr => arr.length > 0)
            ) && (
              <div className={styles.formGroup}>
                <div className={styles.hint}>
                  {t('config.yz.custom_pages_set')}: {
                    Object.values(yzConfig.customPositions)
                      .flatMap(filePosMap => Object.keys(filePosMap))
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(', ')
                  }
                  <button
                    onClick={() => onYzChange('customPositions', {})}
                    style={{
                      marginLeft: 'var(--space-2)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-danger, #ef4444)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-xs)',
                      textDecoration: 'underline'
                    }}
                  >
                    {t('config.yz.custom_clear')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Field>

      {/* 尺寸 */}
      <Field label={t('config.yz.size')} hint={t('config.yz.size_hint')}>
        {numInput('yz-size', yzConfig.sizeMm, v => onYzChange('sizeMm', v), 5, 200)}
      </Field>

      {/* 旋转 */}
      <Field label={`${t('config.yz.rotation')} — ${yzConfig.rotation}°`}>
        <div className={styles.rangeRow}>
          <input
            id="yz-rotation"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={yzConfig.rotation}
            onChange={e => onYzChange('rotation', Number(e.target.value))}
            className={styles.range}
          />
          <input
            type="number"
            min={-180}
            max={180}
            value={yzConfig.rotation}
            onChange={e => onYzChange('rotation', Number(e.target.value))}
            className={styles.rangeNum}
          />
        </div>
      </Field>

      {/* 透明度 */}
      <Field label={`${t('config.yz.opacity')} — ${yzConfig.opacity}%`}>
        <div className={styles.rangeRow}>
          <input
            id="yz-opacity"
            type="range"
            min={1}
            max={100}
            step={1}
            value={yzConfig.opacity}
            onChange={e => onYzChange('opacity', Number(e.target.value))}
            className={styles.range}
          />
          <input
            type="number"
            min={1}
            max={100}
            value={yzConfig.opacity}
            onChange={e => onYzChange('opacity', Number(e.target.value))}
            className={styles.rangeNum}
          />
        </div>
      </Field>

      {/* 位置 — custom 模式用点击预览, 其他模式用滑块 */}
      {yzConfig.pages === 'custom' ? (
        <div className={styles.canvasClickBanner}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="var(--color-accent)" strokeWidth="1.2"/>
            <path d="M8 5v3.5M8 10v.5" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span>{t('config.yz.custom_placement_guide')}</span>
        </div>
      ) : (
        <>
          <div className={styles.posRow}>
            <Field label={`X — ${Math.round(yzConfig.posX * 100)}%`}>
              <input
                id="yz-pos-x"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(yzConfig.posX * 100)}
                onChange={e => onYzChange('posX', Number(e.target.value) / 100)}
                className={styles.range}
              />
            </Field>
            <Field label={`Y — ${Math.round(yzConfig.posY * 100)}%`}>
              <input
                id="yz-pos-y"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(yzConfig.posY * 100)}
                onChange={e => onYzChange('posY', Number(e.target.value) / 100)}
                className={styles.range}
              />
            </Field>
          </div>
          <p className={styles.posHint}>{t('config.yz.drag_hint')}</p>
        </>
      )}

      {/* 高级选项 */}
      <div className={styles.toggleGroup}>
        {settingToggle(
          yzConfig.removeWhite,
          v => onYzChange('removeWhite', v),
          t('config.stamp.remove_white'),
          t('config.stamp.remove_white_hint')
        )}
        {settingToggle(
          yzConfig.multiply,
          v => onYzChange('multiply', v),
          t('config.stamp.multiply'),
          t('config.stamp.multiply_hint')
        )}
        {settingToggle(
          yzConfig.random,
          v => onYzChange('random', v),
          t('config.yz.random'),
          t('config.yz.random_hint')
        )}
        {normalizeToggle}
        </div>
      </div>
    </div>
  );
}
