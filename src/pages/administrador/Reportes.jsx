"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, ClipboardList, Activity } from "lucide-react"
import { api } from "../../api/client"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"

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

// ---------- Componente Heatmap de Actividad ----------
function ActivityHeatmap({ data }) {
  const { days, ranges, matrix, max_value } = data

  // Calculate color intensity based on value
  const getColor = (value) => {
    if (!value || value === 0) return "bg-gray-100"
    const intensity = Math.min((value / max_value) * 100, 100)

    if (intensity <= 20) return "bg-blue-200"
    if (intensity <= 40) return "bg-blue-300"
    if (intensity <= 60) return "bg-blue-400"
    if (intensity <= 80) return "bg-blue-500"
    return "bg-blue-600"
  }

  return (
    <div className="space-y-4">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            {/* Time range labels */}
            <div className="flex flex-col gap-1 justify-around py-2">
              {ranges.map((range, idx) => (
                <div key={idx} className="h-12 flex items-center justify-end pr-2 text-sm text-gray-600 font-medium">
                  {range}
                </div>
              ))}
            </div>

            {/* Heatmap cells */}
            <div className="flex-1">
              {/* Day labels */}
              <div className="flex gap-1 mb-2">
                {days.map((day, idx) => (
                  <div key={idx} className="flex-1 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Matrix grid */}
              <div className="space-y-1">
                {matrix.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((value, colIdx) => (
                      <div
                        key={colIdx}
                        className={`flex-1 h-12 rounded ${getColor(value)} flex items-center justify-center text-xs font-medium text-gray-700 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                        title={`${days[colIdx]} ${ranges[rowIdx]}: ${value} tickets`}
                      >
                        {value > 0 ? value : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <span className="text-sm text-gray-600">0</span>
        <div className="flex gap-1">
          <div className="w-8 h-4 bg-gray-100 rounded"></div>
          <div className="w-8 h-4 bg-blue-200 rounded"></div>
          <div className="w-8 h-4 bg-blue-300 rounded"></div>
          <div className="w-8 h-4 bg-blue-400 rounded"></div>
          <div className="w-8 h-4 bg-blue-500 rounded"></div>
          <div className="w-8 h-4 bg-blue-600 rounded"></div>
        </div>
        <span className="text-sm text-gray-600">{max_value}+</span>
      </div>
    </div>
  )
}
