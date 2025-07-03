import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ControlPanel from "./components/control-panel";
import Grid from "./components/grid";
import OutputPanel from "./components/output-panel";
import { COLOR_CONFIG } from "./config/colors";
import type { GridItemType } from "./types/types";

// Standard rounding to the nearest step
const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
};

function App() {
    const LOCAL_STORAGE_KEY = "dashboardConfig";

    // Load state from local storage on initial render
    const [items, setItems] = useState<GridItemType[]>(() => {
        try {
            const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedConfig) {
                const parsedConfig = JSON.parse(storedConfig);
                const loadedItems: GridItemType[] = parsedConfig.items || [];
                const step = 0.05; // Changed step to 0.05
                return loadedItems.map(item => ({ // Ensure channelNumber is string
                    ...item,
                    x: roundToStep(item.x, step),
                    y: roundToStep(item.y, step),
                    width: roundToStep(item.width, step),
                    height: roundToStep(item.height, step),
                }));
            }
            // If no config, return empty array, channelNumber will be initialized as string when new item is added
            return [];
        } catch (error) {
            console.error("Failed to parse stored items from local storage", error);
            return [];
        }
    });
    const [view, setView] = useState<string>(() => {
        try {
            const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
            return storedConfig ? JSON.parse(storedConfig).view || "" : "";
        } catch (error) {
            console.error("Failed to parse stored view from local storage", error);
            return "";
        }
    });

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedItem =
        items.find((item) => item.id === selectedItemId) || null;

    const handleAddItem = () => {
        const color = COLOR_CONFIG[items.length % COLOR_CONFIG.length];

        const step = 0.05; // Changed step to 0.05
        const newItem: GridItemType = {
            id: uuidv4(),
            x: roundToStep(0.25, step),
            y: roundToStep(0.25, step),
            width: roundToStep(0.2, step),
            height: roundToStep(0.2, step),
            color: color.name,
            type: "gauge", // Default chart type
            channelNumber: "", // Initialize channel number for new items
        };
        setItems([...items, newItem]);
        setSelectedItemId(newItem.id);
    };

    const handleUpdateItem = (id: string, newProps: Partial<GridItemType>) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id ? { ...item, ...newProps } : item
            )
        );
    };

    const handleDeleteItem = (id: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== id)
        );
        if (selectedItemId === id) {
            setSelectedItemId(null);
        }
    };

    // Save state to local storage whenever items or view changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ items, view }));
        } catch (error) {
            console.error("Failed to save config to local storage", error);
        }
    }, [items, view]);

    // Add keyboard listeners for delete and add item
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Delete selected item with Delete key
            if (event.key === "Delete" && selectedItemId) {
                handleDeleteItem(selectedItemId);
            }

            // Add new item with Ctrl+N (or Cmd+N on Mac)
            if (event.key === "n" && (event.ctrlKey || event.metaKey)) {
                event.preventDefault(); // Prevent browser's default new window/tab behavior
                handleAddItem();
            }
        };

        // Attach the event listener to the document
        document.addEventListener("keydown", handleKeyDown);

        // Clean up the event listener when the component unmounts or dependencies change
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedItemId, handleDeleteItem, handleAddItem]); // Dependencies: selectedItemId for delete, and the functions themselves



    return (
        <div className="bg-gray-800 text-white min-h-screen font-sans flex flex-col">
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                <div className="lg:col-span-8 bg-gray-900 p-4 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
                    <Grid
                        items={items}
                        onUpdateItem={handleUpdateItem}
                        selectedItemId={selectedItemId}
                        onSelectItem={setSelectedItemId}
                    />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                        <ControlPanel
                            selectedItem={selectedItem}
                            view={view}
                            onAddItem={handleAddItem}
                            onUpdateItem={handleUpdateItem}
                            onDeleteItem={handleDeleteItem}
                            onUpdateView={setView}
                        />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex-grow flex flex-col">
                        <OutputPanel items={items} view={view} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;