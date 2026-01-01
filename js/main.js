// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });

      // Close mobile menu when link is clicked
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger');
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .practice-card, .why-card').forEach(el => {
  observer.observe(el);
});

// Parallax effect for lawyer symbol
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const lawyerSymbol = document.querySelector('.lawyer-symbol-bg');

  if (lawyerSymbol) {
    const speed = 0.5;
    const yPos = -(currentScrollY * speed);
    lawyerSymbol.style.transform = `translate(-50%, ${yPos}px)`;
  }

  lastScrollY = currentScrollY;
});

// EmailJS initialization
(function() {
  emailjs.init("YOUR_PUBLIC_KEY_HERE");
})();

// Function to send email via EmailJS
function sendEmail() {
  const form = document.getElementById('contact-form');

  // Get form values
  const name = document.getElementById('from_name').value;
  const email = document.getElementById('from_email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  // Validate required fields
  if (!name || !email || !message) {
    showNotification('Please fill in all required fields (Name, Email, Message)', 'error');
    return;
  }

  // Show loading state
  const emailBtn = document.querySelector('button[onclick="sendEmail()"]');
  const originalText = emailBtn.textContent;
  emailBtn.textContent = 'Sending...';
  emailBtn.disabled = true;

  // EmailJS parameters
  const templateParams = {
    from_name: name,
    from_email: email,
    phone: phone || 'Not provided',
    message: message,
    to_email: 'YOUR_EMAIL_HERE' // Replace with your email
  };

  emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      showNotification('Message sent successfully! I will contact you soon.', 'success');
      form.reset();
    }, function(error) {
      console.log('FAILED...', error);
      showNotification('Failed to send message. Please try again or contact me directly.', 'error');
    })
    .finally(() => {
      emailBtn.textContent = originalText;
      emailBtn.disabled = false;
    });
}

// Function to send WhatsApp message
function sendWhatsApp() {
  const name = document.getElementById('from_name').value;
  const email = document.getElementById('from_email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  // Validate required fields
  if (!name || !message) {
    showNotification('Please fill in your name and message', 'error');
    return;
  }

  // Create WhatsApp message
  const whatsappMessage = `*New Contact Form Message*%0A%0A👤 *Name:* ${name}%0A📧 *Email:* ${email || 'Not provided'}%0A📱 *Phone:* ${phone || 'Not provided'}%0A💬 *Message:*%0A${message}`;

  // Your WhatsApp number (replace with your number)
  const whatsappNumber = '201112823679'; // Replace with your WhatsApp number (without +)

  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Open WhatsApp
  window.open(whatsappURL, '_blank');

  showNotification('Opening WhatsApp with your message...', 'info');
}

// Notification function
function showNotification(message, type) {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
    <span>${message}</span>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Hide notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}  