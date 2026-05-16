"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

  export default function SignInForm() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast(data.msg || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

       // ROLE BASED REDIRECT
    if (data.user.role_id === 1) {

      window.location.href = "/dashboard";

    } else if (data.user.role_id === 2) {

      window.location.href = "/user-dashboard";

    } else {

      window.location.href = "/";

    }


  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
  return (<div className="flex flex-col flex-1 lg:w-1/2 w-full">

    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>
        <div>

          <div className="relative sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>

          </div>
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? (<EyeIcon className="fill-gray-500 dark:fill-gray-400" />) : (<EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />)}
                  </span>
                </div>
              </div>

              <div>
                <Button className="w-full" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>);
}
