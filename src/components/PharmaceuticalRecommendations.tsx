
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Icons from "./Icons";

// Types for pharmaceutical products
interface PharmaceuticalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  urgency: "normal" | "recommended" | "critical";
}

interface PharmaceuticalRecommendationsProps {
  emergencyType?: string;
  guidance?: string;
  className?: string;
}

export function PharmaceuticalRecommendations({
  emergencyType,
  guidance,
  className,
}: PharmaceuticalRecommendationsProps) {
  const { toast } = useToast();
  const [cart, setCart] = useState<PharmaceuticalProduct[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Mock function to determine recommended pharmaceuticals based on the emergency
  const getRecommendedPharmaceuticals = (type?: string, guidanceText?: string): PharmaceuticalProduct[] => {
    // Default recommendations
    const defaultRecommendations: PharmaceuticalProduct[] = [
      {
        id: "basic-first-aid",
        name: "Basic First Aid Kit",
        description: "Essential supplies for treating minor injuries and emergencies",
        price: 29.99,
        category: "first-aid",
        urgency: "recommended",
      },
      {
        id: "pain-relief",
        name: "Pain Relief Medication",
        description: "Fast-acting pain relief for headaches, muscle pain, and minor injuries",
        price: 8.99,
        category: "medication",
        urgency: "normal",
      },
    ];

    // If we don't have specific emergency info, return default recommendations
    if (!type && !guidanceText) return defaultRecommendations;

    const lowerType = (type || "").toLowerCase();
    const lowerGuidance = (guidanceText || "").toLowerCase();

    // Specific recommendations based on emergency type
    if (lowerType.includes("burn") || lowerGuidance.includes("burn")) {
      return [
        {
          id: "burn-treatment",
          name: "Burn Treatment Gel",
          description: "Cooling gel with aloe vera for treating minor burns",
          price: 12.99,
          category: "medication",
          urgency: "critical",
        },
        {
          id: "gauze-pads",
          name: "Sterile Gauze Pads",
          description: "For covering burn wounds after applying medication",
          price: 6.49,
          category: "first-aid",
          urgency: "recommended",
        },
        ...defaultRecommendations,
      ];
    } else if (lowerType.includes("cut") || lowerType.includes("bleeding") || lowerGuidance.includes("bleeding")) {
      return [
        {
          id: "antiseptic",
          name: "Antiseptic Solution",
          description: "Prevents infection in cuts and wounds",
          price: 7.99,
          category: "medication",
          urgency: "critical",
        },
        {
          id: "bandages",
          name: "Adhesive Bandages (Assorted)",
          description: "Various sizes for covering cuts and scrapes",
          price: 5.49,
          category: "first-aid",
          urgency: "recommended",
        },
        ...defaultRecommendations,
      ];
    } else if (lowerType.includes("sprain") || lowerGuidance.includes("sprain") || lowerGuidance.includes("swelling")) {
      return [
        {
          id: "cold-pack",
          name: "Instant Cold Pack",
          description: "Reduces swelling and pain for sprains and strains",
          price: 4.99,
          category: "first-aid",
          urgency: "critical",
        },
        {
          id: "elastic-bandage",
          name: "Elastic Bandage Wrap",
          description: "Provides compression and support for sprains",
          price: 8.99,
          category: "first-aid",
          urgency: "recommended",
        },
        ...defaultRecommendations,
      ];
    } else if (lowerType.includes("allergy") || lowerGuidance.includes("allergy") || lowerGuidance.includes("allergic")) {
      return [
        {
          id: "antihistamine",
          name: "Antihistamine Tablets",
          description: "Relieves allergy symptoms",
          price: 11.99,
          category: "medication",
          urgency: "critical",
        },
        ...defaultRecommendations,
      ];
    }

    // Default to standard recommendations
    return defaultRecommendations;
  };

  const recommendations = getRecommendedPharmaceuticals(emergencyType, guidance);

  const addToCart = (product: PharmaceuticalProduct) => {
    setCart([...cart, product]);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
    toast({
      description: "Item removed from cart",
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout initiated",
      description: `Processing order for ${cart.length} items`,
    });
    // Here you would integrate with a payment processor or pharmacy API
    setCart([]);
    setShowCart(false);
  };

  const getUrgencyBadge = (urgency: "normal" | "recommended" | "critical") => {
    switch (urgency) {
      case "critical":
        return <Badge className="bg-emergency text-emergency-foreground">Critical</Badge>;
      case "recommended":
        return <Badge variant="secondary">Recommended</Badge>;
      default:
        return <Badge variant="outline">General</Badge>;
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
          Medical Supplies
          <Button
            variant="outline"
            size="sm"
            className="ml-auto relative"
            onClick={() => setShowCart(!showCart)}
          >
            <Icons.emergency className="h-4 w-4 mr-2" />
            Cart
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {cart.length}
              </Badge>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showCart ? (
          <div className="space-y-4">
            <h3 className="font-medium">Your Cart</h3>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Icons.close className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t flex justify-between">
                  <p className="font-medium">Total:</p>
                  <p className="font-medium">${cartTotal}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on the emergency situation, we recommend the following medical supplies:
            </p>
            <ul className="space-y-3">
              {recommendations.map((product) => (
                <li key={product.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{product.name}</h3>
                        {getUrgencyBadge(product.urgency)}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="font-medium">${product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 self-end"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {showCart && cart.length > 0 && (
        <CardFooter className="flex justify-end pt-0">
          <Button
            className="bg-emergency hover:bg-emergency-hover text-emergency-foreground"
            onClick={handleCheckout}
          >
            Checkout (${cartTotal})
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default PharmaceuticalRecommendations;
