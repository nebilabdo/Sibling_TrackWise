"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
<<<<<<< Updated upstream
  id: string;
  username: string;
  grade: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  token?: string;
=======
  id: string
  username: string
  grade: string
  name: string
  email?: string
  role?: string
  avatar?: string
>>>>>>> Stashed changes
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

<<<<<<< Updated upstream
const AuthContext = createContext<AuthContextType | undefined>(undefined);
=======
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ⚠️ Replace this mockUsers with real backend API calls
const mockUsers = [
  {
    id: "1",
    username: "student1",
    password: "pass123", // only for mock validation, NEVER store password in state/localStorage
    grade: "5",
    name: "John Doe",
    email: "john@example.com",
    role: "child",
  },
  {
    id: "2",
    username: "student2",
    password: "pass456",
    grade: "6",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "child",
  },
  {
    id: "3",
    username: "admin",
    password: "admin123", // Added admin user
    grade: "", // Admin may not need a grade
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
]
>>>>>>> Stashed changes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.token) {
            // Verify token with backend
            const response = await fetch(
              "http://localhost:5000/api/auth/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${parsedUser.token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              setUser({ ...parsedUser, ...data.user });
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("user");
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login with real backend API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Ensure required fields exist in response
      if (!data.user || !data.token) {
        throw new Error("Invalid response from server");
      }

      const userData = {
        id: data.user._id,
        username: data.user.username,
        grade: data.user.grade,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        token: data.token,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout with backend API
  const logout = async () => {
    try {
      if (user?.token) {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // Update profile with backend API
  const updateProfile = async (data: Partial<User>) => {
    if (!user?.token) return;

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
<<<<<<< Updated upstream
  return context;
}
=======
  return context
}
>>>>>>> Stashed changes
