
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onLogout: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onLogout }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <Icons.medicalRecords className="mr-2 h-6 w-6" />
          {title}
        </h1>
        
        <div className="flex items-center space-x-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center">
              <Icons.back className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center">
            <Icons.logout className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
};

export default PageHeader;
