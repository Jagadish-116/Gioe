/* script.js - Shared GIOE Portal functionality */

document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Toggle the mobile menu state
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!burgerMenu.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('open');
        }
    });
});