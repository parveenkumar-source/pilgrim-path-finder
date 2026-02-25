import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import destVaranasi from "@/assets/dest-varanasi.jpg";
import destAmritsar from "@/assets/dest-amritsar.jpg";
import destTirupati from "@/assets/dest-tirupati.jpg";
import destKedarnath from "@/assets/dest-kedarnath.jpg";

const destinations = [
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: destVaranasi,
    rating: 4.9,
    description: "The spiritual capital of India on the banks of the holy Ganges.",
  },
  {
    name: "Golden Temple",
    state: "Punjab",
    image: destAmritsar,
    rating: 4.9,
    description: "The holiest Gurdwara and most important pilgrimage site of Sikhism.",
  },
  {
    name: "Tirupati",
    state: "Andhra Pradesh",
    image: destTirupati,
    rating: 4.8,
    description: "Home to the world-famous Sri Venkateswara Temple on Tirumala hills.",
  },
  {
    name: "Kedarnath",
    state: "Uttarakhand",
    image: destKedarnath,
    rating: 4.9,
    description: "A sacred Jyotirlinga nestled amidst the majestic Himalayan peaks.",
  },
];

const DestinationsSection = () => {
  return (
    <section className="py-24 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-saffron tracking-[0.2em] uppercase text-sm mb-3">
            Sacred Places
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Popular Destinations
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Explore the most revered pilgrimage sites across India, each holding centuries of 
            spiritual significance and divine blessings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-4">
                <img
                  src={dest.image}
                  alt={`${dest.name} pilgrimage destination`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-body text-sm text-gold">{dest.rating}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-cream/70 text-sm font-body mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {dest.state}
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed px-1">
                {dest.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
