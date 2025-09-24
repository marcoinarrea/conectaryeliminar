// CONECTAR Y ELIMINAR - JAVASCRIPT SUBLIME
// La masa madre de reality shows

let appData = null;
let currentSection = 'essence';
let gameState = { level: 0, score: 0, connections: 0, eliminations: 0 };

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAppData();
    initNavigation();
    initScrollEffects();
    initParticipants();
    initGalas();
    initMoments();
    initSimulator();
    initViralFeatures();
    initVisualEffects();
    console.log('🎭 Conectar y Eliminar - La experiencia sublime está lista');
  } catch (error) {
    console.error('Error:', error);
  }
});

// CARGA DE DATOS
async function loadAppData() {
  const response = await fetch('data.json');
  appData = await response.json();
  document.title = `${appData.meta.title} - ${appData.meta.subtitle}`;
  return appData;
}

// NAVEGACIÓN
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      scrollToSection(targetSection);
    });
  });
  
  // Intersection Observer para navegación automática
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id || 'essence';
        updateActiveNavItem(sectionId);
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
  
  document.querySelectorAll('.section, .hero-section').forEach(section => {
    observer.observe(section);
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateActiveNavItem(sectionId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    }
  });
}

// EFECTOS DE SCROLL
function initScrollEffects() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${scrolled * -0.5}px)`;
    }
    
    const nav = document.querySelector('.sublime-nav');
    nav.style.background = scrolled > 100 
      ? 'rgba(15, 20, 25, 0.95)' 
      : 'rgba(15, 20, 25, 0.9)';
  });
  
  // Animaciones de entrada
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.section-header, .participant-card, .gala-item, .moment-card')
    .forEach(el => observer.observe(el));
}

// PARTICIPANTES
function initParticipants() {
  if (!appData?.participants) return;
  
  const expelledGrid = document.getElementById('expelled-grid');
  const finalistsGrid = document.getElementById('finalists-grid');
  
  if (!expelledGrid || !finalistsGrid) return;
  
  const expelled = appData.participants.filter(p => p.status === 'expelled');
  const finalists = appData.participants.filter(p => p.status !== 'expelled');
  
  expelled.forEach(participant => {
    expelledGrid.appendChild(createParticipantCard(participant, true));
  });
  
  finalists.forEach(participant => {
    finalistsGrid.appendChild(createParticipantCard(participant, false));
  });
}

function createParticipantCard(participant, isEliminated) {
  const card = document.createElement('div');
  card.className = `participant-card ${isEliminated ? 'eliminated' : ''}`;
  
  const statusText = isEliminated 
    ? `Eliminado - ${participant.eliminationDate}`
    : participant.signature || 'Superviviente';
  
  card.innerHTML = `
    <img src="${participant.image}" alt="${participant.name}" class="participant-image" loading="lazy">
    <h4 class="participant-name">${participant.name}</h4>
    <p class="participant-status">${statusText}</p>
    <div class="participant-quote">"${isEliminated ? participant.lastWords : participant.favoritePhrase}"</div>
  `;
  
  return card;
}

// GALAS
function initGalas() {
  if (!appData?.galas) return;
  
  const timeline = document.getElementById('galas-timeline');
  if (!timeline) return;
  
  appData.galas.forEach(gala => {
    timeline.appendChild(createGalaElement(gala));
  });
}

function createGalaElement(gala) {
  const galaItem = document.createElement('div');
  galaItem.className = 'gala-item';
  
  const videoContent = gala.available && gala.videoUrl
    ? `<iframe src="${gala.videoUrl}" title="${gala.title}" class="gala-video" frameborder="0" allowfullscreen loading="lazy"></iframe>`
    : `<div class="gala-coming-soon"><p>Próximamente: ${gala.date}</p></div>`;
  
  galaItem.innerHTML = `
    <div class="gala-marker"></div>
    <div class="gala-content">
      <div class="gala-date">${gala.date}</div>
      <h3 class="gala-title">${gala.title}</h3>
      <p class="gala-description">${gala.description}</p>
      ${videoContent}
    </div>
  `;
  
  return galaItem;
}

// MOMENTOS
function initMoments() {
  if (!appData?.shorts) return;
  
  const gallery = document.getElementById('moments-gallery');
  if (!gallery) return;
  
  appData.shorts.forEach(short => {
    gallery.appendChild(createMomentCard(short));
  });
}

function createMomentCard(short) {
  const card = document.createElement('div');
  card.className = 'moment-card';
  
  const tagsHtml = short.tags.map(tag => `<span class="moment-tag">#${tag}</span>`).join('');
  
  card.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${short.videoId}" title="${short.title}" class="moment-video" frameborder="0" allowfullscreen loading="lazy"></iframe>
    <div class="moment-content">
      <h3 class="moment-title">${short.title}</h3>
      <p class="moment-description">${short.description}</p>
      <div class="moment-tags">${tagsHtml}</div>
      <div class="moment-essence">${short.essence}</div>
    </div>
  `;
  
  return card;
}

// SIMULADOR
function initSimulator() {
  const simulator = document.getElementById('simulator-game');
  if (!simulator) return;
  
  simulator.innerHTML = `
    <div class="game-interface">
      <div class="game-header">
        <h3>Simulador de Conexión</h3>
        <div class="game-stats">
          <div class="stat">Conexiones: <span id="connections-count">0</span></div>
          <div class="stat">Eliminaciones: <span id="eliminations-count">0</span></div>
        </div>
      </div>
      <div class="game-area">
        <button class="connect-btn" id="connect-btn" onclick="initiateConnection()">
          CONECTAR AL SALÓN
        </button>
        <div class="connection-status" id="connection-status">Desconectado</div>
      </div>
    </div>
  `;
}

function initiateConnection() {
  gameState.connections++;
  document.getElementById('connections-count').textContent = gameState.connections;
  document.getElementById('connection-status').textContent = 'Conectado - Experiencia completada';
  showNotification('¡Has experimentado la esencia del reality!');
}

// FUNCIONES VIRALES
function initViralFeatures() {
  window.shareExperience = navigator.share ? shareNative : showShareModal;
}

async function shareNative() {
  try {
    await navigator.share({
      title: appData.meta.title,
      text: '🎭 He descubierto la masa madre de todos los reality shows',
      url: window.location.href
    });
  } catch (error) {
    showShareModal();
  }
}

function showShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) modal.classList.add('active');
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) modal.classList.remove('active');
}

function shareToTwitter() {
  const text = encodeURIComponent('🎭 He descubierto la masa madre de todos los reality shows');
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  closeShareModal();
}

function shareToFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  closeShareModal();
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showNotification('¡Enlace copiado!');
    closeShareModal();
  });
}

// EFECTOS VISUALES
function initVisualEffects() {
  setInterval(createGoldenParticle, 3000);
}

function createGoldenParticle() {
  const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed; width: 4px; height: 4px; background: ${color};
    border-radius: 50%; pointer-events: none; z-index: 1000;
    left: ${Math.random() * window.innerWidth}px; top: -10px;
    box-shadow: 0 0 10px ${color};
  `;
  
  document.body.appendChild(particle);
  
  particle.animate([
    { transform: 'translateY(0px) rotate(0deg)', opacity: 0.8 },
    { transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, opacity: 0 }
  ], { duration: 5000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => particle.remove();
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 100px; right: 20px; 
    background: linear-gradient(135deg, #ff006e, #8338ec);
    color: #f0f6fc; padding: 1rem 2rem; border-radius: 25px;
    z-index: 2000; font-weight: 700; transform: translateX(100%);
    transition: transform 0.3s ease-out; 
    box-shadow: 0 4px 20px rgba(255, 0, 110, 0.4);
    border: 1px solid rgba(255, 0, 110, 0.3);
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Funciones globales
window.scrollToSection = scrollToSection;
window.shareExperience = () => {};
window.shareToTwitter = shareToTwitter;
window.shareToFacebook = shareToFacebook;
window.copyLink = copyLink;
window.closeShareModal = closeShareModal;
window.initiateConnection = initiateConnection;