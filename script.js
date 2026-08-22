// ==========================================
// إدارة اللغة والاتجاهات (الافتراضي: الإنجليزية)
// ==========================================

function updateLanguage(lang) {
    const langToggleBtn = document.getElementById('lang-toggle');
    
    // حفظ اللغة في الـ LocalStorage
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

    // ترجمة النصوص بناءً على خصائص data-ar و data-en
    const elementsToTranslate = document.querySelectorAll('[data-ar][data-en]');
    elementsToTranslate.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
}

// تنفيذ الكود بمجرد جاهزية عناصر الصفحة (DOM Ready)
document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب اللغة المحفوظة أو اعتماد الإنجليزية كخيار افتراضي أولي
    const savedLang = localStorage.getItem('site_lang') || 'en';
    updateLanguage(savedLang);

    // 2. ربط زر التبديل عند الضغط عليه
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = localStorage.getItem('site_lang') || 'en';
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            updateLanguage(newLang);
        });
    }

    // 3. إغلاق النافذة المنبثقة عند الضغط على زر Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeCertModal();
        }
    });
});

// ==========================================
// النافذة المنبثقة للشهادات (Cert Modal)
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

// إغلاق Modal عند النقر خارجه
window.onclick = function(event) {
    const modal = document.getElementById("certModal");
    if (event.target === modal) {
        closeCertModal();
    }
};
