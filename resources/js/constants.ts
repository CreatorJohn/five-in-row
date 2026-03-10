export const INITIAL_SIZE = 9;
export const WIN_COUNT = 5;

export const ANIMATION_STYLES = `
  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes draw-border {
    to { stroke-dashoffset: 0; }
  }

  @keyframes active-card {
    0% { border-color: rgba(71, 85, 105, 0.5); }
    50% { border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 15px rgba(59, 130, 246, 0.2); }
    100% { border-color: rgba(71, 85, 105, 0.5); }
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  .animate-draw-border { 
    stroke-dasharray: 100; 
    stroke-dashoffset: 100; 
    animation: draw-border 3s linear infinite; 
  }
  .animate-active-card { animation: active-card 2s infinite; }
  .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
  .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 8s linear infinite; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { 
    background: rgba(71, 85, 105, 0.5); 
    border-radius: 10px; 
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.5); }
`;
