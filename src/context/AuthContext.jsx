import { createContext, useContext, useState } from "react";
import { getAuth, setAuth as saveAuth } from "./authService";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(getAuth());
  const setAuth = (newAuth) => {
    setAuthState(newAuth);
    saveAuth(newAuth); // sync with localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
function useAuth() {
  return useContext(AuthContext);
}
export { AuthProvider, useAuth };
