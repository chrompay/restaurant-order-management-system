import {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    login as loginApi,
} from "../api/auth.api";

import {
    AuthContextType,
    User,
} from "../types/auth.types";
import { authStorage } from "@/services/storage/authStorage";
import { getProfile } from "../api/auth.api";

export const AuthContext =
    createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: Props) {
    const [user, setUser] = useState<User | null>(
        authStorage.getUser()
    );

    const [token, setToken] = useState<string | null>(
        authStorage.getToken()
    );
    const [isLoading, setIsLoading] =
        useState(false);

    const login = async (
        email: string,
        password: string
    ) => {
        setIsLoading(true);

        try {
            const response = await loginApi({
                email,
                password,
            });

            const jwt = response.data.token;
            const currentUser = response.data.user;

            authStorage.setToken(jwt);
            authStorage.setUser(currentUser);

            setToken(jwt);
            setUser(currentUser);
        } catch (error) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authStorage.clear();

        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = authStorage.getToken();

            if (!storedToken) {
                return;
            }

            try {
                const response = await getProfile();

                setUser(response.data);
                authStorage.setUser(response.data);
            } catch {
                authStorage.clear();
                setToken(null);
                setUser(null);
            }
        };

        restoreSession();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,

                isAuthenticated:
                    !!token,

                login,

                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}