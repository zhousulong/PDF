import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './zh.json';
import en from './en.json';

// 优先识别 URL 参数中的 ?lang=zh 或 ?lang=en，其次读取 localStorage
function getInitialLanguage(): string {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'en' || langParam === 'zh') {
      return langParam;
    }
  }
  return localStorage.getItem('lang') || 'zh';
}

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: initialLang,
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
  });

// 同步更新 html[lang] 和 URL 参数，确保中文作为默认主语言
function syncHtmlLang(lng: string) {
  document.documentElement.lang = lng === 'zh' ? 'zh-CN' : 'en';
  if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    if (lng === 'en') {
      url.searchParams.set('lang', 'en');
    } else {
      // 中文为默认主语言，保持根地址干净
      url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url.toString());
  }
}
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
