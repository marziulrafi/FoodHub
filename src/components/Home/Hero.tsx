"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Star, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import heroBurger from "../../../public/assets/hero-burger.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-pattern">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-2xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              <Star className="w-4 h-4 fill-primary" />
              <span>#1 Food Delivery Platform</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Delicious Food,
              <br />
              <span className="text-gradient">Delivered Fast</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover the best meals from top-rated local restaurants and food
              providers. Fresh, fast, and delivered right to your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/meals">
                <button className="group inline-flex items-center justify-center h-14 px-10 rounded-xl bg-primary text-primary-foreground text-lg font-semibold transition hover:bg-primary/90 hover:shadow-glow">
                  Explore Meals
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>

              <Link href="/register">
                <button className="inline-flex items-center justify-center h-14 px-10 rounded-xl border-2 border-primary bg-transparent text-primary text-lg font-semibold transition hover:bg-primary hover:text-primary-foreground">
                  Become a Provider
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-xl">30 Min</p>
                  <p className="text-sm text-muted-foreground">Fast Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-xl">4.9★</p>
                  <p className="text-sm text-muted-foreground">User Rating</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-xl">24/7</p>
                  <p className="text-sm text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <Image
                  src={heroBurger}
                  alt="Delicious burger"
                  className="object-cover"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-overlay-gradient" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-background shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      On orders over $20
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Rating Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-4 -right-4 p-3 rounded-2xl bg-background shadow-elevated"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-golden-yellow text-golden-yellow" />
                  <span className="font-bold">4.9</span>
                  <span className="text-sm text-muted-foreground">(2.5k+)</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
