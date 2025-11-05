"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, ClipboardList, Activity } from "lucide-react"
import { api } from "../../api/client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function Reportes() {
  const [generalStats, setGeneralStats] = useState(null)
  const [ranking, setRanking] = useState([])
  const [clientsEvolution, setClientsEvolution] = useState(null)
  const [heatmapData, setHeatmapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [year] = useState(new Date().getFullYear())
  const [month] = useState(String(new Date().getMonth() + 1).padStart(2, "0"))

  useEffect(() => {
    fetchData()
  }, [year, month])

  async function fetchData() {
    try {
      setLoading(true)
      setError("")

      const [statsRes, rankRes, clientsRes, heatmapRes] = await Promise.all([
        api("/api/reports/stats/general-stats/"),
        api("/api/reports/stats/performance-ranking/"),
        api(`/api/reports/stats/clients-evolution/?year=${year}`),
        api(`/api/reports/stats/activity-heatmap/?year=${year}&month=${month}`),
      ])

      setGeneralStats(statsRes)
      console.log("[v0] General Stats:", statsRes)
      setRanking(rankRes)
      console.log("[v0] Ranking:", rankRes)
      setClientsEvolution(clientsRes)
      console.log("[v0] Clients Evolution:", clientsRes)
      setHeatmapData(heatmapRes)
      console.log("[v0] Heatmap Data:", heatmapRes)
    } catch (e) {
      console.error("[v0] Error cargando reportes:", e)
      setError("Error al cargar los reportes. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Cargando reportes...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">{error}</p>
        <button
          onClick={fetchData}
          className="mt-3 px-3 py-1.5 rounded-md text-white"
          style={{ backgroundColor: "#1F5E89" }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  const chartData = clientsEvolution?.mensual
    ? Object.entries(clientsEvolution.mensual).map(([month, value]) => ({
        mes: month,
        clientes: value,
      }))
    : []

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
        <div className="text-sm text-gray-500">Año: {year}</div>
      </div>

      {/* ---------- Estadísticas generales ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList className="w-6 h-6 text-teal-600" />}
          title="Tickets Abiertos"
          value={generalStats?.tickets_abiertos ?? 0}
          color="bg-teal-50 text-teal-700"
        />
        <StatCard
          icon={<Activity className="w-6 h-6 text-green-600" />}
          title="Tickets Finalizados"
          value={generalStats?.tickets_finalizados ?? 0}
          color="bg-green-50 text-green-700"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Total Clientes"
          value={clientsEvolution?.total_clientes ?? 0}
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
          title="Promedio de Éxito"
          value={
            ranking.length
              ? `${Math.round(ranking.reduce((acc, r) => acc + (r.porcentaje_exito || 0), 0) / ranking.length)}%`
              : "0%"
          }
          color="bg-indigo-50 text-indigo-700"
        />
      </div>

      {/* ---------- Gráfico de evolución de clientes ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Evolución de Clientes por Mes</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clientes" stroke="#1F5E89" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No hay datos disponibles para el año seleccionado.</p>
        )}
      </div>

      {/* ---------- Distribución por Estado ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h2>
        <StatusDistribution />
      </div>

      {/* ---------- Heatmap de Actividad ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Heatmap de Actividad</h2>
        {heatmapData && heatmapData.matrix ? (
          <ActivityHeatmap data={heatmapData} />
        ) : (
          <p className="text-gray-500 text-sm">No hay datos disponibles para el heatmap.</p>
        )}
      </div>

      {/* ---------- Ranking de desempeño ---------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ranking de Desempeño de Técnicos</h2>
        {ranking.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="py-2 px-4 text-left">Técnico</th>
                  <th className="py-2 px-4 text-center">Asignados</th>
                  <th className="py-2 px-4 text-center">Resueltos</th>
                  <th className="py-2 px-4 text-center">Éxito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ranking.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 px-4">{r.nombre_completo}</td>
                    <td className="py-2 px-4 text-center">{r.tickets_asignados}</td>
                    <td className="py-2 px-4 text-center">{r.tickets_resueltos}</td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500" style={{ width: `${r.porcentaje_exito}%` }}></div>
                        </div>
                        <span className="text-gray-700 font-medium">{Math.round(r.porcentaje_exito)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay información disponible del ranking de técnicos.</p>
        )}
      </div>
    </div>
  )
}

// ... existing components ...

function StatusDistribution() {
  // Static data for styling review - will be replaced with API call when endpoint is ready
  const staticData = [
    { name: "Abierto", value: 45, color: "#EF4444" },
    { name: "En diagnóstico", value: 28, color: "#F59E0B" },
    { name: "En reparación", value: 52, color: "#3B82F6" },
    { name: "En pruebas", value: 18, color: "#8B5CF6" },
    { name: "Finalizado", value: 157, color: "#10B981" },
  ]

  const total = staticData.reduce((sum, item) => sum + item.value, 0)

  const [hoveredState, setHoveredState] = useState(null)

  // Calculate percentage for each state
  const dataWithPercentage = staticData.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1),
  }))

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Pie Chart */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredState(index)}
              onMouseLeave={() => setHoveredState(null)}
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={hoveredState === null || hoveredState === index ? 1 : 0.6}
                  style={{ transition: "opacity 0.2s" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              formatter={(value, name, props) => [
                `${value} tickets (${((value / total) * 100).toFixed(1)}%)`,
                props.payload.name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {dataWithPercentage.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
            onMouseEnter={() => setHoveredState(index)}
            onMouseLeave={() => setHoveredState(null)}
          >
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-600">
                {item.percentage}% ({item.value} tickets)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Componente tarjeta de estadísticas ----------
function StatCard({ icon, title, value, color }) {
  return (
    <div className="rounded-xl p-5 flex items-center gap-4 bg-white border border-gray-200">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function ActivityHeatmap({ data }) {
  const { days, ranges, matrix, max_value } = data
  const [hoveredCell, setHoveredCell] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const getColor = (value) => {
    if (!value || value === 0) return "bg-blue-50"
    const intensity = value / max_value

    if (intensity <= 0.125) return "bg-blue-100"
    if (intensity <= 0.25) return "bg-blue-200"
    if (intensity <= 0.375) return "bg-blue-300"
    if (intensity <= 0.5) return "bg-blue-400"
    if (intensity <= 0.625) return "bg-blue-500"
    if (intensity <= 0.75) return "bg-blue-600"
    if (intensity <= 0.875) return "bg-blue-700"
    return "bg-blue-800"
  }

  const handleCellHover = (e, rowIdx, colIdx, value) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
    setHoveredCell({ row: rowIdx, col: colIdx, value, day: days[colIdx], range: ranges[rowIdx] })
  }

  const handleCellLeave = () => {
    setHoveredCell(null)
  }

  return (
    <div className="space-y-8 relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-6">
            {/* Time Range Labels (Rows) */}
            <div className="flex flex-col gap-0 justify-start py-8 min-w-max">
              <div className="h-8 flex items-end"></div>
              {ranges.map((range, idx) => (
                <div
                  key={idx}
                  className="h-10 flex items-center justify-end pr-2 text-xs font-semibold text-gray-700 min-w-16"
                >
                  {range}
                </div>
              ))}
            </div>

            {/* Heatmap Grid Cells */}
            <div className="flex-1">
              {/* Day Headers (Columns) */}
              <div className="flex mb-4 px-0">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex-1 text-center text-xs font-semibold text-gray-700 h-8 flex items-end justify-center pb-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                {matrix.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((value, colIdx) => (
                      <div
                        key={colIdx}
                        className={`flex-1 h-10 ${getColor(value)} cursor-pointer transition-all duration-100 hover:ring-2 hover:ring-offset-1 hover:ring-blue-500 rounded`}
                        onMouseEnter={(e) => handleCellHover(e, rowIdx, colIdx, value)}
                        onMouseLeave={handleCellLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hoveredCell && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-lg px-3 py-2 text-xs z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="font-semibold text-gray-900">{hoveredCell.day}</div>
          <div className="text-gray-600">{hoveredCell.range}</div>
          <div className="text-blue-600 font-bold mt-1">{hoveredCell.value} tickets</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}

      {/* Color Scale Legend */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
        <span className="text-xs font-medium text-gray-600">0</span>
        <div className="flex gap-0">
          <div className="w-5 h-5 bg-blue-50"></div>
          <div className="w-5 h-5 bg-blue-100"></div>
          <div className="w-5 h-5 bg-blue-200"></div>
          <div className="w-5 h-5 bg-blue-300"></div>
          <div className="w-5 h-5 bg-blue-400"></div>
          <div className="w-5 h-5 bg-blue-500"></div>
          <div className="w-5 h-5 bg-blue-600"></div>
          <div className="w-5 h-5 bg-blue-700"></div>
        </div>
        <span className="text-xs font-medium text-gray-600">{Math.round(max_value)}</span>
      </div>
    </div>
  )
}
