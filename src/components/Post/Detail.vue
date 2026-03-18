<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'
import { getToken } from '@/utils/auth'
import { 
  getPostList, 
  deletePost, 
  getPostImageUrl,
  getAvatarUrl, 
  getPost
} from '@/api/post'
import type { CommunityPost } from '../../type'
import Comments from './Comments.vue'
import { 
  ShareAltOutlined, 
  LikeOutlined, 
  MessageOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const comments = ref<{ refresh: () => Promise<void> } | null>(null)
const post = ref<CommunityPost | null>(null)
const loading = ref(true)
const currentUserId = ref<number | null>(null)

// 从路由获取帖子ID
const postId = computed(() => Number(route.params.id))

// 加载帖子详情
const fetchPostDetail = async () => {
  if (!postId.value) {
    message.error('帖子ID无效')
    return
  }
  
  loading.value = true
  try {
    const res = await getPost(postId.value)
    if (res.success && res.data) {
      post.value = res.data
    }
  } catch (err: any) {
    message.error(err.message || '加载失败')
  } finally {
    loading.value = false
  }
}

// 点赞（前端模拟，实际需调用API）
const handleLike = () => {
  if (!getToken('Auth-Token')) {
    message.warning('请先登录')
    return
  }
  if (post.value) {
    post.value.like = (post.value.like || 0) + 1
    message.success('点赞成功')
  }
}

// 分享（复制链接）
const handleShare = async () => {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
    message.success('链接已复制到剪贴板')
  } catch {
    // 降级方案
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    message.success('链接已复制')
  }
}

// 删除帖子
const handleDeletePost = () => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个帖子吗？此操作不可恢复。',
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        const res = await deletePost(postId.value)
        if (res.success) {
          message.success('删除成功')
          router.push('/')
        }
      } catch (err: any) {
        message.error(err.message || '删除失败')
      }
    }
  })
}

// 评论添加后的回调
const handleCommentAdded = () => {
  // 可在此更新帖子评论数等
  console.log('新评论已添加')
}

// 判断是否为帖子作者
const isPostAuthor = computed(() => {
  // TODO: 从user store获取当前用户ID进行比较
  return false
})

onMounted(() => {
  fetchPostDetail()
})
</script>

<template>
  <div class="post-container" :data-theme="themeStore.isDark ? 'dark' : 'light'">
    <!-- 背景装饰 -->
    <div class="post-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
    
    <!-- 主内容 -->
    <div class="main-content">
      <!-- 加载状态 -->
      <a-skeleton :active="true" v-if="loading" class="post-skeleton" />
      
      <template v-else-if="post">
        <!-- 帖子头部 -->
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-author">
            <a-avatar 
              :src="post.author?.avatar ? getAvatarUrl(post.author.avatar) : undefined"
              class="author-avatar"
            >
            <template #icon>
              <UserOutlined/>
            </template>
            </a-avatar>
            <span class="author-name">{{ post.author?.nickname || post.author?.username || `用户${post.user_id}` }}</span>
            <span class="post-time">{{ new Date(post.create_time).toLocaleString('zh-CN') }}</span>
          </div>
        </div>
        
        <!-- 帖子内容 -->
        <div class="post-body">
          <div class="text-content" v-if="post.content" v-html="post.content"></div>
          
          <!-- 图片展示 -->
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
        </div>
        
        <!-- 帖子底部操作 -->
        <div class="post-footer">
          <div class="post-actions">
            <a-button @click="handleLike">
                <template #icon>
                  <LikeOutlined />
                </template>
              点赞 {{ post.like }}
            </a-button>
            <a-button @click="handleShare">
              <template #icon>
                <ShareAltOutlined />
              </template>
              分享
            </a-button>
            <!-- 仅作者可见删除按钮 -->
            <a-button 
              v-if="isPostAuthor" 
              @click="handleDeletePost" 
              :icon="DeleteOutlined"
              danger
              class="delete-btn"
            >
              删除
            </a-button>
          </div>
          
          <!-- 评论区域 -->
          <Comments 
            ref="comments"
            :post-id="postId" 
            @comment-added="handleCommentAdded"
          />
        </div>
      </template>
      
      <!-- 空状态 -->
      <a-empty v-else description="帖子不存在或已删除" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-container {
  --bg-1: #667eea;
  --bg-2: #764ba2;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --card-bg: rgba(255, 255, 255, 0.95);
  --btn-bg: #ffffff;
  --btn-border: #d9d9d9;
  --btn-text: var(--text-primary);
  --btn-hover-bg: #fafafa;
  --btn-hover-border: #40a9ff;
  --btn-hover-text: #40a9ff;
  --btn-active-bg: #f0f0f0;
  --btn-danger-border: #ff4d4f;
  --btn-danger-text: #ff4d4f;
  --btn-danger-hover-bg: #fff1f0;
  
  min-height: 93.17vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
  
  &[data-theme="dark"] {
    --bg-1: #1a1a2e;
    --bg-2: #263c77;
    --text-primary: #f0f0f0;
    --text-secondary: #aaa;
    --card-bg: rgba(30, 30, 46, 0.95);

    --btn-bg: #2a2a4a;
    --btn-border: #444;
    --btn-text: #f0f0f0;
    --btn-hover-bg: #3a3a5a;
    --btn-hover-border: #177ddc;
    --btn-hover-text: #69b1ff;
    --btn-active-bg: #4a4a6a;
    --btn-danger-border: #ff7875;
    --btn-danger-text: #ff7875;
    --btn-danger-hover-bg: #3a2020;
  }
}

.post-bg {
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

.main-content {
  width: 100%;
  max-width: 800px;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 1;
  color: var(--text-primary);
}

.post-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
  margin-bottom: 20px;
  
  .post-title {
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .post-author {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .author-avatar {
      width: 36px;
      height: 36px;
    }
    
    .author-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .post-time {
      font-size: 12px;
      color: var(--text-secondary);
      margin-left: auto;
    }
  }
}

.post-body {
  .text-content {
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-primary);
    margin-bottom: 20px;
    word-break: break-word;
    
    :deep(p) {
      margin: 8px 0;
    }
  }
  
  .image-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
}

.post-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  .post-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    
    .ant-btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .delete-btn {
      margin-left: auto;
    }
  }
}

.post-skeleton {
  padding: 20px 0;
}

// 暗主题适配
:deep(.ant-skeleton) {
  .post-container[data-theme="dark"] & {
    .ant-skeleton-title,
    .ant-skeleton-paragraph > li {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
    margin: 10px;
  }
  
  .post-title {
    font-size: 20px !important;
  }
  
  .image-content {
    grid-template-columns: 1fr;
  }
  
  .post-actions {
    flex-wrap: wrap;
    
    .delete-btn {
      margin-left: 0;
      width: 100%;
      margin-top: 8px;
    }
  }
}

.post-actions {
  .ant-btn {
    // 基础样式
    background: var(--btn-bg) !important;
    border-color: var(--btn-border) !important;
    color: var(--btn-text) !important;
    
    // 图标颜色
    .anticon {
      color: var(--btn-text) !important;
      transition: color 0.3s;
    }
    
    // Hover 状态
    &:hover {
      background: var(--btn-hover-bg) !important;
      border-color: var(--btn-hover-border) !important;
      color: var(--btn-hover-text) !important;
      
      .anticon {
        color: var(--btn-hover-text) !important;
      }
    }
    
    // Active 状态
    &:active {
      background: var(--btn-active-bg) !important;
    }
    
    // Danger 按钮（删除）
    &.ant-btn-dangerous {
      border-color: var(--btn-danger-border) !important;
      color: var(--btn-danger-text) !important;
      
      .anticon {
        color: var(--btn-danger-text) !important;
      }
      
      &:hover {
        background: var(--btn-danger-hover-bg) !important;
        border-color: #ff4d4f !important;
        color: #ff4d4f !important;
        
        .anticon {
          color: #ff4d4f !important;
        }
      }
    }
    
    // 禁用状态
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        background: var(--btn-bg) !important;
        border-color: var(--btn-border) !important;
        color: var(--btn-text) !important;
      }
    }
  }
}
</style>