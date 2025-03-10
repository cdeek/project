"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

// Types
type ResetPassword = (args: {
  password: string;
  passwordConfirm: string;
  token: string;
}) => Promise<void>;

type ForgotPassword = (args: { email: string }) => Promise<void>;

type Create = (args: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => Promise<void>;

type Login = (args: { email: string; password: string }) => Promise<void>;

type Logout = () => Promise<void>;

type AuthState = {
  token: string | null;
  status: "loggedOut" | "loggedIn" | undefined;
};

type AuthAction =
  | { type: "LOGIN"; payload: string }
  | { type: "LOGOUT" }
  | { type: "STATUS"; payload: "loggedOut" | "loggedIn" };

interface AuthContext {
  token?: string | null;
  login: Login;
  logout: Logout;
  create: Create;
  resetPassword: ResetPassword;
  forgotPassword: ForgotPassword;
  status: "loggedOut" | "loggedIn" | undefined;
  dispatch: React.Dispatch<AuthAction>;
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "STATUS":
      return { ...state, status: action.payload };
    default:
      return state;
  }
}; 

class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
} 

// Context
const Context = createContext<AuthContext | null>(null);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    status: "loggedOut",
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/user/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          dispatch({ type: "LOGIN", payload: data });
          dispatch({ type: "STATUS", payload: "loggedIn" });
        } else {
          dispatch({ type: "STATUS", payload: "loggedOut" });
        }
      } catch (e: any) {
        console.error(`Error: ${e.message}`);
      }
    };

    fetchMe();
  }, []);

  const create: Create = useCallback(async (args) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new ServerError(errorData.error || "Failed to create account");
      }

      const data = await res.json();
      dispatch({ type: "LOGIN", payload: data });
      dispatch({ type: "STATUS", payload: "loggedIn" });
    } catch (e) { 
      if (e instanceof ServerError) {
        throw new Error(e.message);
      } else {
        throw new Error("Unexpected error occurred.");
      }
    }
  }, []);

  const login: Login = useCallback(async (args) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new ServerError(errorData.error || "Internal Error.");

      }
      const data = await res.json();
      dispatch({ type: "LOGIN", payload: data.token });
      dispatch({ type: "STATUS", payload: "loggedIn" });
    } catch (e: any) {
      if (e instanceof ServerError) {
        throw new Error(e.message);
      } else {
        throw new Error("Unexpected error occurred.");
      }
    }
  }, []);

  const logout: Logout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to logout");
      }

      dispatch({ type: "LOGOUT" });
      dispatch({ type: "STATUS", payload: "loggedOut" });
    } catch (e: any) {
      throw new Error("An error occurred while logging out.");
    }
  }, []);

  const forgotPassword: ForgotPassword = useCallback(async (args) => {
    try {
      const res = await fetch('api/auth/forgot-password',
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error.message || "Failed to request password reset"
        );
      }
    } catch (e: any) {
      throw new Error(
        "An error occurred while requesting password reset."
      );
    }
  }, []);

  const resetPassword: ResetPassword = useCallback(async (args) => {
    try {
      const res = await fetch('/auth/reset-password',
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || "Failed to reset password");
      }

      const json = await res.json();
      dispatch({ type: "LOGIN", payload: json.token });
      dispatch({ type: "STATUS", payload: "loggedIn" });
    } catch (e: any) {
      throw new Error(
       "An error occurred while resetting the password."
      );
    }
  }, []);

  return (
    <Context
      value={{
        user: state.user,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
        dispatch,
        status: state.status,
      }}
    >
      {children}
    </Context>
  );
};

// Hook
export const useAuth = () => useContext(Context);
