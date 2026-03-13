<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-wrapper">
          <img :src="defIcon" alt="Logo" class="logo" />
        </div>
        <h2 class="title">欢迎回来</h2>
        <p class="subtitle">登录您的账户继续</p>
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
        <!-- 账号输入 -->
        <a-form-item name="username" label="账号">
          <a-input
            v-model:value="form.username"
            placeholder="请输入邮箱或用户名"
            size="large"
            :disabled="loading"
            autocomplete="username"
          >
            <template #prefix>
              <span class="input-icon"><UserOutlined /></span>
            </template>
          </a-input>
        </a-form-item>

        <!-- 密码输入 -->
        <a-form-item name="password" label="密码">
          <a-input-password
            v-model:value="form.password"
            placeholder="请输入密码"
            size="large"
            :disabled="loading"
            autocomplete="current-password"
            @keyup.enter="handleSubmit"
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

        <!-- 登录按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            class="login-btn"
          >
            {{ loading ? '登录中...' : '立即登录' }}
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 底部链接 -->
      <div class="login-footer">
        <span class="footer-text">还没有账号？</span>
        <router-link to="/register" class="footer-link">立即注册</router-link>
      </div>

      <!-- 忘记密码 -->
      <div class="forgot-wrapper">
        <a class="forgot-link" @click="handleForgot">忘记密码？</a>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      © 2024 Your Company. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form';
import defIcon from '@/assets/image/default_avatar.avif'
// import { useLogin } from '@/store/login'
// import { useRouter } from 'vue-router'

// ============ 表单数据 ============
const form = reactive({
  username: '',
  password: ''
})

// ============ 表单引用 ============
const formRef = ref<FormInstance>()

// ============ 状态控制 ============
const loading = ref(false)
const submitError = ref('')

// ============ 表单验证规则 ============
const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入邮箱或用户名', trigger: 'blur' },
    { min: 2, message: '账号长度至少 2 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ]
}

// ============ 事件处理 ============
const handleSubmit = async () => {
  // TODO: 你的登录逻辑
  // 1. 表单验证（a-form 已自动处理）
  // 2. 密码加密（如需）
  // 3. 调用 API
  // 4. 处理响应
}

const handleForgot = () => {
  // TODO: 忘记密码逻辑
  message.info('忘记密码功能开发中...')
}

</script>

<style scoped lang="scss">
// ============ 变量定义 ============
$primary-color: #1890ff;
$primary-hover: #40a9ff;
$primary-light: #e6f7ff;
$text-primary: #000000e0;
$text-secondary: #000000a6;
$text-light: #fffee6;
$text-disabled: #00000040;
$border-color: #d9d9d9;
$bg-color: #f5f5f5;
$white: #ffffff;
$danger: #ff4d4f;
$success: #52c41a;

$border-radius: 8px;
$border-radius-lg: 12px;
$shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

// ============ 容器布局 ============
.login-container {
  min-height: 93.17vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

// ============ 背景装饰 ============
.login-bg {
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

// ============ 登录卡片 ============
.login-card {
  width: 100%;
  max-width: 400px;
  background: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  padding: 48px 40px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============ 头部样式 ============
.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-wrapper {
    width: 72px;
    height: 72px;
    margin: 0 auto 20px;
    background: $primary-light;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition;

    &:hover {
      transform: scale(1.05);
      background: rgba($primary-color, 0.15);
    }

    .logo {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
  }

  .title {
    font-size: 26px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

// ============ 表单样式 ============
.login-form {
  margin-bottom: 24px;

  :deep(.ant-form-item) {
    margin-bottom: 24px;

    .ant-form-item-label {
      padding-bottom: 8px;

      label {
        font-size: 14px;
        font-weight: 500;
        color: $text-light;
      }
    }

    .ant-input-affix-wrapper {
      padding: 12px 16px;
      border-radius: $border-radius;
      transition: $transition;

      &:hover {
        border-color: $primary-hover;
      }

      &.ant-input-affix-wrapper-focused {
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
      }

      .input-icon {
        font-size: 16px;
        margin-right: 8px;
      }

      input {
        font-size: 14px;
        color: $text-primary;
        background-color: #2a2a2a;

        &::placeholder {
          color: #444;
        }
      }
    }

    .ant-input-password-icon {
      color: $text-secondary;
      transition: $transition;

      &:hover {
        color: $primary-color;
      }
    }
  }
}

// ============ 错误提示 ============
.form-error-global {
  margin-bottom: 24px;

  :deep(.ant-alert) {
    border-radius: $border-radius;
    animation: shake 0.5s ease-in-out;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

// ============ 登录按钮 ============
.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: $border-radius;
  background: linear-gradient(135deg, $primary-color, $primary-hover);
  border: none;
  transition: $transition;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($primary-color, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: $border-color;
    border-color: $border-color;
  }
}

// ============ 底部链接 ============
.login-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid $border-color;

  .footer-text {
    font-size: 14px;
    color: $text-secondary;
  }

  .footer-link {
    font-size: 14px;
    color: $primary-color;
    margin-left: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: $transition;

    &:hover {
      color: $primary-hover;
      text-decoration: underline;
    }
  }
}

// ============ 忘记密码 ============
.forgot-wrapper {
  text-align: center;
  margin-top: 16px;

  .forgot-link {
    font-size: 13px;
    color: $text-secondary;
    text-decoration: none;
    transition: $transition;

    &:hover {
      color: $primary-color;
      text-decoration: underline;
    }
  }
}

// ============ 版权信息 ============
.copyright {
  position: absolute;
  bottom: 24px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  letter-spacing: 0.5px;
}

// ============ 响应式适配 ============
@media (max-width: 480px) {
  .login-card {
    padding: 36px 28px;
    margin: 10px;
  }

  .login-header .title {
    font-size: 22px;
  }

  .logo-wrapper {
    width: 60px;
    height: 60px;

    .logo {
      width: 36px;
      height: 36px;
    }
  }

  .login-btn {
    height: 44px;
    font-size: 15px;
  }
}

// ============ 暗色模式支持 ============
@media (prefers-color-scheme: dark) {
  .login-card {
    background: #1f1f1f;
  }

  .title {
    color: #fff !important;
  }

  .subtitle,
  .footer-text,
  .forgot-link {
    color: #aaa !important;
  }

  :deep(.ant-input-affix-wrapper) {
    background: #2a2a2a;
    border-color: #444;

    input {
      color: #fff;

      &::placeholder {
        color: #888;
      }
    }

    &:hover {
      border-color: $primary-hover;
    }

    &.ant-input-affix-wrapper-focused {
      border-color: $primary-color;
      background: #2a2a2a;
    }
  }

  .login-footer {
    border-top-color: #444;
  }
}
</style>