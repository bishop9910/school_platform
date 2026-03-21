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
      path: '/profile',
      name: '个人中心',
      component: () => import('@/components/Profile.vue')
    },
    {
      path: '/profile/edit',
      name: '编辑资料',
      component: () => import('@/components/ProfileEdit.vue')
    },
    {
      path: '/profile/posts',
      name: '我的帖子',
      component: () => import('@/components/MyPosts.vue')
    },
    {
      path: '/post/:id',
      name: '帖子',
      component: () => import('@/components/Post/Detail.vue')
    },
    {
      path: '/post/create',
      name: '创建帖子',
      component: () => import('@/components/Post/Create.vue')
    },
  ]
})

export default router
