import { useCallback} from "react";
export const useMessage = () => {
  let message;
  const show =useCallback(text => {
    if(text){
      return true
    }
    
  }, []);
  return {show,message}
};
