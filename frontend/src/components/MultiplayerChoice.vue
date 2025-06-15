<!-- src/views/MultiplayerChoice.vue -->
<template>
  <div class="multiplayer-choice">
    <h1>Mode multijoueur</h1>
    <div class="buttons">
      <button class="btn-online" @click="goOnline">En ligne</button>
      <button class="btn-local"  @click="goLocal">Local (même écran)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goOnline() {
  // redirige vers le flow « créer / rejoindre une partie en ligne »
  router.push({ name: 'CreateOrJoin' });
}

function goLocal() {
  // redirige vers le composant local (Gamemulti.vue)
  router.push({ name: 'LocalGame' });
}
</script>

<style scoped>
.multiplayer-choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  color: #fff;
}
h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.buttons {
  display: flex;
  gap: 2rem;
}

button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-online {
  background-color: #2196f3;
  color: white;
}
.btn-online:hover {
  background-color: #1976d2;
}

.btn-local {
  background-color: #4caf50;
  color: white;
}
.btn-local:hover {
  background-color: #388e3c;
}
</style>
