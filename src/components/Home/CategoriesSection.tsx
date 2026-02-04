"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    UtensilsCrossed,
    Pizza,
    Salad,
    Fish,
    Beef,
    Cookie,
    Coffee,
    Soup,
} from "lucide-react";

interface Category {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    count: number;
}

const categories: Category[] = [
    { name: "Italian", icon: Pizza, color: "bg-red-100 text-red-600", count: 45 },
    { name: "Japanese", icon: Fish, color: "bg-blue-100 text-blue-600", count: 32 },
    { name: "American", icon: Beef, color: "bg-amber-100 text-amber-600", count: 58 },
    { name: "Healthy", icon: Salad, color: "bg-green-100 text-green-600", count: 29 },
    { name: "Desserts", icon: Cookie, color: "bg-pink-100 text-pink-600", count: 41 },
    { name: "Beverages", icon: Coffee, color: "bg-orange-100 text-orange-600", count: 23 },
    { name: "Asian", icon: Soup, color: "bg-purple-100 text-purple-600", count: 37 },
    { name: "All Cuisines", icon: UtensilsCrossed, color: "bg-primary/10 text-primary", count: 200 },
];

const CategoriesSection = () => {
    return (
        <section className="py-20 bg-muted/30">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary font-semibold tracking-wide uppercase text-sm">
                        Categories
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4">
                        Explore by Cuisine
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From Italian pasta to Japanese sushi, find your favorite cuisine from our wide selection of food categories.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/meals?category=${category.name.toLowerCase()}`}
                                className="group block p-6 rounded-2xl bg-background card-elevated text-center"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <category.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">{category.count} items</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
