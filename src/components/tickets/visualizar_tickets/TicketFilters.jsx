"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, X, ChevronDown, Calendar, User, Check } from "lucide-react"

export function TicketFilters({
  filters,
  onFiltersChange,
  technicians = [],
  estados = [],
  onClearFilters,
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [estadoDropdownOpen, setEstadoDropdownOpen] = useState(false)
  const [tecnicoDropdownOpen, setTecnicoDropdownOpen] = useState(false)
  const [tecnicoSearch, setTecnicoSearch] = useState("")

  const estadoRef = useRef(null)
  const tecnicoRef = useRef(null)

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (estadoRef.current && !estadoRef.current.contains(event.target)) {
        setEstadoDropdownOpen(false)
      }
      if (tecnicoRef.current && !tecnicoRef.current.contains(event.target)) {
        setTecnicoDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, searchText: e.target.value })
  }

  const handleEstadoToggle = (estadoId) => {
    const currentEstados = filters.estados || []
    const newEstados = currentEstados.includes(estadoId)
      ? currentEstados.filter((id) => id !== estadoId)
      : [...currentEstados, estadoId]
    onFiltersChange({ ...filters, estados: newEstados })
  }

  const handleTecnicoChange = (tecnicoDocument) => {
    onFiltersChange({ ...filters, tecnico: tecnicoDocument })
    setTecnicoDropdownOpen(false)
  }

  const handleFechaDesdeChange = (e) => {
    onFiltersChange({ ...filters, fechaDesde: e.target.value })
  }

  const handleFechaHastaChange = (e) => {
    onFiltersChange({ ...filters, fechaHasta: e.target.value })
  }

  const activeFiltersCount = [
    filters.searchText,
    filters.estados?.length > 0,
    filters.tecnico,
    filters.fechaDesde,
    filters.fechaHasta,
  ].filter(Boolean).length

  const filteredTechnicians = technicians.filter((tech) => {
    const fullName = `${tech.first_name || ""} ${tech.last_name || ""}`.toLowerCase()
    const search = tecnicoSearch.toLowerCase()
    return fullName.includes(search) || (tech.email || "").toLowerCase().includes(search)
  })

const selectedTechnician = technicians.find((t) => t.document === filters.tecnico)

  // Calcular la fecha máxima permitida (hoy)
  const getMaxDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }
  const maxDate = getMaxDate()

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
      {/* Barra principal de búsqueda */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Búsqueda por texto */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, título o equipo..."
              value={filters.searchText || ""}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Botón de filtros avanzados */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isExpanded || activeFiltersCount > 0
                ? "bg-teal-50 text-teal-700 border border-teal-200"
                : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-teal-600 text-white text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Panel de filtros avanzados */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Estado */}
            <div className="relative" ref={estadoRef}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Estado
              </label>
              <button
                onClick={() => setEstadoDropdownOpen(!estadoDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <span className={filters.estados?.length > 0 ? "text-gray-900" : "text-gray-400"}>
                  {filters.estados?.length > 0
                    ? `${filters.estados.length} estado${filters.estados.length > 1 ? "s" : ""} seleccionado${filters.estados.length > 1 ? "s" : ""}`
                    : "Seleccionar estados"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${estadoDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {estadoDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                  {estados.map((estado) => {
                    const isSelected = filters.estados?.includes(estado.id)
                    const Icon = estado.icon
                    return (
                      <button
                        key={estado.id}
                        onClick={() => handleEstadoToggle(estado.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-teal-600 border-teal-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${estado.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {estado.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Filtro por Técnico */}
            <div className="relative" ref={tecnicoRef}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Técnico asignado
              </label>
              <button
                onClick={() => setTecnicoDropdownOpen(!tecnicoDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <span className={filters.tecnico ? "text-gray-900" : "text-gray-400"}>
                  {selectedTechnician
                    ? `${selectedTechnician.first_name} ${selectedTechnician.last_name}`.trim()
                    : "Seleccionar técnico"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${tecnicoDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {tecnicoDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar técnico..."
                        value={tecnicoSearch}
                        onChange={(e) => setTecnicoSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    <button
                      onClick={() => handleTecnicoChange(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        !filters.tecnico ? "bg-teal-50" : ""
                      }`}
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Todos los técnicos</span>
                    </button>
                    {filteredTechnicians.map((tech) => {
                      const fullName = `${tech.first_name || ""} ${tech.last_name || ""}`.trim()
                      const isSelected = filters.tecnico === tech.document
                      return (
                        <button
                          key={tech.document}
                          onClick={() => handleTecnicoChange(tech.document)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            isSelected ? "bg-teal-50" : ""
                          }`}
                        >
                          <img
                            src={tech.profile_picture || "/default_avatar.svg"}
                            alt={fullName}
                            className="w-7 h-7 rounded-full bg-gray-200"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-800">{fullName || tech.email}</p>
                            {fullName && (
                              <p className="text-xs text-gray-500">{tech.email}</p>
                            )}
                          </div>
{isSelected && (
                            <Check className="w-4 h-4 text-teal-600" strokeWidth={2.5} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filtro por Fecha Desde */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Fecha desde
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
<input
                  type="date"
                  value={filters.fechaDesde || ""}
                  onChange={handleFechaDesdeChange}
                  max={maxDate}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Filtro por Fecha Hasta */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Fecha hasta
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
<input
                  type="date"
                  value={filters.fechaHasta || ""}
                  onChange={handleFechaHastaChange}
                  max={maxDate}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Chips de filtros activos y botón limpiar */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Filtros activos:</span>

              {filters.searchText && (
                <FilterChip
                  label={`Búsqueda: "${filters.searchText}"`}
                  onRemove={() => onFiltersChange({ ...filters, searchText: "" })}
                />
              )}

              {filters.estados?.map((estadoId) => {
                const estado = estados.find((e) => e.id === estadoId)
                return estado ? (
                  <FilterChip
                    key={estadoId}
                    label={estado.label}
                    color={estado.color}
                    onRemove={() => handleEstadoToggle(estadoId)}
                  />
                ) : null
              })}

              {selectedTechnician && (
                <FilterChip
                  label={`${selectedTechnician.first_name} ${selectedTechnician.last_name}`.trim()}
                  onRemove={() => onFiltersChange({ ...filters, tecnico: null })}
                />
              )}

              {filters.fechaDesde && (
                <FilterChip
                  label={`Desde: ${filters.fechaDesde}`}
                  onRemove={() => onFiltersChange({ ...filters, fechaDesde: "" })}
                />
              )}

              {filters.fechaHasta && (
                <FilterChip
                  label={`Hasta: ${filters.fechaHasta}`}
                  onRemove={() => onFiltersChange({ ...filters, fechaHasta: "" })}
                />
              )}

              <button
                onClick={onClearFilters}
                className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, color, onRemove }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        color || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}
