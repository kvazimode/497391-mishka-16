'use strict'

const buttonMenu = document.querySelector('.main-header__nav-toggler');
const buttonOrder = document.querySelector('.weekly__order-button');
const buttonCartList = document.querySelectorAll('.add-to-cart')
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal__overlay');
const mainNavList = document.querySelectorAll('.main-nav__list');
const classDesktopPages = 'main-nav__list--desktop-pages';
const classButtonOpen = 'main-header__nav-toggler--open';
const classButtonClose = 'main-header__nav-toggler--close';
let resizeTimeout = null;

function changeVisibility(element, inVisible, modal) {
  if (inVisible) {
    element.style.display = 'none';
  } else if (!modal) {
    element.style.display = 'flex';
  } else {
    element.style.display = 'fixed';
  }
}

function changeButtonMenuClass(set) {
  buttonMenu.classList.toggle(classButtonOpen, set);
  if (set) {
    return;
  } else {
    buttonMenu.classList.toggle(classButtonClose);
  }
}

function buttonMenuClickHandler() {
  for (let item of mainNavList) {
    if (buttonMenu.classList.contains(classButtonOpen)) {
      changeVisibility(item, true);
    } else if (!item.classList.contains(classDesktopPages)) {
      changeVisibility(item, false);
    }
  }
  changeButtonMenuClass();
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

function buttonClickHandler(evt) {
  modal.classList.remove('visually-hidden');
  if (evt.target === buttonOrder) {
    buttonOrder.removeEventListener('click', buttonClickHandler);
  } else {
    for (let button of buttonCartList) {
      button.removeEventListener('click', buttonClickHandler);
    }
  }
  modalOverlay.addEventListener('click', modalOverlayClickHandler);
}

function modalOverlayClickHandler(evt) {
  modal.classList.add('visually-hidden');
  modalOverlay.removeEventListener('click', modalOverlayClickHandler);
  buttonOrder.addEventListener('click', buttonClickHandler);
  for (let button of buttonCartList) {
    button.addEventListener('click', buttonClickHandler);
  }
}

window.addEventListener('resize', resizeThrottler)
buttonMenu.addEventListener('click', buttonMenuClickHandler)
if (buttonOrder) {
  buttonOrder.addEventListener('click', buttonClickHandler)
}
if (buttonCartList) {
  for (let button of buttonCartList) {
    button.addEventListener('click', buttonClickHandler);
  }
}
buttonMenu.classList.remove('main-header__nav-toggler--nojs')
changeButtonMenuClass(true)
