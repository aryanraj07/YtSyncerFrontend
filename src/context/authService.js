// authService.js
let storedAuth = localStorage.getItem("auth");
let auth = storedAuth
  ? JSON.parse(storedAuth)
  : {
      user: null,
      token: null,
      isLoggedIn: false,
    };

export const getAuth = () => auth;

export const setAuth = (newAuth) => {
  auth = newAuth;
  localStorage.setItem("auth", JSON.stringify(newAuth));
};
