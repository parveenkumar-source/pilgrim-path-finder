import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(20, "Phone number too long").optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be under 200 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: MapPin, label: "Visit Us", value: "143201 Beas, Punjab, India" },
  { icon: Phone, label: "Call Us", value: "+91 98145 17648" },
  { icon: Mail, label: "Email Us", value: "sahiladwani@gmail.com" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat, 9 AM – 7 PM IST" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || "",
      subject: result.data.subject,
      message: result.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      return;
    }

    // Send email notification (fire-and-forget)
    supabase.functions.invoke("notify-contact", {
      body: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || "",
        subject: result.data.subject,
        message: result.data.message,
      },
    }).catch(console.error);

    toast({ title: "Message Sent! 🙏", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* Hero banner */}
      <section className="pt-24 pb-12 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[0.2em] uppercase text-sm mb-3"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-foreground/70 max-w-xl mx-auto"
          >
            Have questions about your pilgrimage? We're here to help you plan your sacred journey.
          </motion.p>
        </div>
      </section>

      {/* Map */}
      <section className="bg-card border-b border-border">
        <iframe
          title="Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27133.292541498!2d75.37!3d31.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a1f2bcbce5b1b%3A0x8cb15e98bcd1e32!2sBeas%2C%20Punjab%20143201!5e0!3m2!1sen!2sin!4v1700000000000"
          className="w-full h-64 md:h-80 border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Contact content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} />
                  {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" rows={5} placeholder="Tell us about your pilgrimage plans or questions..." value={form.message} onChange={(e) => handleChange("message", e.target.value)} />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button type="submit" className="rounded-full w-full sm:w-auto px-8" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" /> Sending...</span>
                ) : (
                  <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
                )}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
