import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout } from "../api.js";

const AuthContext = createContext(null);

// AuthProvider wraps the entire app and makes auth state available everywhere
export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true);

    // on app startup, check if there's an existing session
    useEffect(() => {
        getCurrentUser()
        .then(data => setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const data = await apiLogin(username, password);
        setUser(data);
        return data;
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook
export function useAuth() {
    return useContext(AuthContext);
}