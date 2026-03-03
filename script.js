const checks = document.querySelectorAll('input[type="checkbox"]');
const KEY = "watchout-checks";

const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
checks.forEach((box, i) => {
  box.checked = Boolean(saved[i]);
  box.addEventListener("change", () => {
    const state = Array.from(checks).map((v) => v.checked);
    localStorage.setItem(KEY, JSON.stringify(state));
  });
});
