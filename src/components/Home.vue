<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getAvatarUrl, getPostImageUrl, getPostList } from '@/api/post'
import { EditOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const ThemeStore = useThemeStore()
const router = useRouter()

// --- 侧边栏数据 ---
const userLevel = ref(1)
const tools = ref([
  { name: '工具合集', icon: '📦', path: '/tools' },
  { name: '签到福利', icon: '🎁', path: '/checkin' },
  { name: '观测枢', icon: '🔍', path: '/observatory' },
  { name: '大地图', icon: '🗺️', path: '/map' },
  { name: '养成计算器', icon: '🧮', path: '/calculator' },
  { name: '阵容广场', icon: '👥', path: '/teams' },
])

// --- 侧边栏方法 ---
const goToPublish = () => router.push('/publish')
const goToPublishImage = () => router.push('/publish?type=image')
const goToPublishVideo = () => router.push('/publish?type=video')
const goToTool = (path: string) => router.push(path)

// --- 分页与数据状态 ---
const page = ref(1)
const pageSize = 10
const posts = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)

// --- 加载数据 ---
const loadPosts = async () => {
  // console.log('加载更多')
  if (loading.value || finished.value) return
  loading.value = true
  
  try {
    const res = await getPostList(page.value)
    const newPosts = res.data
    const firstPost:any = newPosts[0]
    const firstPostImage:any = firstPost.images[0].image_url
    console.log(firstPostImage)

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
const isHome = true;
let timeId: any = null
// --- 滚动监听 ---
const handleScroll = () => {
  if (timeId) {
    clearTimeout(timeId)
  }
  timeId = setTimeout(() => {
    if (!isHome) return
    if (loading.value || finished.value) return
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = window.innerHeight || document.documentElement.clientHeight
    const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadPosts()
    }}, 500)
}

onMounted(() => {
  loadPosts()
  document.body.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  document.body.removeEventListener('scroll', handleScroll)
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
    <!-- 左侧内容区 -->
    <div class="content-left">
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
      <router-link 
        v-for="post in posts" 
        :key="post.id" 
        :to="`/post/${post.id}`" 
        style="text-decoration: none; color: inherit;" 
      > 
        <a-card 
          class="post-card"
          :bordered="true"
          :bodyStyle="{ padding: '0px 16px 0px 16px' }"
        >
        <template #title>
          <div class="card-header">
            <div class="user-info">
              <div class="user-avatar">
                <!-- 头像 -->
                <img 
                  :src="post.author?.avatar ? getAvatarUrl(post.author.avatar) : undefined"
                  alt="用户头像" 
                  class="avatar-img"
                >
              </div>
              <div class="user-details">
                <h5 class="user-name">{{ post.author?.nickname || post.author?.username || `用户${post.user_id}` || '用户' }}</h5>
                <p class="post-time">{{ new Date(post.create_time).toLocaleString('zh-CN') || '刚刚' }}</p>
              </div>
            </div>
            <h4 class="real-title">{{ post.title }}</h4>
          </div>
        </template>
        <div v-if="post.images?.length" class="image-content">
            <a-image 
              v-for="(img, idx) in post.images" 
              :key="idx"
              :src="getPostImageUrl(img.image_url)"
              :preview="{
                visible: false,
                onVisibleChange: (visible: boolean) => { /* 自定义预览逻辑 */ }
              }"
              class="post-image"
            />
          </div>
        <div class="card-content">
          <p class="real-content">{{ post.content.slice(0, 100) }}</p>
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
            <span class="action-count">1111</span>
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
      </router-link>
      <div v-if="loading" class="loading-status">
        <span class="loading-spinner"></span> 加载中...
      </div>
      
      <div v-if="finished && posts.length > 0" class="loading-status finished">
        没有更多数据了
      </div>
    </div>
    </div>
    
    <!-- 右侧边栏 -->
    <div class="sidebar-right">
      <!-- 发布按钮 -->
      <div class="publish-section">
        <router-link to="/post/create" class="publish-btn-link">
          <a-button class="publish-btn">
            <template #icon><EditOutlined /></template>
            发布长文
          </a-button>
        </router-link>
        <a-button class="publish-btn" @click="goToPublishImage">
          <template #icon><PictureOutlined /></template>
          发布图文
        </a-button>
      </div>
      
      <!-- 创作等级 -->
      <div class="creator-level">
        <div class="level-header">
          <span>创作等级 LV.{{ userLevel }}</span>
          <a href="#" class="level-link">进入创作中心 ></a>
        </div>
      </div>
      
      <!-- 工具入口 -->
      <div class="tools-section">
        <div class="tools-grid">
          <div class="tool-item" v-for="tool in tools" :key="tool.name" @click="goToTool(tool.path)">
            <div class="tool-icon">{{ tool.icon }}</div>
            <div class="tool-name">{{ tool.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: center;
}

/* 左侧内容区 */
.content-left {
  flex: 0 0 700px;
  min-width: 0;
}

/* 右侧边栏 */
.sidebar-right {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 发布按钮区 */
.publish-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.publish-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 14px;
}

.publish-btn:first-child {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #333;
}

.publish-btn:first-child:hover {
  border-color: #667eea;
  color: #667eea;
}

/* 创作等级 */
.creator-level {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.level-link {
  color: #667eea;
  text-decoration: none;
  font-size: 12px;
}

/* 工具入口 */
.tools-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 16px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tool-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.tool-icon {
  font-size: 24px;
}

.tool-name {
  font-size: 12px;
  color: #666;
}

/* 深色模式适配 */
.home-container[data-theme="dark"] .publish-section,
.home-container[data-theme="dark"] .creator-level,
.home-container[data-theme="dark"] .tools-section {
  background: rgba(30, 30, 50, 0.95);
}

.home-container[data-theme="dark"] .publish-btn {
  background: rgba(50, 50, 70, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e6e6e6;
}

.home-container[data-theme="dark"] .publish-btn:hover {
  border-color: #818cf8;
  color: #818cf8;
  background: rgba(60, 60, 80, 0.9);
}

.home-container[data-theme="dark"] .publish-btn:first-child {
  background: rgba(50, 50, 70, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e6e6e6;
}

.home-container[data-theme="dark"] .publish-btn:first-child:hover {
  border-color: #818cf8;
  color: #818cf8;
  background: rgba(60, 60, 80, 0.9);
}

.home-container[data-theme="dark"] .level-header {
  color: #e6e6e6;
}

.home-container[data-theme="dark"] .level-link {
  color: #818cf8;
}

.home-container[data-theme="dark"] .tool-name {
  color: #aaa;
}

/* 响应式 */
@media (max-width: 992px) {
  .sidebar-right {
    display: none;
  }
  
  .content-left {
    max-width: 100%;
  }
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
  font-size: 2vh;
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

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.post-time {
  margin: 2px 0 0;
  font-size: 12px;
  color: #999;
}

/* 深色模式适配 */
.home-container[data-theme="dark"] .user-name {
  color: #eee;
}

.home-container[data-theme="dark"] .post-time {
  color: #666;
}

.image-content {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    
    .post-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s;
      
      &:hover {
        transform: scale(1.02);
      }
    }
  }

</style>