import React, { useState } from "react";
import {
    ArrowLeft,
    LogIn,
    Mail,
    Lock,
    AlertCircle,
    Loader2,
    ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => (window.location.href = "/");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await axios.post("/login", { email, password });
            window.location.href = "/";
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Invalid credentials. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh bg-slate-950 text-slate-100 p-6 font-sans relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col gap-6 animate-fade-in">
                {/* Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-800/50 shadow-2xl">
                    <div className="mb-10 flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2.5 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700/50 transition-all cursor-pointer group"
                            title="Return Home"
                        >
                            <ArrowLeft
                                size={18}
                                className="group-hover:-translate-x-0.5 transition-transform"
                            />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black text-white tracking-tight leading-none">
                                Login in to your account
                            </h2>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Player Authentication
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs animate-pop">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Secret Key
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group flex items-center justify-center gap-3 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
                            >
                                {isLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <span>Login</span>
                                        <ChevronRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-xs">
                        <span className="text-slate-500">New warrior?</span>{" "}
                        <button
                            onClick={() => (window.location.href = "/register")}
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors cursor-pointer"
                        >
                            Register Profile
                        </button>
                    </div>
                </div>

                <div className="text-center text-[10px] text-slate-700 mt-2 font-mono uppercase tracking-[0.3em]">
                    Secure Protocol • Strategic Expansion
                </div>
            </div>
        </div>
    );
}
