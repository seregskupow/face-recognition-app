import {createContext} from 'react'

function noop(){};

export const AuthContext = createContext({
    token:null,
    userId:null,
    userName:null,
    logIn:noop,
    logOut:noop,
    isAuth:false
})