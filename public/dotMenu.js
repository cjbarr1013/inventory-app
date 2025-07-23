const closeAllMenus = () => {
  document.querySelectorAll('.dot-menu.visible').forEach((menu) => {
    menu.classList.remove('visible');
  });
};

const isOffScreen = (btn, menu) => {
  const btnBounds = btn.getBoundingClientRect();
  const menuBounds = menu.getBoundingClientRect();
  const windowWidth = document.getElementsByTagName('body')[0].clientWidth;

  return btnBounds.right + menuBounds.width > windowWidth ? true : false;
};

document.querySelectorAll('.dot-menu-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

document.querySelectorAll('.dot-menu-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllMenus();
    const menu = btn.nextElementSibling;

    if (isOffScreen(btn, menu)) {
      menu.classList.add('menu-left');
      menu.classList.remove('menu-right');
    } else {
      menu.classList.add('menu-right');
      menu.classList.remove('menu-left');
    }

    menu.classList.toggle('visible');
  });
});

document.addEventListener('click', closeAllMenus);
