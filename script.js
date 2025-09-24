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
  }, { threshold: 0.2, rootMargin: '-80px 0px -30% 0px' });
  
  // Observar todas las secciones con ID
  const sectionsToObserve = ['#essence', '#participants', '#galas', '#moments', '#simulator'];
  sectionsToObserve.forEach(sectionSelector => {
    const section = document.querySelector(sectionSelector);
    if (section) {
      observer.observe(section);
    }
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
  const actuallyEliminated = isEliminated || participant.status === 'finalist-eliminated' || participant.eliminado;
  card.className = `participant-card ${actuallyEliminated ? 'eliminated' : ''}`;
  
  const statusText = actuallyEliminated 
    ? `Eliminade - ${participant.eliminationDate}`
    : participant.signature || 'Superviviente';
  
  card.innerHTML = `
    <div class="participant-image-container">
      <img src="${participant.image}" alt="${participant.name}" class="participant-image" loading="lazy">
    </div>
    <h4 class="participant-name">${participant.name}</h4>
    <p class="participant-status">${statusText}</p>
    <div class="participant-quote">"${actuallyEliminated ? participant.lastWords : participant.favoritePhrase}"</div>
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
    : `<div class="gala-coming-soon">Próximamente: ${gala.date}</div>`;
  
  const description = gala.description ? `<p class="gala-description">${gala.description}</p>` : '';
  
  galaItem.innerHTML = `
    <div class="gala-content">
      <div class="gala-date">${gala.date}</div>
      <h3 class="gala-title">${gala.title}</h3>
      ${description}
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
        <h3>Simulador Jorge Ponce</h3>
        <div class="game-stats">
          <div class="stat">Conexiones: <span id="connections-count">0</span></div>
          <div class="stat">Eliminaciones: <span id="eliminations-count">0</span></div>
        </div>
      </div>
      <div class="game-area">
        <button class="connect-btn" id="connect-btn" onclick="startEliminationProcess()">
          CONECTAR Y ELIMINAR
        </button>
        <div class="connection-status" id="connection-status">Listo para conectar al salón virtual</div>
      </div>
    </div>
  `;
}

async function startEliminationProcess() {
  // Incrementar estadísticas
  gameState.connections++;
  document.getElementById('connections-count').textContent = gameState.connections;
  
  // Deshabilitar botón
  const connectBtn = document.getElementById('connect-btn');
  connectBtn.disabled = true;
  connectBtn.textContent = 'CONECTANDO...';
  
  // Actualizar status
  document.getElementById('connection-status').textContent = 'Conectando al salón virtual...';
  
  // Navegar a participantes
  scrollToSection('participants');
  
  // Esperar a que termine el scroll
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Crear overlay oscuro
  createDarkOverlay();
  
  // Iniciar proceso de eliminación
  await eliminationRoulette();
  
  // Restaurar botón
  connectBtn.disabled = false;
  connectBtn.textContent = 'CONECTAR Y ELIMINAR';
  document.getElementById('connection-status').textContent = 'Listo para otra conexión';
}

function createDarkOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'elimination-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1000;
    backdrop-filter: blur(5px);
    transition: all 0.5s ease;
  `;
  document.body.appendChild(overlay);
}

async function eliminationRoulette() {
  // Obtener participantes activos (no eliminados)
  const activeParticipants = appData.participants.filter(p => 
    p.status !== 'expelled' && p.status !== 'finalist-eliminated' && !p.eliminado
  );
  
  if (activeParticipants.length === 0) {
    showNotification('¡No quedan participantes para eliminar!');
    removeDarkOverlay();
    return;
  }
  
  // Obtener las cards de participantes activos
  const participantCards = document.querySelectorAll('.participant-card:not(.eliminated)');
  
  // Proceso de ruleta (más corto y directo)
  const rounds = 12; // Menos rondas para más agilidad
  
  for (let i = 0; i < rounds; i++) {
    // Quitar highlight anterior
    participantCards.forEach(card => card.classList.remove('elimination-highlight'));
    
    // Highlight aleatorio
    const randomCard = participantCards[Math.floor(Math.random() * participantCards.length)];
    randomCard.classList.add('elimination-highlight');
    
    // Delay progresivo (más ágil)
    let delay;
    if (i < rounds - 4) {
      delay = 120; // Velocidad inicial
    } else {
      delay = 200 + (i - (rounds - 4)) * 150; // Desaceleración final
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Selección final - pausa dramática
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Eliminar el participante seleccionado
  const selectedCard = document.querySelector('.elimination-highlight');
  if (selectedCard) {
    // Scroll para centrar la card seleccionada
    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extraer card y mostrar en modal
    await extractAndShowInModal(selectedCard);
  }
  
  // Remover overlay
  removeDarkOverlay();
}

async function extractAndShowInModal(card) {
  // Obtener información del participante antes de remover la card
  const participantName = card.querySelector('.participant-name').textContent;
  const participantImage = card.querySelector('.participant-image').src;
  const participantQuote = card.querySelector('.participant-quote').textContent;
  
  // Crear efecto de "extracción" de la card
  card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  card.style.transform = 'scale(0.8) translateY(-50px)';
  card.style.opacity = '0.7';
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Remover la card original de la lista
  card.remove();
  
  // Crear modal de eliminación
  await createEliminationModal(participantName, participantImage, participantQuote);
}

async function createEliminationModal(name, image, quote) {
  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'elimination-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  `;
  
  // Crear card del modal
  const modalCard = document.createElement('div');
  modalCard.className = 'modal-elimination-card';
  modalCard.innerHTML = `
    <div class="modal-card-content">
      <div class="modal-participant-image-container">
        <img src="${image}" alt="${name}" class="modal-participant-image">
      </div>
      <h2 class="modal-participant-name">${name}</h2>
      <p class="modal-participant-quote">${quote}</p>
      <div class="elimination-countdown">
        <div class="countdown-text">ELIMINACIÓN EN</div>
        <div class="countdown-number">3</div>
      </div>
    </div>
  `;
  
  modal.appendChild(modalCard);
  document.body.appendChild(modal);
  
  // Animación de entrada del modal
  modal.style.opacity = '0';
  modalCard.style.transform = 'scale(0.5) rotate(180deg)';
  modalCard.style.opacity = '0';
  
  // Mostrar modal
  await new Promise(resolve => setTimeout(resolve, 100));
  modal.style.transition = 'opacity 0.5s ease';
  modal.style.opacity = '1';
  
  modalCard.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  modalCard.style.transform = 'scale(1) rotate(0deg)';
  modalCard.style.opacity = '1';
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Countdown dramático
  await startEliminationCountdown();
  
  // Explosión del modal
  await explodeModalCard(modalCard);
  
  // Remover modal
  modal.remove();
  
  // Actualizar estadísticas
  gameState.eliminations++;
  document.getElementById('eliminations-count').textContent = gameState.eliminations;
  
  // Mostrar notificación mejorada
  showEnhancedEliminationNotification(name);
}

async function startEliminationCountdown() {
  const countdownNumber = document.querySelector('.countdown-number');
  
  for (let i = 3; i > 0; i--) {
    countdownNumber.textContent = i;
    countdownNumber.style.transform = 'scale(1.5)';
    countdownNumber.style.color = i === 1 ? 'var(--color-primary)' : 'var(--color-text)';
    
    await new Promise(resolve => setTimeout(resolve, 200));
    countdownNumber.style.transform = 'scale(1)';
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  // Último momento dramático
  countdownNumber.textContent = '¡ELIMINADO!';
  countdownNumber.style.color = 'var(--color-primary)';
  countdownNumber.style.transform = 'scale(2)';
  
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function explodeModalCard(modalCard) {
  // Crear partículas de explosión desde el modal
  const rect = modalCard.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Crear más partículas para el modal (20 partículas)
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 12px;
      height: 12px;
      background: var(--color-primary);
      border-radius: 50%;
      left: ${centerX}px;
      top: ${centerY}px;
      z-index: 4000;
      pointer-events: none;
      box-shadow: 0 0 15px var(--color-primary);
    `;
    
    document.body.appendChild(particle);
    
    // Dirección aleatoria para cada partícula
    const angle = (360 / 20) * i + Math.random() * 18;
    const distance = 150 + Math.random() * 200;
    const endX = centerX + Math.cos(angle * Math.PI / 180) * distance;
    const endY = centerY + Math.sin(angle * Math.PI / 180) * distance;
    
    // Animar partícula
    particle.animate([
      { 
        transform: 'translate(0, 0) scale(1)',
        opacity: 1
      },
      { 
        transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
        opacity: 0
      }
    ], {
      duration: 1500 + Math.random() * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
  }
  
  // Explosión de la card del modal
  modalCard.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  modalCard.style.transform = 'scale(3) rotate(1080deg)';
  modalCard.style.opacity = '0';
  modalCard.style.filter = 'blur(20px) brightness(5)';
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}


function showEnhancedEliminationNotification(participantName) {
  const notification = document.createElement('div');
  notification.className = 'enhanced-elimination-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">💥</div>
      <div class="notification-title">¡${participantName.toUpperCase()} ELIMINADO!</div>
      <div class="notification-subtitle">Jorge Ponce ha hablado</div>
      <div class="notification-tagline">Reality sin filtros ✨</div>
      <div class="notification-stats">
        <div class="stat-item">
          <span class="stat-number">${gameState.eliminations}</span>
          <span class="stat-label">Eliminaciones</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">${gameState.connections}</span>
          <span class="stat-label">Conexiones</span>
        </div>
      </div>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
    color: var(--color-text);
    padding: 4rem 3rem;
    border-radius: 25px;
    z-index: 5000;
    text-align: center;
    box-shadow: var(--shadow-neon), 0 0 100px rgba(255, 0, 110, 0.5);
    border: 2px solid var(--color-accent);
    animation: enhancedNotificationShow 3s ease forwards;
    max-width: 90vw;
    width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'enhancedNotificationHide 0.8s ease forwards';
    setTimeout(() => notification.remove(), 800);
  }, 4000);
}

function removeDarkOverlay() {
  const overlay = document.getElementById('elimination-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  }
  
  // Limpiar todos los efectos
  document.querySelectorAll('.elimination-highlight').forEach(card => {
    card.classList.remove('elimination-highlight');
  });
  
  document.querySelectorAll('.elimination-selected').forEach(card => {
    card.classList.remove('elimination-selected');
    // Restaurar estilos originales
    card.style.transform = '';
    card.style.zIndex = '';
    card.style.boxShadow = '';
    card.style.border = '';
    card.style.transition = '';
  });
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
window.startEliminationProcess = startEliminationProcess;