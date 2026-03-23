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
}

export interface PostCommentWithAuthor {
  Post: PostComment;
  Author: AuthorBase;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  user_id: number;
  create_time: string;
  like: number;
  images?: CommunityPostImage[];
}

type AuthorBase = {
  NickName: string
  Avatar: string
}

export interface PostWithAuthor {
  Post: CommunityPost;
  Author: AuthorBase;
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

export interface GetPostCommentsResponse {
  success: boolean;
  message: string;
  data: PostComment[];
  page: number;
  total: number;
}

export interface CreatePostCommentRequest {
  post_id: number;
  content: string;
}

export interface CreatePostCommentResponse {
  success: boolean;
  message: string;
}

export interface DeletePostCommentRequest {
  comment_id: number;
}

export interface DeletePostCommentResponse {
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