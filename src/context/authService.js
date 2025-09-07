// authService.js
let auth = JSON.parse(localStorage.getItem("auth")) || {
  user: null,
  token: null,
  isLoggedIn: false,
};

export const getAuth = () => auth;

export const setAuth = (newAuth) => {
  auth = newAuth;
  localStorage.setItem("auth", JSON.stringify(newAuth));
};
