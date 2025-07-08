<script setup>

import SectionMain from '../components/layouts/SectionMain.vue';
import LayoutAuthenticated from '../components/layouts/LayoutAuthenticated.vue';
// ASUMO que CardBox está en esta ruta, ajusta si es necesario
import CardBox from '../components/base/CardBox.vue';
import CardBoxChar from '../components/base/CardBoxChar.vue';
// Importa la imagen
import logoSsoWhite from '@/assets/images/Logo-sso-white.png'; // Ajusta la ruta si es diferente

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox class="mb-6 flex flex-col items-center justify-center">
        <div class="p-4 text-center">
          <img :src="logoSsoWhite" alt="Logo SSO White" class="max-h-64 mx-auto" />
          </div>
      </CardBox>
<div class="flex flex-wrap lg:flex-nowrap justify-around gap-6">
  <CardBoxChar title="Cuentas Ejecutadas vs No Ejecutadas" class="w-full lg:w-1/2">
    <div class="p-6 text-gray-700 dark:text-gray-300">
      <h3 class="text-xl font-semibold mb-3">Resumen General</h3>
      <ul class="space-y-2">
        <li class="flex justify-between">
          <span>Informes de calor:</span>
          <span class="font-bold text-green-500">150</span>
        </li>
        <li class="flex justify-between">
          <span>Informes de ruido:</span>
          <span class="font-bold text-red-500">50</span>
        </li>
        <li class="flex justify-between border-t pt-2 mt-2 border-gray-300 dark:border-gray-700">
          <span>Total de Informes:</span>
          <span class="font-bold">200</span>
        </li>
      </ul>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        * Datos actualizados al cierre del último mes.
      </p>
    </div>
  </CardBoxChar>

  <CardBoxChar title="Cuentas Presupuestadas" class="w-full lg:w-1/2">
    <div class="p-6 text-gray-700 dark:text-gray-300">
      <h3 class="text-xl font-semibold mb-3">Empresas atentidas</h3>
      <ul class="space-y-2">
        <li class="flex justify-between">
          <span>Empresas afiliadas:</span>
          <span class="font-bold">29</span>
        </li>
        <li class="flex justify-between">
          <span>Empresas no afiliadas</span>
          <span class="font-bold text-yellow-500">11</span>
        </li>
        <li class="flex justify-between border-t pt-2 mt-2 border-gray-300 dark:border-gray-700">
          <span>Total de empresasa atendidas:</span>
          <span class="font-bold">40</span>
        </li>
      </ul>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        * Datos actualizados al cierre del último mes.
      </p>
    </div>
  </CardBoxChar>
</div>
      </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
/* Tus estilos existentes */
.chart-container {
  height: 400px;
  /* Adjust to your preferred height */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Additional styling for consistent padding and alignment */
.chart-box {
  flex: 1;
  padding: 10px;
  box-sizing: border-box;
}

.rocker {
  display: inline-block;
  position: relative;
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  color: #888;
  width: 11.25em;
  /* Adjusted width for larger text */
  height: 4em;
  overflow: hidden;
  border-bottom: 0.5em solid #eee;
}

.rocker-large {
  font-size: 1.5em;
  margin: 1em;
}

.rocker::before {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #999;
  border: 0.5em solid #eee;
  border-bottom: 0;
}

.rocker input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-left,
.switch-right {
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transition: 0.2s;
  user-select: none;
}

.switch-left {
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  left: 0.85em;
  bottom: 0.4em;
  background-color: #ddd;
  transform: rotate(15deg) skewX(15deg);
}

.switch-right {
  right: 0.5em;
  bottom: 0;
  background-color: #bd5757;
  color: #fff;
}

.switch-left::before,
.switch-right::before {
  content: "";
  position: absolute;
  width: 0.4em;
  height: 2.45em;
  bottom: -0.45em;
  background-color: #ccc;
  transform: skewY(-65deg);
}

.switch-left::before {
  left: -0.4em;
}

.switch-right::before {
  right: -0.375em;
  background-color: transparent;
  transform: skewY(65deg);
}

input:checked+.switch-left {
  background-color: #0084d0;
  color: #fff;
  bottom: 0px;
  left: 0.5em;
  height: 2.5em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(0deg) skewX(0deg);
}

input:checked+.switch-left::before {
  background-color: transparent;
  width: 5.0833em;
  /* Adjusted width for larger text */
}

input:checked+.switch-left+.switch-right {
  background-color: #ddd;
  color: #888;
  bottom: 0.4em;
  right: 0.8em;
  height: 2.4em;
  width: 5em;
  /* Adjusted width for larger text */
  transform: rotate(-15deg) skewX(-15deg);
}

input:checked+.switch-left+.switch-right::before {
  background-color: #ccc;
}

/* Keyboard Users */
input:focus+.switch-left {
  color: #333;
}

input:checked:focus+.switch-left {
  color: #fff;
}

input:focus+.switch-left+.switch-right {
  color: #fff;
}

input:checked:focus+.switch-left+.switch-right {
  color: #333;
}

/* Custom height for LineChart */
.h-custom-height {
  height: 500px;
  /* Adjust the height as needed */
}

.custom-select {
  background-color: #181c2c;
  color: white;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 5px;
  font-size: 1rem;
  padding-right: 2rem;
  /* Added padding to prevent text collision with the arrow */
}

.custom-select option {
  background-color: #181c2c;
  color: white;
}
.container {
  width: 100%;
  height: 100%;
  --s: 200px; /* control the size */
  --c1: #1d1d1d;
  --c2: #4e4f51;
  --c3: #3c3c3c;

  background: repeating-conic-gradient(
      from 30deg,
      #0000 0 120deg,
      var(--c3) 0 180deg
    )
    calc(0.5 * var(--s)) calc(0.5 * var(--s) * 0.577),
  repeating-conic-gradient(
      from 30deg,
      var(--c1) 0 60deg,
      var(--c2) 0 120deg,
      var(--c3) 0 180deg
    );
  background-size: var(--s) calc(var(--s) * 0.577);
}

/* Estilos para centrar la imagen en el CardBox si es necesario */
.card-image-container img {
  display: block; /* Para que mx-auto funcione correctamente */
  max-width: 100%; /* Asegura que la imagen no exceda el ancho del card */
  /* max-height: 200px; /* Define una altura máxima si quieres, ajusta el valor */
}
</style>