import { useState } from "react";

export const useValidate = () => {
  const [nameError, setNameError] = useState("");
  const [passError, setPassError] = useState("");
  const [emailError, setEmailError] = useState("");


  const validateName = (value) => {
    if (value.length <= 6) setNameError("Name should be at least 6 characters");
    else if (value.length > 15)
      setNameError("Name max length is 15 characters");
    else setNameError("");
  };
  const validateEmail = (value) => {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(value).toLowerCase()))
      setEmailError("Email should look like example@email.com");
    else setEmailError("");
  };
  const validatePassword = (value) => {
    // eslint-disable-next-line
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!re.test(String(value)))
      setPassError(
        "Password should be at least 8 characters, contain at least 1 uppercase, 1 lowercase and number"
      );
    else setPassError("");
  };
  return {
    validateName,
    validateEmail,
    validatePassword,
    nameError,
    passError,
    emailError,
  };
};
