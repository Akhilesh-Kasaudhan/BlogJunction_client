import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../redux/slices/authThunks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  const { user, isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (data) => {
    if (tab === "login") {
      dispatch(loginUser(data));
      toast.success("Lgged in successfully");
    } else {
      dispatch(registerUser(data));
      toast.success("User registered successfully");
    }
    reset();
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300">
      <div className="w-full max-w-md p-6 shadow-xl bg-base-100 rounded-xl">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="tabs tabs-boxed">
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="input input-bordered w-full"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-error text-sm">{errors.username.message}</p>
              )}
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="input input-bordered w-full"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}
          </div>
          {error && (
            <p className="text-error text-sm text-center">
              {error.message || "Something went wrong"}
            </p>
          )}
          {loading && (
            <p className="text-sm text-center text-blue-500">Processing...</p>
          )}
          <button
            className="btn btn-primary w-full mt-4"
            type="submit"
            disabled={loading}
          >
            {tab === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
