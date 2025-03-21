
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { secureLocalStorage } from "@/utils/encryption";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple password hashing function (not secure enough for production)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// Demo users with hashed passwords
const DEMO_USERS = [
  { 
    id: "1", 
    name: "Test User", 
    email: "test@example.com", 
    password: hashPassword("password123") // Hashed version
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check secureLocalStorage for saved user session
    const savedUser = secureLocalStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(savedUser);
      } catch (e) {
        secureLocalStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Hash the input password
    const hashedPassword = hashPassword(password);
    
    // Find user (in a real app, this would be an API call)
    const foundUser = DEMO_USERS.find(
      u => u.email === email && u.password === hashedPassword
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      secureLocalStorage.setItem("user", userWithoutPassword);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.name}`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (DEMO_USERS.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      });
      setIsLoading(false);
      throw new Error("Email already in use");
    }
    
    // In a real app, this would create a user in the database
    const hashedPassword = hashPassword(password);
    const newUser = { id: `${DEMO_USERS.length + 1}`, name, email };
    
    // Add user to "database" (would happen on server in real app)
    DEMO_USERS.push({
      ...newUser,
      password: hashedPassword
    });
    
    // Set the user
    setUser(newUser);
    secureLocalStorage.setItem("user", newUser);
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully",
    });
    
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with that email
    const foundUser = DEMO_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      toast({
        title: "Reset failed",
        description: "Email not found in our system",
        variant: "destructive",
      });
      setIsLoading(false);
      throw new Error("Email not found");
    }
    
    // For demo purposes, "reset" the password to a known value
    const newHashedPassword = hashPassword("reset123");
    foundUser.password = newHashedPassword;
    
    toast({
      title: "Password reset",
      description: "Password reset email has been sent (demo mode)",
    });
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    secureLocalStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
