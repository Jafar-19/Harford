import React from 'react';
import { HelpCircle, X, ChevronDown } from 'lucide-react';

interface FAQSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const faqs = [
    {
        q: "How is the late fee calculated?",
        a: "Late fees are applied if payment is not received within the 15-day grace period after your due date. The fee is typically a flat rate or a percentage of the outstanding EMI, depending on your loan agreement."
    },
    {
        q: "Can I get a late fee waiver?",
        a: "Waivers are considered on a case-by-case basis. If you pay a partial amount (at least 30% of outstanding) or foreclose the loan, late fees may be waived. Medical emergencies with valid documentation can also be considered for waivers."
    },
    {
        q: "What is foreclosure?",
        a: "Foreclosure means paying off your entire remaining loan balance in one single payment before the end of the loan tenure. This stops future interest charges."
    },
    {
        q: "My payment isn't showing up.",
        a: "If you made a payment that isn't reflected, please raise a dispute through the chat. Our system will generate a ticket ID and our team will investigate and update your account."
    },
    {
        q: "What are my payment options?",
        a: "You can pay your regular EMI, make a partial payment to reduce your principal, or pay the full outstanding amount. We accept existing saved cards or new credit/debit cards."
    }
];

export const FAQSidebar: React.FC<FAQSidebarProps> = ({ isOpen, onClose }) => {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    if (!isOpen) return null;

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl absolute right-0 top-0 z-20 md:relative md:shadow-none transition-all duration-300">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center text-slate-800 font-semibold">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Help & FAQs
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-md text-slate-500 md:hidden">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 flex justify-between items-center font-medium text-sm text-slate-800 transition-colors"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            {faq.q}
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        {openIndex === index && (
                            <div className="p-3 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
