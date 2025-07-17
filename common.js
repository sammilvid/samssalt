// Common JavaScript functionality for all pages
class SamsSaltSite {
  constructor() {
    this.init();
  }

  init() {
    this.setupHamburgerMenu();
  }

  setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }


}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SamsSaltSite();
}); 