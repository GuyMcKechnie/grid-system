export type ChartType = "gauge" | "pie" | "scatter" | "bar";

export interface GridItemType {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: typeof import("../config/colors").COLOR_CONFIG[number]["name"];
    type: ChartType;
    channelNumber: string; // Changed to string
}