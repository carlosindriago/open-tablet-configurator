import { useEffect, useState } from 'react'
import { useWacomStore } from '../store/wacomStore'
import { Orientation, PressureCurve } from '@shared/types'

// Available button actions - comprehensive list for xsetwacom
const BUTTON_ACTIONS = [
  { value: 'button 1', label: '🔘 Click izquierdo', category: 'Mouse' },
  { value: 'button 2', label: '🔘 Click medio', category: 'Mouse' },
  { value: 'button 3', label: '🔘 Click derecho', category: 'Mouse' },
  { value: 'button 4', label: '🖱️ Scroll arriba', category: 'Mouse' },
  { value: 'button 5', label: '🖱️ Scroll abajo', category: 'Mouse' },
  { value: 'button 6', label: '🖱️ Botón atrás', category: 'Mouse' },
  { value: 'button 7', label: '🖱️ Botón adelante', category: 'Mouse' },
  { value: 'button 8', label: '🖱️ Botón extra 1', category: 'Mouse' },
  { value: 'button 9', label: '🖱️ Botón extra 2', category: 'Mouse' },
  
  { value: 'key +Control_L +Z', label: '↩️ Deshacer (Ctrl+Z)', category: 'Edición' },
  { value: 'key +Shift_L +Control_L +Z', label: '↩️ Rehacer (Ctrl+Shift+Z)', category: 'Edición' },
  { value: 'key +Control_L +Y', label: '↩️ Rehacer (Ctrl+Y)', category: 'Edición' },
  { value: 'key +Control_L +S', label: '💾 Guardar (Ctrl+S)', category: 'Edición' },
  { value: 'key +Control_L +Shift_L +S', label: '💾 Guardar como', category: 'Edición' },
  { value: 'key +Control_L +C', label: '📋 Copiar (Ctrl+C)', category: 'Edición' },
  { value: 'key +Control_L +X', label: '✂️ Cortar (Ctrl+X)', category: 'Edición' },
  { value: 'key +Control_L +V', label: '📋 Pegar (Ctrl+V)', category: 'Edición' },
  { value: 'key Delete', label: '🗑️ Eliminar', category: 'Edición' },
  
  { value: 'key +Control_L +plus', label: '🔍 Zoom +', category: 'Vista' },
  { value: 'key +Control_L +minus', label: '🔍 Zoom -', category: 'Vista' },
  { value: 'key +Control_L +0', label: '🔍 Zoom 100%', category: 'Vista' },
  { value: 'key +Control_L +1', label: '🔍 Zoom 100%', category: 'Vista' },
  { value: 'key +Alt_L +0', label: '🔲 Pantalla completa', category: 'Vista' },
  
  { value: 'key space', label: '🖐️ Mano/Pan', category: 'Herramientas' },
  { value: 'key +Shift_L +space', label: '🖐️ Pan inverso', category: 'Herramientas' },
  { value: 'key b', label: '🖌️ Pincel', category: 'Herramientas' },
  { value: 'key e', label: '🧹 Borrador', category: 'Herramientas' },
  { value: 'key g', label: '🪣 Relleno', category: 'Herramientas' },
  { value: 'key s', label: '✏️ Seleccionar', category: 'Herramientas' },
  { value: 'key l', label: '📏 Línea', category: 'Herramientas' },
  { value: 'key t', label: '📝 Texto', category: 'Herramientas' },
  { value: 'key i', label: '💧 Cuentagotas', category: 'Herramientas' },
  { value: 'key h', label: '🖐️ Mano', category: 'Herramientas' },
  { value: 'key z', label: '🔍 Lupa', category: 'Herramientas' },
  { value: 'key r', label: '🔄 Rotar', category: 'Herramientas' },
  { value: 'key p', label: '🖊️ Pluma', category: 'Herramientas' },
  
  { value: 'key +Control_L +Alt_L', label: '⌨️ Ctrl + Alt', category: 'Sistema' },
  { value: 'key +Alt_L +Tab', label: '🔀 Cambiar ventana', category: 'Sistema' },
  { value: 'key +Alt_L +F4', label: '❌ Cerrar ventana', category: 'Sistema' },
  { value: 'key +Control_L +Escape', label: '🖥️ Menú sistema', category: 'Sistema' },
  { value: 'key Escape', label: '⎋ Escape', category: 'Sistema' },
  { value: 'key Tab', label: '⇥ Tab', category: 'Sistema' },
  { value: 'key +Shift_L +Tab', label: '⇤ Shift+Tab', category: 'Sistema' },
  { value: 'key Return', label: '⏎ Enter', category: 'Sistema' },
  
  { value: 'key [', label: ' Decrease size', category: 'Tamaño pincel' },
  { value: 'key ]', label: '] Increase size', category: 'Tamaño pincel' },
  { value: 'key +Shift_L +[', label: '⬇️ Menor opacidad', category: 'Tamaño pincel' },
  { value: 'key +Shift_L +]', label: '⬆️ Mayor opacidad', category: 'Tamaño pincel' },
  
  { value: 'key 1', label: '1️⃣ Capa 1', category: 'Capas' },
  { value: 'key 2', label: '2️⃣ Capa 2', category: 'Capas' },
  { value: 'key 3', label: '3️⃣ Capa 3', category: 'Capas' },
  { value: 'key 4', label: '4️⃣ Capa 4', category: 'Capas' },
  { value: 'key 5', label: '5️⃣ Capa 5', category: 'Capas' },
  { value: 'key +Shift_L +n', label: '📄 Nueva capa', category: 'Capas' },
  { value: 'key +Control_L +e', label: '📑 Combinar capas', category: 'Capas' },
  
  { value: 'none', label: '🚫 Sin acción', category: 'Especial' },
  { value: 'disabled', label: '⛔ Deshabilitado', category: 'Especial' },
] as const

// Pressure curve presets
const PRESSURE_PRESETS = [
  { value: [0, 0, 100, 100], label: 'Lineal', description: 'Respuesta directa' },
  { value: [0, 50, 50, 100], label: 'Suave', description: 'Fácil control' },
  { value: [0, 0, 50, 100], label: 'Firme', description: 'Más presión requerida' },
  { value: [0, 20, 80, 100], label: 'Suave inicial', description: 'Inicio suave, máximo firme' },
  { value: [20, 0, 100, 80], label: 'Firme inicial', description: 'Inicio firme, máximo suave' },
] as const

// Orientation options
const ORIENTATIONS = [
  { value: 'none', label: 'Normal', icon: '↻' },
  { value: 'cw', label: 'Rotado 90°', icon: '⤵' },
  { value: 'half', label: 'Volteado 180°', icon: '↺' },
  { value: 'ccw', label: 'Rotado -90°', icon: '⤴' },
] as const

export const WacomDashboard: React.FC = () => {
  const {
    config,
    isLoading,
    error,
    deviceInfo,
    isDeviceConnected,
    displays,
    isX11,
    loadConfig,
    setOrientation,
    setMode,
    setScreen,
    setPressureCurve,
    setButtonMapping,
    applyConfig,
    resetToDefaults,
    refreshDevices,
    loadDisplays,
    checkX11,
    clearError
  } = useWacomStore()

  const [selectedPreset, setSelectedPreset] = useState<number>(0)

  // Load initial data
  useEffect(() => {
    loadConfig()
    refreshDevices()
    loadDisplays()
    checkX11()

    // Set up device event listeners (only available in Electron context)
    if (!window.wacomAPI) return

    const unsubDeviceConnected = window.wacomAPI.onDeviceConnected(() => {
      refreshDevices()
    })
    
    const unsubDeviceDisconnected = window.wacomAPI.onDeviceDisconnected(() => {
      refreshDevices()
    })

    return () => {
      unsubDeviceConnected()
      unsubDeviceDisconnected()
    }
  }, [])

  // Close window handler
  const handleClose = () => {
    window.close()
  }

  // Minimize window handler
  const handleMinimize = () => {
    // This would need to be exposed via preload
    console.log('Minimize not implemented')
  }

  // Handle pressure preset change
  const handlePresetChange = (presetIndex: number) => {
    setSelectedPreset(presetIndex)
    const preset = PRESSURE_PRESETS[presetIndex]
    setPressureCurve(preset.value as PressureCurve)
  }

  if (!isX11) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 font-sans">
        <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-8 max-w-md shadow-2xl">
          <h1 className="text-2xl font-display font-bold text-red-400 mb-4 flex items-center gap-2">
            ⚠️ Wayland Detectado
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Esta aplicación requiere X11. Detectamos Wayland.
            Cambiá a sesión X11 para usar todas las funciones.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans selection:bg-wacom-500/30">
      {/* Custom Title Bar */}
      <div className="h-12 flex-shrink-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-4 select-none app-drag border-b border-white/5 relative z-50">
        <div className="flex items-center space-x-3">
          <svg className="w-4 h-4 text-wacom-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-sm text-zinc-300 font-display font-medium tracking-wide">Open Graphic Tablet Configurator</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleMinimize}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-all duration-200 app-no-drag"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-all duration-200 app-no-drag"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth">
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
          
          {/* Header with Device Status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-zinc-500 text-sm mt-1 font-medium">Configuración avanzada de hardware</p>
            </div>
            <div className="flex items-center space-x-3">
              {isDeviceConnected ? (
                <div className="flex items-center space-x-2 bg-wacom-500/10 border border-wacom-500/20 px-4 py-2 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(0,151,216,0.15)]">
                  <span className="w-2 h-2 bg-wacom-500 rounded-full animate-pulse shadow-glow"></span>
                  <span className="text-wacom-400 text-sm font-medium tracking-wide">{deviceInfo?.model}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-zinc-900 border border-white/5 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-zinc-400 text-sm font-medium tracking-wide">Desconectado</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400">⚠️</span>
                <p className="text-red-400/90 text-sm font-medium">{error}</p>
              </div>
              <button 
                onClick={clearError}
                className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 rounded-lg p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Orientation & Mode */}
            <div className="space-y-6">
              
              {/* Orientation Card */}
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/60">
                <h2 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center border border-white/5 shadow-inner">
                    <svg className="w-5 h-5 text-wacom-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </span>
                  Orientación
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {ORIENTATIONS.map((orient) => (
                    <button
                      key={orient.value}
                      onClick={() => setOrientation(orient.value as Orientation)}
                      disabled={isLoading || !isDeviceConnected}
                      className={`
                        group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left
                        ${config.orientation === orient.value 
                          ? 'bg-wacom-500/10 border-wacom-500/50 text-wacom-400 shadow-[inset_0_0_20px_rgba(0,151,216,0.1)]' 
                          : 'bg-zinc-950/50 border-white/5 hover:border-white/10 text-zinc-400'}
                        ${(!isDeviceConnected || isLoading) && 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-wacom-500/5 to-transparent opacity-0 transition-opacity duration-300 ${config.orientation === orient.value ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
                      <div className="relative z-10 flex flex-col gap-1">
                        <div className="text-2xl">{orient.icon}</div>
                        <div className="text-sm font-medium">{orient.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Card */}
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/60">
                <h2 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center border border-white/5 shadow-inner">
                    <svg className="w-5 h-5 text-wacom-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </span>
                  Modo de Puntero
                </h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setMode('absolute')}
                    disabled={isLoading || !isDeviceConnected}
                    className={`
                      group relative overflow-hidden w-full p-4 rounded-xl border transition-all duration-300 text-left flex flex-col
                      ${config.mode === 'absolute' 
                        ? 'bg-wacom-500/10 border-wacom-500/50 shadow-[inset_0_0_20px_rgba(0,151,216,0.1)]' 
                        : 'bg-zinc-950/50 border-white/5 hover:border-white/10'}
                      ${(!isDeviceConnected || isLoading) && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-wacom-500/5 to-transparent opacity-0 transition-opacity duration-300 ${config.mode === 'absolute' ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${config.mode === 'absolute' ? 'text-wacom-400' : 'text-zinc-200'}`}>Absoluto (Pen)</div>
                        <div className="text-sm text-zinc-500 mt-1">El cursor mapea la superficie de la tableta</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${config.mode === 'absolute' ? 'border-wacom-500' : 'border-zinc-600'}`}>
                        {config.mode === 'absolute' && <div className="w-2 h-2 rounded-full bg-wacom-500 shadow-glow"></div>}
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setMode('relative')}
                    disabled={isLoading || !isDeviceConnected}
                    className={`
                      group relative overflow-hidden w-full p-4 rounded-xl border transition-all duration-300 text-left flex flex-col
                      ${config.mode === 'relative' 
                        ? 'bg-wacom-500/10 border-wacom-500/50 shadow-[inset_0_0_20px_rgba(0,151,216,0.1)]' 
                        : 'bg-zinc-950/50 border-white/5 hover:border-white/10'}
                      ${(!isDeviceConnected || isLoading) && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-wacom-500/5 to-transparent opacity-0 transition-opacity duration-300 ${config.mode === 'relative' ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${config.mode === 'relative' ? 'text-wacom-400' : 'text-zinc-200'}`}>Relativo (Mouse)</div>
                        <div className="text-sm text-zinc-500 mt-1">Actúa como un touchpad estándar</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${config.mode === 'relative' ? 'border-wacom-500' : 'border-zinc-600'}`}>
                        {config.mode === 'relative' && <div className="w-2 h-2 rounded-full bg-wacom-500 shadow-glow"></div>}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Screen Mapping */}
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/60">
                <h2 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center border border-white/5 shadow-inner">
                    <svg className="w-5 h-5 text-wacom-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Mapeo de Área
                </h2>
                
                <div className="relative">
                  <select
                    value={config.screen}
                    onChange={(e) => setScreen(e.target.value)}
                    disabled={isLoading || !isDeviceConnected}
                    className="w-full appearance-none bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-200 focus:outline-none focus:border-wacom-500/50 focus:ring-1 focus:ring-wacom-500/50 disabled:opacity-50 transition-all duration-300"
                  >
                    <option value="ALL">Todas las pantallas (Proporcional)</option>
                    {displays.map((display) => (
                      <option key={display.name} value={display.name}>
                        {display.name} ({display.resolution}){display.isPrimary && ' - Monitor Principal'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pressure & Buttons */}
            <div className="space-y-6">
              
              {/* Pressure Curve */}
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/60">
                <h2 className="text-lg font-display font-semibold text-white mb-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center border border-white/5 shadow-inner">
                    <svg className="w-5 h-5 text-wacom-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Sensibilidad del Lápiz
                </h2>
                
                {/* Preset buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PRESSURE_PRESETS.map((preset, index) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetChange(index)}
                      disabled={isLoading || !isDeviceConnected}
                      className={`
                        p-3 rounded-xl border transition-all duration-300 text-left
                        ${selectedPreset === index
                          ? 'bg-wacom-500/10 border-wacom-500/50 shadow-[inset_0_0_20px_rgba(0,151,216,0.1)]'
                          : 'bg-zinc-950/50 border-white/5 hover:border-white/10'}
                        ${(!isDeviceConnected || isLoading) && 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div className={`text-sm font-medium ${selectedPreset === index ? 'text-wacom-400' : 'text-zinc-300'}`}>{preset.label}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{preset.description}</div>
                    </button>
                  ))}
                </div>
                
                {/* Visual curve representation - Redesigned as an analytical chart */}
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-20"></div>
                  <svg viewBox="0 0 100 100" className="w-full h-36 relative z-10 overflow-visible">
                    {/* Glow Effect behind the line */}
                    <path
                      d={`M 0 ${100 - config.pressureCurve[1]} C ${config.pressureCurve[0]} ${100 - config.pressureCurve[1]}, ${config.pressureCurve[2]} ${100 - config.pressureCurve[3]}, 100 ${100 - config.pressureCurve[3]}`}
                      fill="none"
                      stroke="rgba(0, 151, 216, 0.4)"
                      strokeWidth="8"
                      className="blur-md"
                    />
                    
                    {/* Grid Lines */}
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#3f3f46" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="0" y2="100" stroke="#3f3f46" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
                    
                    {/* Main Curve */}
                    <path
                      d={`M 0 ${100 - config.pressureCurve[1]} C ${config.pressureCurve[0]} ${100 - config.pressureCurve[1]}, ${config.pressureCurve[2]} ${100 - config.pressureCurve[3]}, 100 ${100 - config.pressureCurve[3]}`}
                      fill="none"
                      stroke="#0097d8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-2 text-[10px] text-zinc-600 font-mono">0g</div>
                  <div className="absolute top-2 right-2 text-[10px] text-zinc-600 font-mono">Max</div>
                </div>
              </div>

              {/* Button Mappings */}
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/60">
                <h2 className="text-lg font-display font-semibold text-white mb-2 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-zinc-800/80 flex items-center justify-center border border-white/5 shadow-inner">
                    <svg className="w-5 h-5 text-wacom-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </span>
                  Botones del Lápiz
                </h2>
                
                <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                  Asigná comandos de teclado y atajos rápidos a los botones físicos de tu lápiz.
                </p>

                <div className="space-y-4">
                  {[
                    { button: 1, label: 'Punta del Lápiz', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', desc: 'Contacto con la tableta' },
                    { button: 2, label: 'Botón Inferior', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', desc: 'El más cercano a la punta' },
                    { button: 3, label: 'Botón Superior', icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', desc: 'El más alejado de la punta' },
                  ].map(({ button, label, icon, desc }) => (
                    <div key={button} className="bg-zinc-950/50 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                          </svg>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-zinc-200">{label}</label>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <select
                          value={config.buttonMappings[button] || 'button 1'}
                          onChange={(e) => setButtonMapping(button, e.target.value)}
                          disabled={button === 1 || isLoading || !isDeviceConnected}
                          className="w-full appearance-none bg-zinc-900 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-wacom-500/50 focus:ring-1 focus:ring-wacom-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {Array.from(new Set(BUTTON_ACTIONS.map(a => a.category))).map((category) => (
                            <optgroup key={category} label={category} className="bg-zinc-900 text-zinc-400 font-semibold">
                              {BUTTON_ACTIONS.filter(a => a.category === category).map((action) => (
                                <option key={action.value} value={action.value} className="text-zinc-200 font-normal">
                                  {action.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-5 p-4 bg-wacom-500/5 border border-wacom-500/10 rounded-xl flex gap-3">
                  <svg className="w-5 h-5 text-wacom-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Para programas como Krita, GIMP o Inkscape, puedes asignar atajos personalizados dentro de las propias preferencias del software.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Toolbar */}
          <div className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 p-4 -mx-8 -mb-12 mt-8 flex flex-col sm:flex-row gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-20">
            <button
              onClick={applyConfig}
              disabled={isLoading || !isDeviceConnected}
              className="flex-1 sm:flex-none px-8 py-3.5 bg-wacom-500 text-white rounded-xl font-medium hover:bg-wacom-400 hover:shadow-[0_0_20px_rgba(0,151,216,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              Aplicar Cambios
            </button>
            
            <button
              onClick={resetToDefaults}
              disabled={isLoading || !isDeviceConnected}
              className="px-6 py-3.5 bg-zinc-900 border border-white/5 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              Valores por Defecto
            </button>
            
            <button
              onClick={refreshDevices}
              disabled={isLoading}
              className="px-6 py-3.5 bg-zinc-900 border border-white/5 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2 sm:ml-auto"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Recargar HW
            </button>
          </div>
          
          {/* Device Info Footer */}
          {deviceInfo && (
            <div className="text-[11px] text-zinc-500 pt-8 pb-4 flex flex-wrap gap-x-6 gap-y-2 uppercase tracking-wider font-mono">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-wacom-500/50"></span>
                {deviceInfo.model}
              </span>
              <span className="opacity-50">|</span>
              {deviceInfo.devices.map((device, i) => (
                <span key={device.id} className="flex items-center gap-2 text-zinc-600">
                  {device.type}: <span className="text-zinc-400">{device.name.split(' ').slice(0, 3).join(' ')}</span>
                  {i < deviceInfo.devices.length - 1 && <span className="opacity-50 ml-4">|</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}