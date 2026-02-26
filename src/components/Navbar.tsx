import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Destinations", href: "/#destinations" },
    { label: "Packages", href: "/packages" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-foreground/20 backdrop-blur-md border-b border-cream/10"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="font-display text-xl font-bold text-cream">
          🙏 PilgrimWay
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              {role === "admin" && (
                <Button size="sm" variant="outline" className="rounded-full font-body border-cream/30 text-cream hover:bg-cream/10 bg-transparent" onClick={() => navigate("/admin")}>
                  Admin Panel
                </Button>
              )}
              {role === "cleaner" && (
                <Button size="sm" variant="outline" className="rounded-full font-body border-cream/30 text-cream hover:bg-cream/10 bg-transparent" onClick={() => navigate("/cleaner")}>
                  My Tasks
                </Button>
              )}
              <Button size="sm" variant="outline" className="rounded-full font-body border-cream/30 text-cream hover:bg-cream/10 bg-transparent" onClick={() => navigate("/my-bookings")}>
                <User className="w-4 h-4 mr-1" /> My Bookings
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full font-body text-cream/70 hover:text-cream" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="sm" className="rounded-full font-body" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cream">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-foreground/95 backdrop-blur-md border-t border-cream/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="font-body text-cream/70 hover:text-gold py-2">
                {link.label}
              </a>
            ))}
            {user ? (
              <>
                {role === "admin" && <a href="/admin" className="font-body text-gold py-2">Admin Panel</a>}
                {role === "cleaner" && <a href="/cleaner" className="font-body text-gold py-2">My Tasks</a>}
                <a href="/my-bookings" className="font-body text-cream/70 hover:text-gold py-2">My Bookings</a>
                <button onClick={signOut} className="font-body text-cream/70 hover:text-gold py-2 text-left">Sign Out</button>
              </>
            ) : (
              <Button size="sm" className="rounded-full font-body w-fit" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>
                Sign In
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
