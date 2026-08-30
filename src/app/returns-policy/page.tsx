import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs">
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-3 shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-emerald-600/30 text-emerald-400 font-bold px-3 py-1 rounded-full text-[11px]">
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Customer Protection Policy</span>
        </div>
        <h1 className="text-3xl font-black">7-Day Free Return & Replacement Guarantee</h1>
        <p className="text-slate-300 leading-relaxed">
          At Nabrijan Market, we prioritize customer trust. If your ordered product is defective, damaged during shipping, or does not match the product description, you can request a hassle-free 7-day return or exchange.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Eligible Return Conditions</span>
          </h2>
          <ul className="space-y-2 text-slate-600 leading-relaxed list-disc pl-4">
            <li>Product received is physically damaged or broken.</li>
            <li>Item delivered is incorrect, missing components, or wrong variant.</li>
            <li>Product fails to power on or has manufacturing defects.</li>
            <li>Original packaging, product box, manuals, and accessories must remain intact.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>How to Submit a Return Request</span>
          </h2>
          <ol className="space-y-2 text-slate-600 leading-relaxed list-decimal pl-4">
            <li>Navigate to <Link href="/account/orders" className="text-emerald-700 font-bold underline">My Account &gt; Order History</Link>.</li>
            <li>Select the delivered order and click <strong>&quot;Request Item Return&quot;</strong>.</li>
            <li>Attach photos/videos showing the product defect or shipping damage.</li>
            <li>Our merchant seller or Nabrijan courier partner will collect the item within 48 hours.</li>
            <li>Upon verification, your refund will be instantly credited to your Nabrijan Wallet or original payment method.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
