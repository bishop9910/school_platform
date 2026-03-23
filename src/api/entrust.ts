import Request, { type ApiResponse } from "@/utils/request";

export interface EntrustInfo {
  id: number;
  title: string;
  content: string;
  status: number;
  reward: number;
  user_id: number;
  create_time: string;
  update_time: string;
  images?: Array<{ id: number; image_url: string }>;
}

export interface EntrustComment {
  id: number;
  content: string;
  user_id: number;
  entrust_id: number;
  like: number;
  create_time: string;
  username?: string;
  avatar?: string;
}

export interface GetEntrustsResponse {
  data: EntrustInfo[];
  total: number;
  page: number;
}

export interface GetEntrustCommentsResponse {
  data: EntrustComment[];
  total: number;
  page: number;
}

/**
 * 创建新委托的请求参数
 */
export interface CreateEntrustInput {
  title: string;
  content: string;
  reward: number;
  images?: string[];
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 获取委托列表（广场）
 * @后端已实现: GET /entrust/list
 */
export function getEntrustList(page = 1, pageSize = 20): Promise<ApiResponse<GetEntrustsResponse>> {
  return Request.request<GetEntrustsResponse>({
    url: '/entrust/list',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

/**
 * 获取单个委托详情
 * @后端已实现: GET /entrust/:entrust_id
 */
export function getEntrust(entrustId: number): Promise<ApiResponse<EntrustInfo>> {
  return Request.request<EntrustInfo>({
    url: `/entrust/${entrustId}`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false }
  });
}

/**
 * 创建新委托
 * @后端已实现: POST /entrust/new
 */
export function createEntrust(data: CreateEntrustInput): Promise<ApiResponse<{ entrust_id: number }>> {
  return Request.request<{ entrust_id: number }>({
    url: '/entrust/new',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data
  });
}

/**
 * 删除委托
 * @后端已实现: POST /entrust/delete
 */
export function deleteEntrust(entrustId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/delete',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId }
  });
}

/**
 * 接受委托
 * @后端已实现: POST /entrust/accept
 */
export function acceptEntrust(entrustId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/accept',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId }
  });
}

/**
 * 点赞委托
 * @后端已实现: POST /entrust/like
 */
export function likeEntrust(entrustId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/like',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId }
  });
}

/**
 * 取消点赞委托
 * @后端已实现: POST /entrust/unlike
 */
export function unlikeEntrust(entrustId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/unlike',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId }
  });
}

/**
 * 获取委托评论列表
 * @后端已实现: GET /entrust/comment
 */
export function getEntrustComments(
  entrustId: number,
  page = 1, 
  pageSize = 20
): Promise<ApiResponse<GetEntrustCommentsResponse>> {
  return Request.request<GetEntrustCommentsResponse>({
    url: '/entrust/comment',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { entrust_id: entrustId, page, page_size: pageSize }
  });
}

/**
 * 创建委托评论
 * @后端已实现: POST /entrust/comment
 */
export function createEntrustComment(
  entrustId: number,
  content: string
): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/comment',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId, content }
  });
}

/**
 * 删除委托评论
 * @后端已实现: POST /entrust/comment/delete
 */
export function deleteEntrustComment(commentId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/comment/delete',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId }
  });
}

/**
 * 点赞委托评论
 * @后端已实现: POST /entrust/comment/like
 */
export function likeEntrustComment(commentId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/comment/like',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId }
  });
}

/**
 * 取消点赞委托评论
 * @后端已实现: POST /entrust/comment/unlike
 */
export function unlikeEntrustComment(commentId: number): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/comment/unlike',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { comment_id: commentId }
  });
}

/**
 * 获取指定用户发布的委托列表
 * @后端已实现: GET /user/:user_id/entrusts
 */
export function getUserEntrusts(
  userId: string, 
  page = 1, 
  pageSize = 20
): Promise<ApiResponse<GetEntrustsResponse>> {
  return Request.request<GetEntrustsResponse>({
    url: `/user/${userId}/entrusts`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

/**
 * 获取指定用户已接受的委托列表
 * @后端已实现: GET /user/:user_id/entrusts/accepted
 */
export function getUserAcceptedEntrusts(
  userId: string, 
  page = 1, 
  pageSize = 20
): Promise<ApiResponse<GetEntrustsResponse>> {
  return Request.request<GetEntrustsResponse>({
    url: `/user/${userId}/entrusts/accepted`,
    method: 'get',
    headers: { isToken: true, repeatSubmit: false },
    params: { page, page_size: pageSize }
  });
}

/**
 * 获取委托交接二维码
 * @后端已实现: POST /entrust/get-qrcode
 */
export function getEntrustQRCode(entrustId: number): Promise<ApiResponse<{ qrcode: string }>> {
  return Request.request<{ qrcode: string }>({
    url: '/entrust/get-qrcode',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId }
  });
}

/**
 * 验证二维码完成交接
 * @后端已实现: POST /entrust/verify
 */
export function verifyEntrustQRCode(
  entrustId: number,
  qrcode: string
): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/entrust/verify',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: { entrust_id: entrustId, qrcode }
  });
}

/**
 * 获取委托图片（返回完整URL）
 */
export function getEntrustImageUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http')) {
    return filename;
  }
  if (filename.startsWith('/files/') || filename.startsWith('/assets/')) {
    return `http://localhost:8080/app${filename}`;
  }
  return `http://localhost:8080/app/files/entrust/${filename}`;
}

/**
 * 获取委托交接二维码图片URL
 * @后端已实现: GET /files/entrust/qrcode/:filename
 */
export function getEntrustQRCodeUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http')) {
    return filename;
  }
  if (filename.startsWith('/files/') || filename.startsWith('/assets/')) {
    return `http://localhost:8080/app${filename}`;
  }
  return `http://localhost:8080/app/files/entrust/qrcode/${filename}`;
}
