'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral'
import { PortadaCursHero } from '../../../src/componentes/comunes'
import { useT } from '../../../src/contextos/TraduccioContext'
import { Curs, ProgressCurs, Leccio, ContingutLeccio, Avaluacio } from '../../../src/tipos/formacion'
// import FormacioIAService from '../../../src/servicios/formacioIA'

// const formacioService = FormacioIAService.getInstance()

export default function CursDetallPage() {
  const params = useParams()
  const cursId = params?.id as string
  const t = useT()

  const [curs, setCurs] = useState<Curs | null>(null)
  const [progressUsuari, setProgressUsuari] = useState<ProgressCurs | null>(null)
  const [leccioActiva, setLeccioActiva] = useState<Leccio | null>(null)
  const [contingutActiu, setContingutActiu] = useState<ContingutLeccio | null>(null)
  const [isInscrit, setIsInscrit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para la interfaz
  const [vistaActiva, setVistaActiva] = useState<'contingut' | 'recursos' | 'avaluacions' | 'discussio'>('contingut')
  const [sidebarObert, setSidebarObert] = useState(true)

  useEffect(() => {
    if (cursId) {
      cargarCurs()
    }
  }, [cursId])

  const cargarCurs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simular carga de datos del curso
      const cursData: Curs = {
        id: cursId,
        titol: "Transformació Digital a l'Administració Pública",
        descripcio: "Aprèn les millors pràctiques per implementar la transformació digital en organismes públics, millorant l'eficiència i l'atenció ciutadana.",
        instructor: {
          nom: "Maria",
          cognoms: "González Martínez",
          email: "maria.gonzalez@formacio.cat",
          bio: "Experta en transformació digital amb 15 anys d'experiència en l'administració pública.",
          avatar: "MG"
        },
        categoria: "DIGITAL",
        nivel: "intermedio",
        modalitat: "mixta",
        duracio: 120,
        certificat: true,
        preu: 0,
        dataCreacio: new Date('2024-01-15'),
        dataPublicacio: new Date('2024-02-01'),
        dataInici: new Date('2024-03-01'),
        dataLimit: new Date('2024-06-30'),
        leccions: [
          {
            id: '1',
            cursId: cursId,
            titol: 'Introducció a la Transformació Digital',
            descripcio: 'Conceptes fonamentals i beneficis de la digitalització',
            ordre: 1,
            duracioEstimada: 30,
            continguts: [
              {
                id: '1-1',
                tipus: 'text',
                titol: 'Què és la transformació digital?',
                contingut: '<p>La transformació digital és un procés integral que implica l\'adopció de tecnologies digitals per millorar els serveis públics i l\'eficiència administrativa...</p>',
                ordre: 1,
                duracioEstimada: 15
              },
              {
                id: '1-2',
                tipus: 'video',
                titol: 'Casos d\'èxit en administracions públiques',
                contingut: 'https://example.com/video-casos-exit',
                ordre: 2,
                duracioEstimada: 15
              }
            ],
            obligatoria: true,
            visible: true,
            generatPerIA: true,
            dificultatIA: 3
          },
          {
            id: '2',
            cursId: cursId,
            titol: 'Eines i Tecnologies Clau',
            descripcio: 'Revisió de les principals tecnologies per a la digitalització',
            ordre: 2,
            duracioEstimada: 45,
            continguts: [
              {
                id: '2-1',
                tipus: 'text',
                titol: 'Plataformes de gestió documental',
                contingut: '<p>Les plataformes de gestió documental són essencials per organitzar i automatitzar els processos administratius...</p>',
                ordre: 1,
                duracioEstimada: 20
              },
              {
                id: '2-2',
                tipus: 'interactiu',
                titol: 'Simulador de workflow digital',
                contingut: '<div>Pràctica interactiva amb eines reals</div>',
                ordre: 2,
                duracioEstimada: 25
              }
            ],
            obligatoria: true,
            visible: true,
            generatPerIA: true,
            dificultatIA: 5
          }
        ],
        avaluacions: [
          {
            id: 'eval-1',
            cursId: cursId,
            titol: 'Avaluació Final',
            descripcio: 'Test de coneixements sobre transformació digital',
            tipus: 'quiz',
            preguntes: [],
            tempsLimit: 30,
            intentsMaxims: 3,
            notaMinima: 7,
            pes: 1,
            generatPerIA: true
          }
        ],
        recursos: [
          {
            id: 'rec-1',
            nom: 'Guia de Transformació Digital',
            tipus: 'pdf',
            url: '/recursos/guia-transformacio-digital.pdf',
            descripcio: 'Document complet amb metodologies i millors pràctiques',
            obligatori: true,
            ordre: 1
          }
        ],
        estat: "ACTIU",
        publicat: true,
        destacat: true,
        totalInscrits: 245,
        totalCompletats: 187,
        valoracioMitjana: 4.6,
        totalValoracions: 156,
        generatPerIA: true,
        promptOriginal: "Crea un curs sobre transformació digital per a empleats públics",
        versioIA: "claude-3.5"
      }

      setCurs(cursData)

      // Simular datos de progreso del usuario
      const progressData: ProgressCurs = {
        usuariId: 'user-123',
        cursId: cursId,
        dataInscripcio: new Date('2024-03-01'),
        dataInici: new Date('2024-03-02'),
        estat: 'en_progres',
        percentatgeCompletacio: 35,
        tempsInvertit: 45,
        leccionsCompletades: ['1'],
        avaluacionsRealitzades: [],
        recomanacionsIA: []
      }

      setProgressUsuari(progressData)
      setIsInscrit(true)

      // Establecer primera lección como activa
      if (cursData.leccions.length > 0) {
        setLeccioActiva(cursData.leccions[0])
        if (cursData.leccions[0].continguts.length > 0) {
          setContingutActiu(cursData.leccions[0].continguts[0])
        }
      }

    } catch (err) {
      console.error('Error carregant curs:', err)
      setError('Error carregant el curs')
    } finally {
      setLoading(false)
    }
  }

  const inscriuresCurs = async () => {
    // Simular inscripción
    setIsInscrit(true)
    await cargarCurs()
  }

  const marcarLeccioCompletada = async (leccioId: string) => {
    if (progressUsuari && !progressUsuari.leccionsCompletades.includes(leccioId)) {
      const novaProgress = {
        ...progressUsuari,
        leccionsCompletades: [...progressUsuari.leccionsCompletades, leccioId],
        percentatgeCompletacio: Math.min(100, progressUsuari.percentatgeCompletacio + (100 / (curs?.leccions.length || 1)))
      }
      setProgressUsuari(novaProgress)
    }
  }


  if (loading) {
    return (
      <LayoutGeneral paginaActual="formacio">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading', { fallback: 'Carregant...' })}</p>
          </div>
        </div>
      </LayoutGeneral>
    )
  }

  if (error || !curs) {
    return (
      <LayoutGeneral paginaActual="formacio">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Curs no trobat'}</p>
            <a 
              href="/formacio" 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('tornar_formacio', { fallback: 'Tornar a Formació' })}
            </a>
          </div>
        </div>
      </LayoutGeneral>
    )
  }

  return (
    <LayoutGeneral paginaActual="formacio" showPadding={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header del curso con portada */}
        <PortadaCursHero categoria={curs.categoria}>
          <div className="w-full p-6 md:p-8 flex items-end">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {curs.categoria}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {curs.nivel.charAt(0).toUpperCase() + curs.nivel.slice(1)}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">{curs.titol}</h1>
              <p className="text-gray-200 text-lg mb-6 max-w-3xl">{curs.descripcio}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-white">
                <div className="flex items-center space-x-2">
                  <span>👨‍🏫</span>
                  <span>{curs.instructor.nom} {curs.instructor.cognoms}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>{curs.duracio} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>{curs.totalInscrits} estudiants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>{curs.valoracioMitjana.toFixed(1)} ({curs.totalValoracions} valoracions)</span>
                </div>
              </div>
            </div>
          </div>
        </PortadaCursHero>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar de lecciones - Solo mostrar si está inscrito */}
            {isInscrit && (
              <div className={`lg:col-span-3 ${sidebarObert ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Contingut del Curs</h3>
                    <button 
                      onClick={() => setSidebarObert(!sidebarObert)}
                      className="lg:hidden p-1 hover:bg-gray-100 rounded"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {progressUsuari && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progrés</span>
                        <span>{progressUsuari.percentatgeCompletacio.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressUsuari.percentatgeCompletacio}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {curs.leccions.map((leccio, index) => {
                      const isCompleted = progressUsuari?.leccionsCompletades.includes(leccio.id)
                      const isActive = leccioActiva?.id === leccio.id
                      
                      return (
                        <button
                          key={leccio.id}
                          onClick={() => {
                            setLeccioActiva(leccio)
                            if (leccio.continguts.length > 0) {
                              setContingutActiu(leccio.continguts[0])
                            }
                            setVistaActiva('contingut')
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-blue-50 border-2 border-blue-500' 
                              : 'hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : isActive 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-200 text-gray-600'
                            }`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900">{leccio.titol}</div>
                              <div className="text-xs text-gray-500">{leccio.duracioEstimada} min</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Contenido principal */}
            <div className={`${isInscrit ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
              {!isInscrit ? (
                // Vista previa para usuarios no inscritos
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Inscriu-te al curs</h2>
                  <p className="text-gray-600 mb-6">
                    Per accedir al contingut complet del curs, primer has d'inscriure't.
                  </p>
                  <button
                    onClick={inscriuresCurs}
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
                  >
                    {curs.preu ? `Inscriure's per ${curs.preu}€` : 'Inscriure\'s Gratuïtament'}
                  </button>
                  
                  {/* Preview del contenido */}
                  <div className="mt-8 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Què aprendràs:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {curs.leccions.slice(0, 4).map((leccio, index) => (
                        <div key={leccio.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <div className="font-medium text-sm">{leccio.titol}</div>
                            <div className="text-xs text-gray-500">{leccio.duracioEstimada} min</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Vista del curso para usuarios inscritos
                <div className="space-y-6">
                  {/* Navegación de pestañas */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8 px-6">
                        {[
                          { key: 'contingut', label: 'Contingut', icon: '📖' },
                          { key: 'recursos', label: 'Recursos', icon: '📎' },
                          { key: 'avaluacions', label: 'Avaluacions', icon: '📝' },
                          { key: 'discussio', label: 'Discussió', icon: '💬' }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setVistaActiva(tab.key as any)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                              vistaActiva === tab.key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Contenido de las pestañas */}
                    <div className="p-6">
                      {vistaActiva === 'contingut' && leccioActiva && (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">{leccioActiva.titol}</h2>
                              <p className="text-gray-600 mt-1">{leccioActiva.descripcio}</p>
                            </div>
                            <button
                              onClick={() => marcarLeccioCompletada(leccioActiva.id)}
                              disabled={progressUsuari?.leccionsCompletades.includes(leccioActiva.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                progressUsuari?.leccionsCompletades.includes(leccioActiva.id)
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                            >
                              {progressUsuari?.leccionsCompletades.includes(leccioActiva.id) ? 'Completada ✓' : 'Marcar com Completada'}
                            </button>
                          </div>

                          {/* Contenido de la lección */}
                          {contingutActiu && (
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h3 className="font-semibold text-gray-900 mb-4">{contingutActiu.titol}</h3>
                              {contingutActiu.tipus === 'text' && (
                                <div 
                                  className="prose max-w-none"
                                  dangerouslySetInnerHTML={{ __html: contingutActiu.contingut }}
                                />
                              )}
                              {contingutActiu.tipus === 'video' && (
                                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                                  <div className="text-white text-center">
                                    <div className="text-4xl mb-2">🎥</div>
                                    <p>Vídeo: {contingutActiu.titol}</p>
                                    <p className="text-sm text-gray-300">{contingutActiu.duracioEstimada} min</p>
                                  </div>
                                </div>
                              )}
                              {contingutActiu.tipus === 'interactiu' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                  <div className="text-2xl mb-2">⚡</div>
                                  <h4 className="font-semibold text-blue-900 mb-2">Contingut Interactiu</h4>
                                  <p className="text-blue-700">{contingutActiu.titol}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Navegación entre contenidos de la lección */}
                          {leccioActiva.continguts.length > 1 && (
                            <div className="mt-6 flex justify-between items-center">
                              <button
                                onClick={() => {
                                  const currentIndex = leccioActiva.continguts.findIndex(c => c.id === contingutActiu?.id)
                                  if (currentIndex > 0) {
                                    setContingutActiu(leccioActiva.continguts[currentIndex - 1])
                                  }
                                }}
                                disabled={leccioActiva.continguts[0].id === contingutActiu?.id}
                                className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                ← Anterior
                              </button>
                              <div className="text-sm text-gray-600">
                                {leccioActiva.continguts.findIndex(c => c.id === contingutActiu?.id) + 1} de {leccioActiva.continguts.length}
                              </div>
                              <button
                                onClick={() => {
                                  const currentIndex = leccioActiva.continguts.findIndex(c => c.id === contingutActiu?.id)
                                  if (currentIndex < leccioActiva.continguts.length - 1) {
                                    setContingutActiu(leccioActiva.continguts[currentIndex + 1])
                                  }
                                }}
                                disabled={leccioActiva.continguts[leccioActiva.continguts.length - 1].id === contingutActiu?.id}
                                className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                Següent →
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {vistaActiva === 'recursos' && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Recursos del Curs</h2>
                          <div className="space-y-4">
                            {curs.recursos.map(recurs => (
                              <div key={recurs.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {recurs.tipus === 'pdf' && '📄'}
                                    {recurs.tipus === 'video' && '🎥'}
                                    {recurs.tipus === 'document' && '📝'}
                                    {recurs.tipus === 'enllaç' && '🔗'}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900">{recurs.nom}</h3>
                                    {recurs.descripcio && (
                                      <p className="text-sm text-gray-600">{recurs.descripcio}</p>
                                    )}
                                    {recurs.obligatori && (
                                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                                        Obligatori
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                  Descarregar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {vistaActiva === 'avaluacions' && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Avaluacions</h2>
                          <div className="space-y-4">
                            {curs.avaluacions.map(avaluacio => (
                              <div key={avaluacio.id} className="p-6 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{avaluacio.titol}</h3>
                                    <p className="text-gray-600">{avaluacio.descripcio}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                      Temps límit: {avaluacio.tempsLimit} min
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Nota mínima: {avaluacio.notaMinima}/10
                                    </div>
                                  </div>
                                </div>
                                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                  Començar Avaluació
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {vistaActiva === 'discussio' && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Discussió del Curs</h2>
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Fòrum de Discussió</h3>
                            <p className="text-gray-600 mb-4">Participa en discussions amb altres estudiants i l'instructor.</p>
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                              Obrir Fòrum
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutGeneral>
  )
}