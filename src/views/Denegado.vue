<template>
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1 class="unauthorized-title">Acceso Denegado</h1>
        <p class="unauthorized-message">No tienes los permisos necesarios para acceder a esta página.</p>
        <router-link to="/dashboard" class="back-home-button">Regresar</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  };
  </script>
  
  <style scoped>
  .unauthorized-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #141e30, #243b55);
    color: white;
    text-align: center;
    padding: 20px;
  }
  
  .unauthorized-content {
    max-width: 600px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .unauthorized-image {
    width: 150px;
    margin-bottom: 20px;
  }
  
  .unauthorized-title {
    font-size: 2.5em;
    margin-bottom: 10px;
  }
  
  .unauthorized-message {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
  
  .back-home-button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 1em;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .back-home-button:hover {
    background-color: #0056b3;
  }
  </style>
  