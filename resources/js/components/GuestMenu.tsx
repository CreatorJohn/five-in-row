import React from "react";
import {
    Users,
    Bot,
    Swords,
    Shield,
    LogIn,
    UserPlus,
    ChevronRight,
} from "lucide-react";

interface GuestMenuProps {
    onNavigate: (view: "game" | "practice") => void;
}

interface MenuButtonProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    variant?: "solid" | "action";
    subtitle?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({
    icon: Icon,
    label,
    onClick,
    variant = "solid",
    subtitle,
}) => {
    const variants = {
        solid: "bg-slate-800/50 hover:bg-slate-700 text-slate-100 border border-slate-700/50 hover:border-slate-600 shadow-lg",
        action: "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/20 border border-blue-400/20",
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] font-bold transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden cursor-pointer ${variants[variant as keyof typeof variants]} `}
        >
            <div
                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors duration-300 ${variant === "action" ? "bg-white/20" : "bg-slate-900/50 group-hover:bg-slate-900"}`}
            >
                <Icon
                    size={20}
                    className="sm:w-6 sm:h-6"
                    strokeWidth={2.5}
                />
            </div>
            <div className="flex flex-col items-start text-left">
                <span className="text-sm sm:text-base tracking-tight">{label}</span>
                {subtitle && (
                    <span className="text-[9px] sm:text-[10px] font-medium opacity-50 uppercase tracking-widest">
                        {subtitle}
                    </span>
                )}
            </div>
            <ChevronRight
                size={18}
                className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all sm:w-5 sm:h-5"
            />
        </button>
    );
};

export const GuestMenu: React.FC<GuestMenuProps> = ({ onNavigate }) => {
    return (
        <div className="relative z-10 w-full max-w-md flex flex-col gap-4 sm:gap-6 animate-fade-in px-4 sm:px-0">
            {/* Guest Identity Card */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-slate-900/40 backdrop-blur-2xl p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-800/50 shadow-2xl gap-4">
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="inline-flex p-3 sm:p-4 bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-700/50 shadow-inner group cursor-default select-none shrink-0">
                        <Swords
                            size={24}
                            className="text-blue-500 mr-1 transition-transform group-hover:-translate-x-1 duration-500 sm:w-8 sm:h-8"
                        />
                        <Shield
                            size={24}
                            className="text-rose-500 ml-1 transition-transform group-hover:translate-x-1 duration-500 sm:w-8 sm:h-8"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                            Five in a Row
                        </h1>
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Strategic Board Game
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => (window.location.href = "/login")}
                        className="flex-1 sm:flex-none p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
                        title="Login"
                    >
                        <LogIn size={18} />
                        <span className="sm:hidden text-[10px] font-black uppercase">Login</span>
                    </button>
                    <button
                        onClick={() => (window.location.href = "/register")}
                        className="flex-1 sm:flex-none p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-900/20 cursor-pointer flex items-center justify-center gap-2"
                        title="Register"
                    >
                        <UserPlus size={18} />
                        <span className="sm:hidden text-[10px] font-black uppercase">Join</span>
                    </button>
                </div>
            </div>

            {/* Guest Play Actions */}
            <div className="flex flex-col gap-3 sm:gap-4">
                <MenuButton
                    icon={Users}
                    label="Play Locally"
                    subtitle="Two players on one device"
                    variant="action"
                    onClick={() => onNavigate("game")}
                />
                <MenuButton
                    icon={Bot}
                    label="Practice Mode"
                    subtitle="Test your skills vs AI"
                    onClick={() => onNavigate("practice")}
                />
            </div>

            {/* Benefits Card */}
            <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed relative z-10">
                    Join our community to unlock{" "}
                    <span className="text-blue-400 font-bold">Replays</span>,
                    <span className="text-amber-400 font-bold"> Rankings</span>,
                    and
                    <span className="text-emerald-400 font-bold"> Friends</span>
                    .
                </p>
                <button 
                    onClick={() => window.location.href = '/register'}
                    className="mt-5 sm:mt-6 w-full py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl sm:rounded-2xl font-bold transition-all border border-slate-700 cursor-pointer active:scale-95 relative z-10"
                >
                    Create Your Profile
                </button>
            </div>
        </div>
    );
};
