<template>
  <div class="profile-container" :data-theme="isDark ? 'dark' : 'light'">
    <!-- 背景装饰 -->
    <div class="profile-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 个人中心卡片 -->
    <div class="profile-card">
      <!-- 头部 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <img :src="userInfo.avatar || defAvatar" alt="用户头像" class="avatar" />
        </div>
        <h2 class="title">{{ userInfo.nickName || userInfo.username }}</h2>
        <p class="subtitle">{{ userInfo.signature || '这个人很懒，还没有设置签名' }}</p>
      </div>

      <!-- 信息区域 -->
      <div class="profile-info">
        <div class="info-section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-item">
            <span class="info-label">用户名：</span>
            <span class="info-value">{{ userInfo.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ userInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">性别：</span>
            <span class="info-value">{{ getGenderText(userInfo.gender) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">权限：</span>
            <span class="info-value">{{ userInfo.role === 1 ? '管理员' : '普通用户' }}</span>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">账号信息</h3>
          <div class="info-item">
            <span class="info-label">ID：</span>
            <span class="info-value">{{ userInfo.id }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">积分：</span>
            <span class="info-value">{{ userInfo.credit_score }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">金币：</span>
            <span class="info-value">{{ userInfo.credit_coin }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="profile-actions">
        <a-button type="primary" class="action-btn">编辑资料</a-button>
        <a-button class="action-btn">我的帖子</a-button>
        <a-button class="action-btn">我的收藏</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useLogin } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import defAvatar from '@/assets/image/default_avatar.avif';

const { userInfo, GetInfo } = useLogin();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

onMounted(() => {
  // 加载用户信息
  GetInfo().catch(error => {
    console.error('获取用户信息失败:', error);
  });
});

// 转换性别显示文本
const getGenderText = (gender: string | number): string => {
  // 处理数据库中的性别值：0-未知，1-男，2-女
  if (typeof gender === 'number') {
    switch (gender) {
      case 0:
        return '未知';
      case 1:
        return '男';
      case 2:
        return '女';
      default:
        return '未知';
    }
  }
  // 处理字符串类型的性别值
  switch (gender) {
    case 'male':
      return '男';
    case 'female':
      return '女';
    case 'unknown':
      return '未知';
    default:
      return '未知';
  }
};
</script>

<style scoped>
/* 基础样式 */
.profile-container {
  min-height: 93.17vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  padding: 20px;
}

/* 背景装饰 */
.profile-bg {
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

/* 个人中心卡片 */
.profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 600px;
  z-index: 1;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

/* 头部 */
.profile-header {
  text-align: center;
  margin-bottom: 32px;
}

.avatar-wrapper {
  margin-bottom: 16px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.8);
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

/* 信息区域 */
.profile-info {
  margin-bottom: 32px;
}

.info-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: #333;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  margin-right: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
}

.info-label {
  width: 80px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

/* 操作按钮 */
.profile-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  flex: 1;
  height: 40px;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* 深色主题 */
.profile-container[data-theme="dark"] .profile-card {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-container[data-theme="dark"] .title,
.profile-container[data-theme="dark"] .info-value {
  color: #e6e6e6;
}

.profile-container[data-theme="dark"] .subtitle,
.profile-container[data-theme="dark"] .info-label {
  color: #a0a0a0;
}

.profile-container[data-theme="dark"] .section-title {
  color: #e6e6e6;
}

.profile-container[data-theme="dark"] .info-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-card {
    padding: 24px;
    margin: 0 20px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .bg-circle {
    transform: scale(0.8);
  }
}
</style>