"use client";

import { useState } from "react";
import InfoTooltip from "./InfoTooltip";

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
    {
        label: "📦 General",
        emojis: ["📦", "🏷️", "🛒", "🛍️", "💰", "🎁", "📋", "📎", "🧾", "💳", "🪙", "🏪"],
    },
    {
        label: "💻 Tech",
        emojis: ["💻", "📱", "🖥️", "⌚", "🎧", "🎮", "📷", "🖨️", "💾", "🔌", "🔋", "📡", "🖱️", "⌨️", "📺", "🎙️"],
    },
    {
        label: "👕 Ropa",
        emojis: ["👕", "👖", "👗", "👠", "👟", "🧢", "🕶️", "👜", "🧤", "🧦", "🧣", "👔", "👙", "🩳", "🥾", "👒"],
    },
    {
        label: "🍕 Comida",
        emojis: ["🍕", "🍔", "🍞", "🥩", "🍗", "🥗", "🍣", "🌮", "🥐", "🧁", "🍫", "🍪", "☕", "🧃", "🥤", "🍷", "🍺", "🧉", "🥛", "🍰"],
    },
    {
        label: "🔧 Herramientas",
        emojis: ["🔧", "🔨", "🪛", "⚙️", "🔩", "💡", "🔑", "🧲", "🪚", "🧰", "🪣", "🧹"],
    },
    {
        label: "💊 Salud",
        emojis: ["💊", "🩹", "🧴", "🪥", "🧼", "🩺", "💉", "🌡️", "🧪", "♿", "🏥", "🩻"],
    },
    {
        label: "📚 Oficina",
        emojis: ["📚", "✏️", "📝", "📐", "📏", "🖊️", "📓", "🗂️", "📌", "📎", "✂️", "🧮"],
    },
    {
        label: "⚽ Deportes",
        emojis: ["⚽", "🏀", "🎾", "🏈", "⚾", "🏐", "🎳", "🏓", "🥊", "🎣", "🏋️", "🚴"],
    },
    {
        label: "🚗 Vehículos",
        emojis: ["🚗", "🏍️", "🚲", "🛵", "🚚", "✈️", "🚢", "⛽", "🛞", "🪖", "🛟", "🧳"],
    },
    {
        label: "🏠 Hogar",
        emojis: ["🛋️", "🪴", "🕯️", "🧸", "🛏️", "🪑", "🚿", "🧊", "🍳", "🥄", "🧽", "🪞", "🖼️", "⏰", "💐", "🪔"],
    },
    {
        label: "🎨 Arte",
        emojis: ["🎨", "🎸", "🎹", "🎺", "🥁", "🎤", "🎬", "🎭", "🧵", "🪡", "🎯", "🎲"],
    },
    {
        label: "💎 Lujo",
        emojis: ["💎", "💍", "👑", "🏆", "🎖️", "🥇", "✨", "🌟", "⭐", "🔮", "🪩", "🎀"],
    },
];

const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap((c) => c.emojis);

interface IconSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
    const [mode, setMode] = useState<"emoji" | "url">(
        value && value.startsWith("http") ? "url" : "emoji"
    );
    const [showGrid, setShowGrid] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);

    const selectedEmoji = !value || value.startsWith("http") ? "📦" : value;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                    Icono del producto
                    <InfoTooltip text="Elige un emoji para representar visualmente tu producto en el catálogo." />
                </label>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => { setMode("emoji"); if (value?.startsWith("http")) onChange(""); }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${mode === "emoji"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Emoji
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode("url"); setShowGrid(false); }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${mode === "url"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        URL
                    </button>
                </div>
            </div>

            {mode === "emoji" ? (
                <div>
                    {/* Selector preview */}
                    <button
                        type="button"
                        onClick={() => setShowGrid(!showGrid)}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                    >
                        <span className="text-3xl transition-transform group-hover:scale-110">
                            {selectedEmoji}
                        </span>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-slate-700">
                                {showGrid ? "Elige un icono" : "Icono seleccionado"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Haz clic para {showGrid ? "cerrar" : "cambiar"}
                            </span>
                        </div>
                    </button>

                    {/* Grid de emojis con categorías */}
                    {showGrid && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Tabs de categoría */}
                            <div className="flex gap-1 px-3 pt-3 pb-2 overflow-x-auto scrollbar-thin">
                                {EMOJI_CATEGORIES.map((cat, i) => (
                                    <button
                                        key={cat.label}
                                        type="button"
                                        onClick={() => setActiveCategory(i)}
                                        className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all ${i === activeCategory
                                                ? "bg-blue-100 text-blue-700 shadow-sm"
                                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Emojis de la categoría activa */}
                            <div className="px-3 pb-3 grid grid-cols-8 gap-1">
                                {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => {
                                            onChange(emoji);
                                            setShowGrid(false);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg transition-all hover:scale-110 ${selectedEmoji === emoji
                                                ? "bg-blue-100 ring-2 ring-blue-400 scale-110"
                                                : "hover:bg-slate-50"
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hidden input to submit the emoji */}
                    <input type="hidden" name="image_url" value={value?.startsWith("http") ? "" : (value || "")} />
                </div>
            ) : (
                <input
                    name="image_url"
                    type="url"
                    value={value?.startsWith("http") ? value : ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition placeholder:text-slate-300"
                />
            )}
        </div>
    );
}
