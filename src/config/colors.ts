export const COLOR_CONFIG = [
    { name: "emerald", hex: "#34D399", tw: "emerald-500" },
    { name: "amber", hex: "#F59E0B", tw: "amber-500" },
    { name: "red", hex: "#EF4444", tw: "red-500" },
    { name: "violet", hex: "#8B5CF6", tw: "violet-500" },
    { name: "pink", hex: "#EC4899", tw: "pink-500" },
    { name: "blue", hex: "#60A5FA", tw: "blue-400" },
    { name: "teal", hex: "#2DD4BF", tw: "teal-400" },
] as const;

export type ColorName = typeof COLOR_CONFIG[number]["name"];

export const COLOR_MAP = COLOR_CONFIG.reduce((map, color) => {
    map[color.name] = color;
    return map;
}, {} as Record<ColorName, typeof COLOR_CONFIG[number]>);


export const UNSELECTED_COLOR_CLASSES: Record<ColorName, string> = {
    emerald: "bg-emerald-500/60",
    amber: "bg-amber-500/60",
    red: "bg-red-500/60",
    violet: "bg-violet-500/60",
    pink: "bg-pink-500/60",
    blue: "bg-blue-400/60",
    teal: "bg-teal-400/60",
};

export const SELECTED_COLOR_CLASSES: Record<ColorName, string> = {
    emerald: "bg-emerald-500/80",
    amber: "bg-amber-500/80",
    red: "bg-red-500/80",
    violet: "bg-violet-500/80",
    pink: "bg-pink-500/80",
    blue: "bg-blue-400/80",
    teal: "bg-teal-400/80",
};