"use client";

import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/Message";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/_providers/Auth";

type FormData = {
  email: string;
  password: string;
}; 

const RegisterForm: React.FC = () => {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const redirect = useRef(searchParams.get("redirect"));
  const { create, status } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  useEffect(()=>{
    router.prefetch('/');
    if (status === "loggedIn") {
      if (redirect?.current) router.push(redirect.current as string);
      else router.push("/");
    };
   },[])
  
  const Icon = showPassword ? Eye : EyeOff;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, 
    watch
  } = useForm<FormData>();
  
  const password = useRef({});
  password.current = watch("password", ""); 

  const onSubmit = async (data: FormData) => {
    try {
      await create(data);
      if (redirect?.current) router.push(redirect.current as string);
      else router.push("/");
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">
          Welcome!
        </CardTitle>
        <CardDescription>
          Enter your credentials below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} method="POST" className="form">
          {error && <Message error={error} className="message" />}
          <Input
            name="name" 
            id="name"
            {...register("email", { required: "Email is required" })}
            type="text"
          /> 
          <Input
            name="email" 
            id="email"
            {...register("email", { required: "Email is required" })}
            type="email"
          /> 
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
          <div className="relative w-full">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", { required: "password is required" })}
            />
            <span className="" onClick={() => setShowPassword(!showPassword)}>
              <Icon />
            </span>
          </div> 
          {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
          
          <div className="relative w-full">
            <Input
              name="confirm_pass"
              type={showPassword ? "text" : "password"}
              id="confirm_pass" 
              validate={(value) =>
                value === password.current || "The passwords do not match"
              }
              {...register("confirm_pass", { required: "Confirm password is required" })}
            />
            <span className="" onClick={() => setShowPassword(!showPassword)}>
              <Icon />
            </span>
          </div> 
          {errors.confirm_pass && <span className="text-red-600 text-sm">{errors.confirm_pass.message}</span>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className=""
          >
            {isSubmitting ? "Processing" : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

