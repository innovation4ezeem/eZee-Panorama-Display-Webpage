/* Menu script copied from the live staynest site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */

document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Toggle mobile menu
    toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        menu.classList.toggle("active");
        toggle.textContent = menu.classList.contains("active") ? "✕" : "☰";
    });

    // Dropdown toggle
    dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
        dropdown.classList.toggle("active");
    });

    // Prevent closing when clicking inside menu
    menu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Close everything when clicking outside
    document.addEventListener("click", function () {
        menu.classList.remove("active");
        dropdownMenu.classList.remove("show");
        dropdown.classList.remove("active");
        toggle.textContent = "☰";
    });

    // Reset on resize
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            menu.classList.remove("active");
            dropdownMenu.classList.remove("show");
            dropdown.classList.remove("active");
            toggle.textContent = "☰";
        }
    });

});
