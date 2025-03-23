"use client";

import React, { useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast} from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/_providers/Auth";
import { Button } from "@/components/ui/button"

type FormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const redirect = useRef(searchParams.get("redirect"));
  const { login, status } = useAuth();
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
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      if (redirect?.current) router.push(redirect.current as string);
      else router.push("/");
    } catch (err) {
      toast({
        variant: "destructive",
        descriprion: err.message,
      })
    }
  }
  
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="">
          Welcome back! 
          <Image
            src="/assets/icons/hand-wave.png"
            alt="icon"
            width={39}
            height={30}
          />
        </CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} method="POST" className="form">
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className=""
          >
            {isSubmitting ? "Processing" : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="">
        <Link href={`/recover-password${allParams}`}>
          Recover your password
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

