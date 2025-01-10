import {
    motion,
    useScroll,
    useVelocity,
    useTransform,
    useSpring,
  } from "framer-motion";
  import React, { useRef } from "react";
  import { FiArrowDown } from "react-icons/fi";
  
  export const VelocityHero = () => {
    const targetRef = useRef(null);
  
    // Track scroll position
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start start", "end start"],
    });
  
    const scrollVelocity = useVelocity(scrollYProgress);
  
    // Apply skew and x movement based on scroll
    const skewXRaw = useTransform(scrollVelocity, [-1, 1], ["45deg", "-45deg"]);
    const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });
  
    const xRaw = useTransform(scrollYProgress, [0, 1], [0, -3000]);
    const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });
  
    // Fade in bottom content as we scroll
    const fadeInContent = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  
    return (
      <section
        ref={targetRef}
        className="relative h-[500vh] bg-gradient-to-br from-green-900 via-gray-800 to-black text-neutral-50"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden">
          <Nav />
          <CenterCopy />
  
          {/* Scrollable Text */}
          <motion.p
            style={{ skewX, x }}
            className="origin-bottom-left whitespace-nowrap text-7xl font-black uppercase leading-[0.85] md:text-9xl md:leading-[0.85]"
          >
            Trade smarter. <br /> HODL longer. <br /> Secure your crypto future.
          </motion.p>
  
          <ScrollArrow />
        </div>
  
        {/* Bottom Pop-up Content */}
       
      </section>
    );
  };
  
  const Nav = () => {
    return (
      <div className="relative mb-1 flex w-full justify-between p-6">
        {/* Empty Nav: No Links */}
      </div>
    );
  };
  
  const CenterCopy = () => {
    return (
      <div className="flex items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-neutral-400 sm:text-5xl md:text-7xl">
          Life is short. <br />
          Don't waste it. <br />
          It's time to{" "}
          <span className="inline-block -skew-x-[18deg] font-black text-neutral-50">
            HODL.
          </span>
        </h1>
      </div>
    );
  };
  
  const ScrollArrow = () => {
    return (
      <>
        <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 text-xs lg:block">
          <span style={{ writingMode: "vertical-lr" }} className="text-neutral-400">
            SCROLL
          </span>
          <FiArrowDown className="mx-auto" />
        </div>
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs lg:block">
          <span style={{ writingMode: "vertical-lr" }} className="text-neutral-400">
            SCROLL
          </span>
          <FiArrowDown className="mx-auto" />
        </div>
      </>
    );
  };
  