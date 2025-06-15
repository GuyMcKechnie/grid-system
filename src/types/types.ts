import type { ColorName } from "../config/colors";

export interface GridItemType {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: ColorName;
}