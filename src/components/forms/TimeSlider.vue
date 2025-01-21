<template>
  <div class="time-slider">
    <!-- Mostrar la hora seleccionada -->
    <div class="selected-time">{{ options[currentIndex] }}</div>
    <div class="track">
      <div 
        class="thumb" 
        :style="{ left: `${currentPercentage}%` }"
        @mousedown="startDragging"
        @touchstart="startDragging"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeSlider",
  data() {
    return {
      options: [
         "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", 
        "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30",
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30","12:00"
      ],
      currentIndex: 0,
      isDragging: false,
    };
  },
  computed: {
    currentPercentage() {
      return (this.currentIndex / (this.options.length - 1)) * 100;
    },
  },
  methods: {
    startDragging(event) {
      this.isDragging = true;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.stopDragging);
      document.addEventListener("touchmove", this.onDrag);
      document.addEventListener("touchend", this.stopDragging);
    },
    onDrag(event) {
      if (!this.isDragging) return;

      const track = this.$el.querySelector(".track");
      const rect = track.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      let percentage = ((clientX - rect.left) / rect.width) * 100;

      percentage = Math.max(0, Math.min(100, percentage));

      const newIndex = Math.round((percentage / 100) * (this.options.length - 1));
      this.currentIndex = newIndex;
    },
    stopDragging() {
      this.isDragging = false;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.stopDragging);
      document.removeEventListener("touchmove", this.onDrag);
      document.removeEventListener("touchend", this.stopDragging);
    },
  },
};
</script>

<style scoped>
.time-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.selected-time {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.track {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
}

.thumb {
  position: absolute;
  top: -8px;
  width: 25px;
  height: 25px;
  background-color: #007bff;
  border-radius: 50%;
  cursor: grab;
  transform: translateX(-50%);
  transition: background-color 0.2s;
}

.thumb:active {
  cursor: grabbing;
}
</style>
