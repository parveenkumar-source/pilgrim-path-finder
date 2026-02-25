import { motion } from "framer-motion";
import { Clock, Users, Star, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    title: "Char Dham Yatra",
    duration: "12 Days",
    price: "₹25,999",
    rating: 4.9,
    groupSize: "15-20",
    highlights: ["Yamunotri", "Gangotri", "Kedarnath", "Badrinath"],
    featured: true,
  },
  {
    title: "Varanasi & Prayagraj",
    duration: "5 Days",
    price: "₹8,499",
    rating: 4.8,
    groupSize: "10-25",
    highlights: ["Ganga Aarti", "Kashi Vishwanath", "Sangam", "Sarnath"],
    featured: false,
  },
  {
    title: "South India Temple Tour",
    duration: "8 Days",
    price: "₹15,999",
    rating: 4.7,
    groupSize: "10-20",
    highlights: ["Tirupati", "Madurai Meenakshi", "Rameshwaram", "Kanyakumari"],
    featured: false,
  },
];

const PackagesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-saffron tracking-[0.2em] uppercase text-sm mb-3">
            Curated Journeys
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Travel Packages
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Carefully crafted pilgrimage packages with comfortable accommodation,
            guided tours, and hassle-free transportation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`rounded-2xl border p-6 relative overflow-hidden transition-shadow hover:shadow-xl ${
                pkg.featured
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card"
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-body text-xs px-3 py-1 rounded-full font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                {pkg.title}
              </h3>

              <div className="flex items-center gap-4 mb-5 font-body text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {pkg.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {pkg.groupSize}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  {pkg.rating}
                </span>
              </div>

              <div className="mb-6">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Highlights
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-secondary text-secondary-foreground font-body text-xs px-3 py-1 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between mt-auto">
                <div>
                  <p className="font-body text-xs text-muted-foreground">Starting from</p>
                  <p className="font-display text-3xl font-bold text-foreground flex items-center">
                    {pkg.price}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">per person</p>
                </div>
                <Button className="rounded-full font-body">
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
