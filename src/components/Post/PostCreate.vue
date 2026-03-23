<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'
import { getToken } from '@/utils/auth'
import { createPost } from '@/api/post'
import { 
  EditOutlined, 
  PictureOutlined,
  UploadOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'

const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

const title = ref('')
const content = ref('')
const fileList = ref<any[]>([])
const loading = ref(false)

const publishType = ref(route.query.type as string || 'text')

const handleSubmit = async () => {
  if (!title.value.trim()) {
    message.warning('请输入标题')
    return
  }
  
  if (!content.value.trim()) {
    message.warning('请输入内容')
    return
  }
  
  loading.value = true
  try {
    const formData = {'content': content.value, 'title': title.value};
    
    // fileList.value.forEach((file: any) => {
    //   if (file.originFileObj) {
    //     formData.append('images', file.originFileObj)
    //   }
    // })
    
    const res = await createPost(formData)
    console.log('API Response:', res)
    // 后端返回 {success: true, message: '...'}，但类型定义使用 code
    // 使用类型断言访问 success 属性
    if ((res as any).success === true || res.code === 200) {
      console.log(res)
      message.success('发布成功')
      router.push('/')
    }
  } catch (err: any) {
    message.error(err.message || '发布失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  if (title.value || content.value || fileList.value.length > 0) {
    const confirm = window.confirm('确定要放弃编辑吗？')
    if (!confirm) return
  }
  router.back()
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleChange = (info: any) => {
  fileList.value = info.fileList
}

</script>

<template>
  <div class="create-container" :data-theme="themeStore.isDark ? 'dark' : 'light'">
    <div class="create-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
    
    <div class="main-content">
      <div class="create-header">
        <h1 class="create-title">
          <EditOutlined v-if="publishType === 'text'" />
          <PictureOutlined v-else />
          {{ publishType === 'text' ? '发布帖子' : '发布图文' }}
        </h1>
        <a-button @click="handleCancel" class="cancel-btn">
          <template #icon><CloseOutlined /></template>
          取消
        </a-button>
      </div>
      
      <div class="create-form">
        <div class="form-item">
          <a-input
            v-model:value="title"
            placeholder="请输入标题"
            class="title-input"
            :maxLength="100"
            show-count
          />
        </div>
        
        <div class="form-item">
          <a-textarea
            v-model:value="content"
            placeholder="请输入内容..."
            class="content-input"
            :rows="10"
            :maxLength="2000"
            show-count
          />
        </div>
        
        <div class="form-item">
          <div class="upload-section">
            <a-upload
              v-model:file-list="fileList"
              list-type="picture-card"
              :before-upload="beforeUpload"
              @change="handleChange"
              :custom-request="() => {}"
              multiple
              accept="image/*"
            >
              <div v-if="fileList.length < 9">
                <UploadOutlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </a-upload>
          </div>
          <p class="upload-tip">最多上传9张图片，每张不超过5MB</p>
        </div>
        
        <div class="form-actions">
          <a-button 
            type="primary" 
            size="large" 
            @click="handleSubmit"
            :loading="loading"
            class="submit-btn"
          >
            发布
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-container {
  --bg-1: #667eea;
  --bg-2: #764ba2;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --card-bg: rgba(255, 255, 255, 0.95);
  --input-bg: #fff;
  --input-border: #d9d9d9;
  --btn-bg: #ffffff;
  --btn-border: #d9d9d9;
  --btn-text: var(--text-primary);
  --btn-hover-bg: #fafafa;
  --btn-hover-border: #40a9ff;
  --btn-hover-text: #40a9ff;
  
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
    --input-bg: #2a2a4a;
    --input-border: #444;
    --btn-bg: #2a2a4a;
    --btn-border: #444;
    --btn-text: #f0f0f0;
    --btn-hover-bg: #3a3a5a;
    --btn-hover-border: #177ddc;
    --btn-hover-text: #69b1ff;
  }
}

.create-bg {
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

.create-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  .create-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
    
    .anticon {
      color: #667eea;
    }
  }
  
  .cancel-btn {
    background: var(--btn-bg);
    border-color: var(--btn-border);
    color: var(--btn-text);
    border-radius: 8px;
    
    &:hover {
      background: var(--btn-hover-bg);
      border-color: var(--btn-hover-border);
      color: var(--btn-hover-text);
    }
  }
}

.create-form {
  .form-item {
    margin-bottom: 20px;
  }
  
  .title-input {
    font-size: 18px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--input-bg);
    border-color: var(--input-border);
    color: var(--text-primary);
    
    &::placeholder {
      color: var(--text-secondary);
    }
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
  
  .content-input {
    font-size: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--input-bg);
    border-color: var(--input-border);
    color: var(--text-primary);
    resize: vertical;
    min-height: 200px;
    
    &::placeholder {
      color: var(--text-secondary);
    }
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
  
  .upload-section {
    :deep(.ant-upload-list-picture-card) {
      .ant-upload-list-item {
        border-radius: 8px;
      }
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 8px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    
    .submit-btn {
      min-width: 120px;
      height: 44px;
      border-radius: 8px;
      font-size: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}

.create-container[data-theme="dark"] {
  .create-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
    
    .create-title .anticon {
      color: #818cf8;
    }
  }
  
  .form-actions {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  :deep(.ant-input) {
    background: var(--input-bg);
    border-color: var(--input-border);
    color: var(--text-primary);
    
    &::placeholder {
      color: var(--text-secondary);
    }
  }
  
  :deep(.ant-input-show-count-suffix) {
    color: var(--text-secondary);
  }
  
  :deep(.ant-upload) {
    background: var(--input-bg);
    border-color: var(--input-border);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
    margin: 10px;
  }
  
  .create-header {
    .create-title {
      font-size: 20px;
    }
  }
  
  .content-input {
    min-height: 150px;
  }
}
</style>
