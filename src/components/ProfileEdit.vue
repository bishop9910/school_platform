<template>
  <div class="edit-container" :data-theme="isDark ? 'dark' : 'light'">
    <div class="edit-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <div class="edit-card">
      <div class="card-header">
        <a-button class="back-btn" @click="goBack">
          <LeftOutlined /> 返回
        </a-button>
        <h2 class="title">编辑资料</h2>
      </div>

      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
        class="edit-form"
      >
        <a-form-item label="头像" name="avatar">
          <div class="avatar-upload">
            <a-avatar :size="100" :src="previewAvatar || formState.avatar || defAvatar">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <a-upload
              :show-upload-list="false"
              :before-upload="handleAvatarChange"
              accept="image/*"
            >
              <a-button class="upload-btn">
                <UploadOutlined /> 更换头像
              </a-button>
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="昵称" name="nickName">
          <a-input
            v-model:value="formState.nickName"
            placeholder="请输入昵称"
            :maxlength="20"
            show-count
          />
        </a-form-item>

        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="formState.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
            <a-radio value="unknown">未知</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="formState.email"
            placeholder="请输入邮箱"
          />
        </a-form-item>

        <a-form-item label="个性签名" name="signature">
          <a-textarea
            v-model:value="formState.signature"
            placeholder="请输入个性签名"
            :maxlength="100"
            show-count
            :rows="3"
          />
        </a-form-item>

        <a-form-item class="submit-btn-wrap">
          <a-button type="primary" html-type="submit" :loading="loading" class="submit-btn">
            保存修改
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useLogin } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { updateUserInfo } from '@/api/login';
import { uploadAvatar } from '@/api/upload';
import defAvatar from '@/assets/image/default_avatar.avif';
import { message } from 'ant-design-vue';
import { LeftOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const { userInfo, GetInfo } = useLogin();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);

const loading = ref(false);
const previewAvatar = ref('');

const formState = reactive({
  nickName: '',
  avatar: '',
  gender: 'unknown',
  email: '',
  signature: ''
});

const rules = {
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

onMounted(async () => {
  try {
    await GetInfo();
    formState.nickName = userInfo.nickName || '';
    formState.avatar = userInfo.avatar || '';
    formState.gender = userInfo.gender || 'unknown';
    formState.email = userInfo.email || '';
    formState.signature = userInfo.signature || '';
  } catch (error) {
    message.error('获取用户信息失败');
  }
});

const handleAvatarChange = async (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('请上传图片文件');
    return false;
  }
  
  // 先显示本地预览
  const reader = new FileReader();
  reader.onload = (e) => {
    previewAvatar.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  // 上传到后端
  try {
    const res = await uploadAvatar(file);
    if (res.success && res.data) {
      // 上传成功，保存后端返回的文件路径
      formState.avatar = res.data.url;
      message.success('头像上传成功');
    }
  } catch (error) {
    message.error('头像上传失败');
    previewAvatar.value = '';
  }
  
  return false;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await updateUserInfo({
      nickName: formState.nickName,
      avatar: formState.avatar,
      gender: formState.gender,
      email: formState.email,
      signature: formState.signature
    });
    message.success('保存成功');
    await GetInfo();
    router.push('/profile');
  } catch (error: any) {
    message.error(error?.message || '保存失败');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.edit-container {
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

.edit-bg {
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

.edit-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 500px;
  z-index: 1;
  transition: all 0.3s ease;
}

.edit-card:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-btn {
  margin-right: 16px;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.edit-form {
  margin-top: 16px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  margin-top: 8px;
}

.submit-btn-wrap {
  margin-top: 24px;
  margin-bottom: 0;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

.edit-container[data-theme="dark"] .edit-card {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-container[data-theme="dark"] .title {
  color: #e6e6e6;
}

@media (max-width: 768px) {
  .edit-card {
    padding: 24px;
    margin: 0 20px;
  }
}
</style>
