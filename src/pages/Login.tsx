
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Icons from "@/components/Icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biometricActive, setBiometricActive] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if biometric auth is available in this browser
    const isBiometricAvailable = 
      window.PublicKeyCredential && 
      typeof window.PublicKeyCredential === 'function';
    
    setBiometricActive(!!isBiometricAvailable);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricAuth = async () => {
    // This is a mock biometric authentication
    // In a real app, this would use the Web Authentication API
    setBiometricActive(true);
    setIsSubmitting(true);
    
    try {
      // Simulate biometric scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Auto-fill demo credentials
      setEmail("test@example.com");
      setPassword("password123");
      
      // Wait a moment then submit
      await new Promise(resolve => setTimeout(resolve, 500));
      await login("test@example.com", "password123");
      navigate("/");
    } catch (error) {
      console.error("Biometric auth error:", error);
    } finally {
      setIsSubmitting(false);
      setBiometricActive(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Icons.emergency className="h-10 w-10 text-emergency" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {biometricActive && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="group relative p-4 rounded-full border border-muted-foreground/20 hover:border-primary/50 transition-colors"
                >
                  <div className={`fingerprint-scanner w-12 h-12 rounded-full relative overflow-hidden ${isSubmitting ? 'scanning' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 fingerprint-pattern"></div>
                    {isSubmitting && (
                      <div className="absolute inset-0 bg-primary/10 scan-line"></div>
                    )}
                  </div>
                  <style>
                    {`
                    .fingerprint-pattern {
                      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50,15 C30,15 15,30 15,50 C15,70 30,85 50,85 C70,85 85,70 85,50 C85,30 70,15 50,15 Z M50,75 C35,75 25,65 25,50 C25,35 35,25 50,25 C65,25 75,35 75,50 C75,65 65,75 50,75 Z M50,65 C40,65 35,60 35,50 C35,40 40,35 50,35 C60,35 65,40 65,50 C65,60 60,65 50,65 Z M50,55 C45,55 45,55 45,50 C45,45 45,45 50,45 C55,45 55,45 55,50 C55,55 55,55 50,55 Z' fill='%23000' fill-opacity='0.1'/%3E%3C/svg%3E");
                      background-size: cover;
                      transform: scale(1.5);
                    }
                    .scanning .fingerprint-pattern {
                      animation: pulse 2s infinite;
                    }
                    .scan-line {
                      height: 2px;
                      background: linear-gradient(to right, transparent, hsl(var(--primary)) 40%, hsl(var(--primary)) 60%, transparent);
                      box-shadow: 0 0 8px 2px hsl(var(--primary)/0.4);
                      animation: scan 2s ease-in-out infinite;
                    }
                    @keyframes scan {
                      0% { top: 0; }
                      50% { top: 100%; }
                      100% { top: 0; }
                    }
                    @keyframes pulse {
                      0% { opacity: 0.5; }
                      50% { opacity: 1; }
                      100% { opacity: 0.5; }
                    }
                    `}
                  </style>
                </button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
        <div className="px-6 pb-6 text-xs text-center text-muted-foreground">
          <p>For demo purposes, use:</p>
          <p>Email: test@example.com / Password: password123</p>
          <p>After password reset: password is 'reset123'</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
