"use client";

import type { Variants } from "motion/react";

import { toast } from "@pheralb/toast";
import { motion, useAnimation } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { SparkleCard } from "./sparkleCard";
import { Github } from "@/ui/icons";
import ExternalLink from "@/ui/externalLink";
import { Button, buttonVariants } from "@/ui/button";

const sparkleVariants: Variants = {
  initial: {
    y: 0,
    fill: "none",
  },
  hover: {
    y: [0, -1, 0, 0],
    fill: "currentColor",
    transition: {
      duration: 1,
      bounce: 0.3,
    },
  },
};

const starVariants: Variants = {
  initial: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  blink: () => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 70,
      damping: 10,
      mass: 0.4,
    },
  }),
};

const RenderToastAnimation = () => {
  const starControls = useAnimation();
  const sparkleControls = useAnimation();

  return (
    <Button
      variant="default"
      className="w-full md:w-40"
      onClick={() =>
        toast.default({
          text: "pheralb/toast",
          description: "✨ A beautiful toast library for React"
        })
      }
      onMouseEnter={() => {
        sparkleControls.start("hover");
        starControls.start("blink", { delay: 1 });
      }}
      onMouseLeave={() => {
        sparkleControls.start("initial");
        starControls.start("initial");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          variants={sparkleVariants}
          animate={sparkleControls}
        />
        <motion.path
          d="M20 3v4"
          variants={starVariants}
          animate={starControls}
        />
        <motion.path
          d="M22 5h-4"
          variants={starVariants}
          animate={starControls}
        />
        <motion.path
          d="M4 17v2"
          variants={starVariants}
          animate={starControls}
        />
        <motion.path
          d="M5 18H3"
          variants={starVariants}
          animate={starControls}
        />
      </svg>
      <span>Render a toast</span>
    </Button>
  );
};

const Hero = () => {
  return (
    <SparkleCard
      className="rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      useBottomDivider={false}
    >
      <div className="animate-in fade-in-30 slide-in-from-bottom-2 mb-4 flex flex-col space-y-1 duration-500">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Toast</h1>
        <p className="font-medium text-neutral-500 dark:text-neutral-400">
          An accessible and beautiful toast library for React.
        </p>
      </div>
      <div className="animate-in fade-in-40 flex flex-col items-center space-y-2 duration-700 md:flex-row md:space-x-2 md:space-y-0">
        <RenderToastAnimation />
        <ExternalLink
          title="View on GitHub"
          href="https://github.com/pheralb/toast"
          className={buttonVariants({
            variant: "outline",
            className: "w-full no-underline md:w-44",
          })}
        >
          <div className="flex items-center space-x-2">
            <Github height={14} />
            <span>View on GitHub</span>
          </div>
          <ArrowUpRight size={12} />
        </ExternalLink>
      </div>
    </SparkleCard>
  );
};

export default Hero;
