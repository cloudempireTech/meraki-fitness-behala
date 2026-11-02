// Meraki Fitness Studio Behala — Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }

  // Dynamic Character-by-Character Typewriter Effect
  const typewriterEl = document.querySelector('.dynamic-typewriter');
  if (typewriterEl) {
    const phrases = [
      'Strength & Hypertrophy',
      'High-Intensity HIIT',
      'Posture Transformation',
      'Custom Athlete Coaching',
      'Mobility & Core Health'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2200; // Pause when complete
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // Interactive Training Split & Macro Target Calculator
  const calcForm = document.getElementById('fitness-calc-form');
  if (calcForm) {
    calcForm.addEventListener('input', updateFitnessCalculation);
    calcForm.addEventListener('change', updateFitnessCalculation);
    updateFitnessCalculation();
  }

  function updateFitnessCalculation() {
    const goalSelect = document.getElementById('calc-goal');
    const daysSelect = document.getElementById('calc-days');
    const expSelect = document.getElementById('calc-exp');
    const weightInput = document.getElementById('calc-weight');
    const targetDisplay = document.getElementById('calc-target-display');
    const detailsDisplay = document.getElementById('calc-details-display');
    const waInquiryBtn = document.getElementById('calc-wa-btn');

    if (!goalSelect || !daysSelect || !targetDisplay) return;

    const goal = goalSelect.value;
    const days = parseInt(daysSelect.value) || 4;
    const exp = expSelect ? expSelect.value : 'intermediate';
    const weight = parseFloat(weightInput ? weightInput.value : 70) || 70;

    let splitName = 'Upper / Lower Power Split';
    let macroProtein = Math.round(weight * 1.8);
    let targetCalories = Math.round(weight * 32);

    if (goal === 'fatloss') {
      targetCalories = Math.round(weight * 26);
      macroProtein = Math.round(weight * 2.0);
      splitName = days <= 3 ? 'Full Body Metabolic Circuit' : 'Push / Pull / Legs + HIIT Protocol';
    } else if (goal === 'hypertrophy') {
      targetCalories = Math.round(weight * 36);
      macroProtein = Math.round(weight * 2.2);
      splitName = days <= 3 ? 'Heavy Compound Full Body' : 'Arnold / PPL Hypertrophy Split';
    } else if (goal === 'posture') {
      targetCalories = Math.round(weight * 30);
      macroProtein = Math.round(weight * 1.6);
      splitName = 'Posterior Chain & Core Alignment Routine';
    } else if (goal === 'endurance') {
      targetCalories = Math.round(weight * 34);
      macroProtein = Math.round(weight * 1.7);
      splitName = 'Functional Athlete & Aerobic Conditioning';
    }

    targetDisplay.innerText = `${splitName}`;
    if (detailsDisplay) {
      detailsDisplay.innerText = `Target: ~${targetCalories} kcal/day | Protein: ~${macroProtein}g daily | ${days} Training Days per week tailored by Meraki Head Coaches.`;
    }

    if (waInquiryBtn) {
      const goalLabel = goalSelect.options[goalSelect.selectedIndex].text;
      const message = encodeURIComponent(
        `Hello Meraki Fitness Studio Behala, I tried your interactive workout calculator: Goal is "${goalLabel}" (${days} days/week, ~${weight}kg). Suggested regimen: ${splitName}. I would like to book a 1-day Free Studio Trial & Trainer Consultation!`
      );
      waInquiryBtn.href = `https://wa.me/918240911029?text=${message}`;
    }
  }

  // Sticky Filter Rail for Programs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      programCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Animated Telemetry Counters & Scroll Observer
  const statNumbers = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Animate counter if element has data-count
        const countTarget = entry.target.dataset.count;
        if (countTarget) {
          let current = 0;
          const target = parseFloat(countTarget);
          const isDecimal = countTarget.includes('.');
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              entry.target.innerText = isDecimal ? target.toFixed(1) : Math.round(target);
              clearInterval(counter);
            } else {
              entry.target.innerText = isDecimal ? current.toFixed(1) : Math.round(current);
            }
          }, stepTime);
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.hero-stat-card, .glass-card, .bento-card, .program-card, .review-card').forEach(el => {
    observer.observe(el);
  });
});
