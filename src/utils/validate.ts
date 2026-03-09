// utils/validate.ts

/**
 * 路径匹配器 - 支持 * 和 ** 通配符
 * @param pattern - 匹配模式，如 '/user/*' 或 '/api/**'
 * @param path - 待匹配路径
 * @returns 是否匹配成功
 */
export function isPathMatch(pattern: string, path: string): boolean {
  // 转义特殊字符并转换通配符为正则
  const regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // 转义正则特殊字符
    .replace(/\*\*/g, '.*')                  // ** 匹配任意路径
    .replace(/\*/g, '[^/]*');                // * 匹配单级路径
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * 判断值是否为空（支持多种空值类型）
 * @param value - 待判断的值
 * @returns 是否为空
 */
export function isEmpty(value: unknown): boolean {
  // null / undefined
  if (value == null) return true;
  
  // 字符串：空串、"undefined"、纯空格
  if (typeof value === 'string') {
    return value.trim() === '' || value === 'undefined';
  }
  
  // 数组：长度为 0
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  // 对象：无自有属性
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  // 数字：0 或 NaN
  if (typeof value === 'number') {
    return value === 0 || Number.isNaN(value);
  }
  
  return false;
}

/**
 * 判断 URL 是否为 http/https 协议
 * @param url - 待判断的 URL
 * @returns 是否为 http/https
 */
export function isHttp(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/**
 * 判断路径是否为外链（支持协议、邮箱、电话）
 * @param path - 待判断的路径
 * @returns 是否为外链
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:|\/\/)/.test(path);
}

/**
 * 验证用户名是否在白名单中
 * @param str - 用户名
 * @param validList - 可选的白名单，默认为 ['admin', 'editor']
 * @returns 是否有效
 */
export function validUsername(str: string, validList: string[] = ['admin', 'editor']): boolean {
  return validList.includes(str.trim());
}

/**
 * 验证 URL 格式（严格模式）
 * @param url - 待验证的 URL
 * @returns 是否格式正确
 */
export function validURL(url: string): boolean {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * 验证字符串是否全为小写字母
 * @param str - 待验证的字符串
 * @returns 是否全为小写
 */
export function validLowerCase(str: string): boolean {
  return /^[a-z]+$/.test(str);
}

/**
 * 验证字符串是否全为大写字母
 * @param str - 待验证的字符串
 * @returns 是否全为大写
 */
export function validUpperCase(str: string): boolean {
  return /^[A-Z]+$/.test(str);
}

/**
 * 验证字符串是否全为字母（不区分大小写）
 * @param str - 待验证的字符串
 * @returns 是否全为字母
 */
export function validAlphabets(str: string): boolean {
  return /^[A-Za-z]+$/.test(str);
}

/**
 * 验证邮箱格式
 * @param email - 待验证的邮箱
 * @returns 是否格式正确
 */
export function validEmail(email: string): boolean {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

// ============ 类型守卫函数（Type Guards）===========

/**
 * 类型守卫：判断是否为字符串
 * @param str - 待判断的值
 * @returns 是否为 string 类型（用于类型缩小）
 */
export function isString(str: unknown): str is string {
  return typeof str === 'string' || str instanceof String;
}

/**
 * 类型守卫：判断是否为数组
 * @param arg - 待判断的值
 * @returns 是否为 Array 类型（用于类型缩小）
 */
export function isArray(arg: unknown): arg is any[] {
  return Array.isArray(arg);
}

/**
 * 类型守卫：判断是否为对象（排除 null 和数组）
 * @param obj - 待判断的值
 * @returns 是否为普通对象
 */
export function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * 类型守卫：判断是否为数字（排除 NaN）
 * @param num - 待判断的值
 * @returns 是否为有效数字
 */
export function isNumber(num: unknown): num is number {
  return typeof num === 'number' && !Number.isNaN(num);
}

/**
 * 类型守卫：判断是否为函数
 * @param fn - 待判断的值
 * @returns 是否为 Function 类型
 */
export function isFunction(fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function';
}