import React from 'react';
import { Game } from '@/components/Game';
import { ANIMATION_STYLES } from '@/constants';

interface GamePlayProps {
    mode: 'game' | 'practice';
    isAuthenticated: boolean;
    userName?: string | null;
    userAvatar?: string | null;
}

export default function GamePlay({ mode, isAuthenticated, userName, userAvatar }: GamePlayProps) {
    const handleBack = () => {
        window.location.href = '/';
    };

    return (
        <>
            <style>{ANIMATION_STYLES}</style>
            <Game 
                mode={mode} 
                onBack={handleBack} 
                isAuthenticated={isAuthenticated}
                userName={userName}
                userAvatar={userAvatar}
            />
        </>
    );
}
