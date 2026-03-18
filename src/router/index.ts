import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: () => import('@/components/Home.vue')
    },
    {
      path: '/test',
      name: '测试',
      component: () => import('@/components/Test.vue')
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/components/Login.vue')
    },
    {
      path: '/register',
      name: '注册',
      component: () => import('@/components/Register.vue')
    },
    {
      path: '/post/:id',
      name: '帖子',
      component: () => import('@/components/Post/Detail.vue')
    }
  ]
})

export default router
