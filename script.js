// ==========================================
// 1. إدارة اللغة والاتجاهات (الافتراضي: الإنجليزية)
// ==========================================
const langToggleBtn = document.getElementById('lang-toggle');

// استرجاع اللغة المحفوظة أو اعتماد الإنجليزية كافتراضي
let currentLang = localStorage.getItem('site_lang') || 'en';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);

    if (lang === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('ar-mode');
        document.body.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
        if (langToggleBtn) langToggleBtn.textContent = 'عربي';
    } else {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('ar-mode');
        document.body.style.fontFamily = "'Tajawal', sans-serif";
        if (langToggleBtn) langToggleBtn.textContent = 'English';
    }

    // ترجمة جميع العناصر التي تحتوي على data-en و data-ar
    const elementsToTranslate = document.querySelectorAll('[data-ar][data-en]');
    elementsToTranslate.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
}
// ==========================================
// 2. النافذة المنبثقة للشهادات (Cert Modal)
// ==========================================
function openCertModal() {
    const modal = document.getElementById("certModal");
    if (modal) {
        modal.classList.add("show");
        modal.style.display = "flex";
    }
}

function closeCertModal() {
    const modal = document.getElementById("certModal");
    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }
}

// ==========================================
// 3. مستمعي الأحداث (Event Listeners)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // تطبيق اللغة فور تحميل الصفحة
    updateLanguage(currentLang);

    // زر تغيير اللغة
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            updateLanguage(newLang);
        });
    }

    // إغلاق النافذة المنبثقة عند النقر خارج الصورة
    window.addEventListener('click', (event) => {
        const modal = document.getElementById("certModal");
        if (event.target === modal) {
            closeCertModal();
        }
    });

    // إغلاق النافذة المنبثقة بزر Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeCertModal();
        }
    });
});
};
