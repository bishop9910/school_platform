import { getInfo, login } from "@/api/login";
import type { UserInfo, UserLoginInput } from "@/type";
import { getToken, setToken } from "@/utils/auth";
import { isEmpty, isHttp } from "@/utils/validate";
import { defineStore } from "pinia";
import { reactive } from "vue";

import defAva from "@/assets/image/default_avatar.avif"

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
    email: ''
  })

  function Login(userInput: UserLoginInput): Promise<void> {
    const username: string = userInput.username.trim()
    const password: string = userInput.password

    return new Promise((resolve, reject) => {
      login(username, password).then(res => {
        setToken("Auth-Token", res.token!)
        userInfo.token = res.token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  function GetInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {

        let avatar = res.data.avatar || ""
        if (!isHttp(avatar)) {
          avatar = (isEmpty(avatar)) ? defAva : import.meta.env.BASE_URL + avatar
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

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  return { userInfo, Login, GetInfo }
})