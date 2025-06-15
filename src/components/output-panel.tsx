// src/components/output-panel.tsx

import React, { useState } from "react";
import type { GridItemType } from "../types/types";

interface OutputPanelProps {
    items: GridItemType[];
}

const OutputPanel: React.FC<OutputPanelProps> = ({ items }) => {
    const [copySuccess, setCopySuccess] = useState("");

    const formatValue = (value: number) => `${value.toFixed(2)}f`;

    const formattedOutput = items.map((item) => {
        const x0 = item.x;
        const x1 = item.x + item.width;
        const y0 = item.y;
        const y1 = item.y + item.height;

        return {
            id: item.id,
            color: item.color, // This will be "emerald", "amber", etc.
            bounds: `(${formatValue(x0)}, ${formatValue(x1)}, ${formatValue(
                y0
            )}, ${formatValue(y1)})`,
        };
    });

    const outputString = JSON.stringify(formattedOutput, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(outputString).then(
            () => {
                setCopySuccess("Copied!");
                setTimeout(() => setCopySuccess(""), 2000);
            },
            () => {
                setCopySuccess("Failed to copy");
            }
        );
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <h2 className="text-xl font-semibold text-gray-200 flex-shrink-0">
                Generated Coordinates
            </h2>
            <div className="relative flex-grow min-h-0">
                <pre className="absolute inset-0 bg-gray-900 text-sm text-green-300 p-4 rounded-lg overflow-auto w-full font-mono">
                    <code>{outputString}</code>
                </pre>
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-xs transition-colors z-10"
                >
                    {copySuccess || "Copy"}
                </button>
            </div>
            <p className="text-xs text-gray-500 flex-shrink-0">
                The output includes the item's assigned color and its calculated
                (x0, x1, y0, y1) bounds.
            </p>
        </div>
    );
};

export default OutputPanel;
