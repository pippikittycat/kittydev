export function initThemeToggle(buttonId = 'theme-toggle-btn') {
  const toggleBtn = document.getElementById(buttonId);
  
  // Guard clause: If button isn't found, exit safely without crashing the script
  if (!toggleBtn) {
    console.warn(`Theme toggle button with ID "${buttonId}" was not found in the DOM.`);
    return;
  }

  function updateButtonLabel(theme) {
    toggleBtn.textContent = `Theme: ${theme}`;
  }

  // 1. Read theme set by blocking script in <head>, fall back to DOM attribute
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateButtonLabel(currentTheme);

  // 2. Click handler with CSS transition
  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateButtonLabel(nextTheme);

  });
}