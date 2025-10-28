import React, { useState } from "react";
import ConsultaUsuario from "../../components/ConsultaUsuario";
import DatosCliente from "../../components/DatosCliente";
import DatosEquipo from "../../components/DatosEquipo";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import ModalNotificacion from "../../components/ModalNotificacion";
import { api } from "../../api/client";

export default function GestionarTickets() {
  const [usuario, setUsuario] = useState(null);
  const [equipo, setEquipo] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tecnico, setTecnico] = useState(null);
  const [cargandoTecnico, setCargandoTecnico] = useState(false);
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
      if (!usuario?.document) throw new Error("Falta documento del cliente");
      if (!tecnico?.id) throw new Error("Falta ID del técnico");

      const fechaActual = new Date().toISOString().split("T")[0];

      const datosTicket = {
        administrador: 202,
        tecnico: tecnico.id,
        cliente: usuario.document,
        estado: 1,
        titulo: equipo.problema,
        descripcion: equipo.descripcion,
        equipo: equipo.equipo,
        fecha: fechaActual,
      };

      await api("/api/tickets/", {
        method: "POST",
        body: datosTicket,
      });

      setMostrarModal(false);
      setUsuario(null);
      setEquipo({});
      setTecnico(null);
      setMensaje("");

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

              <button
                type="button"
                onClick={abrirModalConfirmacion}
                disabled={cargandoTecnico}
                className={`px-4 py-2 rounded-lg w-full ${cargandoTecnico
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                {cargandoTecnico ? "Obteniendo técnico..." : "Guardar Ticket"}
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
            admin: "ID: 202",
          }}
          onClose={() => setMostrarModal(false)}
          onConfirm={confirmarRegistro}
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
