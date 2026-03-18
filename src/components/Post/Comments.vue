<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'
import { getToken } from '@/utils/auth'
import { 
  getComments, 
  createComment, 
  deleteComment,
  getAvatarUrl 
} from '@/api/post'
import type { PostComment } from '../../type'
import { UserOutlined, LikeOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  postId: number
}>()

const emit = defineEmits<{
  (e: 'comment-added'): void
}>()

const themeStore = useThemeStore()
const comments = ref<PostComment[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const commentContent = ref('')
const submitting = ref(false)

// 当前登录用户信息（用于判断是否可删除）
const currentUserId = computed(() => {
  // 可从pinia user store获取，这里简化处理
  return null as number | null
})

// 获取评论列表
const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getComments(props.postId, page.value, 20)
    if (res.success && res.data) {
      comments.value = res.data.data || []
      total.value = res.data.total || 0
    }
  } catch (err: any) {
    message.error(err.message || '加载评论失败')
  } finally {
    loading.value = false
  }
}

// 提交评论
const handleSubmit = async () => {
  if (!commentContent.value.trim()) {
    message.warning('请输入评论内容')
    return
  }
  if (!getToken('Auth-Token')) {
    message.warning('请先登录')
    return
  }
  
  submitting.value = true
  try {
    const res = await createComment({
      post_id: props.postId,
      content: commentContent.value.trim()
    })
    if (res.success) {
      message.success('评论成功')
      commentContent.value = ''
      emit('comment-added')
      fetchComments() // 刷新评论列表
    }
  } catch (err: any) {
    message.error(err.message || '评论失败')
  } finally {
    submitting.value = false
  }
}

// 删除评论
const handleDelete = (commentId: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条评论吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteComment(commentId)
        if (res.success) {
          message.success('删除成功')
          fetchComments()
        }
      } catch (err: any) {
        message.error(err.message || '删除失败')
      }
    }
  })
}

// 格式化时间
const formatTime = (timeStr?: string) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="comments-section" :data-theme="themeStore.isDark ? 'dark' : 'light'">
    <!-- 评论输入区 -->
    <div class="comment-input-wrapper">
      <a-textarea
        v-model:value="commentContent"
        placeholder="写下你的评论..."
        :auto-size="{ minRows: 2, maxRows: 4 }"
        class="comment-input"
      />
      <div class="comment-actions">
        <span class="comment-tip">{{ commentContent.length }}/200</span>
        <a-button 
          type="primary" 
          :loading="submitting"
          @click="handleSubmit"
          :disabled="!commentContent.trim()"
        >
          发布评论
        </a-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <a-skeleton :active="true" v-if="loading && comments.length === 0" />
      
      <a-empty v-else-if="!loading && comments.length === 0" description="暂无评论" />
      
      <div v-else class="comment-items">
        <a-comment 
          v-for="item in comments" 
          :key="item.id"
          class="comment-item"
        >
          <template #author>
            <span class="comment-username">{{ item.username || `用户${item.user_id}` }}</span>
          </template>
          
          <template #avatar>
            <a-avatar 
              :src="item.avatar ? getAvatarUrl(item.avatar) : undefined"
              :icon="UserOutlined"
            />
          </template>
          
          <template #content>
            <p class="comment-text">{{ item.content }}</p>
            <div class="comment-meta">
              <span class="comment-time">{{ formatTime(item.create_time) }}</span>
              <span class="comment-like"><LikeOutlined /> {{ item.like }}</span>
              <a 
                v-if="item.user_id === currentUserId" 
                class="comment-delete"
                @click="handleDelete(item.id)"
              >
                删除
              </a>
            </div>
          </template>
        </a-comment>
      </div>
    </div>

    <!-- 分页（如果需要）-->
    <div v-if="total > 20" class="comment-pagination">
      <a-pagination 
        v-model:current="page" 
        :total="total" 
        :page-size="20"
        @change="fetchComments"
        size="small"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.comments-section {
  margin-top: 24px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &[data-theme="dark"] {
    background: rgba(30, 30, 46, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    :deep(.ant-comment-content) {
      color: rgba(255, 255, 255, 0.85);
    }
    :deep(.ant-textarea) {
      background: #2a2a4a;
      border-color: #3a3a5a;
      color: #fff;
    }
  }
}

.comment-input-wrapper {
  margin-bottom: 20px;
  
  .comment-input {
    margin-bottom: 12px;
  }
  
  .comment-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .comment-tip {
      font-size: 12px;
      color: #999;
    }
  }
}

.comment-list {
  .comment-items {
    max-height: 400px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }
  }
  
  .comment-item {
    margin-bottom: 16px;
    
    :deep(.ant-comment-content) {
      background: rgba(245, 245, 245, 0.5);
      padding: 12px 16px;
      border-radius: 8px;
    }
    
    .comment-username {
      font-weight: 500;
      color: #333;
    }
    
    .comment-text {
      margin: 8px 0;
      line-height: 1.5;
      word-break: break-word;
    }
    
    .comment-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: #999;
      
      .comment-delete {
        color: #ff4d4f;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.comment-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

// 暗主题适配
:deep(.ant-comment) {
  &[data-theme="dark"] & {
    .ant-comment-content {
      background: rgba(40, 40, 60, 0.5);
    }
  }
}
</style>