import Cookies from 'js-cookie'

export function getToken(tokenKey: string) {
  return Cookies.get(tokenKey)
}

export function setToken(tokenKey: string, token: string) {
  return Cookies.set(tokenKey, token)
}

export function removeToken(tokenKey: string) {
  return Cookies.remove(tokenKey)
}

//Auth-Token   Refresh-Token

export const AUTH_TOKEN_KEY = 'Auth-Token';
export const REFRESH_TOKEN_KEY = 'Refresh-Token';