// theme.js
export function initThemeToggle(buttonId = 'theme-toggle-btn') {
  const toggleBtn = document.getElementById(buttonId);
  
  // Guard clause: If button isn't found, exit safely without crashing the script
  if (!toggleBtn) {
    console.warn(`Theme toggle button with ID "${buttonId}" was not found in the DOM.`);
    return;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleBtn.textContent = `Theme: ${theme.toUpperCase()}`;
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}