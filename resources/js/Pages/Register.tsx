import React, { useState, useRef } from "react";
import {
    ArrowLeft,
    UserPlus,
    Mail,
    Lock,
    User,
    AlertCircle,
    Loader2,
    Camera,
    X as CloseIcon,
    ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBack = () => (window.location.href = "/");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                setErrors({
                    profile_picture: ["Image size must be less than 1MB"],
                });
                return;
            }
            if (!file.type.startsWith("image/")) {
                setErrors({ profile_picture: ["File must be an image"] });
                return;
            }
            setErrors(null);
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setProfilePicture(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors(null);

        if (!profilePicture) {
            setErrors({ profile_picture: ["Profile picture is required"] });
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
        formData.append("profile_picture", profilePicture);

        try {
            await axios.post("/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            window.location.href = "/";
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({
                    general: ["Something went wrong. Please try again later."],
                });
            }
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

            <div className="relative z-10 w-full max-w-lg flex flex-col gap-6 animate-fade-in">
                {/* Unified Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-800/50 shadow-2xl relative">
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
                                Create new account
                            </h2>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Player Registration
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center mb-4">
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div
                                    className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${previewUrl ? "border-blue-500 ring-4 ring-blue-500/20" : "border-slate-700 hover:border-slate-600 bg-slate-950/50"}`}
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-600 group-hover:text-slate-400">
                                            <Camera size={24} />
                                            <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">
                                                Avatar
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage();
                                        }}
                                        className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors cursor-pointer"
                                    >
                                        <CloseIcon size={10} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {errors?.profile_picture && (
                                <p className="text-rose-400 text-[10px] mt-2 font-bold uppercase">
                                    {errors.profile_picture[0]}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Warrior Name
                                </label>
                                <div className="relative group">
                                    <User
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                        placeholder="Username"
                                    />
                                </div>
                                {errors?.name && (
                                    <p className="text-rose-400 text-[9px] font-bold">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                        size={16}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors?.email && (
                                    <p className="text-rose-400 text-[9px] font-bold">
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Secret Key
                                </label>
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                        size={16}
                                    />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Verify Key
                                </label>
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                        size={16}
                                    />
                                    <input
                                        type="password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value,
                                            )
                                        }
                                        className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                        {errors?.password && (
                            <p className="text-rose-400 text-[9px] font-bold ml-1">
                                {errors.password[0]}
                            </p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full group flex items-center justify-center gap-3 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <>
                                        <span>Register</span>
                                        <ChevronRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-xs">
                        <span className="text-slate-500">
                            Already a warrior?
                        </span>{" "}
                        <button
                            onClick={() => (window.location.href = "/login")}
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                <div className="text-center text-[10px] text-slate-700 mt-2 font-mono uppercase tracking-[0.3em]">
                    Secure Protocol • Five in a Row
                </div>
            </div>
        </div>
    );
}
