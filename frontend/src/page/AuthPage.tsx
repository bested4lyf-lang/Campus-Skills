import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../component/auth/AuthLayout";
import LoginForm from "../component/auth/LoginForm";
import RegisterForm from "../component/auth/RegisterForm";
import { ApiError, login, register, saveToken } from "../api/authApi";
import { authService } from "../services/authService";
import type { LoginForm as LoginFormData } from "../types/auth";
import type { RegisterForm as RegisterFormData } from "../types/auth";

export default function AuthPage() {
const location = useLocation();
const navigate = useNavigate();

const isRegisterPage = location.pathname === "/register";

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");

async function handleLogin(form: LoginFormData) {
setIsLoading(true);
setError("");


try {
  const response = await login(form);

  saveToken(response.token, form.remember);
  authService.saveCurrentUser(response.user);

  navigate("/");
} catch (error: unknown) {
  if (error instanceof ApiError) {
    setError(error.message);
  } else {
    setError("Unable to sign in. Please try again.");
  }
} finally {
  setIsLoading(false);
}


}

async function handleRegister(form: RegisterFormData) {
setIsLoading(true);
setError("");


try {
  const response = await register(form);

  saveToken(response.token, true);
  authService.saveCurrentUser(response.user);

  navigate("/");
} catch (error: unknown) {
  if (error instanceof ApiError) {
    setError(error.message);
  } else {
    setError("Unable to create your account. Please try again.");
  }
} finally {
  setIsLoading(false);
}


}

return ( <AuthLayout>
{isRegisterPage ? ( <RegisterForm
       onSubmit={handleRegister}
       isLoading={isLoading}
       error={error}
     />
) : ( <LoginForm
       onSubmit={handleLogin}
       isLoading={isLoading}
       error={error}
     />
)} </AuthLayout>
);
}
