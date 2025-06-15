<!-- src/components/MultiplayerHub.vue -->
<template>
  <div class="hub-container">
    <h1>{{ $t('multiplayerHubTitle') /* “Multijoueur” */ }}</h1>
    <div class="hub-buttons">
      <!--        ▶ Mode en ligne (choix créer/rejoindre) -->
      <button @click="goOnline" class="btn btn-online">
        {{ $t('onlineMode') /* “En ligne” */ }}
      </button>
      <!--        ▶ Mode local (2 joueurs sur même écran) -->
      <button @click="goLocal" class="btn btn-local">
        {{ $t('localMode') /* “Local” */ }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
//import { useI18n } from 'vue-i18n';

const router = useRouter();
//const { t } = useI18n();

function goOnline() {
  router.push({ name: 'CreateOrJoin' });
}
function goLocal() {
  router.push({ name: 'MultiplayerLocal' });
}
</script>

<style scoped>
.hub-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
h1 {
  font-size: 2.5rem;
  color: #d4af37;
  margin-bottom: 2rem;
}
.hub-buttons {
  display: flex;
  gap: 2rem;
}
.btn {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: background-color 0.2s;
}
.btn-online {
  background-color: #4caf50;
}
.btn-online:hover {
  background-color: #388e3c;
}
.btn-local {
  background-color: #2196f3;
}
.btn-local:hover {
  background-color: #1976d2;
}
</style>
