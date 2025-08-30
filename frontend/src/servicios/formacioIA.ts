'use client'

import { 
  Curs, 
  Leccio, 
  Avaluacio, 
  GenerarCursPrompt, 
  ParametresAvaluacio,
  AnalisiDificultatIA,
  ServeiIA,
  CursMultiidioma,
  RecomanacioIA,
  PerfilUsuari,
  ContingutPersonalitzat,
  PrediccioBandonament,
  RecomanacioMillora,
  OptimitzacioIA
} from '../tipos/formacion'

// Configuración del servicio Claude IA
interface ConfiguracioClaudeIA {
  apiKey?: string
  model: string
  maxTokens: number
  temperature: number
  baseURL: string
}

class FormacioIAService implements ServeiIA {
  private static instance: FormacioIAService
  private configuracio: ConfiguracioClaudeIA
  private cache: Map<string, any> = new Map()

  private constructor() {
    this.configuracio = {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 8192,
      temperature: 0.7,
      baseURL: 'https://api.anthropic.com/v1'
    }
  }

  static getInstance(): FormacioIAService {
    if (!FormacioIAService.instance) {
      FormacioIAService.instance = new FormacioIAService()
    }
    return FormacioIAService.instance
  }

  // 🎓 Generar curso completo con IA
  async generarCurs(prompt: GenerarCursPrompt): Promise<Curs> {
    const cacheKey = `curs_${JSON.stringify(prompt)}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const sistemPrompt = `Ets un expert en formació per a empleats públics. Crea un curs estructurat i detallat.

CONTEXT: La plataforma és per empleats del sector públic espanyol (Catalunya, Euskadi, Galicia, Madrid, etc.).

REQUERIMENTS:
- Contingut pràctic i aplicable
- Llenguatge professional però accessible
- Exemples reals del sector públic
- Estructura pedagògica sòlida
- Avaluacions efectives

RESPOSTA: JSON vàlid amb l'estructura del curs completa.`

      const userPrompt = `Crea un curs sobre: ${prompt.tema}

Especificacions:
- Duració: ${prompt.duracio} minuts
- Nivell: ${prompt.niveau}
- Categoria: ${prompt.categoria}
- Modalitat: ${prompt.modalitat}
- Audiència: ${prompt.audiencia}
- Objectius: ${prompt.objectius.join(', ')}
${prompt.requisitosPrevios ? `- Requisits previs: ${prompt.requisitosPrevios}` : ''}

El curs ha d'incloure:
1. Estructura clara amb 3-8 leccions
2. Contingut detallat per cada lección
3. Exercicis pràctics
4. Avaluacions (quizzes i exercicis)
5. Recursos complementaris
6. Certificació final si s'escau

FORMAT: JSON seguint l'interface Curs de TypeScript.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      const cursGenerat = JSON.parse(response.content) as Curs

      // Enriquir amb metadatos
      cursGenerat.generatPerIA = true
      cursGenerat.promptOriginal = JSON.stringify(prompt)
      cursGenerat.versioIA = this.configuracio.model
      cursGenerat.dataCreacio = new Date()
      cursGenerat.estat = 'ESBORRANY'

      this.cache.set(cacheKey, cursGenerat)
      return cursGenerat

    } catch (error) {
      console.error('Error generant curs amb IA:', error)
      throw new Error('No s\'ha pogut generar el curs amb IA')
    }
  }

  // 📝 Optimitzar contingut existent
  async optimitzarContingut(contingut: string, objectiu: string): Promise<string> {
    try {
      const sistemPrompt = `Ets un expert en pedagogia i formació online. Optimitza contingut educatiu per maximitzar l'aprenentatge.

PRINCIPIS:
- Claredat i concisió
- Estructura lògica
- Exemples pràctics
- Llenguatge adequat al nivell
- Engagement dels participants`

      const userPrompt = `Optimitza aquest contingut educatiu:

CONTINGUT ORIGINAL:
${contingut}

OBJECTIU D'OPTIMITZACIÓ:
${objectiu}

TASQUES:
1. Millorar la claredat i estructura
2. Afegir exemples pràctics del sector públic
3. Crear transicions fluïdes entre conceptes
4. Ajustar el to i llenguatge
5. Assegurar engagement

RESPOSTA: Contingut optimitzat en format HTML/Markdown.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return response.content

    } catch (error) {
      console.error('Error optimitzant contingut:', error)
      throw error
    }
  }

  // 📊 Crear avaluacions amb IA
  async crearAvaluacions(contingut: string, parametres: ParametresAvaluacio): Promise<Avaluacio> {
    try {
      const sistemPrompt = `Ets un expert en avaluació educativa. Crea avaluacions efectives que mesuren l'aprenentatge real.

PRINCIPIS:
- Preguntes que avaluen comprensió, no memorització
- Varietat de tipus de pregunta
- Feedback constructiu
- Nivell apropiat de dificultat
- Aplicació pràctica dels conceptes`

      const userPrompt = `Crea una avaluació basada en aquest contingut:

CONTINGUT DEL CURS:
${contingut}

PARÀMETRES:
- Nombre de preguntes: ${parametres.nombrePreguntes}
- Tipus permesos: ${parametres.tipus.join(', ')}
- Nivell: ${parametres.nivell}
- Temàtiques: ${parametres.tematica.join(', ')}
- Temps estimat: ${parametres.tempsEstimat} minuts

REQUISITS:
- Preguntes variades i equilibrades
- Opcions plausibles per múltiple elecció
- Explicacions detallades per cada resposta
- Puntuació apropiada
- Feedback constructiu

FORMAT: JSON seguint l'interface Avaluacio.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      const avaluacio = JSON.parse(response.content) as Avaluacio

      avaluacio.generatPerIA = true
      avaluacio.dataCreacio = new Date()

      return avaluacio

    } catch (error) {
      console.error('Error creant avaluacions:', error)
      throw error
    }
  }

  // 🎯 Analitzar dificultat del contingut
  async analitzarDificultat(contingut: string): Promise<AnalisiDificultatIA> {
    try {
      const sistemPrompt = `Ets un expert en anàlisi pedagògic. Avalua la dificultat del contingut educatiu i proporciona recomanacions.

FACTORS A ANALITZAR:
- Complexitat conceptual
- Requisits previs necessaris
- Càrrega cognitiva
- Abstracció dels conceptes
- Densitat informativa`

      const userPrompt = `Analitza la dificultat d'aquest contingut educatiu:

CONTINGUT:
${contingut}

PROPORCIONA:
1. Nivell detectat (basic/intermedio/avanzado)
2. Puntuació de dificultat (1-10)
3. Conceptes clau identificats
4. Requisits previs necessaris
5. Recomanacions per ajustar la dificultat
6. Temps d'aprenentatge estimat realista

FORMAT: JSON seguint l'interface AnalisiDificultatIA.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return JSON.parse(response.content) as AnalisiDificultatIA

    } catch (error) {
      console.error('Error analitzant dificultat:', error)
      throw error
    }
  }

  // 👤 Personalitzar contingut per usuari
  async personalitzarContingut(curs: Curs, perfilUsuari: PerfilUsuari): Promise<ContingutPersonalitzat> {
    try {
      const sistemPrompt = `Ets un expert en personalització educativa. Adapta contingut de cursos segons el perfil de l'aprenent.

PRINCIPIS:
- Respectar l'estil d'aprenentatge
- Ajustar al ritme personal
- Proporcionar exemples rellevants
- Oferir contingut complementari
- Mantenir la motivació alta`

      const userPrompt = `Personalitza aquest curs segons el perfil de l'usuari:

CURS:
${JSON.stringify({
        titol: curs.titol,
        categoria: curs.categoria,
        nivell: curs.nivel,
        leccions: curs.leccions.map(l => ({ id: l.id, titol: l.titol, contingut: l.continguts }))
      })}

PERFIL USUARI:
- Competències actuals: ${perfilUsuari.competenciesActuals.join(', ')}
- Objectius: ${perfilUsuari.objectiusAprenentatge.join(', ')}
- Temps disponible: ${perfilUsuari.tempsDisponible} min/setmana
- Preferències modalitat: ${perfilUsuari.preferenciesTormacio.modalitats.join(', ')}
- Historial completacions: ${perfilUsuari.historialCompletacions.length} cursos
- Performance mitjana: ${perfilUsuari.avaluacionsPerformance.mitjanaQualificacions}

PERSONALITZA:
1. Ruta d'aprenentatge òptima
2. Modificacions de contingut necessàries
3. Recursos addicionals recomanats
4. Ritme suggerit
5. Contingut complementari

FORMAT: JSON seguint l'interface ContingutPersonalitzat.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return JSON.parse(response.content) as ContingutPersonalitzat

    } catch (error) {
      console.error('Error personalitzant contingut:', error)
      throw error
    }
  }

  // 🌍 Traduir curs a múltiples idiomes
  async traduirCurs(curs: Curs, idiomes: string[]): Promise<CursMultiidioma> {
    try {
      const traduccions: { [idioma: string]: any } = {}

      for (const idioma of idiomes) {
        const sistemPrompt = `Ets un traductor expert especialitzat en contingut educatiu per empleats públics.

CONTEXT:
- Sector: Administració pública espanyola
- Audiència: Professionals del sector públic
- Registre: Formal però accessible
- Terminologia: Específica del sector públic

IDIOMA DESTÍ: ${idioma === 'ca' ? 'Català' : idioma === 'es' ? 'Espanyol' : idioma === 'eu' ? 'Euskera' : 'Gallec'}

REQUISITS:
- Mantenir precisió tècnica
- Adaptar culturalment
- Conservar estructura pedagògica
- Usar terminologia oficial del sector públic`

        const userPrompt = `Tradueix aquest curs a ${idioma}:

CURS ORIGINAL:
${JSON.stringify({
          titol: curs.titol,
          descripcio: curs.descripcio,
          leccions: curs.leccions,
          avaluacions: curs.avaluacions,
          recursos: curs.recursos
        })}

TRADUEIX:
1. Títol i descripció
2. Totes les leccions (títols, contingut, exercicis)
3. Avaluacions completes (preguntes, opcions, explicacions)
4. Recursos i materials

MANTÉN:
- IDs originals
- Estructura JSON
- Precisió tècnica
- Coherència terminològica

FORMAT: JSON amb la traducció completa.`

        const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
        traduccions[idioma] = JSON.parse(response.content)
      }

      return {
        cursOriginal: curs,
        traduccions,
        metadadesTraducció: {
          serveiUtilitzat: 'Claude-3.5-Sonnet',
          dataTraducció: new Date(),
          qualitat: 9, // Alta qualitat amb Claude
          revisatPerHuma: false
        }
      }

    } catch (error) {
      console.error('Error traduint curs:', error)
      throw error
    }
  }

  // 🤖 Generar recomanacions personalitzades
  async generarRecomanacions(historialUsuari: any[], preferencies: any): Promise<RecomanacioIA[]> {
    try {
      const sistemPrompt = `Ets un expert en recomanacions educatives. Analitza l'historial i preferències per suggerir cursos òptims.

FACTORS:
- Historial de completacions
- Competències actuals vs objectius
- Tendències del sector públic
- Rutes de carrera professional
- Gaps de coneixement identificats`

      const userPrompt = `Genera recomanacions de cursos basades en:

HISTORIAL USUARI:
${JSON.stringify(historialUsuari)}

PREFERÈNCIES:
${JSON.stringify(preferencies)}

GENERA:
1. 5-10 recomanacions prioritàries
2. Raonament per cada recomanació
3. Puntuació de rellevància
4. Ruta d'aprenentatge suggerida
5. Beneficis específics per l'usuari

FORMAT: Array JSON seguint l'interface RecomanacioIA.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return JSON.parse(response.content) as RecomanacioIA[]

    } catch (error) {
      console.error('Error generant recomanacions:', error)
      throw error
    }
  }

  // 📈 Predir abandonament de cursos
  async prediureAbandonament(progressUsuaris: any[]): Promise<PrediccioBandonament[]> {
    try {
      const sistemPrompt = `Ets un expert en analytics educatius. Prediu la probabilitat d'abandonament i proposa intervencions.

INDICADORS:
- Patrons de participació
- Temps entre sessions
- Performance en avaluacions
- Interacció amb contingut
- Progres vs cronograma plannificat`

      const userPrompt = `Analitza aquests patrons d'usuari i prediu abandonament:

DADES USUARIS:
${JSON.stringify(progressUsuaris)}

PER CADA USUARI PROPORCIONA:
1. Probabilitat d'abandonament (0-1)
2. Factors de risc identificats
3. Moment crític probable
4. Intervencions recomanades
5. Senyal d'alerta a monitorar

FORMAT: Array JSON seguint l'interface PrediccioBandonament.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return JSON.parse(response.content) as PrediccioBandonament[]

    } catch (error) {
      console.error('Error predint abandonament:', error)
      throw error
    }
  }

  // ⚡ Generar optimitzacions per cursos
  async generarOptimitzacions(analytics: any): Promise<OptimitzacioIA[]> {
    try {
      const sistemPrompt = `Ets un expert en optimització de cursos online. Analitza mètriques i proposa millores concrete.

ÀREES D'OPTIMITZACIÓ:
- Contingut més efectiu
- Estructura pedagògica
- Timing i ritme
- Avaluacions més precises
- Recursos complementaris
- Experience d'usuari`

      const userPrompt = `Basant-te en aquestes analytics, proposa optimitzacions:

ANALYTICS:
${JSON.stringify(analytics)}

GENERA OPTIMITZACIONS:
1. Identifica problemes específics
2. Proposa solucions concretes
3. Estima impacte de cada millora
4. Prioritza per cost/benefici
5. Especifica mètriques d'èxit

FORMAT: Array JSON seguint l'interface OptimitzacioIA.`

      const response = await this.cridarClaudeAPI(sistemPrompt, userPrompt)
      return JSON.parse(response.content) as OptimitzacioIA[]

    } catch (error) {
      console.error('Error generant optimitzacions:', error)
      throw error
    }
  }

  // 🔧 Mètode privat: Cridar API de Claude
  private async cridarClaudeAPI(sistemPrompt: string, userPrompt: string): Promise<any> {
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY no està configurada')
    }

    const response = await fetch(`${this.configuracio.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.configuracio.model,
        max_tokens: this.configuracio.maxTokens,
        temperature: this.configuracio.temperature,
        system: sistemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Error API Claude: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Resposta inesperada de l\'API de Claude')
    }

    return {
      content: data.content[0].text,
      usage: data.usage,
      model: data.model
    }
  }

  // 🧼 Netejar cache
  clearCache(): void {
    this.cache.clear()
  }

  // 📊 Estadístiques del servei
  getStats(): any {
    return {
      cacheSize: this.cache.size,
      model: this.configuracio.model,
      configured: !!process.env.ANTHROPIC_API_KEY
    }
  }
}

// Export singleton
export const formacioIA = FormacioIAService.getInstance()
export { FormacioIAService }
export default formacioIA