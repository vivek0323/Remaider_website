
import { AlarmClock } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6">
      <div className="container flex justify-center items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-reminder-100 relative animate-ping-slow">
            <AlarmClock className="h-6 w-6 text-reminder-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-reminder-600 to-reminder-800 bg-clip-text text-transparent">
            Remind Me Later
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
