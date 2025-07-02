import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../redux/slices/authThunks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be 6+ chars" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username is too short" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be 6+ chars" }),
});

const Login = () => {
  const [tab, setTab] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tab === "login" ? loginSchema : registerSchema),
  });

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (data) => {
    if (tab === "login") {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
      toast.success("User registered successfully");
      setTab("login");
    }
    reset();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md p-8 shadow-xl bg-base-100 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          {tab === "login" ? "Welcome Back 👋" : "Create an Account"}
        </h2>

        <div className="flex justify-center mb-6">
          <div className="tabs tabs-boxed bg-base-300">
            <button
              onClick={() => setTab("login")}
              className={`tab ${tab === "login" ? "tab-active" : ""}`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`tab ${tab === "register" ? "tab-active" : ""}`}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {tab === "register" && (
            <div className="form-control">
              <label className="label font-medium">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter username"
                  className="input input-bordered w-full pr-10"
                  {...register("username")}
                />
                <UserPlus
                  className="absolute right-3 top-3 text-gray-400"
                  size={20}
                />
              </div>
              {errors.username && (
                <p className="text-error text-sm">{errors.username.message}</p>
              )}
            </div>
          )}
          <div className="form-control">
            <label className="label font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter email"
                className="input input-bordered w-full pr-10"
                {...register("email")}
              />
              <Mail
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full pr-10"
                {...register("password")}
              />
              <Lock
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
            </div>
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}
          </div>
          {error && (
            <p className="alert alert-error text-sm text-center mt-2">
              {error.message || "Something went wrong"}
            </p>
          )}
          {loading && (
            <p className="text-sm text-center text-blue-500 font-medium">
              Processing...
            </p>
          )}
          <button
            className="btn btn-primary w-full mt-4"
            type="submit"
            disabled={loading}
          >
            {tab === "login" ? (
              <>
                <LogIn className="mr-2" size={18} /> Login
              </>
            ) : (
              <>
                <UserPlus className="mr-2" size={18} /> Register
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
