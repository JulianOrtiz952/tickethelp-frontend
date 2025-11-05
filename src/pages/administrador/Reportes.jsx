"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, ClipboardList, Activity, Clock } from "lucide-react"
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

function getCriticalityColor(dias) {
  if (dias >= 15) return "#ef4444" // red - very critical
  if (dias >= 10) return "#f97316" // orange - critical
  if (dias >= 5) return "#eab308" // yellow - warning
  return "#3b82f6" // blue - normal
}

function getCriticalityBgColor(dias) {
  if (dias >= 15) return "text-red-600"
  if (dias >= 10) return "text-orange-600"
  if (dias >= 5) return "text-yellow-600"
  return "text-blue-600"
}

function capitalizeStatus(status) {
  if (!status) return ""
  return status
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default function Reportes() {
  const [generalStats, setGeneralStats] = useState(null)
  const [ranking, setRanking] = useState([])
  const [clientsEvolution, setClientsEvolution] = useState(null)
  const [heatmapData, setHeatmapData] = useState(null)
  const [statusDistribution, setStatusDistribution] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [year] = useState(new Date().getFullYear())
  const [month] = useState(String(new Date().getMonth() + 1).padStart(2, "0"))
  const [avgResolutionTime, setAvgResolutionTime] = useState(null)
  const [resolutionsByWeekday, setResolutionsByWeekday] = useState(null)
  const [criticalTickets, setCriticalTickets] = useState(null)
  const [flowFunnel, setFlowFunnel] = useState(null)

  useEffect(() => {
    fetchData()
  }, [year, month])

  async function fetchData() {
    try {
      setLoading(true)
      setError("")

      const [
        statsRes,
        rankRes,
        clientsRes,
        heatmapRes,
        avgResTimeRes,
        resolutionsByWeekdayRes,
        criticalRes,
        flowFunnelRes,
      ] = await Promise.all([
        api("/api/reports/stats/general-stats/").catch((e) => {
          console.error("Error en general-stats:", e.status, e.data)
          throw e
        }),
        api(
          `/api/reports/stats/performance-ranking/?from=${new Date().toISOString().split("T")[0]}&to=${new Date().toISOString().split("T")[0]}`,
        ).catch((e) => {
          console.error("Error en performance-ranking:", e.status, e.data)
          throw e
        }),
        api(`/api/reports/stats/clients-evolution/?year=${year}`).catch((e) => {
          console.error("Error en clients-evolution:", e.status, e.data)
          throw e
        }),
        api(`/api/reports/stats/activity-heatmap/?year=${year}&month=${month}`).catch((e) => {
          console.error("Error en activity-heatmap:", e.status, e.data)
          throw e
        }),
        api("/api/reports/stats/avg-resolution-time/").catch((e) => {
          console.error("Error en avg-resolution-time:", e.status, e.data)
          throw e
        }),
        api("/api/reports/stats/resolutions-by-weekday/").catch((e) => {
          console.error("Error en resolutions-by-weekday:", e.status, e.data)
          throw e
        }),
        api("/api/reports/stats/aging-top/").catch((e) => {
          console.error("Error en aging-top:", e.status, e.data)
          throw e
        }),
        api("/api/reports/stats/flow-funnel/").catch((e) => {
          console.error("Error en flow-funnel:", e.status, e.data)
          throw e
        }),
      ])

      setGeneralStats(statsRes)
      setRanking(rankRes)
      setClientsEvolution(clientsRes)
      setHeatmapData(heatmapRes)
      setAvgResolutionTime(avgResTimeRes)
      setResolutionsByWeekday(resolutionsByWeekdayRes)
      setCriticalTickets(criticalRes)
      setFlowFunnel(flowFunnelRes)
    } catch (e) {
      console.error("Error cargando reportes:", e)
      const errorMsg = e?.data?.detail || e?.message || "Error al cargar los reportes. Intenta nuevamente."
      setError(errorMsg)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
      </div>

      {/* ---------- Estadísticas generales ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
          value={generalStats?.promedio_exito ? `${Math.round(generalStats.promedio_exito)}%` : "0%"}
          color="bg-indigo-50 text-indigo-700"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          title="Tiempo Promedio"
          value={avgResolutionTime ? `${avgResolutionTime.promedio_dias.toFixed(1)} días` : "N/A"}
          subtitle={
            avgResolutionTime
              ? `${avgResolutionTime.promedio_horas.toFixed(1)}h • ${avgResolutionTime.tickets_contemplados} tickets`
              : null
          }
          color="bg-purple-50 text-purple-700"
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

      {/* ---------- Distribución por Estado y Tickets Cerrados por Día ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por Estado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Estado</h2>
          <StatusDistribution data={statusDistribution} onRefresh={fetchData} />
        </div>

        {/* Tickets Cerrados por Día */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tickets Cerrados por Día</h2>
          <ResolutionsByWeekday data={resolutionsByWeekday} />
        </div>
      </div>

      {/* ---------- Tickets Críticos y Embudo de Flujo ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Críticos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tickets Críticos (Top 10)</h2>
          <div className="max-h-[360px] overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {criticalTickets && criticalTickets.length > 0 ? (
              criticalTickets.map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  style={{
                    borderLeft: `4px solid ${getCriticalityColor(ticket.dias)}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">#{ticket.ticket_id}</p>
                      <div className={`font-bold text-sm whitespace-nowrap ${getCriticalityBgColor(ticket.dias)}`}>
                        {Math.ceil(ticket.dias)} día{Math.ceil(ticket.dias) !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1" title={ticket.titulo}>
                      {ticket.titulo}
                    </p>
                    {ticket.cliente_nombre && (
                      <p className="text-xs text-gray-500 mb-1 truncate" title={ticket.cliente_nombre}>
                        <span className="font-medium">Cliente:</span> {ticket.cliente_nombre}
                      </p>
                    )}
                    {ticket.tecnico_nombre && (
                      <p className="text-xs text-gray-500 mb-1 truncate" title={ticket.tecnico_nombre}>
                        <span className="font-medium">Técnico:</span> {ticket.tecnico_nombre}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                        {capitalizeStatus(ticket.estado_nombre)}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No hay tickets críticos en este momento.</p>
            )}
          </div>
        </div>

        {/* Flow Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Embudo de Flujo</h2>
          <FlowFunnel data={flowFunnel} />
        </div>
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
                          <div
                            className={`h-full transition-all ${getSuccessBarColor(r.porcentaje_exito)}`}
                            style={getSuccessBarStyle(r.porcentaje_exito)}
                          ></div>
                        </div>
                        <span className={`font-medium ${getSuccessTextColor(r.porcentaje_exito)}`}>
                          {Math.round(r.porcentaje_exito)}%
                        </span>
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

function StatusDistribution({ data, onRefresh }) {
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    )
  })

  const [toDate, setToDate] = useState(() => {
    const date = new Date()
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    )
  })

  const [dateError, setDateError] = useState("")
  const [statusData, setStatusData] = useState(null)
  const [loading, setStatusLoading] = useState(false)

  function validateDateRange(from, to) {
    if (!from || !to) return { valid: false, error: "Ambas fechas son requeridas" }

    const fromD = new Date(from + "T00:00:00")
    const toD = new Date(to + "T23:59:59")

    if (fromD > toD) {
      return { valid: false, error: "La fecha de inicio debe ser menor que la fecha de fin" }
    }

    const diffTime = Math.abs(toD - fromD)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 365) {
      return { valid: false, error: "El rango de búsqueda no puede ser mayor a un año (365 días)" }
    }

    return { valid: true, error: "" }
  }

  const handleDateChange = async (type, newDate) => {
    if (type === "from") {
      setFromDate(newDate)
    } else {
      setToDate(newDate)
    }

    const validation = validateDateRange(type === "from" ? newDate : fromDate, type === "to" ? newDate : toDate)
    if (!validation.valid) {
      setDateError(validation.error)
    } else {
      setDateError("")
      try {
        setStatusLoading(true)
        const newFromDate = type === "from" ? newDate : fromDate
        const newToDate = type === "to" ? newDate : toDate
        const res = await api(`/api/reports/stats/status-distribution/?from=${newFromDate}&to=${newToDate}`)
        setStatusData(res)
      } catch (e) {
        console.error("Error fetching status distribution:", e)
        setDateError("Error al cargar los datos. Intenta nuevamente.")
      } finally {
        setStatusLoading(false)
      }
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setStatusLoading(true)
        const res = await api(`/api/reports/stats/status-distribution/?from=${fromDate}&to=${toDate}`)
        setStatusData(res)
      } catch (e) {
        console.error("Error fetching initial status distribution:", e)
      } finally {
        setStatusLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const rawData = statusData?.items || []

  const statusColorMap = {
    finalized: "#9FCB58", // bright green - Finalizado
    diagnosis: "#FFD349", // bright orange - En diagnóstico
    in_repair: "#5894CB", // bright blue - En reparación
    open: "#FF7978", // bright red - Abierto
    trial: "#B678FB", // bright magenta - En pruebas
  }

  const formattedData = rawData
    .filter((item) => item.cantidad > 0)
    .map((item) => {
      const capitalizedName = item.estado_nombre
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")

      return {
        name: capitalizedName,
        value: item.cantidad,
        percentage: item.porcentaje,
        color: statusColorMap[item.estado_codigo] || "#f3f4f6",
      }
    })

  const [hoveredState, setHoveredState] = useState(null)

  const displayData = formattedData.length > 0 ? formattedData : []

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Desde:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Hasta:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {dateError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">{dateError}</div>
      )}

      {loading && <div className="text-center text-gray-500 text-sm py-4">Cargando datos...</div>}

      {!loading && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex items-center justify-center">
            {displayData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setHoveredState(index)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    {displayData.map((entry, index) => (
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
                      `${value} tickets (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay datos disponibles para el rango seleccionado.</p>
            )}
          </div>

          {/* Legend with percentages */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
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
                      {item.percentage.toFixed(1)}% ({item.value} tickets)
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Sin datos para mostrar</p>
            )}
          </div>
        </div>
      )}
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

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="rounded-xl p-5 flex items-center gap-4 bg-white border border-gray-200">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function getSuccessBarColor(percentage) {
  if (percentage < 25) return "bg-red-500"
  if (percentage < 50) return "bg-yellow-400"
  if (percentage < 75) return "bg-orange-400"
  if (percentage < 100) return "bg-green-400"
  return "bg-gradient-to-r from-green-500 via-teal-400 to-green-600"
}

function getSuccessTextColor(percentage) {
  if (percentage < 25) return "text-red-600"
  if (percentage < 50) return "text-yellow-600"
  if (percentage < 75) return "text-orange-600"
  if (percentage < 100) return "text-green-600"
  return "text-green-700"
}

function getSuccessBarStyle(percentage) {
  if (percentage === 100) {
    return {
      width: "100%",
      animation: "gradient-flow 2s ease-in-out infinite",
      backgroundSize: "200% 100%",
      backgroundImage: "linear-gradient(90deg, #22c55e, #14b8a6, #22c55e)",
    }
  }
  return { width: `${percentage}%` }
}

function ResolutionsByWeekday({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null)

  const chartData = data
    ? Object.entries(data).map(([dayName, count]) => {
        const dayMap = {
          lunes: "Lun",
          martes: "Mar",
          miercoles: "Mié",
          jueves: "Jue",
          viernes: "Vie",
          sabado: "Sáb",
          domingo: "Dom",
        }
        return {
          day: dayMap[dayName] || dayName,
          "Tickets Cerrados": count,
        }
      })
    : []

  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d["Tickets Cerrados"])) : 0
  const yAxisMax = Math.ceil((maxValue + 1) / 2) * 2

  return (
    <div className="space-y-4">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            onMouseLeave={() => setHoveredDay(null)}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={[0, yAxisMax]}
              ticks={Array.from({ length: yAxisMax / 2 + 1 }, (_, i) => i * 2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px",
              }}
              formatter={(value) => [`${value}`, "Tickets Cerrados"]}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="Tickets Cerrados"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-sm text-center py-8">No hay datos disponibles.</p>
      )}
    </div>
  )
}

function FlowFunnel({ data }) {
  // Map status codes to colors matching the status distribution chart
  const statusColorMap = {
    finalized: "#9FCB58", // bright green
    diagnosis: "#FFD349", // bright yellow
    in_repair: "#5894CB", // bright blue
    open: "#FF7978", // bright red
    trial: "#B678FB", // bright magenta
    created: "#3b82f6", // blue for created status
    assigned: "#eab308", // yellow for assigned
    in_progress: "#f97316", // orange for in progress
    closed: "#22c55e", // green for closed
  }

  const items = data?.items || []

  // Capitalize status names
  const formattedItems = items.map((item) => ({
    ...item,
    nombre: item.nombre
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    color: statusColorMap[item.codigo] || "#9ca3af",
  }))

  return (
    <div className="space-y-4">
      {formattedItems.length > 0 ? (
        formattedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${item.porcentaje}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap min-w-fit">
              {item.nombre} ({item.porcentaje.toFixed(0)}%)
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center py-8">No hay datos disponibles para el embudo de flujo.</p>
      )}
    </div>
  )
}
