export const COLOR_CONFIG = [
    { name: "emerald", hex: "#34D399", tw: "emerald-500" },
    { name: "amber", hex: "#F59E0B", tw: "amber-500" },
    { name: "red", hex: "#EF4444", tw: "red-500" },
    { name: "violet", hex: "#8B5CF6", tw: "violet-500" },
    { name: "pink", hex: "#EC4899", tw: "pink-500" },
    { name: "blue", hex: "#3B82F6", tw: "blue-500" }, // Changed to blue-500 for consistency
    { name: "teal", hex: "#14B8A6", tw: "teal-500" }, // Changed to teal-500 for consistency
    { name: "purple", hex: "#A855F7", tw: "purple-500" },
    { name: "fuchsia", hex: "#E879F9", tw: "fuchsia-500" },
    { name: "lime", hex: "#84CC16", tw: "lime-500" },
    { name: "cyan", hex: "#06B6D4", tw: "cyan-500" },
    { name: "orange", hex: "#F97316", tw: "orange-500" },
    { name: "indigo", hex: "#6366F1", tw: "indigo-500" },
] as const;

export const COLOR_MAP: Record<typeof COLOR_CONFIG[number]["name"], typeof COLOR_CONFIG[number]> = COLOR_CONFIG.reduce(
    (map, color) => {
        map[color.name] = color;
        return map;
    }, {} as Record<typeof COLOR_CONFIG[number]["name"], typeof COLOR_CONFIG[number]>);

export const UNSELECTED_COLOR_CLASSES: Record<typeof COLOR_CONFIG[number]["name"], string> = {
    emerald: "bg-emerald-500/60",
    amber: "bg-amber-500/60",
    red: "bg-red-500/60",
    violet: "bg-violet-500/60",
    pink: "bg-pink-500/60", // Corrected missing border class
    blue: "bg-blue-500/60",
    teal: "bg-teal-500/60",
    purple: "bg-purple-500/60",
    fuchsia: "bg-fuchsia-500/60",
    lime: "bg-lime-500/60",
    cyan: "bg-cyan-500/60",
    orange: "bg-orange-500/60",
    indigo: "bg-indigo-500/60",
};

export const SELECTED_COLOR_CLASSES: Record<typeof COLOR_CONFIG[number]["name"], string> = {
    emerald: "bg-emerald-500/80",
    amber: "bg-amber-500/80",
    red: "bg-red-500/80",
    violet: "bg-violet-500/80", // Corrected missing border class
    pink: "bg-pink-500/80", // Corrected missing border class
    blue: "bg-blue-500/80",
    teal: "bg-teal-500/80",
    purple: "bg-purple-500/80",
    fuchsia: "bg-fuchsia-500/80",
    lime: "bg-lime-500/80",
    cyan: "bg-cyan-500/80",
    orange: "bg-orange-500/80",
    indigo: "bg-indigo-500/80",
};
export const UNSELECTED_COLOR_CLASSES_NO_BG: Record<typeof COLOR_CONFIG[number]["name"], string> = {
    emerald: "text-emerald-500/60",
    amber: "text-amber-500/60",
    red: "text-red-500/60",
    violet: "text-violet-500/60",
    pink: "text-pink-500/60", // Corrected missing border class
    blue: "text-blue-500/60",
    teal: "text-teal-500/60",
    purple: "text-purple-500/60",
    fuchsia: "text-fuchsia-500/60",
    lime: "text-lime-500/60",
    cyan: "text-cyan-500/60",
    orange: "text-orange-500/60",
    indigo: "text-indigo-500/60",
};

export const SELECTED_COLOR_CLASSES_NO_BG: Record<typeof COLOR_CONFIG[number]["name"], string> = {
    emerald: "text-emerald-500/80 border-emerald-500/80",
    amber: "text-amber-500/80 border-amber-500/80",
    red: "text-red-500/80 border-red-500/80",
    violet: "text-violet-500/80 border-violet-500/80",
    pink: "text-pink-500/80 border-pink-500/80",
    blue: "text-blue-500/80 border-blue-500/80",
    teal: "text-teal-500/80 border-teal-500/80",
    purple: "text-purple-500/80 border-purple-500/80",
    fuchsia: "text-fuchsia-500/80 border-fuchsia-500/80",
    lime: "text-lime-500/80 border-lime-500/80",
    cyan: "text-cyan-500/80 border-cyan-500/80",
    orange: "text-orange-500/80 border-orange-500/80",
    indigo: "text-indigo-500/80 border-indigo-500/80", // Corrected missing border class
};