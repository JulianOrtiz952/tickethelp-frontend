import React, { useState } from "react";
import ConsultaUsuario from "../../components/ConsultaUsuario";
import DatosCliente from "../../components/DatosCliente";
import DatosEquipo from "../../components/DatosEquipo";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import ModalNotificacion from "../../components/ModalNotificacion";
import { api } from "../../api/client";
import { ticketService } from "../../api/ticketService";
import { useAuth } from "../auth/AuthContext";
import imageCompression from 'browser-image-compression';

export default function GestionarTickets() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [equipo, setEquipo] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tecnico, setTecnico] = useState(null);
  const [cargandoTecnico, setCargandoTecnico] = useState(false);
  const [creandoTicket, setCreandoTicket] = useState(false);
  const [adjuntos, setAdjuntos] = useState([]);
  const [noti, setNoti] = useState({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const cerrarNoti = () => setNoti((n) => ({ ...n, open: false }));

  const manejarUsuarioEncontrado = (data) => {
    setUsuario(data);
    setMensaje("");
  };

  const manejarCambioEquipo = (e) => {
    const { name, value } = e.target;
    setEquipo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const obtenerTecnicoMenosOcupado = async () => {
    try {
      setCargandoTecnico(true);
      const response = await api("/api/tickets/least-busy-technician/");
      const tecnicoData = response?.data || response;
      setTecnico(tecnicoData);
      return tecnicoData;
    } catch {
      setMensaje("❌ Error al obtener técnico disponible. Intente nuevamente.");
      return null;
    } finally {
      setCargandoTecnico(false);
    }
  };

  const validarDatos = () => {
    if (!usuario) {
      setMensaje("❌ Debe consultar un cliente antes de guardar el ticket.");
      return false;
    }
    if (!equipo.problema || !equipo.equipo || !equipo.descripcion) {
      setMensaje("❌ Complete todos los campos del equipo antes de guardar.");
      return false;
    }
    return true;
  };

  const abrirModalConfirmacion = async () => {
    if (!validarDatos()) return;
    const tecnicoObtenido = await obtenerTecnicoMenosOcupado();
    if (tecnicoObtenido) setMostrarModal(true);
  };

  const confirmarRegistro = async () => {
    try {
      setCreandoTicket(true);
      if (!usuario?.document) throw new Error("Falta documento del cliente");
      if (!tecnico?.id) throw new Error("Falta ID del técnico");

      const fechaActual = new Date().toISOString().split("T")[0];

      const datosTicket = {
        administrador: user?.document || "9000000001",
        tecnico: tecnico.id,
        cliente: usuario.document,
        estado: 1,
        titulo: equipo.problema,
        descripcion: equipo.descripcion,
        equipo: equipo.equipo,
        fecha: fechaActual,
      };

      const createdTicket = await api("/api/tickets/", {
        method: "POST",
        body: datosTicket,
      });

      // Subir adjuntos si existen
      if (adjuntos.length > 0 && createdTicket && createdTicket.id) {
        setMensaje("⏳ Comprimiendo y subiendo imágenes...");
        for (const file of adjuntos) {
          try {
            const compressedBlob = await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            });
            const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
            await ticketService.uploadAttachment(createdTicket.id, compressedFile);
          } catch (e) {
            console.error("Error al subir archivo:", e);
          }
        }
      }

      setMostrarModal(false);
      setUsuario(null);
      setEquipo({});
      setTecnico(null);
      setMensaje("");
      setAdjuntos([]);

      // ✅ Mostrar las tres notificaciones secuenciales (cada una 2s)
      mostrarNotificacionesSecuenciales();
    } catch {
      setNoti({
        open: true,
        variant: "error",
        title: "Error al registrar el ticket",
        message: "Intente nuevamente.",
        autoCloseMs: 2000,
      });
    } finally {
      setCreandoTicket(false);
    }
  };

  // 🔁 Secuencia de notificaciones automáticas
  const mostrarNotificacionesSecuenciales = async () => {
    const mostrar = (titulo, mensaje) =>
      new Promise((resolve) => {
        setNoti({
          open: true,
          variant: "success",
          title: titulo,
          message: mensaje,
        });
        setTimeout(() => {
          setNoti((n) => ({ ...n, open: false }));
          setTimeout(resolve, 200); // pequeño delay entre modales
        }, 2000);
      });

    await mostrar("Ticket creado exitosamente", "");
    await mostrar("Notificación enviada exitosamente al técnico", "");
    await mostrar(
      "Notificación enviada correctamente a cliente y técnico",
      ""
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Gestión de Tickets
          </h1>

          {/* Buscar cliente */}
          <ConsultaUsuario onUsuarioEncontrado={manejarUsuarioEncontrado} />

          {/* Mostrar secciones solo si hay cliente */}
          {usuario && (
            <>
              <DatosCliente usuario={usuario} />
              <DatosEquipo equipo={equipo} onChange={manejarCambioEquipo} />

              {/* Zona de adjuntos */}
              <div className="bg-white p-4 border rounded-xl shadow-sm mb-6 flex flex-col gap-3">
                <h3 className="font-semibold text-gray-700">Evidencia Fotográfica (Opcional)</h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setAdjuntos((prev) => [...prev, ...Array.from(e.target.files)])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {adjuntos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">{adjuntos.length} archivo(s) seleccionado(s) listos para comprimir:</p>
                    <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                      {adjuntos.map((file, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                          <span className="truncate text-gray-600 w-3/4 flex-1 text-xs sm:text-sm">{file.name}</span>
                          <div className="flex items-center gap-2 mx-2">
                            <span className="text-xs text-gray-400 whitespace-nowrap">{(file.size / 1024).toFixed(1)} KB</span>
                            <button
                              type="button"
                              onClick={() => setAdjuntos((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 font-bold px-2 rounded hover:bg-red-50 flex-shrink-0"
                              title="Remover archivo"
                            >
                              X
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={abrirModalConfirmacion}
                disabled={cargandoTecnico || creandoTicket}
                className={`px-4 py-2 rounded-lg w-full ${cargandoTecnico || creandoTicket
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {cargandoTecnico ? "Obteniendo técnico..." : creandoTicket ? "Procesando..." : "Guardar Ticket"}
              </button>
            </>
          )}

          {/* Mensajes previos (errores de validación) */}
          {mensaje && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium ${mensaje.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && tecnico && (
        <ModalConfirmacion
          datos={{
            usuario,
            equipo,
            tecnico: `ID: ${tecnico.id}`,
            admin: `ID: ${user?.document || "9000000001"}`,
          }}
          onClose={() => setMostrarModal(false)}
          onConfirm={confirmarRegistro}
          creandoTicket={creandoTicket}
        />
      )}

      {/* Modal de notificación reutilizable */}
      <ModalNotificacion
        open={noti.open}
        onClose={() => setNoti((n) => ({ ...n, open: false }))}
        title={noti.title}
        message={noti.message}
        variant={noti.variant}
      />
    </>
  );
}
