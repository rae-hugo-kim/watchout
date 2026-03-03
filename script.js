const tutorialSections = Array.from(document.querySelectorAll('.tutorial'));
const checks = tutorialSections
  .map((section) => section.querySelector('input[type="checkbox"]'))
  .filter(Boolean);

const pages = Array.from(document.querySelectorAll('.page'));
const pageButtons = Array.from(document.querySelectorAll('[data-go]'));
const goAdvancedBtn = document.getElementById('go-advanced');
const nextPageBtn = document.getElementById('next-page');
const progressText = document.getElementById('progress-text');

const CHECK_KEY = 'watchout-checks';
const PAGE_KEY = 'watchout-page';

const savedChecks = JSON.parse(localStorage.getItem(CHECK_KEY) || '[]');
const savedPage = localStorage.getItem(PAGE_KEY) || '1';

function saveChecks() {
  const state = checks.map((box) => box.checked);
  localStorage.setItem(CHECK_KEY, JSON.stringify(state));
}

function getDoneCount() {
  return checks.filter((box) => box.checked).length;
}

function allDone() {
  return checks.length > 0 && getDoneCount() === checks.length;
}

function updateCompletedStyle() {
  tutorialSections.forEach((section, i) => {
    section.classList.toggle('done', checks[i]?.checked === true);
  });
}

function updateUnlockState() {
  const done = getDoneCount();
  const unlocked = allDone();

  progressText.textContent = `진행률: ${done} / ${checks.length} 완료`;

  goAdvancedBtn.disabled = !unlocked;
  nextPageBtn.disabled = !unlocked;

  if (unlocked) {
    nextPageBtn.textContent = '심화 과정으로 이동';
  } else {
    nextPageBtn.textContent = '4개를 모두 완료하면 열려요';
  }
}

function goPage(pageNumber) {
  if (pageNumber === '2' && !allDone()) return;

  pages.forEach((page) => {
    page.classList.toggle('hidden', page.dataset.page !== pageNumber);
  });

  pageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.go === pageNumber);
  });

  localStorage.setItem(PAGE_KEY, pageNumber);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

checks.forEach((box, i) => {
  box.checked = Boolean(savedChecks[i]);

  box.addEventListener('change', () => {
    saveChecks();
    updateCompletedStyle();
    updateUnlockState();

    if (box.checked) {
      const nextSection = tutorialSections[i + 1];
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nextSection.classList.add('pulse');
        setTimeout(() => nextSection.classList.remove('pulse'), 1200);
      }
    }
  });
});

pageButtons.forEach((btn) => {
  btn.addEventListener('click', () => goPage(btn.dataset.go));
});

nextPageBtn?.addEventListener('click', () => goPage('2'));

updateCompletedStyle();
updateUnlockState();
goPage(savedPage === '2' && allDone() ? '2' : '1');
