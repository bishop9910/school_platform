type UserGender = "male" | "female" | "unknown"

export type UserInfo = { token: string | undefined } & UserBaseInfo

export type UserResInfo = {
  data: UserBaseInfo
}

export type UserBaseInfo = {
  id: string
  username: string
  nickName: string
  avatar: string
  gender: UserGender
  credit_coin: number
  credit_score: number
  email: string
  signature: string
}

export type UserLoginInput = {
  username: string
  password: string
}

export type LoginResult = {
  token: string
}