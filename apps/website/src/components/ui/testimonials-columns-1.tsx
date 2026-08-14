"use client";
import React from "react";
import { motion } from "motion/react";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Array<{
    text: string;
    image: string;
    name: string;
    role: string;
  }>;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-3 sm:gap-4 md:gap-6 pb-3 sm:pb-4 md:pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-4 sm:p-6 md:p-10 border shadow-lg shadow-primary/10 max-w-[200px] sm:max-w-[260px] md:max-w-xs w-full" key={i}>
                  <div className="text-[10px] sm:text-xs md:text-sm leading-relaxed italic">{text}</div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-4 md:mt-5">
                    {image ? (
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] sm:text-xs md:text-sm font-medium">
                        {getInitials(name)}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-4 sm:leading-5 text-xs sm:text-sm md:text-base">{name}</div>
                      <div className="leading-4 sm:leading-5 opacity-60 tracking-tight text-[10px] sm:text-xs md:text-sm">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
