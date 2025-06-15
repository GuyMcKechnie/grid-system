// src/components/grid.tsx

import React, { useLayoutEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { GridItemType } from "../types/types";

import {
    SELECTED_COLOR_CLASSES,
    UNSELECTED_COLOR_CLASSES,
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
                // The snapping logic is correct, it calculates the "safe area"
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

    const snapToGrid = (value: number) => {
        return Math.round(value / GRID_UNIT) * GRID_UNIT;
    };

    const gridStyle = {
        backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
        backgroundSize: `${GRID_UNIT}px ${GRID_UNIT}px`,
    };

    return (
        // --- OUTER WRAPPER ---
        // Its job is to fill the space and center the actual grid container.
        // It no longer has the background style or the onClick handler.
        <div
            ref={wrapperRef}
            className="w-full h-full flex items-center justify-center"
        >
            {/* --- INNER GRID CONTAINER (THE FIX) --- */}
            {/* This is our "perfect" grid. Its dimensions are explicitly set from state. */}
            {/* It gets the background, is relative, and contains the items. */}
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
                        // All these calculations are now relative to the inner grid's dimensions,
                        // which is correct.
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
                                // The `bounds="parent"` prop now correctly constrains the item
                                // to the inner grid container.
                                bounds="parent"
                                dragGrid={[GRID_UNIT, GRID_UNIT]}
                                resizeGrid={[GRID_UNIT, GRID_UNIT]}
                                onDragStop={(_e, d) => {
                                    const snappedX = snapToGrid(d.x);
                                    const snappedY = snapToGrid(d.y);
                                    const newX =
                                        snappedX / gridDimensions.width;
                                    const newY =
                                        1 -
                                        snappedY / gridDimensions.height -
                                        item.height;
                                    onUpdateItem(item.id, {
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
                                    const snappedWidth = snapToGrid(
                                        parseFloat(ref.style.width)
                                    );
                                    const snappedHeight = snapToGrid(
                                        parseFloat(ref.style.height)
                                    );
                                    const snappedX = snapToGrid(position.x);
                                    const snappedY = snapToGrid(position.y);
                                    const newWidth =
                                        snappedWidth / gridDimensions.width;
                                    const newHeight =
                                        snappedHeight / gridDimensions.height;
                                    const newX =
                                        snappedX / gridDimensions.width;
                                    const newY =
                                        1 -
                                        snappedY / gridDimensions.height -
                                        newHeight;
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
                                    e.stopPropagation();
                                    onSelectItem(item.id);
                                }}
                                className={`flex items-center justify-center transition-all duration-200 ${backgroundColorClass} ${
                                    isSelected
                                        ? "ring-2 ring-cyan-300 z-10"
                                        : "z-0"
                                }`}
                            >
                                <span className="text-xs text-white font-mono select-none">
                                    ID: {item.id.substring(0, 4)}
                                </span>
                            </Rnd>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Grid;
