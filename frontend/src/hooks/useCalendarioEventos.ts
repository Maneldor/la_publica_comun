import { useState, useMemo, useCallback } from 'react'
import { Evento, VistaCalendario, ConfiguracionCalendario } from '../../tipos/eventos'

// ✅ TÉCNICA AVANZADA: Custom Hook para lógica de calendario
// Separa la lógica de cálculos de calendario del componente UI

export interface DiaCalendario {
  fecha: Date
  esHoy: boolean
  esMesActual: boolean
  eventos: Evento[]
  esFinDeSemana: boolean
  esPasado: boolean
}

export interface SemanaCalendario {
  inicio: Date
  fin: Date
  dias: DiaCalendario[]
}

export interface MesCalendario {
  año: number
  mes: number
  nombre: string
  semanas: SemanaCalendario[]
  totalEventos: number
}

export function useCalendarioEventos(eventos: Evento[], configuracion: ConfiguracionCalendario) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(configuracion.fechaInicial)
  
  // ✅ CÁLCULOS MEMOIZADOS - Solo recalcular si cambian eventos o fecha
  const calendarioMes = useMemo((): MesCalendario => {
    const año = fechaSeleccionada.getFullYear()
    const mes = fechaSeleccionada.getMonth()
    
    // Primer día del mes
    const primerDia = new Date(año, mes, 1)
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0)
    
    // Primer día de la semana que se muestra (puede ser del mes anterior)
    const inicioSemana = new Date(primerDia)
    inicioSemana.setDate(primerDia.getDate() - primerDia.getDay())
    
    // Último día de la semana que se muestra (puede ser del mes siguiente)
    const finSemana = new Date(ultimoDia)
    finSemana.setDate(ultimoDia.getDate() + (6 - ultimoDia.getDay()))
    
    const semanas: SemanaCalendario[] = []
    const fechaActual = new Date(inicioSemana)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    while (fechaActual <= finSemana) {
      const inicioSemanaActual = new Date(fechaActual)
      const dias: DiaCalendario[] = []
      
      // Crear 7 días de la semana
      for (let i = 0; i < 7; i++) {
        const fechaDia = new Date(fechaActual)
        
        // Filtrar eventos para este día
        const eventosDelDia = eventos.filter(evento => {
          const fechaEvento = new Date(evento.fechaInicio)
          fechaEvento.setHours(0, 0, 0, 0)
          return fechaEvento.getTime() === fechaDia.getTime()
        })
        
        dias.push({
          fecha: new Date(fechaDia),
          esHoy: fechaDia.getTime() === hoy.getTime(),
          esMesActual: fechaDia.getMonth() === mes,
          eventos: eventosDelDia,
          esFinDeSemana: fechaDia.getDay() === 0 || fechaDia.getDay() === 6,
          esPasado: fechaDia < hoy
        })
        
        fechaActual.setDate(fechaActual.getDate() + 1)
      }
      
      const finSemanaActual = new Date(fechaActual)
      finSemanaActual.setDate(finSemanaActual.getDate() - 1)
      
      semanas.push({
        inicio: inicioSemanaActual,
        fin: finSemanaActual,
        dias
      })
    }
    
    // Contar eventos del mes
    const eventosDelMes = eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio)
      return fechaEvento.getMonth() === mes && fechaEvento.getFullYear() === año
    })
    
    return {
      año,
      mes,
      nombre: primerDia.toLocaleDateString('es', { month: 'long', year: 'numeric' }),
      semanas,
      totalEventos: eventosDelMes.length
    }
  }, [eventos, fechaSeleccionada])
  
  // ✅ CÁLCULO DE SEMANA
  const calendarioSemana = useMemo(() => {
    const inicioSemana = new Date(fechaSeleccionada)
    inicioSemana.setDate(fechaSeleccionada.getDate() - fechaSeleccionada.getDay())
    
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 6)
    
    const dias: DiaCalendario[] = []
    const fechaActual = new Date(inicioSemana)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 7; i++) {
      const eventosDelDia = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio)
        fechaEvento.setHours(0, 0, 0, 0)
        return fechaEvento.getTime() === fechaActual.getTime()
      })
      
      dias.push({
        fecha: new Date(fechaActual),
        esHoy: fechaActual.getTime() === hoy.getTime(),
        esMesActual: true, // En vista semana todos son "del mes actual"
        eventos: eventosDelDia,
        esFinDeSemana: fechaActual.getDay() === 0 || fechaActual.getDay() === 6,
        esPasado: fechaActual < hoy
      })
      
      fechaActual.setDate(fechaActual.getDate() + 1)
    }
    
    return {
      inicio: inicioSemana,
      fin: finSemana,
      dias
    }
  }, [eventos, fechaSeleccionada])
  
  // ✅ CÁLCULO DE DÍA
  const calendarioDia = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const fechaDia = new Date(fechaSeleccionada)
    fechaDia.setHours(0, 0, 0, 0)
    
    const eventosDelDia = eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio)
      fechaEvento.setHours(0, 0, 0, 0)
      return fechaEvento.getTime() === fechaDia.getTime()
    })
    
    // ✅ TÉCNICA: Agrupar eventos por horas para vista de día
    const eventosPorHora: { [hora: string]: Evento[] } = {}
    
    eventosDelDia.forEach(evento => {
      const horaEvento = new Date(evento.fechaInicio).getHours()
      const claveHora = `${horaEvento}:00`
      
      if (!eventosPorHora[claveHora]) {
        eventosPorHora[claveHora] = []
      }
      
      eventosPorHora[claveHora].push(evento)
    })
    
    return {
      fecha: fechaSeleccionada,
      esHoy: fechaDia.getTime() === hoy.getTime(),
      eventos: eventosDelDia,
      eventosPorHora,
      totalEventos: eventosDelDia.length
    }
  }, [eventos, fechaSeleccionada])
  
  // ✅ NAVEGACIÓN OPTIMIZADA
  const navegarMes = useCallback((direccion: 'anterior' | 'siguiente') => {
    setFechaSeleccionada(prev => {
      const nuevaFecha = new Date(prev)
      if (direccion === 'anterior') {
        nuevaFecha.setMonth(nuevaFecha.getMonth() - 1)
      } else {
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1)
      }
      return nuevaFecha
    })
  }, [])
  
  const navegarSemana = useCallback((direccion: 'anterior' | 'siguiente') => {
    setFechaSeleccionada(prev => {
      const nuevaFecha = new Date(prev)
      const dias = direccion === 'anterior' ? -7 : 7
      nuevaFecha.setDate(nuevaFecha.getDate() + dias)
      return nuevaFecha
    })
  }, [])
  
  const navegarDia = useCallback((direccion: 'anterior' | 'siguiente') => {
    setFechaSeleccionada(prev => {
      const nuevaFecha = new Date(prev)
      const dias = direccion === 'anterior' ? -1 : 1
      nuevaFecha.setDate(nuevaFecha.getDate() + dias)
      return nuevaFecha
    })
  }, [])
  
  const irAHoy = useCallback(() => {
    setFechaSeleccionada(new Date())
  }, [])
  
  const irAFecha = useCallback((fecha: Date) => {
    setFechaSeleccionada(fecha)
  }, [])
  
  // ✅ UTILIDADES DE FORMATO
  const formatearFecha = useCallback((fecha: Date, formato: 'completo' | 'corto' | 'mes-año') => {
    switch (formato) {
      case 'completo':
        return fecha.toLocaleDateString('es', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      case 'corto':
        return fecha.toLocaleDateString('es', { 
          month: 'short', 
          day: 'numeric' 
        })
      case 'mes-año':
        return fecha.toLocaleDateString('es', { 
          month: 'long', 
          year: 'numeric' 
        })
      default:
        return fecha.toLocaleDateString('es')
    }
  }, [])
  
  const obtenerEventosRangoFechas = useCallback((inicio: Date, fin: Date): Evento[] => {
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio)
      return fechaEvento >= inicio && fechaEvento <= fin
    })
  }, [eventos])
  
  // ✅ ESTADÍSTICAS RÁPIDAS
  const estadisticasRapidas = useMemo(() => {
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    
    const eventosEsteMes = obtenerEventosRangoFechas(inicioMes, finMes)
    const eventosHoy = calendarioDia.eventos
    const proximosEventos = eventos.filter(evento => 
      new Date(evento.fechaInicio) > hoy && evento.estado === 'programado'
    ).slice(0, 5)
    
    return {
      totalEsteMes: eventosEsteMes.length,
      totalHoy: eventosHoy.length,
      proximosEventos
    }
  }, [eventos, calendarioDia.eventos, obtenerEventosRangoFechas])
  
  return {
    // Estado
    fechaSeleccionada,
    
    // Datos calculados por vista
    calendarioMes,
    calendarioSemana,
    calendarioDia,
    estadisticasRapidas,
    
    // Navegación
    navegarMes,
    navegarSemana,
    navegarDia,
    irAHoy,
    irAFecha,
    
    // Utilidades
    formatearFecha,
    obtenerEventosRangoFechas
  }
}