// Spatial keyboard navigation is also usable by remotes that emit arrow keys.
document.addEventListener('keydown', (event) => {
  const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!direction || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
  const active = document.activeElement;
  if (active && (active.matches('input, textarea, select, [contenteditable="true"]') || active.closest('[role="slider"]'))) return;
  const modal = document.querySelector('dialog[open]');
  const scope = modal || document;
  const candidates = [...scope.querySelectorAll('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width && rect.height && getComputedStyle(element).visibility !== 'hidden' && !element.closest('[hidden], [inert]');
  });
  if (!candidates.length) return;
  if (!candidates.includes(active)) { candidates[0].focus(); event.preventDefault(); return; }
  const rect = active.getBoundingClientRect();
  const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
  let best = null, score = Infinity;
  for (const candidate of candidates) {
    if (candidate === active) continue;
    const target = candidate.getBoundingClientRect();
    const dx = target.left + target.width / 2 - x, dy = target.top + target.height / 2 - y;
    const forward = dx * direction[0] + dy * direction[1];
    if (forward <= 0) continue;
    const sideways = Math.abs(dx * direction[1] - dy * direction[0]);
    const distance = forward + sideways * 2;
    if (distance < score) { best = candidate; score = distance; }
  }
  if (best) { best.focus(); event.preventDefault(); }
});
