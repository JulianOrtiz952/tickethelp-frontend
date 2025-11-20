"use client";

import { useEffect, useState } from "react";
import { useAuth } from ".././auth/AuthContext";
import { api } from "../../api/client";
import { TrendingUp, Users, ClipboardList, Activity, Clock, TrendingDown } from "lucide-react"
// Ajusta este path al endpoint real en tu backend
const PERFORMANCE_PATH = "/api/reports/stats/performance/";

export default function RendimientoTecnico() {
  const { isAuthed } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthed) {
      setError("No hay usuario autenticado.");
      setLoading(false);
      return;
    }

    fetchStats().catch((e) => {
      console.error("[RendimientoTecnico] error:", e);
      setError(e?.message || "Error al cargar el panel de rendimiento.");
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  async function fetchStats() {
    setLoading(true);
    setError("");

    try {
      const data = await api(PERFORMANCE_PATH, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      setStats(data);
    } catch (err) {
      // Si tu client api lanza error con response.status, aquí puedes refinar mensajes
      setError(err?.message || "Error al cargar el panel de rendimiento.");
    } finally {
      setLoading(false);
    }
  }

  const renderDuracionPromedio = () => {
    if (!stats?.duracion_promedio_resolucion) return "—";

    const { promedio_dias, promedio_horas } = stats.duracion_promedio_resolucion;

    if (!promedio_dias && !promedio_horas) {
      return "Sin tickets finalizados aún";
    }

    return `${promedio_dias.toFixed(1)} días (${promedio_horas.toFixed(1)} h)`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B6CB0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error al cargar el panel de rendimiento</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-3 px-3 py-1.5 rounded-md text-white"
          style={{ backgroundColor: "#4494AD" }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rendimiento del Técnico</h1>
        <p className="text-gray-600 mt-1">
          Visualiza tus tiempos promedio, tickets resueltos y desempeño general.
        </p>
      </div>

      {/* Tarjetas resumen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 text-blue-600 p-3 text-xl">{<ClipboardList className="w-6 h-6 text-teal-600" />}</div>
          <div>
            <p className="text-sm text-gray-500">Tickets asignados</p>
            <p className="text-2xl font-semibold">
              {stats?.total_tickets_asignados ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="rounded-xl bg-green-50 text-green-600 p-3 text-xl">{<Activity className="w-6 h-6 text-green-600" />}</div>
          <div>
            <p className="text-sm text-gray-500">Tickets resueltos</p>
            <p className="text-2xl font-semibold">
              {stats?.total_tickets_resueltos ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="rounded-xl bg-purple-50 text-purple-600 p-3 text-xl">{<Clock className="w-6 h-6 text-purple-600" />}</div>
          <div>
            <p className="text-sm text-gray-500">Duración promedio de resolución</p>
            <p className="text-lg font-semibold">{renderDuracionPromedio()}</p>
          </div>
        </div>
      </section>

      {/* Detalle: tiempos y top 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tiempos promedio entre estados */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Tiempos promedio entre estados
          </h2>

          {stats?.tiempos_promedio_entre_estados?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-left">Transición</th>
                  <th className="py-2 text-left">Promedio (h)</th>
                  <th className="py-2 text-left">Muestras</th>
                </tr>
              </thead>
              <tbody>
                {stats.tiempos_promedio_entre_estados.map((t, idx) => (
                  <tr key={idx} className="border-b last:border-none">
                    <td className="py-2">{t.transicion}</td>
                    <td className="py-2">{t.promedio_horas.toFixed(1)} h</td>
                    <td className="py-2">{t.muestras}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay datos suficientes para calcular tiempos promedio entre estados.
            </p>
          )}
        </div>

        {/* Top 3 tickets más rápidos */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Tickets más rápidos (Top 3)
          </h2>

          {stats?.top_tres_tickets_rapidos?.length > 0 ? (
            <div className="space-y-3">
              {stats.top_tres_tickets_rapidos.map((ticket, index) => (
                <div
                  key={ticket.ticket_id}
                  className="border border-gray-200 rounded-xl p-4 flex justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                    <p className="text-sm font-semibold">
                      Ticket #{ticket.ticket_id} — {ticket.equipo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Duración</p>
                    <p className="text-sm font-semibold text-red-500">
                      {ticket.duracion_total_horas.toFixed(1)} h
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay tickets finalizados para generar el ranking.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
