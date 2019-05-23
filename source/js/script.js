'use strict'

const buttonMenu = document.querySelector('.main-header__nav-toggler');
const buttonOrder = document.querySelector('.weekly__order-button');
const buttonCartList = document.querySelectorAll('.add-to-cart')
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal__overlay');
const mainNavList = document.querySelectorAll('.main-nav__list');
const classDesktopPages = 'main-nav__list--desktop-pages';
const classButtonOpened = 'main-header__nav-toggler--opened';
const classButtonClosed = 'main-header__nav-toggler--closed';
let resizeTimeout = null;

function changeVisibility(element, visible, modal) {
  if (!visible) {
    element.style.display = 'none';
  } else if (!modal) {
    element.style.display = 'flex';
  } else {
    element.style.display = 'fixed';
  }
}

function changeButtonMenuClass(set) {
  buttonMenu.classList.toggle(classButtonClosed, set);
  if (set) {
    buttonMenu.classList.remove(classButtonOpened);
  } else {
    buttonMenu.classList.toggle(classButtonOpened);
  }
}

function openMobileOrTabletMenu(item) {
  if (item.classList.contains(classDesktopPages)) {
    changeVisibility(item, false);
  } else {
    changeVisibility(item, true);
  }
}

function hideMobileMenu() {
  for (let item of mainNavList) {
    changeVisibility(item, false);
  }
}

function toggleMobileMenu() {
  for (let item of mainNavList) {
    if (buttonMenu.classList.contains(classButtonClosed)) {
      changeVisibility(item, false);
    } else {
      openMobileOrTabletMenu(item);
    }
  }
}

function setMobileMenu() {
  changeButtonMenuClass(true);
  hideMobileMenu();
  buttonMenu.addEventListener('click', buttonMenuClickHandler)
}

function buttonMenuClickHandler() {
  changeButtonMenuClass();
  toggleMobileMenu();
}

function resizeHandler() {
  if (window.innerWidth < 770) {
    setMobileMenu();
  } else if (window.innerWidth < 1151) {
    for (let item of mainNavList) {
      openMobileOrTabletMenu(item);
    }
    buttonMenu.removeEventListener('click', buttonMenuClickHandler)
  } else {
    for (let item of mainNavList) {
      changeVisibility(item, true);
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
  if (buttonOrder) {
    buttonOrder.addEventListener('click', buttonClickHandler);
  }
  for (let button of buttonCartList) {
    button.addEventListener('click', buttonClickHandler);
  }
}

buttonMenu.classList.remove('main-header__nav-toggler--nojs')
window.addEventListener('resize', resizeThrottler)

if (buttonOrder) {
  buttonOrder.addEventListener('click', buttonClickHandler);
}

if (buttonCartList) {
  for (let button of buttonCartList) {
    button.addEventListener('click', buttonClickHandler);
  }
}

if (window.innerWidth < 770) {
  setMobileMenu();
}
