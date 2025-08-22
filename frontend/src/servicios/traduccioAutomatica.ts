'use client'

// Servicio de traducción automática
export interface DiccionariTraduccions {
  [idioma: string]: {
    [clau: string]: string
  }
}

export interface ConfiguracioTraduccion {
  idiomesSuportats: string[]
  idiomaPredeterminat: string
  fallbackIdioma: string
  traduccionsCache: DiccionariTraduccions
  habilitatServeiExtern: boolean
  proveidorExtern?: 'google' | 'deepl' | 'azure'
}

class TraduccioAutomaticaService {
  private static instance: TraduccioAutomaticaService
  private configuracio: ConfiguracioTraduccion
  private traduccionsCarregades: Set<string> = new Set()
  private cacheMemoria: Map<string, Map<string, string>> = new Map()

  private constructor() {
    this.configuracio = {
      idiomesSuportats: ['ca', 'es', 'eu', 'gl'],
      idiomaPredeterminat: 'ca',
      fallbackIdioma: 'es',
      traduccionsCache: this.carregarTraduccionsBase(),
      habilitatServeiExtern: false, // En desarrollo, solo usar diccionario local
      proveidorExtern: undefined
    }
    this.inicialitzarCache()
  }

  static getInstance(): TraduccioAutomaticaService {
    if (!TraduccioAutomaticaService.instance) {
      TraduccioAutomaticaService.instance = new TraduccioAutomaticaService()
    }
    return TraduccioAutomaticaService.instance
  }

  private carregarTraduccionsBase(): DiccionariTraduccions {
    // Traducciones base para la interfaz común
    return {
      ca: {
        // Navegación
        'nav.inici': 'Inici',
        'nav.xarxa_social': 'Xarxa Social',
        'nav.perfil': 'El Meu Perfil',
        'nav.membres': 'Membres',
        'nav.grups': 'Grups',
        'nav.forums': 'Fòrums',
        'nav.blogs': 'Blogs',
        'nav.empreses': 'Empreses Col·laboradores',
        'nav.ofertes': 'Ofertes',
        'nav.tauler_anuncis': 'Tauler d\'Anuncis',
        'nav.assessorament': 'Assessorament',
        'nav.enllcos_interes': 'Enllaços d\'Interès',
        'nav.cercar': 'Cercar',
        'nav.missatges': 'Missatges',
        'nav.notificacions': 'Notificacions',
        'nav.calendari': 'Calendari',
        'nav.configuracio': 'Configuració',
        'nav.emails': 'Emails',
        
        // Secciones comunes
        'section.comunitat': 'COMUNITAT',
        'section.serveis': 'SERVEIS',
        'section.accions_rapides': 'ACCIONS RÀPIDES',
        'section.configuracio': 'CONFIGURACIÓ',
        
        // Configuración
        'config.perfil': 'Perfil i Compte',
        'config.privacitat': 'Privacitat',
        'config.notificacions': 'Notificacions',
        'config.aparenca': 'Aparença i Tema',
        'config.idioma': 'Idioma i Regió',
        'config.seguretat': 'Seguretat',
        'config.aplicacions': 'Aplicacions Connectades',
        'config.dades': 'Dades i Emmagatzematge',
        
        // Acciones
        'action.guardar': 'Guardar',
        'action.cancel·lar': 'Cancel·lar',
        'action.eliminar': 'Eliminar',
        'action.editar': 'Editar',
        'action.acceptar': 'Acceptar',
        'action.rebutjar': 'Rebutjar',
        'action.enviar': 'Enviar',
        'action.tancar': 'Tancar',
        'action.obrir': 'Obrir',
        'action.contactar': 'Contactar',
        
        // Anuncios específicos
        'anuncio.desde': 'des de',
        'anuncio.gratis': 'Gratis',
        'anuncio.negociable': 'Negociable',
        'anuncio.favorito': 'Afegir a favorits',
        'anuncio.intercambio': 'Intercanvi',
        'anuncio.destacado': 'Destacat',
        
        // Estados
        'status.online': 'En línia',
        'status.offline': 'Desconnectat',
        'status.ocupat': 'Ocupat',
        'status.absent': 'Absent',
        'status.verificado': 'Verificat',
        
        // Notificaciones
        'notif.missatge_nou': 'Nou missatge',
        'notif.mencio': 'T\'han mencionat',
        'notif.solicitud_connexio': 'Sol·licitud de connexió',
        'notif.invitacio_grup': 'Invitació a grup',
        
        // Formularios
        'form.nom': 'Nom',
        'form.email': 'Correu electrònic',
        'form.telefon': 'Telèfon',
        'form.organitzacio': 'Organització',
        'form.provincia': 'Província',
        'form.descripcio': 'Descripció',
        'form.missatge': 'Missatge',
        
        // Avisos legales
        'legal.privacitat_titol': 'Avís Important sobre Privacitat i Responsabilitat',
        'legal.privacitat_p1': 'La Pública prioritza la teva privacitat i seguretat. Totes les dades personals i sensibles estan configurades com a privades per defecte.',
        'legal.privacitat_p2': 'La plataforma no es fa responsable de les dades que el Membre editi i faci públiques. És responsabilitat de l\'usuari gestionar la visibilitat de la seva informació personal.',
        'legal.privacitat_p3': 'Pots controlar en tot moment la visibilitat de les teves dades des de la secció de privacitat.',
      },
      es: {
        // Navegación
        'nav.inici': 'Inicio',
        'nav.xarxa_social': 'Red Social',
        'nav.perfil': 'Mi Perfil',
        'nav.membres': 'Miembros',
        'nav.grups': 'Grupos',
        'nav.forums': 'Foros',
        'nav.blogs': 'Blogs',
        'nav.empreses': 'Empresas Colaboradoras',
        'nav.ofertes': 'Ofertas',
        'nav.tauler_anuncis': 'Tablón de Anuncios',
        'nav.assessorament': 'Asesoramiento',
        'nav.enllcos_interes': 'Enlaces de Interés',
        'nav.cercar': 'Buscar',
        'nav.missatges': 'Mensajes',
        'nav.notificacions': 'Notificaciones',
        'nav.calendari': 'Calendario',
        'nav.configuracio': 'Configuración',
        'nav.emails': 'Emails',
        
        // Secciones comunes
        'section.comunitat': 'COMUNIDAD',
        'section.serveis': 'SERVICIOS',
        'section.accions_rapides': 'ACCIONES RÁPIDAS',
        'section.configuracio': 'CONFIGURACIÓN',
        
        // Configuración
        'config.perfil': 'Perfil y Cuenta',
        'config.privacitat': 'Privacidad',
        'config.notificacions': 'Notificaciones',
        'config.aparenca': 'Apariencia y Tema',
        'config.idioma': 'Idioma y Región',
        'config.seguretat': 'Seguridad',
        'config.aplicacions': 'Aplicaciones Conectadas',
        'config.dades': 'Datos y Almacenamiento',
        
        // Acciones
        'action.guardar': 'Guardar',
        'action.cancel·lar': 'Cancelar',
        'action.eliminar': 'Eliminar',
        'action.editar': 'Editar',
        'action.acceptar': 'Aceptar',
        'action.rebutjar': 'Rechazar',
        'action.enviar': 'Enviar',
        'action.tancar': 'Cerrar',
        'action.obrir': 'Abrir',
        'action.contactar': 'Contactar',
        
        // Anuncios específicos
        'anuncio.desde': 'desde',
        'anuncio.gratis': 'Gratis',
        'anuncio.negociable': 'Negociable',
        'anuncio.favorito': 'Añadir a favoritos',
        'anuncio.intercambio': 'Intercambio',
        'anuncio.destacado': 'Destacado',
        
        // Estados
        'status.online': 'En línea',
        'status.offline': 'Desconectado',
        'status.ocupat': 'Ocupado',
        'status.absent': 'Ausente',
        'status.verificado': 'Verificado',
        
        // Notificaciones
        'notif.missatge_nou': 'Nuevo mensaje',
        'notif.mencio': 'Te han mencionado',
        'notif.solicitud_connexio': 'Solicitud de conexión',
        'notif.invitacio_grup': 'Invitación a grupo',
        
        // Formularios
        'form.nom': 'Nombre',
        'form.email': 'Correo electrónico',
        'form.telefon': 'Teléfono',
        'form.organitzacio': 'Organización',
        'form.provincia': 'Provincia',
        'form.descripcio': 'Descripción',
        'form.missatge': 'Mensaje',
        
        // Avisos legales
        'legal.privacitat_titol': 'Aviso Importante sobre Privacidad y Responsabilidad',
        'legal.privacitat_p1': 'La Pública prioriza tu privacidad y seguridad. Todos los datos personales y sensibles están configurados como privados por defecto.',
        'legal.privacitat_p2': 'La plataforma no se hace responsable de los datos que el Miembro edite y haga públicos. Es responsabilidad del usuario gestionar la visibilidad de su información personal.',
        'legal.privacitat_p3': 'Puedes controlar en todo momento la visibilidad de tus datos desde la sección de privacidad.',
      },
      eu: {
        // Navegación
        'nav.inici': 'Hasiera',
        'nav.xarxa_social': 'Sare Soziala',
        'nav.perfil': 'Nire Profila',
        'nav.membres': 'Kideak',
        'nav.grups': 'Taldeak',
        'nav.forums': 'Foroak',
        'nav.blogs': 'Blogak',
        'nav.empreses': 'Enpresa Kolaboratzaileak',
        'nav.ofertes': 'Eskaintzak',
        'nav.tauler_anuncis': 'Iragarkien Mahaia',
        'nav.assessorament': 'Aholkularitza',
        'nav.enllcos_interes': 'Intereseko Estekak',
        'nav.cercar': 'Bilatu',
        'nav.missatges': 'Mezuak',
        'nav.notificacions': 'Jakinarazpenak',
        'nav.calendari': 'Egutegia',
        'nav.configuracio': 'Konfigurazioa',
        'nav.emails': 'Emailak',
        
        // Secciones comunes
        'section.comunitat': 'KOMUNITATEA',
        'section.serveis': 'ZERBITZUAK',
        'section.accions_rapides': 'EKINTZA AZKARRAK',
        'section.configuracio': 'KONFIGURAZIOA',
        
        // Configuración
        'config.perfil': 'Profila eta Kontua',
        'config.privacitat': 'Pribatutasuna',
        'config.notificacions': 'Jakinarazpenak',
        'config.aparenca': 'Itxura eta Gaia',
        'config.idioma': 'Hizkuntza eta Eremua',
        'config.seguretat': 'Segurtasuna',
        'config.aplicacions': 'Konektatutako Aplikazioak',
        'config.dades': 'Datuak eta Biltegiratza',
        
        // Acciones
        'action.guardar': 'Gorde',
        'action.cancel·lar': 'Ezeztatu',
        'action.eliminar': 'Ezabatu',
        'action.editar': 'Editatu',
        'action.acceptar': 'Onartu',
        'action.rebutjar': 'Baztertu',
        'action.enviar': 'Bidali',
        'action.tancar': 'Itxi',
        'action.obrir': 'Ireki',
        'action.contactar': 'Harremanetan jarri',
        
        // Anuncios específicos
        'anuncio.desde': 'hemendik',
        'anuncio.gratis': 'Doan',
        'anuncio.negociable': 'Negozia daiteke',
        'anuncio.favorito': 'Gogokoetara gehitu',
        'anuncio.intercambio': 'Trukaketa',
        'anuncio.destacado': 'Nabarmentua',
        
        // Estados
        'status.online': 'Konektatuta',
        'status.offline': 'Deskonektatuta',
        'status.ocupat': 'Okupatuta',
        'status.absent': 'Kanpoan',
        'status.verificado': 'Egiaztatuta',
        
        // Notificaciones
        'notif.missatge_nou': 'Mezu berria',
        'notif.mencio': 'Aipatu zaituzte',
        'notif.solicitud_connexio': 'Konexio eskaria',
        'notif.invitacio_grup': 'Talde gonbidapena',
        
        // Formularios
        'form.nom': 'Izena',
        'form.email': 'Helbide elektronikoa',
        'form.telefon': 'Telefonoa',
        'form.organitzacio': 'Erakundea',
        'form.provincia': 'Probintzia',
        'form.descripcio': 'Deskribapena',
        'form.missatge': 'Mezua',
        
        // Avisos legales
        'legal.privacitat_titol': 'Pribatutasunari eta Erantzukizunari buruzko Ohar Garrantzitsua',
        'legal.privacitat_p1': 'La Públicak zure pribatutasuna eta segurtasuna lehenetsi egiten ditu. Datu pertsonal eta sentikor guztiak pribatu gisa konfiguratuta daude modu lehenetsian.',
        'legal.privacitat_p2': 'Plataformak ez du erantzukizunik hartzen Kideak editatzen eta publiko egiten dituen datuekin. Erabiltzailearen erantzukizuna da bere informazio pertsonalaren ikusgarritasuna kudeatzea.',
        'legal.privacitat_p3': 'Une oro kontrola dezakezu zure datuen ikusgarritasuna pribatutasun ataletik.',
      },
      gl: {
        // Navegación
        'nav.inici': 'Inicio',
        'nav.xarxa_social': 'Rede Social',
        'nav.perfil': 'O Meu Perfil',
        'nav.membres': 'Membros',
        'nav.grups': 'Grupos',
        'nav.forums': 'Foros',
        'nav.blogs': 'Blogs',
        'nav.empreses': 'Empresas Colaboradoras',
        'nav.ofertes': 'Ofertas',
        'nav.tauler_anuncis': 'Taboleiro de Anuncios',
        'nav.assessorament': 'Asesoramento',
        'nav.enllcos_interes': 'Ligazóns de Interese',
        'nav.cercar': 'Buscar',
        'nav.missatges': 'Mensaxes',
        'nav.notificacions': 'Notificacións',
        'nav.calendari': 'Calendario',
        'nav.configuracio': 'Configuración',
        'nav.emails': 'Emails',
        
        // Secciones comunes
        'section.comunitat': 'COMUNIDADE',
        'section.serveis': 'SERVIZOS',
        'section.accions_rapides': 'ACCIÓNS RÁPIDAS',
        'section.configuracio': 'CONFIGURACIÓN',
        
        // Configuración
        'config.perfil': 'Perfil e Conta',
        'config.privacitat': 'Privacidade',
        'config.notificacions': 'Notificacións',
        'config.aparenca': 'Aparencia e Tema',
        'config.idioma': 'Idioma e Rexión',
        'config.seguretat': 'Seguridade',
        'config.aplicacions': 'Aplicacións Conectadas',
        'config.dades': 'Datos e Almacenamento',
        
        // Acciones
        'action.guardar': 'Gardar',
        'action.cancel·lar': 'Cancelar',
        'action.eliminar': 'Eliminar',
        'action.editar': 'Editar',
        'action.acceptar': 'Aceptar',
        'action.rebutjar': 'Rexeitar',
        'action.enviar': 'Enviar',
        'action.tancar': 'Pechar',
        'action.obrir': 'Abrir',
        'action.contactar': 'Contactar',
        
        // Anuncios específicos
        'anuncio.desde': 'desde',
        'anuncio.gratis': 'Gratis',
        'anuncio.negociable': 'Negociable',
        'anuncio.favorito': 'Engadir a favoritos',
        'anuncio.intercambio': 'Intercambio',
        'anuncio.destacado': 'Destacado',
        
        // Estados
        'status.online': 'En liña',
        'status.offline': 'Desconectado',
        'status.ocupat': 'Ocupado',
        'status.absent': 'Ausente',
        'status.verificado': 'Verificado',
        
        // Notificaciones
        'notif.missatge_nou': 'Nova mensaxe',
        'notif.mencio': 'Mencionáronte',
        'notif.solicitud_connexio': 'Solicitude de conexión',
        'notif.invitacio_grup': 'Convite a grupo',
        
        // Formularios
        'form.nom': 'Nome',
        'form.email': 'Correo electrónico',
        'form.telefon': 'Teléfono',
        'form.organitzacio': 'Organización',
        'form.provincia': 'Provincia',
        'form.descripcio': 'Descrición',
        'form.missatge': 'Mensaxe',
        
        // Avisos legales
        'legal.privacitat_titol': 'Aviso Importante sobre Privacidade e Responsabilidade',
        'legal.privacitat_p1': 'La Pública prioriza a túa privacidade e seguridade. Todos os datos persoais e sensibles están configurados como privados por defecto.',
        'legal.privacitat_p2': 'A plataforma non se fai responsable dos datos que o Membro edite e faga públicos. É responsabilidade do usuario xestionar a visibilidade da súa información persoal.',
        'legal.privacitat_p3': 'Podes controlar en todo momento a visibilidade dos teus datos desde a sección de privacidade.',
      }
    }
  }

  private inicialitzarCache() {
    // Cargar todas las traducciones en cache de memoria para mejor rendimiento
    Object.keys(this.configuracio.traduccionsCache).forEach(idioma => {
      const traduccions = this.configuracio.traduccionsCache[idioma]
      if (traduccions) {
        this.cacheMemoria.set(idioma, new Map(Object.entries(traduccions)))
      }
    })
  }

  // Método principal de traducción
  t(clau: string, idioma?: string, opcions?: {
    fallback?: string
    variables?: Record<string, string | number>
    contexte?: string
  }): string {
    const idiomaTraduccio = idioma || this.configuracio.idiomaPredeterminat
    const fallback = opcions?.fallback || clau
    
    // Buscar en cache de memoria primero
    const cacheIdioma = this.cacheMemoria.get(idiomaTraduccio)
    if (cacheIdioma?.has(clau)) {
      let traduccio = cacheIdioma.get(clau)!
      
      // Aplicar variables si existen
      if (opcions?.variables) {
        traduccio = this.aplicarVariables(traduccio, opcions.variables)
      }
      
      return traduccio
    }

    // Si no se encuentra, intentar con idioma fallback
    if (idiomaTraduccio !== this.configuracio.fallbackIdioma) {
      const cacheFallback = this.cacheMemoria.get(this.configuracio.fallbackIdioma)
      if (cacheFallback?.has(clau)) {
        let traduccio = cacheFallback.get(clau)!
        
        if (opcions?.variables) {
          traduccio = this.aplicarVariables(traduccio, opcions.variables)
        }
        
        console.warn(`⚠️ Traducció no trobada per "${clau}" en ${idiomaTraduccio}, utilitzant fallback ${this.configuracio.fallbackIdioma}`)
        return traduccio
      }
    }

    // Si tampoco se encuentra, devolver fallback o la clave misma
    console.warn(`⚠️ Traducció no trobada per "${clau}" en cap idioma suportat`)
    return fallback
  }

  private aplicarVariables(text: string, variables: Record<string, string | number>): string {
    let resultat = text
    Object.entries(variables).forEach(([clau, valor]) => {
      resultat = resultat.replace(new RegExp(`{{${clau}}}`, 'g'), String(valor))
      resultat = resultat.replace(new RegExp(`{${clau}}`, 'g'), String(valor))
    })
    return resultat
  }

  // Obtener todas las traducciones para un idioma
  obtenirTraduccionsIdioma(idioma: string): Record<string, string> {
    const cache = this.cacheMemoria.get(idioma)
    if (!cache) return {}
    
    const traduccions: Record<string, string> = {}
    cache.forEach((valor, clau) => {
      traduccions[clau] = valor
    })
    return traduccions
  }

  // Agregar nuevas traducciones dinámicamente
  afegirTraduccions(idioma: string, traduccions: Record<string, string>) {
    if (!this.cacheMemoria.has(idioma)) {
      this.cacheMemoria.set(idioma, new Map())
    }
    
    const cache = this.cacheMemoria.get(idioma)!
    Object.entries(traduccions).forEach(([clau, valor]) => {
      cache.set(clau, valor)
    })
    
    // También actualizar el diccionario base
    if (!this.configuracio.traduccionsCache[idioma]) {
      this.configuracio.traduccionsCache[idioma] = {}
    }
    Object.assign(this.configuracio.traduccionsCache[idioma], traduccions)
    
    console.log(`📝 Afegides ${Object.keys(traduccions).length} traduccions per ${idioma}`)
  }

  // Obtener idiomas soportados
  obtenirIdiomesSuportats(): string[] {
    return [...this.configuracio.idiomesSuportats]
  }

  // Verificar si un idioma está soportado
  esIdiomaSuportat(idioma: string): boolean {
    return this.configuracio.idiomesSuportats.includes(idioma)
  }

  // Configurar idioma predeterminado
  configurarIdiomaPredeterminat(idioma: string) {
    if (this.esIdiomaSuportat(idioma)) {
      this.configuracio.idiomaPredeterminat = idioma
      console.log(`🌐 Idioma predeterminat configurat: ${idioma}`)
    } else {
      console.warn(`⚠️ Idioma no suportat: ${idioma}`)
    }
  }

  // Obtener estadísticas de traducción
  obtenirEstadistiques(): {
    idiomesSuportats: number
    totalClaus: number
    traduccionsPerIdioma: Record<string, number>
    clausSenseTraduccion: string[]
  } {
    const traduccionsPerIdioma: Record<string, number> = {}
    const totesLesClaus = new Set<string>()
    
    this.cacheMemoria.forEach((traduccions, idioma) => {
      traduccionsPerIdioma[idioma] = traduccions.size
      traduccions.forEach((_, clau) => totesLesClaus.add(clau))
    })
    
    // Buscar claves sin traducir
    const clausSenseTraduccion: string[] = []
    const idiomaPrincipal = this.configuracio.idiomaPredeterminat
    const cachePrincipal = this.cacheMemoria.get(idiomaPrincipal)
    
    if (cachePrincipal) {
      totesLesClaus.forEach(clau => {
        if (!cachePrincipal.has(clau)) {
          clausSenseTraduccion.push(clau)
        }
      })
    }
    
    return {
      idiomesSuportats: this.configuracio.idiomesSuportats.length,
      totalClaus: totesLesClaus.size,
      traduccionsPerIdioma,
      clausSenseTraduccion
    }
  }

  // Exportar traducciones para desarrollo
  exportarTraduccions(): DiccionariTraduccions {
    const exportacio: DiccionariTraduccions = {}
    
    this.cacheMemoria.forEach((traduccions, idioma) => {
      exportacio[idioma] = {}
      traduccions.forEach((valor, clau) => {
        exportacio[idioma][clau] = valor
      })
    })
    
    return exportacio
  }

  // Importar traducciones desde archivo JSON
  importarTraduccions(traduccions: DiccionariTraduccions) {
    Object.entries(traduccions).forEach(([idioma, claus]) => {
      this.afegirTraduccions(idioma, claus)
    })
    
    console.log(`📁 Traduccions importades per ${Object.keys(traduccions).length} idiomes`)
  }
}

// Export singleton
export const traduccioAutomatica = TraduccioAutomaticaService.getInstance()

// Hook personalizado para usar en componentes
export function useTraduccio(idioma?: string) {
  return {
    t: (clau: string, opcions?: {
      fallback?: string
      variables?: Record<string, string | number>
      contexte?: string
    }) => traduccioAutomatica.t(clau, idioma, opcions),
    
    idiomesSuportats: traduccioAutomatica.obtenirIdiomesSuportats(),
    
    afegirTraduccions: (traduccions: Record<string, string>) => {
      if (idioma) {
        traduccioAutomatica.afegirTraduccions(idioma, traduccions)
      }
    }
  }
}