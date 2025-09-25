// authService.js
let storedAuth = localStorage.getItem("auth");
let auth = storedAuth
  ? JSON.parse(storedAuth)
  : {
      user: null,
      token: null,
      isLoggedIn: false,
    };

export const getAuth = () => {
  try {
    const stored = localStorage.getItem("auth");
    if (!stored) return { user: null, token: null, isLoggedIn: false };
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse auth from localStorage", err);
    return { user: null, token: null, isLoggedIn: false };
  }
};

export const setAuth = (newAuth) => {
  try {
    localStorage.setItem("auth", JSON.stringify(newAuth));
  } catch (err) {
    console.error("Failed to save auth to localStorage", err);
  }
};
