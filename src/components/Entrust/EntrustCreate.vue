<script setup lang="ts">
import {useThemeStore} from '@/stores/theme'
const ThemeStore = useThemeStore()

</script>

<template>
<div class="home-container" :data-theme="ThemeStore.isDark?'dark':'light'">
  <div class="home-bg" >
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
  </div>
</template>

<style>
  .home-container[data-theme="dark"] {
  --bg-1 :#1a1a2e;
  --bg-2 :#263c77;
}
.home-container {
  --bg-1 :#667eea;
  --bg-2 :#764ba2;
  min-height: 93.17vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}



.home-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 350px;
  height: 350px;
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  top: 40%;
  left: 20%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
</style>