import Request, { type ApiResponse } from "@/utils/request";

/**
 * 上传文件响应类型
 */
export interface UploadResponse {
  filename: string;
  url: string;
}

/**
 * 上传当前用户头像
 * @后端已实现: POST /uploads/avatar
 * @注意: 不要手动设置 Content-Type，浏览器会自动添加包含 boundary 的正确值
 */
export function uploadAvatar(file: File): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  return Request.request<UploadResponse>({
    url: '/uploads/avatar',
    method: 'post',
    headers: { 
      isToken: true, 
      repeatSubmit: false
    },
    data: formData
  });
}

/**
 * 上传帖子图片
 * @后端已实现: POST /uploads/post
 * @注意: 不要手动设置 Content-Type，浏览器会自动添加包含 boundary 的正确值
 */
export function uploadPostImage(file: File): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  return Request.request<UploadResponse>({
    url: '/uploads/post',
    method: 'post',
    headers: { 
      isToken: true, 
      repeatSubmit: false
    },
    data: formData
  });
}

/**
 * 上传委托图片
 * @后端已实现: POST /uploads/entrust
 * @注意: 不要手动设置 Content-Type，浏览器会自动添加包含 boundary 的正确值
 */
export function uploadEntrustImage(file: File): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  return Request.request<UploadResponse>({
    url: '/uploads/entrust',
    method: 'post',
    headers: { 
      isToken: true, 
      repeatSubmit: false
    },
    data: formData
  });
}
