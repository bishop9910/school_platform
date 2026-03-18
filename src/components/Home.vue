<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const ThemeStore = useThemeStore()

// --- 分页与数据状态 ---
const page = ref(1)
const pageSize = 10
const posts = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)

// --- 加载数据 ---
const loadPosts = async () => {
  if (loading.value || finished.value) return
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPosts = Array.from({ length: pageSize }).map((_, index) => ({
      id: (page.value - 1) * pageSize + index,
      title: `帖子标题 - 第 ${page.value} 页 - ${index + 1}`,
      content: '这是帖子的摘要内容，显示一部分文字...',
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 500)
    }))

    if (newPosts.length < pageSize) {
      finished.value = true
    }

    posts.value = [...posts.value, ...newPosts]
    page.value++
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

// --- 操作按钮事件 ---
const handleLike = (post: any) => {
  console.log('点赞', post.id)
  post.likes = (post.likes || 0) + 1
}

const handleComment = (post: any) => {
  console.log('评论', post.id)
}

const handleShare = (post: any) => {
  console.log('分享', post.id)
}

// --- 滚动监听 ---
const handleScroll = () => {
  if (loading.value || finished.value) return

  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  const clientHeight = window.innerHeight || document.documentElement.clientHeight
  const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadPosts()
  }
}

onMounted(() => {
  loadPosts()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
<div class="home-container" :data-theme="ThemeStore.isDark?'dark':'light'">
  <div class="home-bg">
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
        v-for="post in posts" 
        :key="post.id" 
        class="post-card"
        :bordered="true"
        :bodyStyle="{ padding: '0px 16px 0px 16px' }"
      >
        <template #title>
          <div class="card-header">
            <h4 class="real-title">{{ post.title }}</h4>
          </div>
        </template>
        <div class="card-content">
          <p class="real-content">{{ post.content }}</p>
        </div>
        
        <!-- ✨ 美化后的操作区 -->
        <div class="card-footer-actions">
          <button class="action-btn like-btn" @click="handleLike(post)">
            <span class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" class="icon-heart">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span class="action-text">点赞</span>
            <span class="action-count">{{ post.likes }}</span>
          </button>
          
          <button class="action-btn comment-btn" @click="handleComment(post)">
            <span class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" class="icon-comment">
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
              </svg>
            </span>
            <span class="action-text">评论</span>
            <span class="action-count">{{ post.comments }}</span>
          </button>
          
          <button class="action-btn share-btn" @click="handleShare(post)">
            <span class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" class="icon-share">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </span>
            <span class="action-text">分享</span>
          </button>
        </div>
      </a-card>

      <div v-if="loading" class="loading-status">
        <span class="loading-spinner"></span> 加载中...
      </div>
      
      <div v-if="finished && posts.length > 0" class="loading-status finished">
        没有更多数据了
      </div>
    </div>
  </div>
</div>
</template>

<style>
/* 保持原有变量定义 */
.home-container[data-theme="dark"] {
  --bg-1 :#1a1a2e;
  --bg-2 :#263c77;
}

.home-container {
  --bg-1 :#667eea;
  --bg-2 :#764ba2;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 注意：如果内容很多，justify-content 可能会影响顶部间距，通常改为 flex-start */
  align-items: center;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  position: relative;
  min-height: 100vh; 
  padding: 20px;
  box-sizing: border-box;
}

/* 建议修改：当内容超出时，让内容从顶部开始，而不是居中 */
.home-container:has(.posts-container) {
  justify-content: flex-start;
  padding-top: 40px;
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

/* 真实内容样式 */
.real-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.real-content {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

/* 加载状态样式 */
.loading-status {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-status.finished {
  color: #999;
}

/* 简单的 loading 转圈动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 深色模式适配 */
.home-container[data-theme="dark"] .post-card {
  background: rgba(30, 30, 50, 0.95);
  color: #fff;
}

/* 修复标题和内容颜色 */
.home-container[data-theme="dark"] .real-title {
  color: #eee;
}

.home-container[data-theme="dark"] .real-content {
  color: #aaa;
}

/* ... 后面的 loading 样式保持不变 ... */
.home-container[data-theme="dark"] .loading-status {
  color: #aaa;
}

.home-container[data-theme="dark"] .loading-spinner {
  border-color: #444;
  border-top-color: #667eea;
}

/* ===== ✨ 美化后的操作区样式 ===== */
.card-footer-actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 0;
  margin: 0 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  color: #64748b;
  min-width: 100px;
}

/* 按钮背景渐变效果 */
.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.action-btn:hover::before {
  opacity: 1;
}

.action-btn:hover {
  color: #667eea;
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

/* 图标样式 */
.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.action-btn:hover .action-icon {
  transform: scale(1.15);
}

.action-icon svg {
  width: 100%;
  height: 100%;
}

/* 文字样式 */
.action-text {
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 计数样式 */
.action-count {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
  background: rgba(148, 163, 184, 0.15);
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.action-btn:hover .action-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

/* 点赞按钮特殊效果 */
.like-btn:hover .icon-heart {
  color: #ef4444;
}

/* 评论按钮特殊效果 */
.comment-btn:hover .icon-comment {
  color: #3b82f6;
}

/* 分享按钮特殊效果 */
.share-btn:hover .icon-share {
  color: #10b981;
}

/* ===== 🌙 深色模式适配 ===== */
.home-container[data-theme="dark"] .card-footer-actions {
  border-top-color: rgba(255, 255, 255, 0.12);
}

.home-container[data-theme="dark"] .action-btn {
  color: #94a3b8;
}

.home-container[data-theme="dark"] .action-btn::before {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
}

.home-container[data-theme="dark"] .action-btn:hover {
  color: #818cf8;
}

.home-container[data-theme="dark"] .action-count {
  background: rgba(148, 163, 184, 0.2);
  color: #64748b;
}

.home-container[data-theme="dark"] .action-btn:hover .action-count {
  background: rgba(129, 140, 248, 0.25);
  color: #818cf8;
}

/* 点赞深色效果 */
.home-container[data-theme="dark"] .like-btn:hover .icon-heart {
  color: #f87171;
}

/* 评论深色效果 */
.home-container[data-theme="dark"] .comment-btn:hover .icon-comment {
  color: #60a5fa;
}

/* 分享深色效果 */
.home-container[data-theme="dark"] .share-btn:hover .icon-share {
  color: #34d399;
}

/* ===== 点击涟漪效果 ===== */
.action-btn .ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.4);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* ===== 点赞动画 ===== */
@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.action-btn.liked .icon-heart {
  animation: heart-beat 0.4s ease;
  color: #ef4444;
}

.home-container[data-theme="dark"] .action-btn.liked .icon-heart {
  color: #f87171;
}

</style>