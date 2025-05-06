import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import bcryptjs from "bcryptjs";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Default admin account - preserved for demo purposes
const ADMIN_EMAIL = "test@example.com";
const ADMIN_PASSWORD_HASH = "$2a$10$xLpS1PpKiA.PSIakR0LwkeOwhWv7ehwxaOq.B4DS7mWq69wDZ8j0G"; // hashed 'password123'

// Store users in localStorage with secure practices
const getStoredUsers = (): Array<{id: string; name: string; email: string; passwordHash: string; role?: "user" | "admin"}> => {
  const users = localStorage.getItem("secure_users");
  if (!users) {
    // Initialize with admin user if no users exist
    const initialUsers = [
      {
        id: "1",
        name: "Test User",
        email: ADMIN_EMAIL,
        passwordHash: ADMIN_PASSWORD_HASH,
        role: "admin" as const
      }
    ];
    localStorage.setItem("secure_users", JSON.stringify(initialUsers));
    return initialUsers;
  }
  
  try {
    return JSON.parse(users);
  } catch (e) {
    console.error("Failed to parse users from localStorage");
    return [];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session token
    const sessionToken = localStorage.getItem("auth_session");
    
    if (sessionToken) {
      try {
        // Validate session token (in a real app this would verify with backend)
        const parsedToken = JSON.parse(sessionToken);
        const expiresAt = new Date(parsedToken.expiresAt);
        
        // Check if token is expired
        if (expiresAt > new Date()) {
          // In a real app, we would validate this token with the server
          setUser({
            id: parsedToken.userId,
            name: parsedToken.name,
            email: parsedToken.email,
            role: parsedToken.role || "user"
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem("auth_session");
        }
      } catch (e) {
        // Invalid token format
        localStorage.removeItem("auth_session");
      }
    }
    
    // Initialize users if not already done
    getStoredUsers();
    setIsLoading(false);
  }, []);

  // Helper to create secure session
  const createSession = (user: { id: string; name: string; email: string; role?: "user" | "admin" }) => {
    // Create session expiring in 24 hours
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    localStorage.setItem("auth_session", JSON.stringify(session));
    
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user"
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Special case for admin login - keep this for demo purposes
      if (email === ADMIN_EMAIL) {
        const isValidPassword = await bcryptjs.compare(password, ADMIN_PASSWORD_HASH);
        
        if (isValidPassword) {
          const adminUser = {
            id: "1",
            name: "Test User",
            email: ADMIN_EMAIL,
            role: "admin" as const
          };
          
          createSession(adminUser);
          
          toast({
            title: "Welcome back, Admin!",
            description: `Logged in as ${adminUser.name}`,
          });
          
          setIsLoading(false);
          return;
        }
      }
      
      // Regular user authentication
      const users = getStoredUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Verify password securely
      const isValidPassword = await bcryptjs.compare(password, foundUser.passwordHash);
      
      if (!isValidPassword) {
        throw new Error("Invalid email or password");
      }
      
      // Create secure session
      createSession({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      });
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${foundUser.name}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      // Generate strong password hash
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        passwordHash,
        role: "user" as const
      };
      
      // Save user to localStorage
      const updatedUsers = [...users, newUser];
      localStorage.setItem("secure_users", JSON.stringify(updatedUsers));
      
      // Create session for new user
      createSession({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const users = getStoredUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error("Email not found");
      }
      
      // This is for demo purposes only
      // In a real app, you would:
      // 1. Generate a secure reset token
      // 2. Send an email with a reset link
      // 3. Handle token verification and password reset in separate flow
      
      // For demo, reset the admin password to known value
      if (email === ADMIN_EMAIL) {
        foundUser.passwordHash = ADMIN_PASSWORD_HASH; // Reset to 'password123'
      } else {
        // Generate temporary password and update hash
        const tempPassword = "reset123";
        const salt = await bcryptjs.genSalt(10);
        foundUser.passwordHash = await bcryptjs.hash(tempPassword, salt);
      }
      
      // Update users in storage
      localStorage.setItem("secure_users", JSON.stringify(users));
      
      toast({
        title: "Password reset",
        description: "Password reset email has been sent (demo mode)",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove session
    localStorage.removeItem("auth_session");
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Check if user is admin
  const isAdmin = !!user?.role && user.role === "admin";

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
        isAdmin
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
