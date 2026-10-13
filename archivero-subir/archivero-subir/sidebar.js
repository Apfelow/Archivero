document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function abrirMenu() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }

    function cerrarMenu() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    if (menuToggle) menuToggle.addEventListener('click', abrirMenu);
    if (closeMenu) closeMenu.addEventListener('click', cerrarMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', cerrarMenu);
});