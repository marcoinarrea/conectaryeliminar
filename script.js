async function loadPeople() {
  try {
    const res = await fetch("people.json");
    const people = await res.json();
    
    // Separar expulsados y finalistas
    const expelled = people.filter(p => p.status === 'expelled');
    const finalists = people.filter(p => p.status === 'finalist' || p.status === 'finalist-eliminated');
    
    // Renderizar expulsados
    renderContestants(expelled, 'expelled-grid');
    
    // Renderizar finalistas
    renderContestants(finalists, 'finalists-grid');
    
  } catch (error) {
    console.error('Error loading people:', error);
  }
}

function renderContestants(contestants, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  
  contestants.forEach(person => {
    const card = document.createElement("div");
    card.className = `contestant-card ${person.status}`;
    
    card.innerHTML = `
      <img src="${person.image}" alt="${person.name}" class="contestant-image" loading="lazy">
      <p class="contestant-name">${person.name}</p>
    `;
    
    // Agregar efecto de hover y click
    card.addEventListener('mouseenter', () => {
      if (person.status !== 'expelled') {
        card.style.transform = 'translateY(-10px) scale(1.05)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    
    container.appendChild(card);
  });
  
  // Agregar clase especial si solo hay una tarjeta (para centrar)
  if (contestants.length === 1) {
    container.classList.add('single-card');
  } else {
    container.classList.remove('single-card');
  }
}

// Función para agregar efectos de sonido (opcional)
function playSound(type) {
  // Esta función podría expandirse para incluir efectos de sonido
  // de concursos de TV españoles
  console.log(`Playing ${type} sound effect`);
}

// Función para simular cambios en tiempo real
function simulateRealTimeUpdates() {
  // Esta función podría usarse para simular actualizaciones
  // en tiempo real del estado de los concursantes
  setInterval(() => {
    // Aquí podrían agregarse efectos visuales adicionales
    // como parpadeos en las luces decorativas
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, index) => {
      setTimeout(() => {
        light.style.animation = 'none';
        light.offsetHeight; // Trigger reflow
        light.style.animation = 'blink 2s infinite alternate';
      }, index * 100);
    });
  }, 10000); // Cada 10 segundos
}

// Función para manejar la carga desde localStorage (manteniendo compatibilidad)
function loadFromStorage() {
  const saved = localStorage.getItem("people");
  if (saved) {
    try {
      const people = JSON.parse(saved);
      
      // Separar expulsados y finalistas
      const expelled = people.filter(p => p.status === 'expelled');
      const finalists = people.filter(p => p.status === 'finalist' || p.status === 'finalist-eliminated');
      
      // Renderizar
      renderContestants(expelled, 'expelled-grid');
      renderContestants(finalists, 'finalists-grid');
      
    } catch (error) {
      console.error('Error parsing saved data:', error);
      loadPeople();
    }
  } else {
    loadPeople();
  }
}

// Función para agregar efectos visuales especiales
function addSpecialEffects() {
  // Efecto de partículas azules ocasionales
  setInterval(() => {
    createBlueParticle();
  }, 3000);
}

function createBlueParticle() {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    width: 4px;
    height: 4px;
    background: #60a5fa;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 0 10px #60a5fa;
    left: ${Math.random() * window.innerWidth}px;
    top: -10px;
    animation: fall 3s linear forwards;
  `;
  
  document.body.appendChild(particle);
  
  // Remover la partícula después de la animación
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 3000);
}

// Agregar animación CSS para las partículas
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Función para cargar galas desde JSON
async function loadGalas() {
  try {
    const res = await fetch("galas.json");
    const galas = await res.json();
    renderGalas(galas);
  } catch (error) {
    console.error('Error loading galas:', error);
  }
}

function renderGalas(galas) {
  const container = document.getElementById('galas-grid');
  container.innerHTML = "";
  
  galas.forEach(gala => {
    const galaItem = document.createElement("div");
    galaItem.className = `gala-item${!gala.available ? ' placeholder' : ''}`;
    
    const videoContent = gala.available && gala.videoUrl ? 
      `<iframe 
        src="${gala.videoUrl}" 
        title="Conectar y Eliminar - ${gala.title}"
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen
        loading="lazy">
      </iframe>` :
      `<div class="coming-soon-content">
        <span class="coming-soon-text">PRÓXIMAMENTE</span>
        <div class="coming-soon-date">${gala.date}</div>
      </div>`;
    
    galaItem.innerHTML = `
      <h3 class="gala-number">${gala.title}</h3>
      <div class="gala-date">${gala.date}</div>
      <div class="gala-video-wrapper${!gala.available || !gala.videoUrl ? ' coming-soon' : ''}">
        ${videoContent}
      </div>
      <p class="gala-description">${gala.description}</p>
    `;
    
    container.appendChild(galaItem);
  });
}

// Función para cargar shorts desde JSON
async function loadShorts() {
  try {
    const res = await fetch("shorts.json");
    const shorts = await res.json();
    renderShorts(shorts);
  } catch (error) {
    console.error('Error loading shorts:', error);
  }
}

function renderShorts(shorts) {
  const container = document.getElementById('shorts-grid');
  container.innerHTML = "";
  
  shorts.forEach(short => {
    const shortItem = document.createElement("div");
    shortItem.className = "short-item";
    
    const tagsHtml = short.tags.map(tag => `<span class="short-tag">#${tag}</span>`).join('');
    
    shortItem.innerHTML = `
      <div class="short-video-container">
        <iframe 
          src="https://www.youtube.com/embed/${short.videoId}" 
          title="${short.title}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen
          loading="lazy">
        </iframe>
        <div class="short-overlay">
          <div class="short-duration">${short.duration}</div>
          <div class="short-gala-ref">${short.galaRef}</div>
        </div>
      </div>
      <div class="short-content">
        <h3 class="short-title">${short.title}</h3>
        <p class="short-description">${short.description}</p>
        <div class="short-tags">${tagsHtml}</div>
      </div>
    `;
    
    // Efecto hover para shorts
    shortItem.addEventListener('mouseenter', () => {
      shortItem.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    shortItem.addEventListener('mouseleave', () => {
      shortItem.style.transform = '';
    });
    
    container.appendChild(shortItem);
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  loadGalas();
  loadShorts();
  simulateRealTimeUpdates();
  addSpecialEffects();
});