import React, { useLayoutEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { GridItemType } from "../types/types";
import { Gauge, PieChart, ScatterChart, BarChart } from 'lucide-react';

import {
    SELECTED_COLOR_CLASSES,
    UNSELECTED_COLOR_CLASSES,
    SELECTED_COLOR_CLASSES_NO_BG,
    UNSELECTED_COLOR_CLASSES_NO_BG,
} from "../config/colors";

interface GridProps {
    items: GridItemType[];
    selectedItemId: string | null;
    onUpdateItem: (id: string, newProps: Partial<GridItemType>) => void;
    onSelectItem: (id: string) => void;
}

const GRID_UNIT = 20;

const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
};

const Grid: React.FC<GridProps> = ({
    items,
    selectedItemId,
    onUpdateItem,
    onSelectItem,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [gridDimensions, setGridDimensions] = useState({
        width: 0,
        height: 0,
    });

    useLayoutEffect(() => {
        const updateSize = () => {
            if (wrapperRef.current) {
                const snappedWidth =
                    Math.floor(wrapperRef.current.clientWidth / GRID_UNIT) *
                    GRID_UNIT;
                const snappedHeight =
                    Math.floor(wrapperRef.current.clientHeight / GRID_UNIT) *
                    GRID_UNIT;

                setGridDimensions({
                    width: snappedWidth,
                    height: snappedHeight,
                });
            }
        };

        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const gridStyle = {
        backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
        backgroundSize: `${GRID_UNIT}px ${GRID_UNIT}px`,
    };

    // Determine the icon color class based on selection
    const renderChartType = (item: GridItemType) => {
        const iconColorClass = item.id === selectedItemId
            ? SELECTED_COLOR_CLASSES_NO_BG[item.color]
            : UNSELECTED_COLOR_CLASSES_NO_BG[item.color];

        const iconProps = {
            className: `w-12 h-12 ${iconColorClass}`, // Apply color and size
        };

        switch (item.type) {
            case "gauge": {
                return <Gauge {...iconProps} />;
            }
            case "pie": {
                return <PieChart {...iconProps} />;
            }
            case "scatter": {
                return <ScatterChart {...iconProps} />;
            }
            case "bar": {
                return <BarChart {...iconProps} />;
            }
            default:
                return (
                    <div
                        className={`text-xs text-gray-400 ${iconColorClass}`}
                    >
                        Unknown Chart Type
                    </div>
                );
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="w-full h-full flex items-center justify-center"
        >
            {gridDimensions.width > 0 && (
                <div
                    className="relative"
                    style={{
                        width: `${gridDimensions.width}px`,
                        height: `${gridDimensions.height}px`,
                        ...gridStyle,
                    }}
                    onClick={() => onSelectItem("")}
                >
                    {items.map((item) => {
                        const size = {
                            width: item.width * gridDimensions.width,
                            height: item.height * gridDimensions.height,
                        };
                        const position = {
                            x: item.x * gridDimensions.width,
                            y:
                                (1 - item.y - item.height) *
                                gridDimensions.height,
                        };
                        const isSelected = item.id === selectedItemId;
                        const backgroundColorClass = isSelected
                            ? SELECTED_COLOR_CLASSES[item.color]
                            : UNSELECTED_COLOR_CLASSES[item.color];

                        return (
                            <Rnd
                                key={item.id}
                                size={size}
                                position={position}
                                dragGrid={[GRID_UNIT, GRID_UNIT]}
                                resizeGrid={[GRID_UNIT, GRID_UNIT]}
                                bounds="parent" // Restrict movement and resizing to the parent container
                                onDragStop={(_e, d) => {
                                    // d.x and d.y are already snapped by dragGrid
                                    let newX = d.x / gridDimensions.width;
                                    let newY = 1 - (d.y / gridDimensions.height) - item.height;

                                    // Clamp positions to max 1.0 as per requirement
                                    // x and y can be negative as blocks can go off grid
                                    newX = Math.min(1, newX);
                                    newY = Math.min(1, newY);

                                    onUpdateItem(item.id, {
                                        // Round to nearest 0.05
                                        x: roundToStep(newX, 0.05),
                                        y: roundToStep(newY, 0.05),
                                    });
                                }}
                                onResizeStop={(
                                    _e,
                                    _direction,
                                    ref,
                                    _delta,
                                    position
                                ) => {
                                    // ref.style.width/height and position.x/y are already snapped by resizeGrid
                                    const newWidth = parseFloat(ref.style.width) / gridDimensions.width;
                                    const newHeight = parseFloat(ref.style.height) / gridDimensions.height;
                                    const newX = position.x / gridDimensions.width;
                                    const newY = 1 - (position.y / gridDimensions.height) - newHeight;

                                    onUpdateItem(item.id, {
                                        width: roundToStep(newWidth, 0.05),
                                        height: roundToStep(newHeight, 0.05),
                                        x: roundToStep(newX, 0.05),
                                        y: roundToStep(newY, 0.05),
                                    });
                                }}
                                onClick={(e: {
                                    stopPropagation: () => void;
                                }) => {
                                    e.stopPropagation(); // Prevent grid click from deselecting
                                    onSelectItem(item.id);
                                }}
                                className={`flex flex-col items-center justify-center transition-all duration-200 ${backgroundColorClass} ${isSelected
                                    ? "ring-2 ring-cyan-300 z-10"
                                    : "z-0"
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    {renderChartType(item)}
                                    <span className="text-xs text-white font-mono select-none mt-1">
                                        ID: {item.id.substring(0, 4)}
                                    </span>
                                    {item.channelNumber !== "" && (
                                        <span className="text-xs text-white font-mono select-none">CH: {item.channelNumber}</span>
                                    )}
                                </div>
                            </Rnd>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Grid;