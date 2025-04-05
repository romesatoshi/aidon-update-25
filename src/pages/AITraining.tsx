import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useEmergencyData from "@/hooks/useEmergencyData";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Icons from "@/components/Icons";
import AIMetricsChart from "@/components/ai-training/AIMetricsChart";
import TrainingDataForm, { TrainingData } from "@/components/ai-training/TrainingDataForm";
import ValidationDialog from "@/components/ai-training/ValidationDialog";
import { Badge } from "@/components/ui/badge";

const AITraining = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { data, loading } = useEmergencyData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "completed">("idle");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.79,
    f1Score: 0.80
  });
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<null | {
    accuracy: number;
    precision: number;
    recall: 0.79,
    f1Score: 0.80
  }>(null);

  const handleValuesChange = (field: string, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [field]: parseFloat(value.toFixed(2))
    }));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    // Load any saved training data from localStorage
    const savedTrainingData = localStorage.getItem('aiTrainingData');
    if (savedTrainingData) {
      try {
        setTrainingData(JSON.parse(savedTrainingData));
      } catch (error) {
        console.error('Failed to parse training data:', error);
      }
    }
  }, [isAuthenticated, navigate]);

  // Save training data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('aiTrainingData', JSON.stringify(trainingData));
  }, [trainingData]);

  const startTraining = () => {
    if (trainingData.length === 0 && data.history.length === 0) {
      toast({
        title: "No Training Data",
        description: "Please add at least one training scenario before starting the training process.",
        variant: "destructive",
      });
      setActiveTab("data");
      return;
    }

    setTrainingStatus("training");
    setTrainingProgress(0);
    
    // Count validated entries
    const validatedEntries = trainingData.filter(entry => entry.validated).length;
    
    // Simulate actual training process with realistic steps
    let step = 0;
    const totalSteps = 5; // Preprocessing, training, evaluation, optimization, saving
    const stepMessages = [
      "Preprocessing and validating training data...",
      "Training model with validated scenarios...",
      "Evaluating model performance...",
      "Optimizing model parameters...",
      "Saving and finalizing model..."
    ];
    
    const interval = setInterval(() => {
      step++;
      const progress = (step / totalSteps) * 100;
      
      setTrainingProgress(progress);
      
      if (step <= totalSteps) {
        toast({
          title: `Training Step ${step}/${totalSteps}`,
          description: stepMessages[step - 1],
        });
      }
      
      if (step >= totalSteps) {
        clearInterval(interval);
        setTrainingStatus("completed");
        
        // Calculate improvement based on amount of training data and validation
        const dataPoints = validatedEntries + Math.min(data.history.length, 5);
        const validationBonus = validatedEntries > 0 ? validatedEntries * 0.005 : 0;
        const improvementFactor = Math.min(0.1, dataPoints * 0.01 + validationBonus);
        
        // Calculate new metrics
        const newMetrics = {
          accuracy: Math.min(0.98, metrics.accuracy + improvementFactor),
          precision: Math.min(0.97, metrics.precision + improvementFactor),
          recall: Math.min(0.95, metrics.recall + improvementFactor * 1.1),
          f1Score: Math.min(0.96, metrics.f1Score + improvementFactor * 0.9)
        };
        
        // Update metrics
        setMetrics(newMetrics);
        setLatestMetrics(newMetrics);
        
        toast({
          title: "Training Completed",
          description: `The AI model has been successfully trained with ${dataPoints} scenarios. Performance improved by ${(improvementFactor * 100).toFixed(1)}%.`,
        });
      }
    }, 1200);
  };

  const handleAddTrainingData = (data: TrainingData) => {
    setTrainingData((prevData) => [...prevData, data]);
    toast({
      title: "Training Data Added",
      description: "Your custom emergency scenario has been added to the training dataset.",
    });
  };

  const removeTrainingData = (index: number) => {
    setTrainingData((prevData) => prevData.filter((_, i) => i !== index));
    toast({
      title: "Training Data Removed",
      description: "The scenario has been removed from the training dataset.",
    });
  };
  
  const validateTrainingData = (id: string, isValid: boolean, correctedGuidance?: string) => {
    setTrainingData(prevData => prevData.map(item => {
      if (item.timestamp === id) {
        const updatedItem = { 
          ...item, 
          validated: isValid,
          confidence: isValid ? 0.9 : 0.3
        };
        
        if (correctedGuidance) {
          updatedItem.expectedGuidance = correctedGuidance;
        }
        
        return updatedItem;
      }
      return item;
    }));
    
    toast({
      title: isValid ? "Scenario Validated" : "Scenario Rejected",
      description: isValid 
        ? "This scenario has been validated and will be used for AI training." 
        : "This scenario has been rejected or modified and will need review.",
    });
  };

  const exportTrainingData = () => {
    // Create a JSON blob and trigger download
    const dataStr = JSON.stringify(trainingData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "aid-on-training-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Training data exported as JSON file."
    });
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <Icons.brain className="mr-2 h-6 w-6 text-primary" />
            Aid-On AI Training Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Train and monitor the performance of the emergency guidance AI
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
          <Icons.home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Training Data</TabsTrigger>
          <TabsTrigger value="model">Model Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.accuracy * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +{((metrics.accuracy - 0.85) * 100).toFixed(1)}% from baseline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.precision * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +{((metrics.precision - 0.82) * 100).toFixed(1)}% from baseline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recall</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.recall * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +{((metrics.recall - 0.79) * 100).toFixed(1)}% from baseline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.f1Score * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +{((metrics.f1Score - 0.80) * 100).toFixed(1)}% from baseline
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Model performance over the past training cycles
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AIMetricsChart latestMetrics={latestMetrics} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Status</CardTitle>
              <CardDescription>
                {trainingStatus === "idle" ? 
                  `Ready to train with ${trainingData.length + Math.min(data.history.length, 5)} scenarios` : 
                  trainingStatus === "training" ? "Training in progress..." : 
                  "Training completed"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={trainingProgress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                {trainingProgress.toFixed(0)}% complete
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Validated scenarios:</span>
                  <span className="font-medium">{trainingData.filter(d => d.validated).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending validation:</span>
                  <span className="font-medium">{trainingData.filter(d => d.validated === false || d.validated === undefined).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>User history entries:</span>
                  <span className="font-medium">{Math.min(data.history.length, 5)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={startTraining}
                disabled={trainingStatus === "training"}
                className="flex items-center gap-2"
              >
                <Icons.refresh className="h-4 w-4" />
                {trainingStatus === "completed" ? "Retrain Model" : "Start Training"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={exportTrainingData}
                disabled={trainingData.length === 0}
                className="flex items-center gap-2"
              >
                <Icons.download className="h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Training Data</CardTitle>
              <CardDescription>
                Create custom emergency scenarios to improve AI responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingDataForm onSubmit={handleAddTrainingData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Dataset</CardTitle>
              <CardDescription>
                Current emergency scenarios used for training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of your emergency training data</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Guidance</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingData.map((entry, index) => (
                    <TableRow key={`custom-${index}`}>
                      <TableCell className="font-medium">
                        {entry.emergencyScenario}
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">{entry.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{entry.expectedGuidance}</TableCell>
                      <TableCell>
                        {entry.validated ? (
                          <Badge className="bg-green-500">Validated</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <ValidationDialog 
                            trainingData={entry} 
                            onValidate={validateTrainingData} 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeTrainingData(index)}
                            className="h-8 w-8"
                          >
                            <Icons.trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.history.slice(0, 5).map((entry, index) => (
                    <TableRow key={`history-${index}`}>
                      <TableCell className="font-medium">{entry.emergency}</TableCell>
                      <TableCell className="max-w-md truncate">{entry.guidance}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500">User Query</Badge>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                  
                  <TableRow>
                    <TableCell className="font-medium">Severe Allergic Reaction</TableCell>
                    <TableCell className="max-w-md truncate">Look for signs of anaphylaxis. If available, help them use their epinephrine auto-injector. Call emergency services immediately.</TableCell>
                    <TableCell>Expert</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Diabetic Emergency</TableCell>
                    <TableCell className="max-w-md truncate">If conscious and able to swallow, give them sugar. If unconscious, place in recovery position and call emergency services.</TableCell>
                    <TableCell>Expert</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="model" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
              <CardDescription>
                Advanced settings for the AI model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model Version</label>
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>Aid-On Model v1.2.4</span>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Training Mode</label>
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>Supervised Learning</span>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Collection</label>
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>Enabled</span>
                      <Button variant="outline" size="sm">Disable</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expert Validation</label>
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>Required</span>
                      <Button variant="outline" size="sm">Optional</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export/Import Model</CardTitle>
              <CardDescription>
                Transfer your model between environments
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Icons.download className="h-4 w-4" />
                Export Model
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Icons.upload className="h-4 w-4" />
                Import Model
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITraining;
