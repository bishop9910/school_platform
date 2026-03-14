// src/stores/theme.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('isDark', () => {
  // 1. 定义状态
  const isDark = ref(false)
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  const theme = saved || 'light'
  isDark.value = theme === 'dark'
  localStorage.setItem('theme', theme)

  

  return { isDark }
})