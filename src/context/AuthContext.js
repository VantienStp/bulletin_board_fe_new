// src/context/AuthContext.js
'use client'; 

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '@/lib/api'; 
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user_info');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser)); 
        }
        setIsLoading(false);
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const data = await loginUser(username, password); 
            if (data.token) {
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('user_info', JSON.stringify({ username: data.username, isAdmin: data.isAdmin }));

                setToken(data.token);
                setUser({ username: data.username, isAdmin: data.isAdmin }); 
                
                setIsLoading(false);
                return { success: true };
            }
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_info');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);