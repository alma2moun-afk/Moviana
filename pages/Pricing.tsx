
import React from 'react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "For hobbyists and curious creators.",
      features: ["5 videos per month", "Standard resolution (720p)", "Community support", "1080p limited preview"],
      cta: "Current Plan",
      current: true
    },
    {
      name: "Professional",
      price: "$29",
      period: "/mo",
      desc: "Perfect for content creators & influencers.",
      features: ["Unlimited videos", "Full HD (1080p) production", "No watermarks", "Priority generation speed", "Advanced editing tools"],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/mo",
      desc: "For agencies and high-volume production.",
      features: ["Up to 4K resolution (Alpha)", "Multi-user seats", "API direct access", "Dedicated manager", "Custom model fine-tuning"],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 text-lg">Choose the plan that fits your creative vision. Upgrade or cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-3xl border transition-all flex flex-col ${
              plan.popular 
              ? 'bg-indigo-600/5 border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.1)]' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm">{plan.desc}</p>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                  <i className="fa-solid fa-check text-indigo-500 mt-1"></i>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${
              plan.current 
              ? 'bg-slate-800 text-slate-400 cursor-default' 
              : plan.popular
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center">
        <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
        <p className="text-slate-400 mb-6">We offer tailored packages for large teams and high-bandwidth requirements.</p>
        <button className="px-8 py-3 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition-colors">
          Get in Touch
        </button>
      </div>
    </div>
  );
};

export default Pricing;
