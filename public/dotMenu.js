const closeAllMenus = () => {
  document.querySelectorAll('.dot-menu.visible').forEach((menu) => {
    menu.classList.remove('visible');
  });
};

document.querySelectorAll('.dot-menu-btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeAllMenus();
    const menu = btn.nextElementSibling;
    menu.classList.toggle('visible');
  });
});

document.addEventListener('click', closeAllMenus);
