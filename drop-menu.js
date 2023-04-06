const toggleBtn = document.querySelector('.toggle-drop-menu-btn')
const toggleBtnIcon = document.querySelector('.toggle-drop-menu-btn i')
const dropDownMenu = document.querySelector('.header-drop-menu')

window.onresize = function () {
    dropDownMenu.classList.remove('open')
    const isOpen = dropDownMenu.classList.contains('open')
    toggleBtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
}

toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open')
    const isOpen = dropDownMenu.classList.contains('open')
    toggleBtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
}