import { getInfo, login, logout } from "@/api/login";
import { getAvatarUrl } from "@/api/post";
import type { UserInfo, UserLoginInput } from "@/type";
import { getToken, setToken, removeToken, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils/auth";
import { isEmpty, isHttp } from "@/utils/validate";
import { defineStore } from "pinia";
import { reactive } from "vue";

import defAva from "@/assets/image/default_avatar.avif";

export const useLogin = defineStore('login', () => {
  const userInfo: UserInfo = reactive({
    token: getToken("Auth-Token"),
    id: '',
    username: '',
    nickName: '',
    avatar: '',
    gender: 'unknown',
    credit_coin: 0,
    credit_score: 100,
    signature: '',
    email: '',
    role: 0
  })

  function Login(userInput: UserLoginInput): Promise<void> {
    const username: string = userInput.username.trim()
    const password: string = userInput.password

    return new Promise((resolve, reject) => {
      login(username, password).then(res => {
        setToken(AUTH_TOKEN_KEY, res.token!)
        userInfo.token = res.token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  function Logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 调用后端退出登录接口
      logout().then(() => {
        clearUserInfo()
        resolve()
      }).catch(() => {
        // 即使接口失败也强制清除本地状态
        clearUserInfo()
        resolve()
      })
    })
  }

  // 清除本地用户信息
  function clearUserInfo() {
    removeToken(AUTH_TOKEN_KEY)
    removeToken(REFRESH_TOKEN_KEY)
    userInfo.token = ''
    userInfo.id = ''
    userInfo.username = ''
    userInfo.nickName = ''
    userInfo.avatar = ''
    userInfo.gender = 'unknown'
    userInfo.credit_coin = 0
    userInfo.credit_score = 100
    userInfo.signature = ''
    userInfo.email = ''
    userInfo.role = 0
  }

  function GetInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        let avatar = res.data.avatar || ""
        if (!isHttp(avatar) && !isEmpty(avatar)) {
          avatar = getAvatarUrl(avatar)
        }
        if (isEmpty(avatar)) {
          avatar = defAva
        }

        userInfo.id = res.data.id!
        userInfo.username = res.data.username!
        userInfo.nickName = res.data.nickName!
        userInfo.avatar = avatar
        userInfo.gender = res.data.gender!
        userInfo.email = res.data.email!
        userInfo.signature = res.data.signature!
        userInfo.credit_coin = res.data.credit_coin!
        userInfo.credit_score = res.data.credit_score!
        userInfo.role = res.data.role || 0

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  return { userInfo, Login, Logout, GetInfo }
})