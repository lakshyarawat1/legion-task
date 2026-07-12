"use client";

import React from "react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Layout,
  Users,
  Zap,
  MessageSquareMore,
  ChevronDown,
  Check,
  Star,
  Code2,
  Figma,
  Github,
  Slack,
  Triangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ModeToggle } from "@/app/(components)/ModeToggle/ModeToggle";

export default function LandingPage() {
  const { isSignedIn } = useAuth();


  return (
    <div className="bg-background selection:bg-primary/30 relative min-h-screen overflow-hidden">
      {/* True WebGL Fluid Background */}
      <canvas className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70 mix-blend-multiply dark:opacity-40 dark:mix-blend-screen" />
      <Script src="/fluid.js?v=6" strategy="lazyOnload" />

      {/* Static ambient background overlay for texture */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 dark:opacity-[0.03] mix-blend-overlay" />

      {/* Navbar Placeholder */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/app-logo-light.png"
            alt="LegionTask Logo Light"
            width={40}
            height={40}
            priority={true}
            className="shadow-primary/20 rounded-xl shadow-lg dark:hidden"
          />
          <Image
            src="/app-logo-dark.png"
            alt="LegionTask Logo Dark"
            width={40}
            height={40}
            priority={true}
            className="shadow-primary/20 hidden rounded-xl shadow-lg dark:block"
          />
          <span className="text-foreground text-xl font-bold tracking-tight">
            LegionTask
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors hidden sm:block">
            Pricing
          </Link>
          <ModeToggle />
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button className="hover:shadow-primary/25 rounded-full px-6 shadow-lg transition-all">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hidden sm:flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="hover:shadow-primary/25 rounded-full px-6 shadow-lg transition-all">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-8 pt-20 pb-12">
        {/* Hero Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center space-y-8 text-center duration-1000">
          <div className="border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-xl shadow-lg">
            <span className="bg-primary mr-2 flex h-2 w-2 animate-pulse rounded-full"></span>
            LegionTask 2.0 is now live
          </div>

          <h1 className="text-foreground max-w-4xl text-5xl leading-[1.1] font-extrabold tracking-tighter md:text-7xl">
            Manage your team&apos;s work with{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              effortless clarity.
            </span>
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            The premium project management tool designed for modern teams. Track
            tasks, balance workloads, and ship faster in a beautiful,
            distraction-free environment.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="hover:shadow-primary/30 group h-14 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="hover:shadow-primary/30 group h-14 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1"
                >
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full px-8 text-base shadow-sm transition-all hover:-translate-y-1 bg-transparent border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Hero Image/Mockup */}
          <div className="relative mt-20 w-full max-w-5xl">
            <div className="from-background absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent pointer-events-none" />
            <motion.div 
               className="border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/20 overflow-hidden rounded-3xl border p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-3xl"
            >
              <div className="border-black/5 dark:border-white/10 bg-background/80 relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border backdrop-blur-md">
                {/* Mock UI Representation */}
                <div className="absolute inset-0 flex flex-col" style={{ transform: "translateZ(30px)" }}>
                  <div className="border-border flex h-12 items-center gap-2 border-b px-4">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="flex flex-1 gap-6 overflow-hidden p-6">
                    {/* Column 1: To Do */}
                    <div className="bg-black/5 dark:bg-black/5 dark:bg-white/5 flex flex-1 flex-col gap-4 rounded-2xl p-4 border border-black/5 dark:border-white/5 backdrop-blur-md">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-foreground text-sm font-semibold">
                          To Do
                        </span>
                        <span className="bg-foreground/10 text-foreground/70 rounded-full px-2 py-0.5 text-xs font-medium">
                          2
                        </span>
                      </div>

                      {/* TaskCard Mock 1 */}
                      <motion.div
                        drag
                        dragSnapToOrigin
                        whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50, rotate: -2 }}
                        whileHover={{ cursor: "grab" }}
                        className="bg-black/5 dark:bg-black/5 dark:bg-white/10 relative z-10 mb-4 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl border border-black/5 dark:border-black/5 dark:border-white/10 backdrop-blur-xl"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex flex-1 flex-wrap items-center gap-2">
                            <div className="rounded-full bg-red-200 px-2 py-1 text-xs font-semibold text-red-700">
                              Urgent
                            </div>
                            <div className="flex gap-2">
                              <div className="bg-secondary text-foreground rounded-full px-2 py-1 text-xs">
                                Design
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-3 flex justify-between">
                          <h4 className="text-md text-foreground font-bold">
                            Design System 2.0
                          </h4>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          <span>10/12/2026 - 10/15/2026</span>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Complete overhaul of the core UI components for dark
                          mode.
                        </p>
                        <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                          <div className="flex -space-x-[6px] overflow-hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-purple-500 to-blue-500 text-[10px] font-bold text-white dark:border-black">
                              AL
                            </div>
                          </div>
                          <div className="text-muted-foreground flex items-center">
                            <MessageSquareMore className="mr-1 h-4 w-4" />
                            <span className="text-sm dark:text-neutral-400">
                              3
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* TaskCard Mock 2 */}
                      <motion.div
                        drag
                        dragSnapToOrigin
                        whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50, rotate: 3 }}
                        whileHover={{ cursor: "grab" }}
                        className="bg-black/5 dark:bg-black/5 dark:bg-white/10 relative z-10 mb-4 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl border border-black/5 dark:border-black/5 dark:border-white/10 backdrop-blur-xl"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex flex-1 flex-wrap items-center gap-2">
                            <div className="rounded-full bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-700">
                              High
                            </div>
                          </div>
                        </div>
                        <div className="my-3 flex justify-between">
                          <h4 className="text-md text-foreground font-bold">
                            User Authentication
                          </h4>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Integrate Clerk auth into the Next.js frontend.
                        </p>
                        <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                          <div className="flex -space-x-[6px] overflow-hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-emerald-500 to-teal-500 text-[10px] font-bold text-white dark:border-black">
                              SJ
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="bg-black/5 dark:bg-black/5 dark:bg-white/5 flex flex-1 flex-col gap-4 rounded-2xl p-4 border border-black/5 dark:border-white/5 backdrop-blur-md">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-foreground text-sm font-semibold">
                          Work In Progress
                        </span>
                        <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                          1
                        </span>
                      </div>

                      {/* TaskCard Mock 3 */}
                      <motion.div
                        drag
                        dragSnapToOrigin
                        whileDrag={{
                          scale: 1.05,
                          cursor: "grabbing",
                          zIndex: 50,
                          rotate: 2,
                        }}
                        whileHover={{ cursor: "grab" }}
                        className="bg-black/5 dark:bg-black/5 dark:bg-white/10 relative z-10 mb-4 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl border border-black/5 dark:border-black/5 dark:border-white/10 backdrop-blur-xl"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex flex-1 flex-wrap items-center gap-2">
                            <div className="rounded-full bg-red-200 px-2 py-1 text-xs font-semibold text-red-700">
                              Urgent
                            </div>
                            <div className="flex gap-2">
                              <div className="bg-secondary text-foreground rounded-full px-2 py-1 text-xs">
                                Frontend
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-3 flex justify-between">
                          <h4 className="text-md text-foreground font-bold">
                            WebGL Fluid Integration
                          </h4>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Implement raw WebGL physics for the landing page
                          background.
                        </p>
                        <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                          <div className="flex -space-x-[6px] overflow-hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-orange-500 to-amber-500 text-[10px] font-bold text-white dark:border-black">
                              MK
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-blue-500 to-indigo-500 text-[10px] font-bold text-white dark:border-black">
                              AL
                            </div>
                          </div>
                          <div className="text-muted-foreground flex items-center">
                            <MessageSquareMore className="mr-1 h-4 w-4" />
                            <span className="text-sm dark:text-neutral-400">
                              8
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Column 3: Under Review */}
                    <div className="bg-black/5 dark:bg-black/5 dark:bg-white/5 flex flex-1 flex-col gap-4 rounded-2xl p-4 border border-black/5 dark:border-white/5 backdrop-blur-md">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-foreground text-sm font-semibold">
                          Under Review
                        </span>
                        <span className="bg-foreground/10 text-foreground/70 rounded-full px-2 py-0.5 text-xs font-medium">
                          1
                        </span>
                      </div>

                      {/* TaskCard Mock 4 */}
                      <motion.div
                        drag
                        dragSnapToOrigin
                        whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50, rotate: -1 }}
                        whileHover={{ cursor: "grab" }}
                        className="bg-black/5 dark:bg-black/5 dark:bg-white/10 relative z-10 mb-4 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl border border-black/5 dark:border-black/5 dark:border-white/10 backdrop-blur-xl"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex flex-1 flex-wrap items-center gap-2">
                            <div className="rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-700">
                              Medium
                            </div>
                            <div className="flex gap-2">
                              <div className="bg-secondary text-foreground rounded-full px-2 py-1 text-xs">
                                Backend
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-3 flex justify-between">
                          <h4 className="text-md text-foreground font-bold">
                            Setup Redux Store
                          </h4>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Configure RTK Query endpoints for the Tasks API.
                        </p>
                        <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                          <div className="flex -space-x-[6px] overflow-hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-emerald-500 to-teal-500 text-[10px] font-bold text-white dark:border-black">
                              SJ
                            </div>
                          </div>
                          <div className="text-muted-foreground flex items-center">
                            <MessageSquareMore className="mr-1 h-4 w-4" />
                            <span className="text-sm dark:text-neutral-400">
                              1
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid gap-8 md:grid-cols-3"
        >
          <FeatureCard
            icon={<Layout className="h-8 w-8 text-blue-500" />}
            title="Beautiful Kanban Boards"
            description="Visualize your work effortlessly. Drag and drop tasks with buttery smooth animations."
            moreInfo="Customize columns, set WIP limits, and use powerful filtering to keep your team focused on what matters most."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title="Team Collaboration"
            description="Built for teams. Assign tasks, leave comments, and share attachments instantly."
            moreInfo="Mention teammates, attach files directly from your device, and maintain a single source of truth for every project."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-emerald-500" />}
            title="Lightning Fast"
            description="No loading spinners. Optimistic UI updates make everything feel instantaneous."
            moreInfo="Built on Next.js 15, delivering a butter-smooth 60fps experience across all your devices with zero lag."
          />
        </motion.div>

        {/* 1. Integrations Banner */}
        <div className="border-border/50 bg-secondary/20 mt-20 border-y py-12">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="text-muted-foreground mb-8 text-sm font-semibold tracking-widest uppercase">
              Integrates seamlessly with your stack
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-muted-foreground hover:text-foreground flex cursor-default items-center gap-2 text-lg font-semibold transition-colors">
                <Github className="h-8 w-8" /> GitHub
              </div>
              <div className="text-muted-foreground hover:text-foreground flex cursor-default items-center gap-2 text-lg font-semibold transition-colors">
                <Slack className="h-8 w-8" /> Slack
              </div>
              <div className="text-muted-foreground hover:text-foreground flex cursor-default items-center gap-2 text-lg font-semibold transition-colors">
                <Figma className="h-8 w-8" /> Figma
              </div>
              <div className="text-muted-foreground hover:text-foreground flex cursor-default items-center gap-2 text-lg font-semibold transition-colors">
                <Code2 className="h-8 w-8" /> VS Code
              </div>
              <div className="text-muted-foreground hover:text-foreground flex cursor-default items-center gap-2 text-lg font-semibold transition-colors">
                <Triangle className="h-8 w-8" /> Vercel
              </div>
            </div>
          </div>
        </div>

        {/* 2. Testimonials & Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Loved by engineering teams
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              See how LegionTask is helping teams ship faster and maintain
              absolute clarity.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <TestimonialCard
              name="Sarah Chen"
              role="Lead Product Manager"
              content="LegionTask replaced Jira, Asana, and Trello for us overnight. The speed of the UI is unmatched."
            />
            <TestimonialCard
              name="David Miller"
              role="CTO at TechFlow"
              content="Finally, a project management tool that doesn't feel like a chore to use. The dark mode is simply gorgeous."
            />
            <TestimonialCard
              name="Elena Rodriguez"
              role="Senior Engineer"
              content="The real-time updates and seamless GitHub integration mean I never have to leave my workflow."
            />
          </div>
        </motion.div>

        {/* 3. Pricing Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Start for free, upgrade when your team needs more power.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for individuals and small indie projects."
              features={[
                "Unlimited tasks",
                "Up to 3 projects",
                "Basic Kanban board",
                "Community support",
              ]}
            />
            <PricingCard
              name="Pro"
              price="$12"
              period="/mo"
              description="For growing teams that need more collaboration."
              isPopular
              features={[
                "Unlimited projects",
                "Advanced timeline view",
                "GitHub & Slack integrations",
                "Priority support",
              ]}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For large organizations with strict security needs."
              features={[
                "SSO & SAML",
                "Dedicated account manager",
                "Custom contracts",
                "SLA guarantees",
              ]}
            />
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/pricing">
              <Button variant="link" className="text-primary hover:text-primary/80 group text-lg font-medium">
                See full feature comparison
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 4. FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Can I import my data from Jira or Asana?"
              answer="Yes! We offer a seamless 1-click import tool that pulls all your tasks, epics, and attachments directly into LegionTask without losing any context."
            />
            <FAQItem
              question="Is there a limit to how many users I can invite on the Free plan?"
              answer="The free plan is limited to 5 team members. If you need more, you can easily upgrade to our Pro tier."
            />
            <FAQItem
              question="Do you offer special pricing for open-source projects?"
              answer="Absolutely. We love open-source and offer our Pro tier entirely free for non-commercial open-source projects."
            />
          </div>
        </motion.div>

        {/* Final CTA */}
        <div className="border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative mt-24 mb-12 overflow-hidden rounded-[2.5rem] border p-12 text-center">
          <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />
          <h2 className="text-foreground relative z-10 mb-6 text-4xl font-bold md:text-5xl">
            Ready to supercharge your team?
          </h2>
          <p className="text-muted-foreground relative z-10 mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of modern engineering teams who have already ditched
            the clutter and shipped faster with LegionTask.
          </p>
          <Link href="/sign-up" className="relative z-10">
            <Button
              size="lg"
              className="hover:shadow-primary/30 group bg-primary text-primary-foreground h-14 rounded-full px-10 text-base shadow-xl transition-all hover:-translate-y-1"
            >
              Start your free trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border/50 bg-background/80 relative z-10 mx-auto max-w-7xl border-t px-8 pt-16 pb-8 backdrop-blur-md">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/app-logo-light.png"
                alt="LegionTask Logo"
                width={32}
                height={32}
                className="rounded-lg dark:hidden"
              />
              <Image
                src="/app-logo-dark.png"
                alt="LegionTask Logo"
                width={32}
                height={32}
                className="hidden rounded-lg dark:block"
              />
              <span className="text-foreground font-bold tracking-tight">
                LegionTask
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The premium project management tool designed for modern teams.
            </p>
          </div>
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Product</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Company</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Legal</h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border/50 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LegionTask Inc. All rights reserved.
          </p>
          <div className="text-muted-foreground flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              <Triangle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  moreInfo,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  moreInfo?: string;
}) {
  return (
    <div className="relative z-10 hover:z-50">
      {/* Invisible spacer to maintain grid layout height */}
      <div className="invisible p-8">
        <div className="mb-6 h-14"></div>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <p className="leading-relaxed">{description}</p>
      </div>

      <div className="group border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-black/5 dark:bg-white/10 absolute top-0 left-0 w-full cursor-pointer overflow-hidden rounded-3xl border p-8 backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.05] shadow-lg hover:shadow-2xl">
        <div className="bg-black/5 dark:bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5 backdrop-blur-md mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-foreground mb-3 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {moreInfo && (
          <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
              <div className="border-border/50 mt-4 border-t pt-6">
                <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                  {moreInfo}
                </p>
                <div className="text-primary mt-4 flex items-center text-sm font-semibold transition-colors hover:text-blue-400">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) {
  return (
    <div className="border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 shadow-lg flex flex-col gap-4 rounded-3xl border p-6 backdrop-blur-2xl">
      <div className="flex gap-1 text-yellow-500">
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
        <Star className="h-4 w-4 fill-current" />
      </div>
      <p className="text-foreground leading-relaxed italic">
        &quot;{content}&quot;
      </p>
      <div className="mt-auto flex items-center gap-3 pt-4">
        <div className="from-primary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br to-purple-600 text-sm font-bold text-white">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="text-foreground text-sm font-semibold">{name}</h4>
          <p className="text-muted-foreground text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl border p-8 ${isPopular ? "border-primary shadow-primary/20 bg-black/5 dark:bg-black/5 dark:bg-white/10 shadow-2xl backdrop-blur-2xl" : "border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 shadow-lg backdrop-blur-2xl"} flex flex-col`}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold tracking-wider uppercase">
          Most Popular
        </div>
      )}
      <h3 className="text-foreground text-xl font-bold">{name}</h3>
      <p className="text-muted-foreground mt-2 min-h-[40px] text-sm">
        {description}
      </p>
      <div className="my-6">
        <span className="text-foreground text-4xl font-extrabold">{price}</span>
        {period && <span className="text-muted-foreground">{period}</span>}
      </div>
      <div className="mb-8 flex-1 space-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <Check className="text-primary h-5 w-5 flex-shrink-0" />
            <span className="text-foreground text-sm">{f}</span>
          </div>
        ))}
      </div>
      <Button
        className={`w-full rounded-full ${isPopular ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
      >
        {price === "Custom" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 shadow-lg overflow-hidden rounded-3xl border backdrop-blur-2xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
      >
        <span className="text-foreground font-semibold">{question}</span>
        <ChevronDown
          className={`text-muted-foreground h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground px-6 pb-4 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
