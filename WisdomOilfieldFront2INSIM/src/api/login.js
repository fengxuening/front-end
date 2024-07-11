import api from '@/utils/api'
import service from "@/utils/api";
;

export function getInfo(token) {
  return api({
    url: '/login/testGetInfo',
    method: 'get',
    params: {token}
  })
}

export function  handleLogin(loginForm) {
    return service.post(`/yz/oauth/token?username=${loginForm.username}&code=${loginForm.code}&password=${loginForm.password}&grant_type=${loginForm.grant_type}&client_secret=${loginForm.client_secret}&client_id=${loginForm.client_id}`,
        loginForm, {headers: {Authorization: 'Basic Y2xpZW50LWFwcDoxMjM0NTY='}}
    )
}



