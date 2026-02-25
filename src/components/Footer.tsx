import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl font-bold text-gold mb-4">
              🙏 PilgrimWay
            </h3>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed">
              Your trusted companion for sacred journeys across India. We connect devotees 
              with divine destinations through seamless travel experiences.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm">
              {["Destinations", "Packages", "About Us", "Contact", "FAQs"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-semibold mb-4">Top Pilgrimages</h4>
            <ul className="space-y-2 font-body text-sm">
              {["Varanasi", "Golden Temple", "Tirupati", "Kedarnath", "Char Dham Yatra"].map((dest) => (
                <li key={dest}>
                  <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors">
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-start gap-2 text-primary-foreground/60">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                123 Pilgrim Road, New Delhi, India
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/60">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/60">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                info@pilgrimway.in
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/40 font-body text-sm">
            © 2026 PilgrimWay. All rights reserved. Made with devotion 🙏
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
