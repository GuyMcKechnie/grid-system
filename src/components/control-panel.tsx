import React from "react";
import type { ChartType, GridItemType } from "../types/types";

interface ControlPanelProps {
    selectedItem: GridItemType | null;
    onAddItem: () => void;
    onUpdateItem: (id: string, newProps: Partial<GridItemType>) => void;
    onDeleteItem: (id: string) => void;
    view: string; // Add view prop
    onUpdateView: (view: string) => void;
}

// Standard rounding to the nearest step
const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
};

const ChartTypeSelector: React.FC<{
    value: ChartType;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">
            Chart Type</label>
        <select
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        >
            <option value="gauge">Gauge</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
            <option value="bar">Bar</option>
        </select>
    </div>
);

interface TextInputFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    description?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">
            {label}
        </label>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
    </div>
);


interface NumericInputFieldProps {
    label: string;
    value: number; // Now strictly for numbers
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    description?: string;
}

const NumericInputField: React.FC<NumericInputFieldProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    placeholder,
    description,
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400">{label}</label>
            <input
                type="number"
                value={value.toFixed(2)} // Format number to 2 decimal places for display
                onChange={onChange} // Call parent's onChange directly on every input change
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />
            {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
    );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
    selectedItem,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    view, // Destructure view prop
    onUpdateView,
}) => {

    const handleItemChange = (field: "x" | "y" | "width" | "height" | "channelNumber" | "type") =>
        (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => { // This function will now be called on every keystroke
            if (!selectedItem) return;

            if (field === "channelNumber") {
                // For channelNumber, keep as string in state, parse to int in output
                onUpdateItem(selectedItem.id, { [field]: e.target.value });
            } else if (field === "type") {
                onUpdateItem(selectedItem.id, { type: e.target.value as ChartType });
            } else {
                let parsedValue = parseFloat(e.target.value);
                if (isNaN(parsedValue)) {
                    parsedValue = 0; // Default to 0 if input is not a valid number
                }

                // Apply clamping based on field
                if (field === "x" || field === "y") {
                    // Starting positions can be negative, but not over 1.0
                    parsedValue = Math.min(1, parsedValue);
                } else if (field === "width" || field === "height") {
                    // Width/Height must be positive and not over 1.0
                    parsedValue = Math.max(0, Math.min(1, parsedValue));
                }

                // Round to nearest 0.05 for coordinates
                const step = 0.05; // Changed step to 0.05
                const roundedValue = roundToStep(parsedValue, step);

                onUpdateItem(selectedItem.id, { [field]: roundedValue });
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

            <TextInputField
                label="View Name"
                placeholder="e.g., MyPlot"
                value={view}
                onChange={(e) => onUpdateView(e.target.value)}
            />

            {selectedItem ? (
                <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-300">
                        Editing Item{" "}
                        <span className="font-mono text-cyan-400">
                            {selectedItem.id.substring(0, 8)}
                        </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Position inputs */}
                        <NumericInputField
                            label="X Position"
                            value={selectedItem.x}
                            onChange={handleItemChange("x")}
                            max={1} step={0.05}
                            description="Relative horizontal position (0-1)"
                        />
                        <NumericInputField
                            label="Y Position"
                            value={selectedItem.y}
                            onChange={handleItemChange("y")}
                            max={1} step={0.05}
                            description="Relative vertical position (0-1)"
                        />
                        {/* Size inputs */}
                        <NumericInputField
                            label="Width"
                            value={selectedItem.width}
                            onChange={handleItemChange("width")}
                            min={0} max={1} step={0.05}
                            description="Relative width (0-1)"
                        />
                        <NumericInputField
                            label="Height"
                            value={selectedItem.height}
                            onChange={handleItemChange("height")}
                            min={0} max={1} step={0.05}
                            description="Relative height (0-1)"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Replace NumericInputField with TextInputField for channelNumber */}
                        <TextInputField
                            label="Channel Number"
                            value={selectedItem.channelNumber}
                            onChange={handleItemChange("channelNumber")}
                            placeholder="e.g. 'gen_frequency'"
                        /> 
                        
                        <ChartTypeSelector
                            value={selectedItem.type}
                            onChange={handleItemChange("type")}
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