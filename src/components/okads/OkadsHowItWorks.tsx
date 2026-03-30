import { Search, CreditCard, Truck } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse & Pick',
    description: 'Explore our fresh seafood catalog and add what you need to your cart.',
    color: 'from-teal-400 to-teal-600',
  },
  {
    icon: CreditCard,
    title: 'Pay Securely',
    description: 'Checkout with Paystack — safe, fast, and reliable. Card, bank, or USSD.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Truck,
    title: 'We Deliver',
    description: 'Fresh seafood delivered to your doorstep next day across Abuja. No wahala!',
    color: 'from-orange-400 to-orange-600',
  },
];

export default function OkadsHowItWorks() {
  return (
    <section className="py-16 bg-[#F0FDFA]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#134E4A]">How It Works</h2>
          <p className="text-[#0D9488] mt-2">Three simple steps to fresh seafood</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center space-y-4">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#134E4A]">
                <span className="text-[#0D9488] mr-2">{i + 1}.</span>
                {step.title}
              </div>
              <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
