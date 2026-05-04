// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    // close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ===== DEMO QUIZ =====
const quizData = [
  {
    question: "Em uma via urbana, qual é a velocidade máxima permitida quando não há sinalização indicativa?",
    options: ["40 km/h", "60 km/h", "80 km/h", "50 km/h"],
    correct: 3,
    explanation: "De acordo com o CTB (Art. 61), em vias urbanas sem sinalização, a velocidade máxima é de 50 km/h para veículos leves."
  },
  {
    question: "Ao se deparar com um acidente de trânsito, qual deve ser a primeira atitude do socorrista?",
    options: [
      "Remover imediatamente a vítima do veículo",
      "Sinalizar o local e ligar para o resgate",
      "Oferecer água para a vítima",
      "Tentar reanimar a vítima com massagem cardíaca"
    ],
    correct: 1,
    explanation: "A primeira atitude é garantir a segurança do local, sinalizando e acionando o serviço de emergência (SAMU 192)."
  },
  {
    question: "A direção defensiva é composta por quantos elementos básicos?",
    options: ["3 elementos", "4 elementos", "5 elementos", "6 elementos"],
    correct: 2,
    explanation: "São 5 elementos: Conhecimento, Atenção, Previsão, Habilidade e Ação. Esses elementos formam a base da direção defensiva."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = quizData[currentQuestion];
  const container = document.getElementById('quiz-content');
  if (!container) return;

  answered = false;

  // Update progress
  document.querySelectorAll('.demo-progress span').forEach((span, i) => {
    span.classList.remove('active', 'done');
    if (i < currentQuestion) span.classList.add('done');
    if (i === currentQuestion) span.classList.add('active');
  });

  container.innerHTML = `
    <p class="demo-counter">Questão ${currentQuestion + 1} de ${quizData.length}</p>
    <p class="demo-question">${q.question}</p>
    <div class="demo-options">
      ${q.options.map((opt, i) => `
        <div class="demo-option" data-index="${i}" onclick="selectAnswer(${i})">
          <span class="demo-option-letter">${String.fromCharCode(65 + i)}</span>
          <span>${opt}</span>
        </div>
      `).join('')}
    </div>
    <div class="demo-feedback" id="quiz-feedback"></div>
    <button class="demo-btn-next" id="quiz-next" onclick="nextQuestion()">Próxima →</button>
  `;
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const options = document.querySelectorAll('.demo-option');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next');

  options.forEach((opt, i) => {
    opt.style.pointerEvents = 'none';
    if (i === q.correct) opt.classList.add('correct');
    if (i === index && i !== q.correct) opt.classList.add('wrong');
  });

  if (index === q.correct) {
    score++;
    feedback.className = 'demo-feedback show correct-fb';
    feedback.innerHTML = `✅ Correto! ${q.explanation}`;
  } else {
    feedback.className = 'demo-feedback show wrong-fb';
    feedback.innerHTML = `❌ Incorreto. ${q.explanation}`;
  }

  nextBtn.classList.add('show');
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const container = document.getElementById('quiz-content');
  const progress = document.querySelector('.demo-progress');
  if (progress) {
    progress.querySelectorAll('span').forEach(s => s.classList.add('done'));
  }

  const percentage = Math.round((score / quizData.length) * 100);
  const passed = percentage >= 70;

  container.innerHTML = `
    <div class="demo-result show">
      <div class="demo-score">${score}/${quizData.length}</div>
      <h3>${passed ? '🎉 Parabéns, você passou!' : '😔 Não foi dessa vez...'}</h3>
      <p>${passed
        ? 'Você tem potencial! Imagine com os simulados completos... sua aprovação está garantida!'
        : 'Sem problemas! Com nossos simulados completos você vai estudar e passar de primeira!'
      }</p>
      <a href="#precos" class="btn-primary" style="display:inline-flex;">
        Quero os Simulados Completos 🚀
      </a>
      <br><br>
      <button onclick="resetQuiz()" class="btn-secondary" style="border:none;cursor:pointer;">
        Refazer Quiz ↻
      </button>
    </div>
  `;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
}

// Init quiz
document.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
});

// ===== NAVBAR SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
