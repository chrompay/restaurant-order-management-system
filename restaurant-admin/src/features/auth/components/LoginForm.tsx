import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

import PasswordInput from "./PasswordInput";

export default function LoginForm() {
    const { handleLogin } = useLogin();

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const email = watch("email");

    console.log("Email:", email);

    const password = watch("password");

    const onSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            setServerError("");

            await handleLogin(values);
        } catch (error: any) {
            setServerError(
                error?.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>

                <CardDescription>
                    Sign in to access your restaurant dashboard.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email Address
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@restaurant.com"
                            {...register("email")}
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password
                        </Label>

                        <PasswordInput
                            value={password}
                            onChange={(value) =>
                                setValue("password", value)
                            }
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}