let visibleMenu = false;
const menuButton = document.getElementsByClassName('header__button')[0];
const menuList = document.getElementsByClassName('header__navigation')[0];

if (menuButton !== undefined) {
  menuButton.addEventListener('click', event => {
    visibleMenu = !visibleMenu;
    if (visibleMenu) {
      menuList.classList.add('active');
    } else {
      menuList.classList.remove('active');
    }
  });
}