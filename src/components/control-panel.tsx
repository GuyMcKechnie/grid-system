import React from "react";
import type { GridItemType } from "../types/types";

interface ControlPanelProps {
    selectedItem: GridItemType | null;
    onAddItem: () => void;
    onUpdateItem: (id: string, newProps: Partial<GridItemType>) => void;
    onDeleteItem: (id: string) => void;
}

const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
};

const InputField: React.FC<{
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">
            {label}
        </label>
        <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={value.toFixed(2)}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
    </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
    selectedItem,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
}) => {
    const handleInputChange =
        (field: keyof GridItemType) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (selectedItem) {
                const roundedValue = roundToStep(
                    parseFloat(e.target.value),
                    0.05
                );
                onUpdateItem(selectedItem.id, {
                    [field]: roundedValue,
                });
            }
        };

    return (
        <div className="flex flex-col h-full space-y-6">
            <h2 className="text-xl font-semibold text-gray-200">Controls</h2>
            <button
                onClick={onAddItem}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                Add New Item
            </button>

            {selectedItem ? (
                <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-300">
                        Editing Item{" "}
                        <span className="font-mono text-cyan-400">
                            {selectedItem.id.substring(0, 8)}
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="X Position"
                            value={selectedItem.x}
                            onChange={handleInputChange("x")}
                        />
                        <InputField
                            label="Y Position"
                            value={selectedItem.y}
                            onChange={handleInputChange("y")}
                        />
                        <InputField
                            label="Width"
                            value={selectedItem.width}
                            onChange={handleInputChange("width")}
                        />
                        <InputField
                            label="Height"
                            value={selectedItem.height}
                            onChange={handleInputChange("height")}
                        />
                    </div>
                    <button
                        onClick={() => onDeleteItem(selectedItem.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4"
                    >
                        Delete Selected Item
                    </button>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-center p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-400">
                        Click "Add New Item" to start, or click an existing item
                        on the grid to select it.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
