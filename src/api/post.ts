import Request, { type ApiResponse } from "@/utils/request";
import type {
  CommunityPost,
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  DeletePostRequest,
  DeletePostResponse,
  PostComment,
  GetPostsResponse,
  GetPostResponse
} from "../type";

/**
 * 获取帖子列表（用于获取单个帖子详情，因API无单帖接口）
 */
export function getPostList(page = 1, pageSize = 20): Promise<ApiResponse<GetPostsResponse>> {
  return Request.request<GetPostsResponse>({
    url: '/post/list',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

export function getPost(post_id: number): Promise<ApiResponse<GetPostResponse>>{
  return Request.request<GetPostResponse>({
    url: `/post/${post_id}`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false}
  })
}

/**
 * 获取指定帖子的评论列表
 */
export function getComments(
  postId: number, 
  page = 1, 
  pageSize = 20
): Promise<ApiResponse<GetCommentsResponse>> {
  return Request.request<GetCommentsResponse>({
    url: '/post/comment',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { post_id: postId, page, page_size: pageSize }
  });
}

/**
 * 创建评论
 */
export function createComment(
  data: CreateCommentRequest
): Promise<ApiResponse<CreateCommentResponse>> {
  return Request.request<CreateCommentResponse>({
    url: '/post/comment',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data
  });
}

/**
 * 删除评论
 */
export function deleteComment(
  commentId: number
): Promise<ApiResponse<DeleteCommentResponse>> {
  return Request.request<DeleteCommentResponse>({
    url: '/post/comment/delete',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId } as DeleteCommentRequest
  });
}

/**
 * 删除帖子
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
 * 获取帖子图片（返回完整URL）
 */
export function getPostImageUrl(filename: string): string {
  return `http://localhost:8080/app${filename}`;
}

/**
 * 获取头像图片（返回完整URL）
 */
export function getAvatarUrl(filename: string): string {
  return `http://localhost:8080/app${filename}`;
}