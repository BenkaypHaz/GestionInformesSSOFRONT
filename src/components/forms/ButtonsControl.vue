<template>
    <button :class="buttonType">
      <div class="svg-wrapper-1">
        <div class="svg-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
            </path>
          </svg>
        </div>
      </div>
      <span>{{ buttonText }}</span>
    </button>
  </template>
  
  
  <script>
  export default {
    props: {
      buttonType: {
        type: String,
        default: 'send-button'
      },
      buttonText: {
        type: String,
        default: 'Guardar'
      }
    }
  }
  </script>
<style scoped>


.send-button {
  font-family: inherit;
  font-size: 16px;
  height: 100; /* Makes the button take the full height of the container */
  background: #633394;
  color: white;
  padding: 0.7em 1em;
  display: flex;
  align-items: center;
  justify-content: center; /* Center content horizontally */
  border: none;
  border-radius: 10%; /* Adjust as needed */
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.send-button span {
  display: block;
  margin-left: 0.3em;
  transition: all 0.3s ease-in-out;
}

.send-button svg {
  display: block;
  transform-origin: center center;
  transition: transform 0.3s ease-in-out;
}

.send-button:hover .svg-wrapper {
  animation: fly-1 0.6s ease-in-out infinite alternate;
}

.send-button:hover svg {
  transform: translateX(1.6em) rotate(45deg) scale(1.1);
}

.send-button:hover span {
  transform: translateX(5em);
}

.send-button:active {
  transform: scale(0.95);
}

@keyframes fly-1 {
  from {
    transform: translateY(0.1em);
  }
  to {
    transform: translateY(-0.1em);
  }
}

.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: auto;
  padding: 12px 18px;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50px;
  background: #b1dae7;
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}

.cta span {
  position: relative;
  font-family: "Ubuntu", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #234567;
}

.cta svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #234567;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.cta:hover:before {
  width: 100%;
  background-color: #633394;
}

.cta:hover span {
  color: white;
}

.cta:hover svg {
  transform: translateX(0);
  stroke: white;
}

.cta span,
.cta svg {
  margin: 0 5px; /* Adjust as needed */
  color: #234567;
}

.cta:active {
  transform: scale(0.95);
}
</style>
