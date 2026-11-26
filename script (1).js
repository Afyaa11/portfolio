// ==========================================
// أدوات مساعدة
// ==========================================

// قراءة/حفظ آمن في localStorage (بعض المتصفحات تمنعه في الوضع الخاص)
function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* تجاهل */ }
}

// هل المستخدم مفعّل خيار "تقليل الحركة" في جهازه؟
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================
// 1. إدارة اللغة والاتجاهات (الافتراضي: الإنجليزية)
// ==========================================
function updateLanguage(lang) {
    const langToggleBtn = document.getElementById('lang-toggle');
    storageSet('site_lang', lang);

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

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });

    // نخبر باقي الأجزاء (مثل الكتابة التلقائية) أن اللغة تغيّرت
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function currentLang() {
    return storageGet('site_lang') || 'en';
}

// ==========================================
// 2. الوضع الليلي (Dark Mode)
// ==========================================
function applyTheme(theme) {
    const btn = document.getElementById('theme-toggle');
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme !== 'dark');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    storageSet('site_theme', theme);
}

function initTheme() {
    // إذا ما فيه اختيار محفوظ، نتبع إعداد جهاز الزائر
    const saved = storageGet('site_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (systemDark ? 'dark' : 'light'));

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }
}

// ==========================================
// 3. الكتابة التلقائية (Typing Effect)
// ==========================================
const typedWords = {
    en: ['Data Analytics', 'Front-End Development', 'Power BI Dashboards', 'UI/UX Design'],
    ar: ['تحليل البيانات', 'تطوير واجهات الويب', 'لوحات Power BI التفاعلية', 'تصميم UI/UX']
};

function initTyping() {
    const el = document.getElementById('typedText');
    if (!el) return;

    let timer = null;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let words = typedWords[currentLang()] || typedWords.en;

    // بدون حركة: نعرض الكلمات كلها مرة وحدة
    if (prefersReducedMotion) {
        const showAll = () => { el.textContent = (typedWords[currentLang()] || typedWords.en).join(' • '); };
        showAll();
        document.addEventListener('langchange', showAll);
        return;
    }

    function tick() {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        el.textContent = word.slice(0, charIndex);

        let delay = deleting ? 45 : 90;
        if (!deleting && charIndex === word.length) {
            delay = 1600;          // وقفة بعد اكتمال الكلمة
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 350;
        }
        timer = setTimeout(tick, delay);
    }

    // عند تغيير اللغة نبدأ من جديد بكلمات اللغة الثانية
    document.addEventListener('langchange', (e) => {
        clearTimeout(timer);
        words = typedWords[e.detail] || typedWords.en;
        wordIndex = 0; charIndex = 0; deleting = false;
        el.textContent = '';
        timer = setTimeout(tick, 300);
    });

    tick();
}

// ==========================================
// 4. ظهور العناصر عند التمرير (Scroll Reveal)
// ==========================================
function initReveal() {
    const targets = document.querySelectorAll(
        '.section-title, .skill-card, .project-card, .contact-section > p, .contact-links, .puzzle-img'
    );
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    document.body.classList.add('js-reveal');
    targets.forEach((el, i) => {
        el.classList.add('reveal');
        // تأخير بسيط متدرّج للكروت اللي جنب بعض
        el.style.transitionDelay = `${(i % 3) * 120}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
                // نشيل التأخير بعد الظهور عشان ما يأثر على الـ hover
                setTimeout(() => { entry.target.style.transitionDelay = ''; }, 900);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
}

// ==========================================
// 5. شريط التقدّم + زر العودة للأعلى
// ==========================================
function initScrollUI() {
    const bar = document.getElementById('scrollProgress');
    const topBtn = document.getElementById('backToTop');
    const navbar = document.querySelector('.navbar');

    function onScroll() {
        const scrollTop = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const percent = max > 0 ? (scrollTop / max) * 100 : 0;

        if (bar) bar.style.width = `${percent}%`;
        if (topBtn) topBtn.classList.toggle('show', scrollTop > 500);
        if (navbar) navbar.classList.toggle('scrolled', scrollTop > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (topBtn) {
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ==========================================
// 6. تمييز رابط القسم الحالي في النافبار
// ==========================================
function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
}

// ==========================================
// 7. ميلان الكروت ثلاثي الأبعاد (للكمبيوتر فقط)
// ==========================================
function initTilt() {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || prefersReducedMotion) return;

    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // ما نميّل كرت Power BI لما الماوس فوق اللوحة نفسها
            if (e.target.closest('.powerbi-wrapper')) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;   // من -0.5 إلى 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
            card.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
            card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
            card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
            card.classList.add('tilting');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('tilting');
            card.style.removeProperty('--rx');
            card.style.removeProperty('--ry');
        });
    });
}

// ==========================================
// 8. نسخ الإيميل + رسالة تأكيد
// ==========================================
let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function initCopyEmail() {
    const btn = document.querySelector('.copy-email-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.dataset.email;
        const msg = currentLang() === 'ar' ? 'تم نسخ الإيميل ✅' : 'Email copied ✅';
        try {
            await navigator.clipboard.writeText(email);
            showToast(msg);
        } catch (e) {
            // حل بديل للمتصفحات القديمة
            const temp = document.createElement('textarea');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
            showToast(msg);
        }
    });
}

// ==========================================
// 9. النافذة المنبثقة للشهادات (Cert Modal)
// ==========================================
function openCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';   // منع تمرير الصفحة خلف النافذة
    }
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// إغلاق Modal عند النقر خارجه
window.addEventListener('click', (event) => {
    const modal = document.getElementById('certModal');
    if (event.target === modal) closeCertModal();
});

// ==========================================
// التشغيل بعد جاهزية الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTyping();
    updateLanguage(currentLang());

    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateLanguage(currentLang() === 'en' ? 'ar' : 'en');
        });
    }

    initReveal();
    initScrollUI();
    initActiveNav();
    initTilt();
    initCopyEmail();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeCertModal();
    });
});
