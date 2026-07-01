import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import type { LoginFormValues } from "../schemas/login.schema";

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values.email, values.password);

    navigate("/");
  };

  return {
    handleLogin,
  };
}