<script setup lang="ts">
import {useThemeStore} from '@/stores/theme'
import {getInfo} from '@/api/login'
const ThemeStore = useThemeStore()

</script>

<template>
<div class="home-container" :data-theme="ThemeStore.isDark?'dark':'light'">
  <div class="home-bg" >
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>
    <div class="bg-circle circle-3"></div>
  </div>
  <div class="main-content">
    <!-- 顶部轮播图 -->
    <a-carousel autoplay class="top-carousel">
      <div>
        <div class="carousel-item">
          <h3>轮播图 1</h3>
        </div>
      </div>
      <div>
        <div class="carousel-item">
          <h3>轮播图 2</h3>
        </div>
      </div>
      <div>
        <div class="carousel-item">
          <h3>轮播图 3</h3>
        </div>
      </div>
    </a-carousel>

    <!-- 帖子列表 -->
    <div class="posts-container">
      <a-card 
        v-for="i in 10" 
        :key="i" 
        class="post-card"
        :bordered="true"
      >
        <template #title>
          <div class="card-header">
            <div class="title-placeholder"></div>
          </div>
        </template>
        <div class="card-content">
          <div class="content-line line-1"></div>
          <div class="content-line line-2"></div>
          <div class="content-line line-3"></div>
        </div>
        <template #actions>
          <span>操作 1</span>
          <span>操作 2</span>
        </template>
      </a-card>
    </div>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  position: relative;
  min-height: 100vh; 
  padding: 20px;
  box-sizing: border-box;

}

.home-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-circle {
  position: fixed;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
  z-index: 0;  
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

.main-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* 顶部轮播图 */
.top-carousel {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.carousel-item {
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-item h3 {
  color: #fff;
  font-size: 32px;
  margin: 0;
}

/* 帖子列表容器 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 帖子卡片 */
.post-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

/* 卡片标题占位 */
.card-header {
  display: flex;
  align-items: center;
}

.title-placeholder {
  height: 24px;
  width: 60%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

/* 卡片内容占位 */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.content-line {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.content-line.line-1 {
  height: 16px;
  width: 100%;
  animation-delay: 0s;
}

.content-line.line-2 {
  height: 16px;
  width: 90%;
  animation-delay: 0.2s;
}

.content-line.line-3 {
  height: 16px;
  width: 70%;
  animation-delay: 0.4s;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 深色模式适配 */
.home-container[data-theme="dark"] .post-card {
  background: rgba(30, 30, 50, 0.95);
  color: #fff;
}

.home-container[data-theme="dark"] .title-placeholder,
.home-container[data-theme="dark"] .content-line {
  background: linear-gradient(90deg, #4a4a6a 25%, #5a5a7a 50%, #4a4a6a 75%);
  background-size: 200% 100%;
}
</style>