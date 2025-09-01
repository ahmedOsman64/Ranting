// AO Rants - Main JavaScript

// Sample rants data
const rantsData = [
  {
    id: 1,
    title: "The Neighbor's Midnight Drilling",
    category: "Neighbors",
    text: "It's 2 AM and my neighbor decides NOW is the perfect time to hang pictures. The drilling sounds like a construction site!",
    likes: 47
  },
  {
    id: 2,
    title: "WiFi Password Changed Again",
    category: "Tech",
    text: "Landlord changed the WiFi password without telling anyone. Now I'm using my phone's hotspot like it's 2010.",
    likes: 32
  },
  {
    id: 3,
    title: "The Mysterious Disappearing Leftovers",
    category: "Food",
    text: "Put my leftover pizza in the fridge. Came back 2 hours later and it's gone. I live alone. This is concerning.",
    likes: 89
  },
  {
    id: 4,
    title: "Electricity Bill Shock",
    category: "Bills",
    text: "Got my electricity bill today. Apparently, I used enough power to light up half of Mogadishu. Time to live by candlelight.",
    likes: 23
  },
  {
    id: 5,
    title: "The Great Dish Washing Debate",
    category: "Chores",
    text: "Roommate thinks dishes wash themselves if you leave them long enough. Scientific experiment ongoing for 3 weeks now.",
    likes: 65
  },
  {
    id: 6,
    title: "Package Delivery Adventures",
    category: "Random",
    text: "Delivery guy called saying he's outside. I'm outside too. We're both confused. Turns out there are two buildings with the same number.",
    likes: 41
  },
  {
    id: 7,
    title: "The AC Remote Mystery",
    category: "Tech",
    text: "AC remote has disappeared into the void. It's 35°C outside and I'm manually pressing buttons like a caveman.",
    likes: 28
  },
  {
    id: 8,
    title: "Grocery Shopping Olympics",
    category: "Food",
    text: "Went to buy milk. Came back with everything except milk. My shopping list is apparently just a suggestion.",
    likes: 56
  }
];

// Global state
let currentTheme = 'dark';
let rantQueue = [];
let currentFilter = 'All';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize application
function initializeApp() {
  setupThemeToggle();
  setupNavigation();
  setupQueueSystem();
  updateActiveNavLink();
  
  // Page-specific initialization
  const currentPage = getCurrentPage();
  switch(currentPage) {
    case 'categories':
      initializeCategoriesPage();
      break;
    case 'top-rants':
      initializeTopRantsPage();
      break;
    case 'submit':
      initializeSubmitPage();
      break;
  }
  
  // Update footer year
  updateFooterYear();
}

// Get current page from URL
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '');
  return page === '' ? 'index' : page;
}

// Theme Toggle Functionality
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  
  themeToggle.addEventListener('click', toggleTheme);
  
  // Update button text
  updateThemeToggleText();
}

function toggleTheme() {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeToggleText();
}

function updateThemeToggleText() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// Navigation
function setupNavigation() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navLinks) {
      navLinks.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

function updateActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    const linkPage = href.replace('.html', '').replace('./', '');
    
    if ((currentPage === 'index' && (linkPage === 'index' || href === '/')) ||
        (currentPage === linkPage)) {
      link.classList.add('active');
    }
  });
}

// Queue System
function setupQueueSystem() {
  const queueToggle = document.querySelector('.queue-toggle');
  const queuePanel = document.querySelector('.queue-panel');
  const queueClose = document.querySelector('.queue-close');
  
  if (queueToggle) {
    queueToggle.addEventListener('click', toggleQueuePanel);
  }
  
  if (queueClose) {
    queueClose.addEventListener('click', closeQueuePanel);
  }
  
  // Close queue panel with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && queuePanel && queuePanel.classList.contains('active')) {
      closeQueuePanel();
    }
  });
  
  updateQueueDisplay();
}

function toggleQueuePanel() {
  const queuePanel = document.querySelector('.queue-panel');
  if (queuePanel) {
    queuePanel.classList.toggle('active');
    updateQueueDisplay();
  }
}

function closeQueuePanel() {
  const queuePanel = document.querySelector('.queue-panel');
  if (queuePanel) {
    queuePanel.classList.remove('active');
  }
}

function addToQueue(rant) {
  // Check if rant already in queue
  const existingIndex = rantQueue.findIndex(item => item.id === rant.id);
  if (existingIndex === -1) {
    rantQueue.push(rant);
    updateQueueDisplay();
    showToast('Rant added to queue!', 'success');
  } else {
    showToast('Rant already in queue!', 'warning');
  }
}

function removeFromQueue(rantId) {
  rantQueue = rantQueue.filter(item => item.id !== rantId);
  updateQueueDisplay();
  showToast('Rant removed from queue!', 'success');
}

function updateQueueDisplay() {
  const queueCount = document.querySelector('.queue-count');
  const queueItems = document.querySelector('.queue-items');
  const queueToggle = document.querySelector('.queue-toggle');
  
  if (queueCount) {
    queueCount.textContent = rantQueue.length;
    queueCount.style.display = rantQueue.length > 0 ? 'flex' : 'none';
  }
  
  if (queueToggle) {
    queueToggle.style.display = rantQueue.length > 0 ? 'block' : 'none';
  }
  
  if (queueItems) {
    if (rantQueue.length === 0) {
      queueItems.innerHTML = '<p class="text-muted">No rants in queue yet.</p>';
    } else {
      queueItems.innerHTML = rantQueue.map(rant => `
        <div class="queue-item">
          <div class="queue-item-header">
            <div class="queue-item-title">${rant.title}</div>
            <button class="queue-item-remove" onclick="removeFromQueue(${rant.id})" aria-label="Remove from queue">
              ×
            </button>
          </div>
          <div class="rant-category">${rant.category}</div>
        </div>
      `).join('');
    }
  }
}

// Categories Page
function initializeCategoriesPage() {
  setupFilterPills();
  renderRantCards();
}

function setupFilterPills() {
  const filterPills = document.querySelectorAll('.pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Remove active class from all pills
      filterPills.forEach(p => p.classList.remove('active'));
      // Add active class to clicked pill
      pill.classList.add('active');
      // Update current filter
      currentFilter = pill.textContent;
      // Re-render rant cards
      renderRantCards();
    });
  });
}

function renderRantCards() {
  const rantGrid = document.querySelector('.rant-grid');
  if (!rantGrid) return;
  
  const filteredRants = currentFilter === 'All' 
    ? rantsData 
    : rantsData.filter(rant => rant.category === currentFilter);
  
  if (filteredRants.length === 0) {
    rantGrid.innerHTML = '<p class="text-muted">No rants found for this category.</p>';
    return;
  }
  
  rantGrid.innerHTML = filteredRants.map(rant => `
    <div class="rant-card">
      <div class="rant-header">
        <div>
          <div class="rant-title">${rant.title}</div>
          <div class="rant-category">${rant.category}</div>
        </div>
      </div>
      <div class="rant-text">${rant.text}</div>
      <div class="rant-footer">
        <div class="rant-likes">
          <span>👍</span>
          <span>${rant.likes}</span>
        </div>
        <button class="btn btn-secondary" onclick="addToQueue(${JSON.stringify(rant).replace(/"/g, '&quot;')})">
          Add to Queue
        </button>
      </div>
    </div>
  `).join('');
}

// Top Rants Page
function initializeTopRantsPage() {
  renderTopRants();
}

function renderTopRants() {
  const topRantsContainer = document.querySelector('.top-rants-container');
  if (!topRantsContainer) return;
  
  // Sort rants by likes and get top 3
  const sortedRants = [...rantsData].sort((a, b) => b.likes - a.likes);
  const topRants = sortedRants.slice(0, 3);
  
  const categories = ['Most Liked', 'Funniest', 'Most Relatable'];
  
  topRantsContainer.innerHTML = `
    <div class="card-grid">
      ${topRants.map((rant, index) => `
        <div class="card">
          <div class="stat-card">
            <span class="stat-number">#${index + 1}</span>
            <span class="stat-label">${categories[index]}</span>
          </div>
          <h3>${rant.title}</h3>
          <div class="rant-category">${rant.category}</div>
          <p class="rant-text">${rant.text}</p>
          <div class="rant-footer">
            <div class="rant-likes">
              <span>👍</span>
              <span>${rant.likes}</span>
            </div>
            <button class="btn btn-secondary" onclick="addToQueue(${JSON.stringify(rant).replace(/"/g, '&quot;')})">
              Add to Queue
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Submit Page
function initializeSubmitPage() {
  setupFormValidation();
  setupQueuePanel();
}

function setupFormValidation() {
  const form = document.querySelector('.submit-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = '';
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
  }
  
  // Email validation
  if (fieldName === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }
  }
  
  // Show/hide error
  showFieldError(field, isValid ? '' : errorMessage);
  return isValid;
}

function showFieldError(field, message) {
  clearFieldError(field);
  
  if (message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    field.parentNode.appendChild(errorDiv);
  }
}

function clearFieldError(field) {
  field.classList.remove('error');
  const existingError = field.parentNode.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  let isFormValid = true;
  
  // Validate all fields
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });
  
  if (!isFormValid) {
    showToast('Please fix the errors in the form.', 'error');
    return;
  }
  
  // Simulate form submission
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    // Reset form and queue
    form.reset();
    rantQueue = [];
    updateQueueDisplay();
    
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Show success message
    showToast('Rant submitted! Thanks for sharing.', 'success');
    
    // Close queue panel if open
    closeQueuePanel();
  }, 1500);
}

function setupQueuePanel() {
  // Queue panel is already set up in setupQueueSystem
  // This function can be used for submit page specific queue functionality
}

// Toast Notifications
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 3000);
}

// Utility Functions
function updateFooterYear() {
  const yearElement = document.querySelector('.current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Accessibility helpers
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Apply focus trap to queue panel when it opens
document.addEventListener('DOMContentLoaded', () => {
  const queuePanel = document.querySelector('.queue-panel');
  if (queuePanel) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (queuePanel.classList.contains('active')) {
            trapFocus(queuePanel);
            // Focus first focusable element
            const firstFocusable = queuePanel.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
              firstFocusable.focus();
            }
          }
        }
      });
    });
    
    observer.observe(queuePanel, { attributes: true });
  }
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Intersection Observer for animations
const observeElements = () => {
  const elements = document.querySelectorAll('.card, .rant-card, .stat-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
};

// Initialize animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(observeElements, 100);
});
