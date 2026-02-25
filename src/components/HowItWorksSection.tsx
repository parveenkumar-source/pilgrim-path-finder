import { motion } from "framer-motion";
import { Search, CalendarCheck, MapPinned, Smile } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore Destinations",
    description: "Browse our curated list of sacred pilgrimage sites across India.",
  },
  {
    icon: CalendarCheck,
    title: "Choose a Package",
    description: "Select a travel package that fits your schedule and budget.",
  },
  {
    icon: MapPinned,
    title: "Book Your Trip",
    description: "Complete your booking online with secure payment options.",
  },
  {
    icon: Smile,
    title: "Begin Your Yatra",
    description: "Embark on your spiritual journey with everything taken care of.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-saffron tracking-[0.2em] uppercase text-sm mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 relative">
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-body font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
