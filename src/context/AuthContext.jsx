import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, setAuth as saveAuth } from "./authService";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getAuth());
  useEffect(() => {
    setAuth(getAuth());
  }, []);
  const updateAuth = (newAuth) => {
    setAuth(newAuth);
    saveAuth(newAuth); // sync both context + localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
function useAuth() {
  return useContext(AuthContext);
}
export { AuthProvider, useAuth };
