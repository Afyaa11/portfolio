/// ==========================================
// 1. برمجة زر الليل والنهار (Dark/Light Mode)
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggleBtn.textContent = '🌙';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️';
    }
});

// ==========================================
// 2. برمجة تحويل اللغة الفوري (الافتراضي: الإنجليزية)
// ==========================================
const langToggleBtn = document.getElementById('lang-toggle');

// استرجاع اللغة المحفوظة أو الاعتماد على الإنجليزية 'en' كافتراضي
let currentLang = localStorage.getItem('site_lang') || 'en';

// دالة تحديث النصوص والاتجاه حسب اللغة
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);

    if (lang === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.style.fontFamily = "'Inter', sans-serif";
        if (langToggleBtn) langToggleBtn.textContent = 'عربي';
    } else {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.style.fontFamily = "'Tajawal', sans-serif";
        if (langToggleBtn) langToggleBtn.textContent = 'English';
    }

    // تحديث النصوص لجميع العناصر التي تحتوي على data-en و data-ar
    const elementsToTranslate = document.querySelectorAll('[data-ar][data-en]');
    elementsToTranslate.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
}

// تطبيق اللغة الافتراضية فور فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});

// عند الضغط على زر التبديل
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        updateLanguage(newLang);
    });
}

// ==========================================
// 3. برمجة حركة ظهور العناصر عند التمرير (Scroll Animation)
// ==========================================
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    observer.observe(el);
});

// ==========================================
// 4. النافذة المنبثقة للشهادة (Cert Modal)
// ==========================================
function openCertModal() {
    const modal = document.getElementById("certModal");
    if (modal) modal.style.display = "flex";
}

function closeCertModal() {
    const modal = document.getElementById("certModal");
    if (modal) modal.style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("certModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};