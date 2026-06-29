// ====== HEADER SCROLL ======
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ====== BURGER MENU ======
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('mobile-open');
});
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('mobile-open'));
});

// ====== COURSE TABS ======
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.course-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ====== MODAL ======
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');

function openModal(title, price) {
  modalTitle.textContent = title;
  modalPrice.textContent = price;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ====== ORDER SUBMIT ======
function submitOrder(e) {
  e.preventDefault();
  closeModal();
  showToast('Заказ оформлен! Мы свяжемся с вами в течение 15 минут.');
  e.target.reset();
}

// ====== CONTACT FORM ======
function submitForm(e) {
  e.preventDefault();
  showToast('Заявка отправлена! Ожидайте звонка от нашего менеджера.');
  e.target.reset();
}

// ====== TOAST ======
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// ====== SCROLL REVEAL ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.course-card, .benefit-card, .review-card, .process__step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ====== PHONE MASK ======
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.startsWith('7')) {
      let m = v.match(/^(\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      this.value = !m[2] ? '+7' :
        '+7 (' + m[2] + (m[3] ? ') ' + m[3] : '') +
        (m[4] ? '-' + m[4] : '') + (m[5] ? '-' + m[5] : '');
    } else {
      this.value = v ? '+' + v : '';
    }
  });
});

// ====== SMOOTH STAT COUNTER ======
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 50;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current).toLocaleString('ru') + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const nums = entry.target.querySelectorAll('.stat__num');
    nums.forEach(num => {
      const text = num.textContent;
      if (text.includes('3 400')) animateCounter(num, 3400, '+');
      else if (text.includes('12')) animateCounter(num, 12, '');
      else if (text.includes('97')) animateCounter(num, 97, '%');
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);
