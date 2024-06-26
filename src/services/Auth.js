import { getAccessToken, removeUserData } from "./Storage"


export const isAuthenticated = ()=>{
    return getAccessToken()!=null?true:false;
}

export const logout = ()=>{
    removeUserData();
}