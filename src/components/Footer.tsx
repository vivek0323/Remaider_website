
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12">
      <div className="container flex justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart className="h-3 w-3 fill-reminder-400 text-reminder-400" /> using Lovable
        </p>
      </div>
    </footer>
  );
};

export default Footer;
