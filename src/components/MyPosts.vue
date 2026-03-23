<template>
  <div class="myposts-container" :data-theme="isDark ? 'dark' : 'light'">
    <div class="myposts-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <div class="myposts-card">
      <div class="card-header">
        <a-button class="back-btn" @click="goBack">
          <LeftOutlined /> 返回
        </a-button>
        <h2 class="title">我的帖子</h2>
        <a-button type="primary" class="create-btn" @click="goToCreate">
          <PlusOutlined /> 发布帖子
        </a-button>
      </div>

      <div class="posts-list" v-if="posts.length > 0">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-item"
        >
          <div class="post-content" @click="goToDetail(post.id)">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <span class="post-time">{{ formatTime(post.create_time) }}</span>
            </div>
            <p class="post-text">{{ post.content.slice(0, 100) }}{{ post.content.length > 100 ? '...' : '' }}</p>
            <div v-if="post.images && post.images.length" class="post-images">
              <a-image
                v-for="(img, idx) in post.images.slice(0, 3)"
                :key="idx"
                :src="getPostImageUrl(img.image_url)"
                :preview="false"
                class="post-image"
              />
              <span v-if="post.images.length > 3" class="more-images">
                +{{ post.images.length - 3 }}
              </span>
            </div>
            <div class="post-stats">
              <span class="stat-item">
                <HeartOutlined /> {{ post.like || 0 }}
              </span>
              <span class="stat-item">
                <MessageOutlined /> {{ post.comment_count || 0 }}
              </span>
            </div>
          </div>
          <div class="post-actions">
            <a-button size="small" @click="goToDetail(post.id)">
              <EyeOutlined /> 查看
            </a-button>
            <a-button size="small" type="primary" @click="editPost(post.id)">
              <EditOutlined /> 编辑
            </a-button>
            <a-popconfirm
              title="确定删除这篇帖子吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(post.id)"
            >
              <a-button size="small" danger>
                <DeleteOutlined /> 删除
              </a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>

      <a-empty v-else-if="!loading" description="还没有发布过帖子">
        <a-button type="primary" @click="goToCreate">发布第一篇帖子</a-button>
      </a-empty>

      <div v-if="loading" class="loading-status">
        <a-spin /> 加载中...
      </div>

      <div v-if="finished && posts.length > 0" class="loading-status finished">
        没有更多数据了
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';
import { useLogin } from '@/stores/user';
import { getMyPosts, deletePost, getPostImageUrl } from '@/api/post';
import { message } from 'ant-design-vue';
import {
  LeftOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const themeStore = useThemeStore();
const loginStore = useLogin();
const isDark = computed(() => themeStore.isDark);

const posts = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const pageSize = 10;

onMounted(() => {
  loadPosts();
  document.body.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.body.removeEventListener('scroll', handleScroll);
});

let timeId: any = null;
const handleScroll = () => {
  if (timeId) {
    clearTimeout(timeId);
  }
  timeId = setTimeout(() => {
    if (loading.value || finished.value) return;
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadPosts();
    }
  }, 500);
};

const loadPosts = async () => {
  if (loading.value || finished.value) return;
  loading.value = true;

  try {
    // 后端接口需要 user_id，从 store 获取当前用户ID
    const userId = loginStore.userInfo.id;
    if (!userId) {
      message.error('请先登录');
      return;
    }
    const res = await getMyPosts(userId, page.value, pageSize);
    const newPosts = res.data || [];

    if (newPosts.length < pageSize) {
      finished.value = true;
    }

    posts.value = [...posts.value, ...newPosts];
    page.value++;
  } catch (error) {
    message.error('加载帖子失败');
  } finally {
    loading.value = false;
  }
};

const formatTime = (time: string) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

const goBack = () => {
  router.back();
};

const goToCreate = () => {
  router.push('/post/create');
};

const goToDetail = (id: number) => {
  router.push(`/post/${id}`);
};

const editPost = (id: number) => {
  router.push(`/post/edit/${id}`);
};

const handleDelete = async (id: number) => {
  try {
    await deletePost(id);
    message.success('删除成功');
    posts.value = posts.value.filter(p => p.id !== id);
  } catch (error) {
    message.error('删除失败');
  }
};
</script>

<style scoped>
.myposts-container {
  min-height: 93.17vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  padding: 20px;
}

.myposts-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.myposts-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  width: 100%;
  max-width: 800px;
  z-index: 1;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.back-btn {
  margin-right: auto;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.create-btn {
  margin-left: auto;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.post-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-content {
  cursor: pointer;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.post-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-text {
  margin: 0 0 12px;
  color: #666;
  line-height: 1.6;
}

.post-images {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.post-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #999;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.loading-status {
  text-align: center;
  padding: 20px;
  color: #666;
}

.finished {
  color: #999;
}

.myposts-container[data-theme="dark"] .myposts-card {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.myposts-container[data-theme="dark"] .title {
  color: #e6e6e6;
}

.myposts-container[data-theme="dark"] .post-item {
  background: rgba(50, 50, 70, 0.8);
}

.myposts-container[data-theme="dark"] .post-title {
  color: #e6e6e6;
}

.myposts-container[data-theme="dark"] .post-text {
  color: #aaa;
}

.myposts-container[data-theme="dark"] .post-actions {
  border-top-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .myposts-card {
    padding: 16px;
    margin: 0 10px;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .title {
    font-size: 20px;
    order: -1;
    width: 100%;
    margin-bottom: 12px;
  }

  .post-image {
    width: 60px;
    height: 60px;
  }

  .more-images {
    width: 60px;
    height: 60px;
  }
}
</style>
