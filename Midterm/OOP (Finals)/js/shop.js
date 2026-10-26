
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    if (hamburger && nav) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('show');
      });
    }

    const dropdownParents = document.querySelectorAll('.nav-links li.has-dropdown > a');
    dropdownParents.forEach(parent => {
      parent.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const li = this.parentElement;
          const isOpen = li.classList.contains('open');
          document.querySelectorAll('.nav-links li.has-dropdown').forEach(item => {
            item.classList.remove('open');
          });
          if (!isOpen) {
            li.classList.add('open');
          }
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 768 && nav && hamburger) {
        if (nav.classList.contains('show') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
          nav.classList.remove('show');
          document.querySelectorAll('.nav-links li.has-dropdown').forEach(item => {
            item.classList.remove('open');
          });
        }
      }
    });