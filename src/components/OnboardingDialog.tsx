
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isNewUser) {
      setOpen(true);
    }
  }, [user]);

  const handleSkip = () => {
    setOpen(false);
    completeOnboarding();
  };

  const handleSetupMedicalInfo = () => {
    setOpen(false);
    completeOnboarding();
    navigate("/medical-records");
  };

  if (!user?.isNewUser) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
            <Icons.medicalRecords className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome to Aid-On!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Let's set up your medical information for faster emergency response
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm mb-3">
            Setting up your medical profile helps:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">First responders get critical information faster</span>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Emergency guidance can be customized to your conditions</span>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">You can quickly access and share your medical details</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSkip} className="sm:order-1 order-2">
            Skip for now
          </Button>
          <Button onClick={handleSetupMedicalInfo} className="sm:order-2 order-1 bg-primary">
            <Icons.medicalRecords className="mr-2 h-4 w-4" />
            Set up medical profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingDialog;
