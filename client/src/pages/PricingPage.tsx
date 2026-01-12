import { Check, X } from "lucide-react";

const PricingTier = ({
    name,
    price,
    description,
    features,
    isPopular = false,
    cta,
    disabled = false,
}: {
    name: string;
    price: string;
    description: string;
    features: { name: string; included: boolean }[];
    isPopular?: boolean;
    cta: string;
    disabled?: boolean;
}) => {
    return (
        <div className={`relative flex flex-col p-6 bg-white dark:bg-zinc-900 rounded-2xl border ${isPopular ? "border-blue-500 shadow-xl shadow-blue-500/10 scale-105 z-10" : "border-gray-200 dark:border-zinc-800"}`}>
            {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                </div>
            )}
            
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{price}</span>
                    {price !== "Free" && <span className="text-gray-500 text-sm">/month</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>

            <ul className="flex-1 space-y-3 mb-6">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                        {feature.included ? (
                            <Check className="w-5 h-5 text-blue-500 shrink-0" />
                        ) : (
                            <X className="w-5 h-5 text-gray-300 dark:text-zinc-700 shrink-0" />
                        )}
                        <span className={feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-zinc-600"}>
                            {feature.name}
                        </span>
                    </li>
                ))}
            </ul>

            <button
                disabled={disabled}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isPopular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {cta}
            </button>
        </div>
    );
};

export const PricingPage = () => {
    // Define tiers based on LinkMeld capabilities
    const tiers = [
        {
            name: "Free",
            price: "Free",
            description: "Essential tools for personal knowledge management.",
            features: [
                { name: "50 captures per month", included: true },
                { name: "Basic AI chat (GPT-3.5)", included: true },
                { name: "3 Collections", included: true },
                { name: "Web & Note capture", included: true },
                { name: "Advanced RAG Search", included: false },
                { name: "Unlimited AI History", included: false },
                { name: "Priority Support", included: false },
            ],
            cta: "Current Plan",
            disabled: true,
        },
        {
            name: "Pro",
            price: "$12",
            description: "Power up your brain with advanced AI and unlimited storage.",
            isPopular: true,
            features: [
                { name: "Unlimited captures", included: true },
                { name: "Advanced AI (GPT-4, Claude 3)", included: true },
                { name: "Unlimited Collections", included: true },
                { name: "All capture types (PDF, Images)", included: true },
                { name: "Advanced RAG Search", included: true },
                { name: "Unlimited AI History", included: true },
                { name: "Priority Support", included: false },
            ],
            cta: "Upgrade to Pro",
        },
        {
            name: "Team",
            price: "$29",
            description: "Collaborate and share knowledge with your team.",
            features: [
                { name: "Everything in Pro", included: true },
                { name: "Shared Collections", included: true },
                { name: "Team Analytics", included: true },
                { name: "Admin Controls", included: true },
                { name: "API Access", included: true },
                { name: "Custom AI Models", included: true },
                { name: "Dedicated Success Manager", included: true },
            ],
            cta: "Contact Sales",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="serif text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the perfect plan to organize your digital life and supercharge your second brain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {tiers.map((tier) => (
                        <PricingTier key={tier.name} {...tier} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Need a custom enterprise solution? <a href="#" className="text-blue-600 hover:underline">Contact us</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

