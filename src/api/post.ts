import Request, { type ApiResponse } from "@/utils/request";
import type {
  CommunityPost,
  GetPostCommentsResponse,
  CreatePostCommentRequest,
  CreatePostCommentResponse,
  DeletePostCommentRequest,
  DeletePostCommentResponse,
  DeletePostRequest,
  DeletePostResponse,
  PostComment,
  GetPostsResponse,
  GetPostResponse,
  CreatePostRequest
} from "../type";

/**
 * 获取帖子列表（广场）
 * @后端已实现: GET /post/list
 */
export function getPostList(page = 1, pageSize = 20): Promise<ApiResponse<GetPostsResponse>> {
  return Request.request<GetPostsResponse>({
    url: '/post/list',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

/**
 * 获取单个帖子详情
 * @后端已实现: GET /post/:post_id
 */
export function getPost(post_id: number): Promise<ApiResponse<GetPostResponse>> {
  return Request.request<GetPostResponse>({
    url: `/post/${post_id}`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false }
  });
}

/**
 * 获取指定用户的帖子列表
 * @后端已实现: GET /user/:user_id/posts
 */
export function getUserPosts(userId: string, page = 1, pageSize = 20): Promise<ApiResponse<GetPostsResponse>> {
  return Request.request<GetPostsResponse>({
    url: `/user/${userId}/posts`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

/**
 * 获取当前用户的帖子列表（兼容旧代码，内部调用 getUserPosts）
 * @注意: 需要传入当前用户ID，最终调用的是 /user/:user_id/posts
 */
export function getMyPosts(userId: string, page = 1, pageSize = 20): Promise<ApiResponse<GetPostsResponse>> {
  return getUserPosts(userId, page, pageSize);
}

/**
 * 获取指定帖子的评论列表
 * @后端已实现: GET /post/comment
 */
export function getComments(
  postId: number,
  page = 1,
  pageSize = 20
): Promise<ApiResponse<GetPostCommentsResponse>> {
  return Request.request<GetPostCommentsResponse>({
    url: '/post/comment',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { post_id: postId, page, page_size: pageSize }
  });
}

/**
 * 创建评论
 * @后端已实现: POST /post/comment
 */
export function createComment(
  data: CreatePostCommentRequest
): Promise<ApiResponse<CreatePostCommentResponse>> {
  return Request.request<CreatePostCommentResponse>({
    url: '/post/comment',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data
  });
}

/**
 * 删除评论
 * @后端已实现: POST /post/comment/delete
 */
export function deleteComment(
  commentId: number
): Promise<ApiResponse<DeletePostCommentResponse>> {
  return Request.request<DeletePostCommentResponse>({
    url: '/post/comment/delete',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId } as DeletePostCommentRequest
  });
}

/**
 * 创建帖子
 * @后端已实现: POST /post/new
 */
export function createPost(data: CreatePostRequest): Promise<ApiResponse<{ post_id: number }>> {
  return Request.request<{ post_id: number }>({
    url: '/post/new',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data
  });
}

/**
 * 删除帖子
 * @后端已实现: POST /post/delete
 */
export function deletePost(
  postId: number
): Promise<ApiResponse<DeletePostResponse>> {
  return Request.request<DeletePostResponse>({
    url: '/post/delete',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { post_id: postId } as DeletePostRequest
  });
}

/**
 * 点赞帖子
 * @后端已实现: POST /post/like
 */
export function likePost(postId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/post/like',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { post_id: postId }
  });
}

/**
 * 取消点赞帖子
 * @后端已实现: POST /post/unlike
 */
export function unlikePost(postId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/post/unlike',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { post_id: postId }
  });
}

/**
 * 点赞评论
 * @后端已实现: POST /post/comment/like
 */
export function likeComment(commentId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/post/comment/like',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId }
  });
}

/**
 * 取消点赞评论
 * @后端已实现: POST /post/comment/unlike
 */
export function unlikeComment(commentId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/post/comment/unlike',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId }
  });
}

/**
 * 获取帖子图片（返回完整URL）
 * @后端新路径: /files/post/:filename
 */
export function getPostImageUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http')) {
    return filename;
  }
  if (filename.startsWith('/files/') || filename.startsWith('/assets/')) {
    return `http://localhost:8080/app${filename}`;
  }
  return `http://localhost:8080/app/files/post/${filename}`;
}

/**
 * 获取头像图片（返回完整URL）
 * @后端新路径: /files/avatar/:filename
 */
export function getAvatarUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http')) {
    return filename;
  }
  if (filename.startsWith('/files/') || filename.startsWith('/assets/')) {
    return `http://localhost:8080/app${filename}`;
  }
  return `http://localhost:8080/app/files/avatar/${filename}`;
}
