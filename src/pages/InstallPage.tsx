import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>App Installed!</CardTitle>
            <CardDescription>
              Counter Sales Analytics is now installed on your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Open Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Install Counter Sales Analytics</CardTitle>
          <CardDescription>
            Get the full app experience with offline support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {deferredPrompt && (
            <Button onClick={handleInstall} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
          )}

          {isIOS && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">iOS Installation</p>
                  <ol className="mt-2 space-y-1 text-muted-foreground list-decimal list-inside">
                    <li>Tap the Share button in Safari</li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to confirm</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {!isIOS && !deferredPrompt && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Monitor className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Desktop Installation</p>
                  <p className="text-muted-foreground mt-1">
                    Look for the install icon in your browser's address bar, or use the browser menu to install this app.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Android Installation</p>
                  <p className="text-muted-foreground mt-1">
                    Tap the browser menu and select "Install app" or "Add to Home screen".
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Benefits of installing:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Works offline with your data</li>
              <li>• Faster loading times</li>
              <li>• Full-screen experience</li>
              <li>• Quick access from home screen</li>
            </ul>
          </div>

          <Button variant="outline" onClick={() => navigate("/")} className="w-full">
            Continue in Browser
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPage;
