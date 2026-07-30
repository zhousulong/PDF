import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SeoSection.module.css';

interface FaqItem {
  q: string;
  a: string;
}

export const SeoSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Dynamic document title and meta description update on language change
  useEffect(() => {
    const title = t('meta.title');
    const description = t('meta.description');
    
    if (title) {
      document.title = title;
    }
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    const htmlRoot = document.getElementById('html-root') || document.documentElement;
    if (htmlRoot) {
      htmlRoot.setAttribute('lang', i18n.language === 'en' ? 'en' : 'zh-CN');
    }
  }, [i18n.language, t]);

  const faqs = (t('seo.faqs', { returnObjects: true }) as FaqItem[]) || [];

  return (
    <section className={styles.seoContainer} aria-label="SEO Description and FAQ">
      <div className={styles.heroHeader}>
        <h1 className={styles.h1Title}>{t('seo.h1')}</h1>
        <p className={styles.subtitle}>{t('seo.sub')}</p>
      </div>

      <div className={styles.guideCard}>
        <h2 className={styles.guideTitle}>
          <span>📖</span> {t('seo.guide_title')}
        </h2>
        <p className={styles.guideText}>{t('seo.guide_text')}</p>
      </div>

      <div className={styles.faqSection}>
        <h2 className={styles.faqHeading}>
          <span>💡</span> {t('seo.faq_title')}
        </h2>
        <div className={styles.faqGrid}>
          {Array.isArray(faqs) &&
            faqs.map((faq, index) => (
              <article key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>
                  <span className={styles.faqBadge}>Q</span>
                  <span>{faq.q}</span>
                </h3>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SeoSection;
