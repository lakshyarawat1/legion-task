"use client";

import React from "react";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ModeToggle } from "@/app/(components)/ModeToggle/ModeToggle";

export default function PricingPage() {
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
        <Link href="/" className="flex items-center gap-3">
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
        </Link>
        <div className="flex items-center gap-4">
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
        {/* Pricing Hero */}
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center space-y-6 text-center duration-1000 mb-16">
          <h1 className="text-foreground max-w-4xl text-5xl leading-[1.1] font-extrabold tracking-tighter md:text-7xl">
            Transparent pricing for <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              teams that move fast.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            Start for free, upgrade when your team needs more power. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3 mb-32"
        >
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
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl mb-32"
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Compare all features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Find the perfect plan for your workflow.
            </p>
          </div>
          
          <div className="border-black/5 dark:border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/5 dark:bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden rounded-3xl border backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-black/5 dark:border-white/10 border-b">
                  <tr>
                    <th className="p-6 font-semibold w-1/3">Features</th>
                    <th className="p-6 font-semibold w-1/5 text-center">Starter</th>
                    <th className="p-6 font-semibold w-1/5 text-center text-primary">Pro</th>
                    <th className="p-6 font-semibold w-1/5 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-black/5 dark:divide-white/10 divide-y">
                  {/* Category: Core */}
                  <tr className="bg-black/5 dark:bg-white/5">
                    <td colSpan={4} className="p-4 text-sm font-bold tracking-widest uppercase text-muted-foreground">Core Features</td>
                  </tr>
                  <FeatureRow name="Projects" starter="3" pro="Unlimited" enterprise="Unlimited" />
                  <FeatureRow name="Tasks" starter="Unlimited" pro="Unlimited" enterprise="Unlimited" />
                  <FeatureRow name="Kanban Board" starter={true} pro={true} enterprise={true} />
                  <FeatureRow name="Gantt & Timeline" starter={false} pro={true} enterprise={true} />
                  <FeatureRow name="Custom Fields" starter={false} pro={true} enterprise={true} />
                  
                  {/* Category: Collaboration */}
                  <tr className="bg-black/5 dark:bg-white/5">
                    <td colSpan={4} className="p-4 text-sm font-bold tracking-widest uppercase text-muted-foreground">Collaboration</td>
                  </tr>
                  <FeatureRow name="Team Members" starter="Up to 5" pro="Unlimited" enterprise="Unlimited" />
                  <FeatureRow name="File Attachments" starter="5MB / file" pro="100MB / file" enterprise="Unlimited" />
                  <FeatureRow name="Guest Access" starter={false} pro={true} enterprise={true} />
                  <FeatureRow name="Team Permissions" starter={false} pro="Basic" enterprise="Advanced (RBAC)" />

                  {/* Category: Integrations & Security */}
                  <tr className="bg-black/5 dark:bg-white/5">
                    <td colSpan={4} className="p-4 text-sm font-bold tracking-widest uppercase text-muted-foreground">Integrations & Security</td>
                  </tr>
                  <FeatureRow name="GitHub & GitLab" starter={false} pro={true} enterprise={true} />
                  <FeatureRow name="Slack & Teams" starter={false} pro={true} enterprise={true} />
                  <FeatureRow name="API Access" starter={false} pro={true} enterprise={true} />
                  <FeatureRow name="SSO / SAML" starter={false} pro={false} enterprise={true} />
                  <FeatureRow name="Audit Logs" starter={false} pro={false} enterprise={true} />
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
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
              question="Can I change my plan later?"
              answer="Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges or credits will automatically be applied to your account."
            />
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
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Integrations
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
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
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
        <div className="border-border/50 pt-8 text-center border-t">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} LegionTask. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ----------------------
// Reusable Components
// ----------------------

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
      <ul className="mb-8 flex-1 space-y-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="text-primary mr-3 mt-0.5 h-5 w-5 shrink-0" />
            <span className="text-muted-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={isPopular ? "default" : "outline"}
        className={`w-full rounded-full ${isPopular ? "shadow-primary/25 shadow-lg" : "bg-transparent border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"} transition-all`}
      >
        Get Started
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

function FeatureRow({ 
  name, 
  starter, 
  pro, 
  enterprise 
}: { 
  name: string; 
  starter: boolean | string; 
  pro: boolean | string; 
  enterprise: boolean | string;
}) {
  const renderValue = (value: boolean | string, isPro: boolean = false) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className={`mx-auto h-5 w-5 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
      ) : (
        <X className="text-muted-foreground/30 mx-auto h-5 w-5" />
      );
    }
    return <span className={`text-sm ${isPro ? "text-primary font-medium" : "text-muted-foreground"}`}>{value}</span>;
  };

  return (
    <tr className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      <td className="p-4 pl-6 text-sm font-medium text-foreground">{name}</td>
      <td className="p-4 text-center">{renderValue(starter)}</td>
      <td className="p-4 text-center">{renderValue(pro, true)}</td>
      <td className="p-4 text-center">{renderValue(enterprise)}</td>
    </tr>
  );
}
