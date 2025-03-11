// ecommerce-platform/pages/about.tsx
"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function AboutUs() {
  const controlsStory = useAnimation();
  const controlsContact = useAnimation();
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [contactRef, contactInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (storyInView) {
      controlsStory.start("visible");
    }
    if (contactInView) {
      controlsContact.start("visible");
    }
  }, [controlsStory, storyInView, controlsContact, contactInView]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const teamHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      >
        <h1 className="text-5xl font-bold">About Elegant By D</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Crafting modern e-commerce experiences since 2025.
        </p>
      </motion.section>

      {/* Story Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">Our Story</h2>
        <motion.div
          ref={storyRef}
          initial="hidden"
          animate={controlsStory}
          variants={fadeIn}
          className="space-y-8 max-w-3xl mx-auto"
        >
          <p>
            Founded in 2025, Elegant By D started as a passion project to bring
            stylish, affordable products to everyone. From a small team, we’ve
            grown into a platform that empowers both customers and creators.
          </p>
          <p>
            Our mission? To blend technology with elegance, delivering seamless
            shopping experiences worldwide.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto py-16 bg-white">
        <h2 className="text-3xl font-semibold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Dushani Kannangara", role: "Founder", img: "/team/jane.jpg" },
            { name: "Samitha Kannangara", role: "Tech Lead", img: "/samitha.jpg" },
            { name: "Shanil Fonseka", role: "Designer", img: "/team/emily.jpg" },
          ].map((member) => (
            <motion.div
              key={member.name}
              variants={teamHover}
              initial="rest"
              whileHover="hover"
              className="text-center p-4 border rounded-lg shadow-sm"
            >
              <Image
                src={member.img}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-medium">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">Contact Us</h2>
        <motion.div
          ref={contactRef}
          initial="hidden"
          animate={controlsContact}
          variants={fadeIn}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <p className="text-lg">
            We’d love to hear from you! Reach out with any questions or feedback.
          </p>
          <div className="space-y-4">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@elegantbyd.com" className="text-blue-500 hover:underline">
                support@elegantbyd.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+947578800443" className="text-blue-500 hover:underline">
                +94 757 880 0443
              </a>
            </p>
            
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
          <Link href="/products">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Shop Now
          </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}