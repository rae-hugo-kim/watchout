const tutorialSections = Array.from(document.querySelectorAll('.tutorial'));
const checks = tutorialSections
  .map((section) => section.querySelector('input[type="checkbox"]'))
  .filter(Boolean);

const KEY = 'watchout-checks';

const saved = JSON.parse(localStorage.getItem(KEY) || '[]');

function saveState() {
  const state = checks.map((box) => box.checked);
  localStorage.setItem(KEY, JSON.stringify(state));
}

function updateCompletedStyle() {
  tutorialSections.forEach((section, i) => {
    section.classList.toggle('done', checks[i]?.checked === true);
  });
}

checks.forEach((box, i) => {
  box.checked = Boolean(saved[i]);

  box.addEventListener('change', () => {
    saveState();
    updateCompletedStyle();

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

updateCompletedStyle();
