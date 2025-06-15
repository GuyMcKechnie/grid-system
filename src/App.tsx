// src/App.tsx

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ControlPanel from "./components/control-panel";
import Grid from "./components/grid";
import OutputPanel from "./components/output-panel";
import type { GridItemType } from "./types/types";
import { COLOR_CONFIG } from "./config/colors"; // Import our new color config

function App() {
    const [items, setItems] = useState<GridItemType[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedItem =
        items.find((item) => item.id === selectedItemId) || null;

    const handleAddItem = () => {
        // --- CHANGE IS HERE ---
        // Get the full color object from our config array
        const color = COLOR_CONFIG[items.length % COLOR_CONFIG.length];

        const newItem: GridItemType = {
            id: uuidv4(),
            x: 0.25,
            y: 0.25,
            width: 0.2,
            height: 0.2,
            // Assign just the color's name to the item
            color: color.name,
        };
        setItems([...items, newItem]);
        setSelectedItemId(newItem.id);
    };

    // ... rest of the App.tsx component is unchanged ...

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

    return (
        <div className="bg-gray-800 text-white min-h-screen font-sans flex flex-col">
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                <div className="lg:col-span-8 bg-gray-900 p-4 rounded-lg shadow-lg flex items-center justify-center">
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
                            onAddItem={handleAddItem}
                            onUpdateItem={handleUpdateItem}
                            onDeleteItem={handleDeleteItem}
                        />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-inner min-h-96">
                        <OutputPanel items={items} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;