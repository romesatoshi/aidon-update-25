
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Icons from "@/components/Icons";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      setIsReset(true);
      toast({
        title: "Reset email sent",
        description: "For this demo, your password is now reset to 'reset123'",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset failed",
        description: "Please check your email address and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Icons.emergency className="h-10 w-10 text-emergency" />
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address to reset your password
          </CardDescription>
        </CardHeader>
        {!isReset ? (
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-800 dark:text-green-300 text-sm">
              <div className="flex items-center mb-2">
                <Icons.check className="h-5 w-5 mr-2" />
                <span className="font-medium">Password reset email sent!</span>
              </div>
              <p>Please check your inbox for instructions to reset your password.</p>
              <p className="mt-2">For this demo, your password has been reset to: <strong>reset123</strong></p>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate("/login")}
            >
              Return to Login
            </Button>
          </CardContent>
        )}
        <div className="px-6 pb-6 text-xs text-center text-muted-foreground">
          <p>For demo purposes, use:</p>
          <p>Email: test@example.com</p>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
