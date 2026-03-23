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
  post: PostComment;
  author: AuthorBase;
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
  id: number
  nickName: string
  avatar: string
}

export interface PostWithAuthor {
  post: CommunityPost;
  author: AuthorBase;
}

// API响应类型
export interface GetPostsResponse {
  success: boolean;
  message: string;
  data: PostWithAuthor[];
  page: number;
  total: number;
}

export interface GetPostResponse {
  success: boolean;
  message: string;
  data: PostWithAuthor;
  page: number;
  total: number;
}

export interface GetPostCommentsResponse {
  success: boolean;
  message: string;
  data: PostCommentWithAuthor[];
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

enum credit_level {
  Danger,
  Normal,
  Good,
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}

export interface CommunityEntrust {
  id: number;
  user_id: number;
  allowed_credit_score_level: credit_level;
  acceptor_id: number;
  credit_coin: number;
  title: string;
  content: string;
  is_over: boolean;
  is_progressing: boolean;
  like_count: number;
  images: CommunityEntrustImage[]

  create_time?: string;
}

export interface CommunityEntrustImage {
  id: number;
  image_url: string;
  entrust_id: number;
}

export interface EntrustComment {
  content: string
  entrust_id: number
  id: number
  like_count: number
  user_id: number
}

export interface EntrustWithAuthor {
  author: AuthorBase;
  entrust: CommunityEntrust;
}

export interface EntrustCommentWithAuthor {
  author: AuthorBase;
  comment: EntrustComment;
}

//api 响应
export interface GetEntrustsResponse {
  success: boolean;
  message: string;
  data: EntrustWithAuthor[];
  page: number;
  total: number;
}

export interface NewEntrustRequest {
  allowed_credit_score_level: credit_level;
  coin: number
  content: string
  title: string
}

export interface NewEntrustResponse {
  success: boolean;
  message: string;
  data: {
    entrust_id: number;
  }
}

export interface UploadEntrustImageRequest {
  entrust_id: number;
  image: File | Blob;
}

export interface UploadEntrustImageResponse {
  success: boolean;
  message: string;
}

export interface GetUserEntrustsRequest {
  user_id: number;
  page: number;
  page_size: number;
}

export interface GetUserEntrustsResponse {
  success: boolean;
  message: string;
  data: EntrustWithAuthor[];
  page: number;
  total: number;
}

export interface GetUserAcceptedEntrustsRequest {
  user_id: number;
  page: number;
  page_size: number;
}

export interface GetUserAcceptedEntrustsResponse {
  success: boolean;
  message: string;
  data: EntrustWithAuthor[];
  page: number;
  total: number;
}

export interface GetEntrustByIdRequest {
  entrust_id: number;
}

export interface GetEntrustByIdResponse {
  success: boolean;
  message: string;
  data: EntrustWithAuthor[];
}

export interface GetEntrustCommentsRequest {
  entrust_id: number;
  page: number;
  page_size: number;
}

export interface GetEntrustCommentsResponse {
  success: boolean;
  message: string;
  data: EntrustCommentWithAuthor[];
  page: number;
  total: number;
}

export interface NewEntrustCommentRequest {
  content: string;
  entrust_id: number;
}

export interface NewEntrustCommentResponse {
  success: boolean;
  message: string;
}

export interface DeleteEntrustCommentRequest {
  comment_id: number;
}

export interface DeleteEntrustCommentResponse {
  success: boolean;
  message: string;
}