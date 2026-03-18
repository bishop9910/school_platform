<template>
  <div class="login-container" :data-theme = "theme.isDark ? 'dark' : 'light'">
    <!-- 背景装饰 -->
    <div class="login-bg" >
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

    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      © 2026 bishop9910. All rights reserved.
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, reactive, toRef, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form';
import defIcon from '@/assets/image/default_avatar.avif'
import cache from '@/utils/cache'
import { useRouter } from 'vue-router'
import {isEmpty } from '@/utils/validate'
import { login } from '@/api/login'
import type { ApiResponse } from '@/utils/request';
import { useThemeStore } from '@/stores/theme'
import { setToken, getToken ,removeToken, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/auth'
const theme = useThemeStore();
const router = useRouter();

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
const handleSubmit = (values: any) => {
  loading.value = true
  submitError.value = ''

  // 前置验证
  if (isEmpty(values.username)) {
    submitError.value = '账号不能为空'
    message.error('账号不能为空')
    loading.value = false
    return
  }
  if (isEmpty(values.password)) {
    submitError.value = '密码不能为空'
    message.error('密码不能为空')
    loading.value = false
    return
  }

  // 调用 API 链式处理
  login(values.username, values.password)
    .then((res: ApiResponse) => {
      // 缓存凭证
      if (res.data?.access_token) {
        setToken(AUTH_TOKEN_KEY, res.data.access_token)
        setToken(REFRESH_TOKEN_KEY, res.data.refresh_token)
      }
      if (res.data?.userInfo) {
        cache.local.setJSON('userInfo', res.data.userInfo)
      }

      // 成功反馈
      message.success('登录成功！')
      console.log(res)
      setTimeout(() => {
        router.push('/').catch(() => {
          // 跳转失败兜底
          window.location.href = '/'
        })
      }, 500)
    })
    .catch((error: any) => {
      const errorMsg = '登录失败，请检查账号密码'
      submitError.value = String(errorMsg)
      message.error(String(errorMsg))
    })
    .finally(() => {
      loading.value = false
    })
}

</script>

<style scoped lang="scss">
@use 'sass:map';

// ============ 基础变量（避免未定义错误） ============
$white: #ffffff;
$primary: #667eea;
$primary-hover: #764ba2;

// ============ 亮色主题 ============
$theme-light: (
  bg-from: #667eea,
  bg-to: #764ba2,
  card-bg: #ffffff,
  card-border: rgba(255, 255, 255, 0.2),
  text-primary: #1a1a2e,
  text-secondary: #666666,
  text-placeholder: #999999,
  input-bg: #ffffff,
  input-border: #d9d9d9,
  input-hover: #40a9ff,
  input-focus: #1890ff,
  footer-border: rgba(0, 0, 0, 0.1),
  error-bg: #fff2f0,
  error-border: #ffccc7,
  error-text: #ff4d4f,
  shadow-card: 0 8px 32px rgba(0, 0, 0, 0.12),
  shadow-input: 0 2px 8px rgba(0, 0, 0, 0.08),
  shadow-btn: 0 4px 16px rgba(102, 126, 234, 0.4),
);

// ============ 暗色主题 ============
$theme-dark: (
  bg-from: #1a1a2e,
  bg-to: #16213e,
  card-bg: #1e1e2e,
  card-border: rgba(255, 255, 255, 0.1),
  text-primary: #ffffff,
  text-secondary: #aaaaaa,
  text-placeholder: #666666,
  input-bg: #2a2a3e,
  input-border: #44445a,
  input-hover: #5a6fd6,
  input-focus: #667eea,
  footer-border: rgba(255, 255, 255, 0.1),
  error-bg: rgba(255, 77, 79, 0.15),
  error-border: rgba(255, 77, 79, 0.3),
  error-text: #ff787a,
  shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4),
  shadow-input: 0 2px 8px rgba(0, 0, 0, 0.2),
  shadow-btn: 0 4px 16px rgba(102, 126, 234, 0.3),
);

// ============ 主题 Mixin（核心：用选择器替代 if() 函数） ============
@mixin t($property, $key, $important: false) {
  $value: map.get($theme-light, $key);
  $dark-value: map.get($theme-dark, $key);
  
  @if $important {
    #{$property}: $value !important;
    [data-theme="dark"] & {
      #{$property}: $dark-value !important;
    }
  } @else {
    #{$property}: $value;
    [data-theme="dark"] & {
      #{$property}: $dark-value;
    }
  }
}

// 快捷 mixin
@mixin text-main { @include t(color, text-primary); }
@mixin text-sub { @include t(color, text-secondary); }
@mixin card-style {
  @include t(background, card-bg);
  @include t(border-color, card-border);
  @include t(box-shadow, shadow-card);
}
@mixin input-style {
  @include t(background, input-bg, true);
  @include t(border-color, input-border);
  @include t(color, text-primary);
  &::placeholder { @include t(color, text-placeholder); }
  &:hover { @include t(border-color, input-hover); }
  &:focus {
    @include t(border-color, input-focus);
    box-shadow: 0 0 0 2px rgba(map.get($theme-light, input-focus), 0.1);
    [data-theme="dark"] & {
      box-shadow: 0 0 0 2px rgba(map.get($theme-dark, input-focus), 0.15);
    }
  }
}

// ============ 背景渐变 ============
@function bg-gradient($theme) {
  @return linear-gradient(135deg, 
    map.get($theme, bg-from) 0%, 
    map.get($theme, bg-to) 100%
  );
}

// ============ 容器 ============
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: bg-gradient($theme-light);
  [data-theme="dark"] & {
    background: bg-gradient($theme-dark);
  }
  position: relative;
  overflow: hidden;
  padding: 20px;
  transition: background 0.3s ease;
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
  background: rgba(255, 255, 255, 0.08);
  animation: float 20s infinite ease-in-out;
  [data-theme="dark"] & {
    background: rgba(255, 255, 255, 0.03);
  }
}

.circle-1 { width: 500px; height: 500px; top: -150px; right: -150px; animation-delay: 0s; }
.circle-2 { width: 350px; height: 350px; bottom: -100px; left: -100px; animation-delay: -7s; }
.circle-3 { width: 250px; height: 250px; top: 40%; left: 20%; animation-delay: -14s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

// ============ 登录卡片 ============
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  padding: 48px 40px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid map.get($theme-light, card-border);
  
  @include card-style;
  [data-theme="dark"] & {
    border-color: map.get($theme-dark, card-border);
  }
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

// ============ 头部 ============
.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo-wrapper {
    width: 72px;
    height: 72px;
    margin: 0 auto 20px;
    background: rgba(map.get($theme-light, input-focus), 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      background: rgba(map.get($theme-light, input-focus), 0.15);
    }
    [data-theme="dark"] & {
      background: rgba(map.get($theme-dark, input-focus), 0.2);
      &:hover { background: rgba(map.get($theme-dark, input-focus), 0.25); }
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
    @include text-main;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
    transition: color 0.3s ease;
  }

  .subtitle {
    font-size: 14px;
    @include text-sub;
    margin: 0;
    transition: color 0.3s ease;
  }
}

// ============ 表单（深度适配 AntD） ============
.login-form {
  margin-bottom: 24px;

  :deep(.ant-form-item) {
    margin-bottom: 24px;

    .ant-form-item-label {
      padding-bottom: 8px;
      label {
        font-size: 14px;
        font-weight: 500;
        @include text-main;
        transition: color 0.3s ease;
      }
    }

    .ant-input-affix-wrapper {
      padding: 12px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      @include input-style;

      .input-icon {
        font-size: 16px;
        margin-right: 8px;
        @include text-sub;
        transition: color 0.3s ease;
      }

      .anticon {
        @include t(color, text-secondary);
        transition: color 0.3s ease;
      }
    }

    .ant-input-affix-wrapper-focused {
      .input-icon, .anticon {
        @include t(color, input-focus);
      }
    }
  }
}

// ============ 错误提示 ============
.form-error-global {
  margin-bottom: 24px;
  transition: all 0.3s ease;

  :deep(.ant-alert) {
    border-radius: 8px;
    @include t(background, error-bg);
    @include t(border-color, error-border);
    
    .ant-alert-message,
    .ant-alert-icon {
      @include t(color, error-text);
    }
  }
}

// ============ 登录按钮 ============
.login-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, $primary 0%, $primary-hover 100%);
  transition: all 0.3s ease;
  @include t(box-shadow, shadow-btn);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.05);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(0.95);
  }

  &:disabled {
    background: map.get($theme-light, input-border);
    [data-theme="dark"] & {
      background: map.get($theme-dark, input-border);
    }
    box-shadow: none;
    cursor: not-allowed;
  }
}

// ============ 底部链接 ============
.login-footer {
  text-align: center;
  padding-top: 16px;
  @include t(border-top-color, footer-border);
  transition: border-color 0.3s ease;

  .footer-text {
    font-size: 14px;
    @include text-sub;
    transition: color 0.3s ease;
  }

  .footer-link {
    font-size: 14px;
    @include t(color, input-focus);
    margin-left: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      @include t(color, input-hover);
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
  
  [data-theme="light"] & {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

// ============ 响应式 ============
@media (max-width: 480px) {
  .login-card {
    padding: 36px 28px;
    margin: 10px;
  }
  .login-header .title { font-size: 22px; }
  .logo-wrapper {
    width: 60px; height: 60px;
    .logo { width: 36px; height: 36px; }
  }
  .login-btn { height: 44px; font-size: 15px; }
}

// ============ 过渡优化 ============
*, *::before, *::after {
  transition-property: background, border-color, color, box-shadow, transform;
  transition-duration: 0.25s;
  transition-timing-function: ease;
}
</style>