import React, { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import apiClient from "../services/apiClient";

export default function AIChatPage() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse(null);
        try {
            const res = await apiClient.post("/ai/query", { query });
            console.log(res.data);
            setResponse(res.data);
        } catch (err) {
            console.error(err);
            setResponse({ response: "Error al comunicarse con el backend." });
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    const renderChart = () => {
        if (!response?.data || !response?.chartType) return null;

        const chartType = response.chartType.toLowerCase();
        let data = response.data;

        // Si el backend devuelve chartData (formato Recharts)
        if (response.chartData && response.chartData.labels && response.chartData.datasets?.length) {
            const { labels, datasets } = response.chartData;
            data = labels.map((label, index) => ({
                x: label,
                y: datasets[0].data[index],
                valor_formateado: response.data[index]?.valor_formateado,
            }));

            // Ordenar por fecha si es line chart
            if (chartType === "line" && !isNaN(Date.parse(data[0]?.x))) {
                data.sort((a, b) => new Date(a.x) - new Date(b.x));
            }
        }

        // === 📊 GRÁFICO DE BARRAS ===
        if (chartType === "bar") {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={response.chartData ? "x" : "nombre_producto"}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name, props) =>
                                props.payload.valor_formateado || `$${Number(value).toFixed(2)}`
                            }
                        />
                        <Bar dataKey={response.chartData ? "y" : "valor_numerico"} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        // === 📈 GRÁFICO DE LÍNEAS ===
        if (chartType === "line") {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={response.chartData ? "x" : "fecha_evento"} angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name, props) =>
                                props.payload.valor_formateado || `$${Number(value).toFixed(2)}`
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey={response.chartData ? "y" : "valor_numerico"}
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        // === 🥧 GRÁFICO DE TORTA ===
        if (chartType === "pie") {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={response.chartData ? "y" : "valor_numerico"}
                            nameKey={response.chartData ? "x" : "nombre_producto"}
                            outerRadius={120}
                            label={({ name, payload }) =>
                                `${name}: ${payload.valor_formateado || `$${payload.y?.toFixed(2)}`}`
                            }
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) =>
                                props.payload.valor_formateado || `$${Number(value).toFixed(2)}`
                            }
                        />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        // === 🚫 CASO POR DEFECTO ===
        return <p className="text-gray-500 italic">No se puede renderizar este tipo de gráfico.</p>;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg text-slate-900 dark:text-white space-y-6">
            <h2 className="text-2xl font-bold text-center">🤖 Chat Analítico con IA</h2>

            {/* === Campo de consulta === */}
            <div className="flex gap-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ej: productos con más ventas"
                    className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                    {loading ? "Consultando..." : "Enviar"}
                </button>
            </div>

            {/* === Mensajes dinámicos === */}
            {loading && (
                <p className="text-blue-500 italic text-center mt-4">
                    Consultando a la IA... esto puede tardar unos segundos.
                </p>
            )}
            {!loading && !response && (
                <p className="text-gray-500 italic text-center mt-4">
                    Escribí una consulta, por ejemplo: “evolución del stock del Galaxy S24”.
                </p>
            )}

            {/* === Resultado IA + gráfico === */}
            {response && (
                <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[400px]">
                        <p className="text-slate-900 dark:text-gray-100 leading-relaxed">{response.response}</p>
                    </div>
                    <div className="flex-1 flex justify-center items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        {renderChart()}
                    </div>
                </div>
            )}
        </div>
    );
}
