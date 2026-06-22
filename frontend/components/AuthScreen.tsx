import React, { useState } from 'react';
import { ShieldCheck, Building2, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
    onLogin: (mobileNumber: string) => void;
    isLoading: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isLoading }) => {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleaned = mobile.replace(/\D/g, '');
        if (cleaned.length < 10) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        setError('');
        onLogin(cleaned);
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-blue-600 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Nexus Bank</h1>
                    <p className="text-blue-100 text-sm">Secure Debt Resolution Portal</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                                Enter Registered Mobile Number
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                                    +1
                                </span>
                                <input
                                    type="tel"
                                    id="mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="(555) 000-0000"
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !mobile}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Verify & Continue
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center text-sm text-slate-500">
                        <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
                        Bank-grade 256-bit encryption
                    </div>
                </div>
            </div>
        </div>
    );
};
