import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Phone, Info, CreditCard } from "lucide-react";
import { useState } from "react";
import logo from '../assets/logo.png'

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About Us", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
    { path: "/payment", label: "Payment Info", icon: CreditCard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 xs:w-14 xs:h-14 sm:w-14 sm:h-14 lg:w-14 lg:h-14 transform transition-transform duration-200 ease-in-out hover:scale-110"
            />
            <span className="text-xl font-bold text-foreground">DealHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  asChild
                >
                  <Link to={item.path} className="gap-2">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    asChild
                    className="justify-start gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
