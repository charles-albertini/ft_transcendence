<!-- src/components/CreateOrJoin.vue -->
<template>
  <div class="choose-container">
    <h2>{{ $t('chooseOnlineTitle') /* “Choisir : En ligne” */ }}</h2>
    <div class="buttons">
      <button @click="goCreate" class="btn btn-create">
        {{ $t('createGameBtn') /* “Créer une partie” */ }}
      </button>
      <button @click="goJoin" class="btn btn-join">
        {{ $t('joinGameBtn') /* “Rejoindre une partie” */ }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
//import { useI18n } from 'vue-i18n';

const router = useRouter();
//const { t } = useI18n();

function goCreate() {
  router.push({ name: 'CreateGame' });
}
function goJoin() {
  router.push({ name: 'JoinGame' });
}
</script>

<style scoped>
.choose-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f8f9fa;
}
h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #d4af37;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
}
.btn {
  padding: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.2s;
  color: white;
}
.btn-create {
  background-color: #ff9800;
}
.btn-create:hover {
  background-color: #fb8c00;
}
.btn-join {
  background-color: #4caf50;
}
.btn-join:hover {
  background-color: #388e3c;
}
</style>
