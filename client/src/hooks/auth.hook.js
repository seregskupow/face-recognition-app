import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";

const userData = "User";
export const useAuth = () => {
    const history = useHistory();
    const [token,setToken]=useState(null)
    const [ready,setReady] = useState(false)
    const [userId,setId]=useState(null)
    const [userName,setName]=useState(null)

  const logIn = useCallback((jwtToken,id,name)=>{
    setToken(jwtToken)
    setId(id)
    setName(name)
    localStorage.setItem(userData,JSON.stringify({token:jwtToken,userId:id,userName:name}))
    history.push("/match");
  },[])
  const logOut = useCallback(()=>{
    setToken(null)
    setId(null)
    setName(null)
    localStorage.removeItem(userData)
    sessionStorage.clear();
  },[])

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem(userData))
    if(data && data.token){
        logIn(data.token,data.userId,data.userName)
    }
    setReady(true)
  },[logIn])
  return {logIn,logOut,token,userId,userName,ready};
};
