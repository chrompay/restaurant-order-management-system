import {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { toast } from "sonner";

import {
    login as loginApi,
} from "../api/auth.api";

import {
    AuthContextType,
    User,
} from "../types/auth.types";
import { authStorage } from "@/services/storage/authStorage";
import { getProfile } from "../api/auth.api";
import { STAFF_ROLES } from "../constants";

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

            if (!STAFF_ROLES.includes(currentUser.role)) {
                throw new Error("This portal is for staff only.");
            }

            authStorage.setToken(jwt);
            authStorage.setUser(currentUser);

            setToken(jwt);
            setUser(currentUser);
        } catch (error) {
            authStorage.clear();
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

    const updateUser = (nextUser: User) => {
        authStorage.setUser(nextUser);
        setUser(nextUser);
    };

    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = authStorage.getToken();

            if (!storedToken) {
                return;
            }

            try {
                const response = await getProfile();

                if (!STAFF_ROLES.includes(response.data.role)) {
                    authStorage.clear();
                    setToken(null);
                    setUser(null);
                    toast.error("This portal is for staff only.");
                    return;
                }

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

                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}