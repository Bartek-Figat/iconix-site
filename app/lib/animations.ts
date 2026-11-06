/** Example animations shown in the icon popup. spin/pulse ship with @iconix/icons/css; the rest are plain CSS you copy. */
export interface Anim {
  id: string;
  label: string;
  /** Default duration in seconds. */
  duration: number;
  /** Runs once (e.g. line drawing) instead of looping. */
  once?: boolean;
  /** Built into the library as a prop/attribute. */
  builtIn?: 'spin' | 'pulse';
  hint: string;
  css: (d: number) => string;
}

export const ANIMS: Anim[] = [
  {
    id: 'spin', label: 'Spin', duration: 1, builtIn: 'spin',
    hint: 'Built in: add the spin prop and import @iconix/icons/css once. Good for loaders and refresh buttons.',
    css: (d) => `.iconix-spin {
  animation: iconix-spin ${d}s linear infinite;
  transform-origin: center;
}
@keyframes iconix-spin { to { transform: rotate(360deg); } }`,
  },
  {
    id: 'pulse', label: 'Pulse', duration: 1, builtIn: 'pulse',
    hint: 'Built in: rotates in 8 steps, like a classic loading spinner.',
    css: (d) => `.iconix-pulse {
  animation: iconix-spin ${d}s steps(8) infinite;
  transform-origin: center;
}`,
  },
  {
    id: 'draw', label: 'Draw', duration: 1.6, once: true,
    hint: 'Draws the lines of the icon, as if by hand. Nice for empty states and success messages.',
    css: (d) => `.icon-draw * {
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: icon-draw ${d}s ease-out forwards;
}
@keyframes icon-draw { to { stroke-dashoffset: 0; } }`,
  },
  {
    id: 'bounce', label: 'Bounce', duration: 0.9,
    hint: 'Jumps up and down. Draws attention to a call to action or a new item.',
    css: (d) => `.icon-bounce { animation: icon-bounce ${d}s cubic-bezier(.3,0,.3,1) infinite; }
@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-25%); }
}`,
  },
  {
    id: 'beat', label: 'Heartbeat', duration: 1.1,
    hint: 'Grows and shrinks twice, like a heartbeat. Works well for likes and favorites.',
    css: (d) => `.icon-beat { animation: icon-beat ${d}s ease-in-out infinite; transform-origin: center; }
@keyframes icon-beat {
  0%, 40%, 100% { transform: scale(1); }
  15%           { transform: scale(1.22); }
  30%           { transform: scale(1.1); }
}`,
  },
  {
    id: 'shake', label: 'Shake', duration: 0.6,
    hint: 'Short side-to-side shake. Use it for errors or a wrong password.',
    css: (d) => `.icon-shake { animation: icon-shake ${d}s ease-in-out infinite; }
@keyframes icon-shake {
  0%, 100%      { transform: translateX(0); }
  20%, 60%      { transform: translateX(-12%); }
  40%, 80%      { transform: translateX(12%); }
}`,
  },
  {
    id: 'ring', label: 'Ring', duration: 1.2,
    hint: 'Swings from the top, like a bell. Made for notifications and alarms.',
    css: (d) => `.icon-ring { animation: icon-ring ${d}s ease-in-out infinite; transform-origin: 50% 10%; }
@keyframes icon-ring {
  0%, 60%, 100% { transform: rotate(0); }
  10%, 30%      { transform: rotate(16deg); }
  20%, 40%      { transform: rotate(-16deg); }
  50%           { transform: rotate(6deg); }
}`,
  },
  {
    id: 'float', label: 'Float', duration: 2.4,
    hint: 'Slow, gentle floating. Calm motion for hero sections and illustrations.',
    css: (d) => `.icon-float { animation: icon-float ${d}s ease-in-out infinite; }
@keyframes icon-float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50%      { transform: translateY(-10%) rotate(-4deg); }
}`,
  },
  {
    id: 'fade', label: 'Blink', duration: 1.4,
    hint: 'Fades in and out. Shows a live or recording status.',
    css: (d) => `.icon-fade { animation: icon-fade ${d}s ease-in-out infinite; }
@keyframes icon-fade { 50% { opacity: .25; } }`,
  },
];

/** CSS class that runs the animation (built-in ones use the library class names). */
export const animClass = (a: Anim) => (a.builtIn ? `iconix-${a.builtIn}` : `icon-${a.id}`);
