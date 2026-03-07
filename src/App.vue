<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  const theme = saved || 'light'
  isDark.value = theme === 'dark'
  localStorage.setItem('theme', theme)
})
</script>

<template>
  <nav :data-theme="isDark ? 'dark' : 'light'">
    <div class="nav-links">
      <router-link to="/">主页</router-link>
      <router-link to="/test">test</router-link>
      <router-link to="/test">test</router-link>
      <router-link to="/test">test</router-link>
      <router-link to="/test">test</router-link>

    </div>

    <div class="nav-title">
      <h2>校园技能与资源流转平台</h2>
    </div>
    
    <div class="theme-toggle-wrapper">
      <label class="theme-toggle" :title="isDark ? '切换到亮色模式' : '切换到深色模式'">
        <input 
          type="checkbox" 
          v-model="isDark" 
          class="theme-checkbox"
        />
        <span class="toggle-slider">
          <span class="toggle-icon sun">☀️</span>
          <span class="toggle-icon moon">🌙</span>
        </span>
      </label>
    </div>
  </nav>
  
  <router-view></router-view>
</template>

<style scoped>
/* ========== 亮色主题（默认） ========== */
nav {
  --nav-bg-2: #e877f4;
  --nav-bg-1: #5344d5;
  --nav-text: #ffffff;
  --nav-hover: rgba(255, 255, 255, 0.2);
  --nav-active: rgba(255, 255, 255, 0.35);
  --nav-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --nav-radius: 0;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  --toggle-bg: rgba(255, 255, 255, 0.25);
  --toggle-slider-bg: #ffffff;
  --toggle-icon-opacity: 0.5;
  --toggle-icon-active: 1;

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--nav-bg-1) 0%, var(--nav-bg-2) 100%);
  border-radius: var(--nav-radius);
  box-shadow: var(--nav-shadow);
  
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
  
  position: sticky;
  top: 0;
  z-index: 100;
  
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* ========== 深色主题 ========== */
nav[data-theme="dark"] {
  --nav-bg-1: #1a1a2e;
  --nav-bg-2: #263c77;
  --nav-text: #e6e6e6;
  --nav-hover: rgba(255, 255, 255, 0.1);
  --nav-active: rgba(255, 255, 255, 0.2);
  --nav-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  
  --toggle-bg: rgba(255, 255, 255, 0.15);
  --toggle-slider-bg: #2d3748;
  --toggle-icon-opacity: 0.4;
  --toggle-icon-active: 1;
}

/* 流光动画 */
nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.12),
    transparent
  );
  opacity: 0;
  transform: translateX(-100%);
  transition: transform 1.1s ease, opacity 0.3s ease;
  pointer-events: none;
  will-change: transform;
}

nav:hover::before {
  transform: translateX(100%);
  opacity: 1;
}

/* 链接容器 - 靠左 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
}

.nav-title {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
  color: #ffffff
}

/* 链接样式 */
nav :deep(a) {
  position: relative;
  padding: 10px 20px;
  color: var(--nav-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  transition: var(--transition);
  display: inline-block;
  white-space: nowrap;
}

nav :deep(a:hover) {
  background: var(--nav-hover);
  transform: translateY(-2px);
}

nav :deep(a.router-link-active) {
  background: var(--nav-active);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 currentColor;
}

nav :deep(a.router-link-active::after) {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  animation: underlinePulse 2s ease-in-out infinite;
}

@keyframes underlinePulse {
  0%, 100% { opacity: 1; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 0.7; transform: translateX(-50%) scaleX(0.9); }
}

nav :deep(a:active) {
  transform: translateY(0);
  transition-duration: 0.1s;
}

/* ========== 滑动切换按钮样式 ========== */
.theme-toggle-wrapper {
  display: flex;
  align-items: center;
}

.theme-toggle {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
  cursor: pointer;
}

.theme-checkbox {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--toggle-bg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 28px;
  transition: var(--transition);
  overflow: hidden;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 2px;
  background: var(--toggle-slider-bg);
  border-radius: 50%;
  transition: var(--transition);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.toggle-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  transition: var(--transition);
  z-index: 1;
  pointer-events: none;
}

.toggle-icon.sun { left: 6px; opacity: var(--toggle-icon-active); }
.toggle-icon.moon { right: 6px; opacity: var(--toggle-icon-opacity); }

.theme-checkbox:checked + .toggle-slider::before {
  transform: translateX(28px);
  background: #ffd700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}
.theme-checkbox:checked + .toggle-slider .toggle-icon.sun { opacity: var(--toggle-icon-opacity); }
.theme-checkbox:checked + .toggle-slider .toggle-icon.moon { opacity: var(--toggle-icon-active); }

.theme-toggle:hover .toggle-slider {
  border-color: rgba(255, 255, 255, 0.5);
}

/* 响应式 */
@media (max-width: 768px) {
  nav {
    padding: 10px 16px;
  }
  nav :deep(a) {
    padding: 8px 14px;
    font-size: 14px;
  }
  .theme-toggle {
    width: 48px;
    height: 24px;
  }
  .toggle-slider::before {
    height: 18px;
    width: 18px;
  }
  .theme-checkbox:checked + .toggle-slider::before {
    transform: translateX(24px);
  }
  .toggle-icon { font-size: 12px; }
}

@media (max-width: 480px) {
  nav {
    padding: 8px 12px;
    gap: 4px;
  }
  nav :deep(a) {
    padding: 6px 12px;
    font-size: 13px;
  }
  .theme-toggle {
    width: 44px;
    height: 22px;
  }
  .toggle-slider::before {
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
  }
  .theme-checkbox:checked + .toggle-slider::before {
    transform: translateX(22px);
  }
  .toggle-icon { font-size: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>