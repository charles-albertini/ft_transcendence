<template>
  <div class="hub-container">
    <!-- Back to Home Button -->
    <button class="back-button" @click="goHome">
      <span class="back-arrow">←</span>
      <span>Accueil</span>
    </button>

    <div class="hero-section">
      <div class="title-container">
        <h1 class="main-title">{{ $t(' Menu Mode de jeu') /* "Multijoueur" */ }}</h1>
        <p class="subtitle">Choisissez votre mode de jeu préféré</p>
      </div>
    </div>
    
    <div class="game-modes">
      <div class="mode-card" @click="goOnline">
        <div class="mode-icon">🌐</div>
        <h3 class="mode-title">{{ $t('online') /* "En ligne" */ }}</h3>
        <p class="mode-description">Affrontez des joueurs</p>
        <div class="mode-features">
          <span class="feature-tag">1v1</span>
          <span class="feature-tag">melee generale</span>
        </div>
        <button class="mode-button primary">
          <span>Jouer</span>
          <div class="button-arrow">→</div>
        </button>
      </div>

      <div class="mode-card" @click="goLocal">
        <div class="mode-icon">🎮</div>
        <h3 class="mode-title">{{ $t('local') /* "Local" */ }}</h3>
        <p class="mode-description">Jouer</p>
        <div class="mode-features">
          <span class="feature-tag">2 Joueurs</span>
          <span class="feature-tag">Local</span>
        </div>
        <button class="mode-button secondary">
          <span>Jouer localement</span>
          <div class="button-arrow">→</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composable/useAuths';

const router = useRouter();
const { isAuthenticated } = useAuth();

function goHome() {
  if (isAuthenticated.value) {
    router.push({ name: 'Home2' });
  } else {
    router.push({ name: 'Home' });
  }
}

function goOnline() {
  router.push({ name: 'CreateOrJoin' });
}

function goLocal() {
  router.push({ name: 'MultiplayerLocal' });
}
</script>

<style scoped>
.hub-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hub-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 50%);
  pointer-events: none;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 1rem;
  padding: 0.8rem 1.5rem;
  color: #d4af37;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 10;
}

.back-button:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  color: #f4d03f;
  transform: translateX(-3px);
}

.back-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.back-button:hover .back-arrow {
  transform: translateX(-2px);
}

.hero-section {
  text-align: center;
  margin-bottom: 4rem;
  z-index: 1;
}

.title-container {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 1.5rem;
  padding: 2rem 3rem;
  max-width: 600px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 8px rgba(212, 175, 55, 0.3);
}

.subtitle {
  color: #e0e0e0;
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
}

.game-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1000px;
  width: 100%;
  z-index: 1;
}

.mode-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 1.5rem;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.8s;
}

.mode-card:hover::before {
  left: 100%;
}

.mode-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #d4af37;
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
  background: rgba(0, 0, 0, 0.6);
}

.mode-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.mode-card:hover .mode-icon {
  transform: scale(1.2);
}

.mode-title {
  color: #d4af37;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  transition: color 0.3s ease;
}

.mode-card:hover .mode-title {
  color: #f4d03f;
}

.mode-description {
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
}

.mode-features {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(212, 175, 55, 0.2);
  color: #d4af37;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
}

.mode-card:hover .feature-tag {
  background: rgba(212, 175, 55, 0.3);
  color: #f4d03f;
  border-color: #d4af37;
}

.mode-button {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.mode-button.primary {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  color: #1a1a1a;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.mode-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #f4d03f, #d4af37);
}

.mode-button.secondary {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
}

.mode-button.secondary:hover {
  background: #d4af37;
  color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.button-arrow {
  transition: transform 0.3s ease;
  opacity: 0.7;
}

.mode-button:hover .button-arrow {
  transform: translateX(5px);
  opacity: 1;
}
</style>
message.txt
8 KB