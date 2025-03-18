
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import Icons from "./Icons";
import { useLanguage } from "@/contexts/LanguageContext";

interface GuidanceDisplayProps {
  guidance: string;
  onReset: () => void;
  className?: string;
}

export function GuidanceDisplay({ guidance, onReset, className }: GuidanceDisplayProps) {
  const { isSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();
  const { t } = useLanguage();

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(guidance);
    }
  };

  if (!guidance) return null;

  return (
    <Card className={cn("animate-scale-in border-l-4 border-l-primary", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Icons.emergency className="mr-2 h-5 w-5 text-emergency" />
          {t('emergency.guidance.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-balance">{guidance}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2 border-t">
        <p className="text-sm text-muted-foreground w-full">
          <strong className="font-medium">{t('emergency.guidance.important')}</strong> {t('emergency.guidance.call')}
        </p>
        <p className="text-sm text-muted-foreground w-full">
          <strong className="font-medium">{t('emergency.guidance.qrcode.title')}</strong> {t('emergency.guidance.qrcode.scan')}
        </p>
        <div className="flex gap-2 w-full justify-end">
          {isSupported && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpeak}
              className={cn(isSpeaking && "bg-primary/10")}
            >
              <Icons.voice className="mr-1 h-4 w-4" />
              {isSpeaking ? t('emergency.guidance.stop') : t('emergency.guidance.speak')}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
          >
            <Icons.reset className="mr-1 h-4 w-4" />
            {t('emergency.guidance.new')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default GuidanceDisplay;
