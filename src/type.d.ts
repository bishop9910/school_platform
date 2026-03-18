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
  role: number // 0: 普通用户, 1: 管理员
}

export type UserLoginInput = {
  username: string
  password: string
}

export type UserRegisterInput = {
  username: string
  email: string
  password: string
}

export type LoginResult = {
  token: string
}

export type RegisterResult = {
  message: string
}

// 帖子相关
export interface CommunityPostImage {
  id: number;
  image_url: string;
  post_id: number;
}

export interface PostComment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  like: number;
  create_time?: string;
  // 扩展字段（前端组合用）
  username?: string;
  avatar?: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  user_id: number;
  create_time: string;
  like: number;
  images?: CommunityPostImage[];
  // 作者信息（前端组合）
  author?: {
    username: string;
    avatar?: string;
    nickname?: string;
  };
}

// API响应类型
export interface GetPostsResponse {
  success: boolean;
  message: string;
  data: CommunityPost[];
  page: number;
  total: number;
}

export interface GetPostResponse {
    success: boolean;
  message: string;
  data: CommunityPost;
  page: number;
  total: number;
}

export interface GetCommentsResponse {
  success: boolean;
  message: string;
  data: PostComment[];
  page: number;
  total: number;
}

export interface CreateCommentRequest {
  post_id: number;
  content: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
}

export interface DeleteCommentRequest {
  comment_id: number;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

export interface DeletePostRequest {
  post_id: number;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}