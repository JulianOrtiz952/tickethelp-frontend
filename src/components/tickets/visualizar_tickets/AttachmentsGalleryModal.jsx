import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Download, Loader2 } from "lucide-react";
import { ticketService } from "../../../api/ticketService";

export function AttachmentsGalleryModal({ isOpen, onClose, ticketId }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchAttachments();
    }
  }, [isOpen, ticketId]);

  const fetchAttachments = async () => {
    setLoading(true);
    try {
      const data = await ticketService.getAttachments(ticketId);
      // Data expected: { message, ticket_id, total_adjuntos, adjuntos: [...] }
      setAttachments(data.adjuntos || []);
    } catch (e) {
      console.error("Error fetching attachments:", e);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Evidencia Fotográfica
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500">Cargando imágenes...</p>
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Este ticket no tiene imágenes adjuntas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attachments.map((adjunto, idx) => (
                <div key={adjunto.id || idx} className="border rounded-lg overflow-hidden flex flex-col bg-gray-50 group relative">
                  <div className="h-48 bg-gray-200 overflow-hidden relative">
                    <img
                      src={adjunto.url}
                      alt={adjunto.nombre_original}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={adjunto.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 text-gray-900 p-2 rounded-full hover:bg-white transform hover:scale-110 transition-all shadow-lg"
                        title="Ver original"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-3 text-xs flex justify-between items-center bg-white border-t">
                    <span className="truncate flex-1 font-medium title={adjunto.nombre_original}">
                      {adjunto.nombre_original}
                    </span>
                    <span className="text-gray-400 ml-2 whitespace-nowrap">
                      {(adjunto.tamano_bytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
