'use strict'

const buttonMenu = document.querySelector('.main-header__nav-toggler');
const mainNavList = document.querySelectorAll('.main-nav__list');
const classDesktopPages = 'main-nav__list--desktop-pages';
const classButtonOpen = 'main-header__nav-toggler--open';
let resizeTimeout = null;

function changeVisibility(element, inVisible) {
  if (inVisible) {
    element.style.display = "none";
  } else {
    element.style.display = "flex";
  }
}

function changeButtonMenuIcon(set) {
  buttonMenu.classList.toggle(classButtonOpen, set);
}

function buttonMenuClickHandler() {
  for (let item of mainNavList) {
    if (buttonMenu.classList.contains(classButtonOpen)) {
      changeVisibility(item, true);
    } else if (!item.classList.contains(classDesktopPages)) {
      changeVisibility(item, false);
    }
  }
  changeButtonMenuIcon();
}

function resizeHandler() {
  if (window.innerWidth < 772) {
    for (let item of mainNavList) {
      changeVisibility(item, true);
    }
    changeButtonMenuIcon(false);
    buttonMenu.addEventListener('click', buttonMenuClickHandler)
  } else if (window.innerWidth < 1151) {
    for (let item of mainNavList) {
      if (item.classList.contains(classDesktopPages)) {
        changeVisibility(item, true);
      } else {
        changeVisibility(item, false);
      }
    }
    buttonMenu.removeEventListener('click', buttonMenuClickHandler)
  } else {
    for (let item of mainNavList) {
      changeVisibility(item, false);
    }
  }
}


function resizeThrottler() {
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      resizeHandler();
    }, 100);
  }
}

window.addEventListener('resize', resizeThrottler)
buttonMenu.addEventListener('click', buttonMenuClickHandler)
changeButtonMenuIcon(true)
