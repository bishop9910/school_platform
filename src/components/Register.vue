<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 注册卡片 -->
    <div class="login-card">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-wrapper">
          <img :src="defIcon" alt="Logo" class="logo" />
        </div>
        <h2 class="title">创建新账户</h2>
        <p class="subtitle">填写以下信息完成注册</p>
      </div>

      <!-- 表单 -->
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
        class="login-form"
      >
        <!-- 用户名输入 -->
        <a-form-item name="username" label="用户名">
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            size="large"
            :disabled="loading"
            autocomplete="username"
          >
            <template #prefix>
              <span class="input-icon"><UserOutlined /></span>
            </template>
          </a-input>
        </a-form-item>

        <!-- 邮箱输入 -->
        <a-form-item name="email" label="邮箱">
          <a-input
            v-model:value="form.email"
            placeholder="请输入邮箱"
            size="large"
            :disabled="loading"
            autocomplete="email"
          >
            <template #prefix>
              <span class="input-icon"><MailOutlined /></span>
            </template>
          </a-input>
        </a-form-item>

        <!-- 密码输入 -->
        <a-form-item name="password" label="密码">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码（至少6位）"
            size="large"
            :disabled="loading"
            autocomplete="new-password"
          >
            <template #prefix>
              <span class="input-icon"><LockOutlined /></span>
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 确认密码输入 -->
        <a-form-item name="confirmPassword" label="确认密码">
          <a-input-password
            v-model:value="form.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
            :disabled="loading"
            autocomplete="new-password"
          >
            <template #prefix>
              <span class="input-icon"><LockOutlined /></span>
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 错误提示 -->
        <div v-if="submitError" class="form-error-global">
          <a-alert type="error" show-icon :message="submitError" />
        </div>

        <!-- 注册按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="login-btn"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 底部链接 -->
      <div class="login-footer">
        <span class="footer-text">已有账号？</span>
        <a class="footer-link" @click="handleLogin">立即登录</a>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      © 2024 Your Company. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue';
import defIcon from '@/assets/image/default_avatar.avif';
import { register } from '@/api/login';
import type { UserRegisterInput } from '@/type';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const submitError = ref('');

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, value: any) => {
        if (value !== form.password) {
          return Promise.reject(new Error('两次输入的密码不一致'));
        }
        return Promise.resolve();
      },
      trigger: 'blur'
    }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    submitError.value = '';
    
    const registerData: UserRegisterInput = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password
    };
    
    await register(registerData);
    message.success('注册成功，即将跳转到登录页面');
    
    // 注册成功后跳转到登录页面
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error: any) {
    if (error.message) {
      submitError.value = error.message;
    } else {
      submitError.value = '注册失败，请稍后重试';
    }
  } finally {
    loading.value = false;
  }
};

const handleLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 复用登录页面的样式 */
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.login-bg {
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

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  z-index: 1;
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-wrapper {
  margin-bottom: 16px;
}

.logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
}

.login-form {
  margin-bottom: 24px;
}

.input-icon {
  color: #999;
  margin-right: 8px;
}

.form-error-global {
  margin-bottom: 16px;
}

.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.forgot-wrapper {
  text-align: center;
  margin-top: 16px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.copyright {
  margin-top: 24px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    padding: 24px;
    margin: 0 20px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .bg-circle {
    transform: scale(0.8);
  }
}
</style>