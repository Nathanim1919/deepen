import { motion } from "framer-motion";
import { FiCheck, FiZap, FiBriefcase, FiGlobe } from "react-icons/fi";
import { useState } from "react";

export const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Essentials",
      monthlyPrice: "Free",
      annualPrice: "Free",
      description: "For individuals exploring knowledge management",
      cta: "Get Started",
      featured: false,
      features: [
        "100 monthly captures",
        "Basic organization",
        "1GB secure storage",
        "Community support",
        "Web & mobile apps"
      ],
      icon: <FiZap className="text-blue-500" />,
    },
    {
      name: "Professional",
      monthlyPrice: "$19",
      annualPrice: "$15",
      period: "/month",
      description: "For serious knowledge workers and creators",
      cta: "Start Free Trial",
      featured: true,
      features: [
        "Unlimited captures",
        "Advanced AI organization",
        "100GB encrypted storage",
        "Priority 24/7 support",
        "Full API access",
        "Team collaboration (up to 5)",
        "Version history (30 days)"
      ],
      icon: <FiBriefcase className="text-purple-500" />,
    },
    {
      name: "Organization",
      monthlyPrice: "Custom",
      annualPrice: "Custom",
      description: "For enterprises and institutions",
      cta: "Contact Sales",
      featured: false,
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "1TB+ secure storage",
        "Dedicated success manager",
        "SAML/SSO integration",
        "Advanced audit logs",
        "Custom retention policies",
        "On-premise deployment"
      ],
      icon: <FiGlobe className="text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 py-6 px-6">
      {/* Ultra-subtle background grid */}
      <div className="fixed inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Apple-style minimalist header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <h2 className="text-5xl font-light tracking-tight mb-6">
            Deepen Pricing
          </h2>
          <div className="w-16 h-px bg-gray-800 mx-auto mb-8" />
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Simple plans for transforming how you work with knowledge.
          </p>
        </motion.div>

        {/* Precise billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-20"
        >
          <div className="inline-flex p-1 bg-gray-900 rounded-lg border border-gray-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                billingCycle === "monthly"
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:text-gray-300"
              } transition-colors`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 text-sm font-medium rounded-md ${
                billingCycle === "annual"
                  ? "bg-gray-800 text-white"
                  : "text-gray-500 hover:text-gray-300"
              } transition-colors`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </motion.div>

        {/* Pricing cards with surgical precision */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`relative rounded-xl p-8 border ${
                plan.featured 
                  ? "border-gray-700 bg-gradient-to-b from-gray-900 to-gray-950 shadow-xl" 
                  : "border-gray-800 bg-gray-900"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-full ${
                  plan.featured ? "bg-purple-900/30" : "bg-gray-800"
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-light">{plan.name}</h3>
              </div>

              <div className="mb-8">
                <p className="text-gray-400 font-light mb-4">{plan.description}</p>
                <p className="text-4xl font-light mb-1">
                  {billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                  {plan.period && (
                    <span className="text-xl font-light text-gray-500">
                      {billingCycle === "annual" ? "/month" : plan.period}
                    </span>
                  )}
                </p>
                {billingCycle === "annual" && plan.name === "Professional" && (
                  <p className="text-sm text-gray-500">$180 billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <FiCheck className={`mt-1 mr-3 flex-shrink-0 ${
                      plan.featured ? "text-purple-500" : "text-gray-600"
                    }`} />
                    <span className="text-gray-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-medium ${
                  plan.featured
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                } transition-all`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Apple-style fine print */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-sm text-gray-500">
            All plans include end-to-end encryption. 14-day money-back guarantee for annual plans.
          </p>
        </motion.div>
      </div>
    </div>
  );
};