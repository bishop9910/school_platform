<script setup lang="ts">
import { useLogin } from '@/stores/user';
import { computed } from 'vue';
const { userInfo, Login, GetInfo } = useLogin()

Login({username: "admin_user", password: "123456"})

const handleGetInfo = () => {
  GetInfo()
}

const showGender = computed(()=>{
  if(userInfo.gender === "male"){
    return "男"
  }else if(userInfo.gender === "female"){
    return "女"
  }else{
    return "未知"
  }
})
</script>

<template>
  <h1>主页</h1>
  <button @click="handleGetInfo">点我</button>

  <div v-if=" userInfo.id !== '' ">
    用户名：{{ userInfo.username }} 昵称：{{ userInfo.nickName }} 性别: {{ showGender }}
  </div>
</template>

<style>

</style>