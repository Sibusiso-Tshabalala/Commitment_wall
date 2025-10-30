document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS
  AOS.init({ duration: 800, once: true });

  // Navbar Scroll & Mobile Menu
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Commitment Wall Logic
  const form = document.getElementById('pledgeForm');
  const commitmentsContainer = document.getElementById('commitmentsContainer');
  const voiceBtn = document.getElementById('voiceBtn');
  const listeningIndicator = document.getElementById('listeningIndicator');
  const aiAnalysis = document.getElementById('aiAnalysis');
  const analyzingIndicator = document.getElementById('analyzingIndicator');
  const submitBtn = document.getElementById('submitBtn');

  let recognition = null;
  let isListening = false;

  // Speech Recognition Setup
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      document.getElementById('message').value = e.results[0][0].transcript;
      toggleVoice();
      analyzeAI(e.results[0][0].transcript);
    };
    recognition.onerror = () => toggleVoice();
  } else {
    voiceBtn.disabled = true;
    voiceBtn.title = "Voice not supported in this browser";
  }

  function toggleVoice() {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      isListening = false;
      voiceBtn.classList.remove('listening');
      voiceBtn.innerHTML = 'Microphone Voice Input';
      listeningIndicator.style.display = 'none';
    } else {
      recognition.start();
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceBtn.innerHTML = 'Stop';
      listeningIndicator.style.display = 'block';
    }
  }

  voiceBtn.addEventListener('click', toggleVoice);

  // AI Analysis (Mock)
  function analyzeAI(text) {
    if (text.length < 10) {
      aiAnalysis.style.display = 'none';
      return;
    }
    analyzingIndicator.style.display = 'block';
    setTimeout(() => {
      const categories = ['Education','Environment','Healthcare','Technology','Economic Development','Social Justice','Infrastructure','Agriculture'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      document.getElementById('aiCategory').textContent = cat;
      document.getElementById('aiSentiment').textContent = 'Positive';
      document.getElementById('aiImpactScore').textContent = (60 + Math.random() * 40).toFixed(0) + '/100';
      document.getElementById('category').value = cat;
      aiAnalysis.style.display = 'block';
      analyzingIndicator.style.display = 'none';
    }, 1500);
  }

  document.getElementById('message').addEventListener('input', (e) => analyzeAI(e.target.value));

  // Load & Save Commitments
  function loadCommitments() {
    const saved = JSON.parse(localStorage.getItem('commitments') || '[]');
    commitmentsContainer.innerHTML = '';
    saved.forEach((c, i) => addCommitmentCard(c, i * 100));
  }

  function addCommitmentCard(data, delay = 0) {
    const card = document.createElement('div');
    card.className = 'commitment-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', delay);
    card.innerHTML = `
      <div class="commitment-name">${data.name}</div>
      <div class="commitment-message">"${data.message}"</div>
      <div class="commitment-meta">
        <span>${new Date(data.timestamp).toLocaleDateString()}</span>
        <span class="commitment-category">${data.category}</span>
      </div>
    `;
    commitmentsContainer.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 100);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div> Submitting...';

    const data = {
      name: document.getElementById('name').value.trim(),
      message: document.getElementById('message').value.trim(),
      category: document.getElementById('category').value,
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem('commitments') || '[]');
      saved.unshift(data);
      localStorage.setItem('commitments', JSON.stringify(saved));
      addCommitmentCard(data);
      form.reset();
      aiAnalysis.style.display = 'none';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Commitment';
      AOS.refresh();
    }, 1500);
  });

  // Initialize
  loadCommitments();
});