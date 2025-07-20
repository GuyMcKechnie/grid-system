import React, { useState } from "react";
import type { GridItemType } from "../types/types";

interface OutputPanelProps {
    items: GridItemType[];
    view: string; // View is now a global prop
}

const OutputPanel: React.FC<OutputPanelProps> = ({
    items,
    view, // Remove channelNumber from destructuring as it's not passed as a prop
}) => {
    const [copySuccess, setCopySuccess] = useState("");

    // Helper to format numbers with 'f' suffix for C# float literals
    const formatValue = (value: number) => `${value.toFixed(2)}f`;

    const formattedOutput = items.map((item) => {
        // Determine the final channel parameter for C# output
        // It should be a number if the input is a valid number,
        // otherwise it should be a quoted string literal (unless for scatter).
        const channelValue = item.channelNumber.trim();
        const num = Number(channelValue);
        const isChannelNumeric = channelValue !== "" && !isNaN(num) && isFinite(num);

        let addMethodCall: string;

        if (item.type === "scatter") {
            // For scatter, channelNumber MUST be an integer for `new int[] {channelNumber}`
            // The input field's string value is used directly here, assuming it resolves to an integer variable/constant in C# context.
            const scatterChannelParam = channelValue;
            addMethodCall = `new AreaChart().MultiTimeAutoGen(${view}.plot.layout, new Domain(${formatValue(item.x)}, ${formatValue(item.x + item.width)}, ${formatValue(item.y)}, ${formatValue(item.y + item.height)}), _dataPacket, new int[] {${scatterChannelParam}})`;
        } else {
            // For other chart types, use the original logic for channel parameter
            const finalChannelParameter = isChannelNumeric ? num : `"${channelValue}"`;

            let traceType;
            switch (item.type) {
                case "gauge":
                    traceType = "RadialGauge";
                    break;
                case "pie":
                    traceType = "PieTrace";
                    break;
                case "bar":
                    traceType = "BarTrace";
                    break;
                default:
                    traceType = "UnknownTrace"; // Fallback for unknown types
            }
            addMethodCall = `new ${traceType}().AutoGen(${view}.plot.layout, new Domain(${formatValue(item.x)}, ${formatValue(item.x + item.width)}, ${formatValue(item.y)}, ${formatValue(item.y + item.height)}), _dataPacket, ${finalChannelParameter})`;
        }
        return `${view}.plot.data.Add(${addMethodCall});`;
    });

    // Join all formatted lines with a newline
    const outputString = formattedOutput.join("\n");

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
            <div className="flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-200">
                    Output
                </h2>
                <button
                    onClick={handleCopy}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                >
                    {copySuccess || "Copy"}
                </button>
            </div>
            <div className="relative flex-grow min-h-0">
                <pre className="absolute inset-0 bg-gray-900 text-sm text-green-300 p-4 rounded-lg overflow-auto w-full font-mono">
                    <code>{outputString}</code>
                </pre>
            </div>
        </div>
    );
};

export default OutputPanel;
