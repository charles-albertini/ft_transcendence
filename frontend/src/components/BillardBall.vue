<template>
	<div
	  class="relative rounded-full flex items-center justify-center"
	  :class="className"
	  :style="{
		width: size + 'px',
		height: size + 'px',
		backgroundColor: ballColor,
		boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 5px rgba(0, 0, 0, 0.2), inset 0 2px 5px rgba(255, 255, 255, 0.2)',
	  }"
	>
	  <div
		class="absolute rounded-full flex items-center justify-center"
		:style="{
		  width: size * 0.4 + 'px',
		  height: size * 0.4 + 'px',
		  backgroundColor: '#ffffff',
		}"
	  >
		<span
		  :style="{
			color: textColor,
			fontWeight: 'bold',
			fontSize: size * 0.25 + 'px',
		  }"
		>
		  {{ number }}
		</span>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Définition des props
  const props = defineProps({
	number: {
	  type: Number,
	  required: true,
	},
	size: {
	  type: Number,
	  default: 50,
	},
	className: {
	  type: String,
	  default: '',
	},
  })
  
  // Couleurs pour les différentes boules de billard
  const colors = {
	1: '#fdd835', // Jaune
	2: '#1e88e5', // Bleu
	3: '#e53935', // Rouge
	4: '#8e24aa', // Violet
	5: '#ff9800', // Orange
	6: '#2e7d32', // Vert
	7: '#5d4037', // Marron
	8: '#000000', // Noir
	9: '#fdd835', // Jaune
	10: '#1e88e5', // Bleu
	11: '#e53935', // Rouge
	12: '#8e24aa', // Violet
	13: '#ff9800', // Orange
	14: '#2e7d32', // Vert
	15: '#5d4037', // Marron,
  }
  
  // Calcul de la couleur de la boule
  const ballColor = computed(() => colors[props.number] || '#000000')
  
  // Calcul de la couleur du texte
  const textColor = computed(() => (props.number === 8 ? '#ffffff' : '#000000'))
  </script>