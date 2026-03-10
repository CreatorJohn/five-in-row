import React from 'react';
import { AuthMenu } from '@/components/AuthMenu';
import { GuestMenu } from '@/components/GuestMenu';
import { ANIMATION_STYLES } from '@/constants';

interface HomeProps {
    isAuthenticated: boolean;
    userName?: string | null;
    userAvatar?: string | null;
}

export default function Home({ isAuthenticated, userName, userAvatar }: HomeProps) {
    const handleNavigate = (view: 'game' | 'practice' | 'gallery') => {
        window.location.href = `/${view}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh bg-slate-950 text-slate-100 p-6 font-sans relative overflow-hidden">
            <style>{ANIMATION_STYLES}</style>
            
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {isAuthenticated ? (
                <AuthMenu 
                    onNavigate={handleNavigate} 
                    userName={userName || 'Player'} 
                    userAvatar={userAvatar} 
                />
            ) : (
                <GuestMenu onNavigate={handleNavigate} />
            )}

            <div className="text-center text-[10px] text-slate-700 mt-8 font-mono uppercase tracking-[0.3em] relative z-10">
                v1.7.2 • Dynamic Experience
            </div>
        </div>
    );
}
