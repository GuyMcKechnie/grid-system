// src/types/types.ts
import type { ColorName } from "../config/colors"; // Import the new type

export interface GridItemType {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: ColorName; // Use the specific ColorName type instead of a generic string
}