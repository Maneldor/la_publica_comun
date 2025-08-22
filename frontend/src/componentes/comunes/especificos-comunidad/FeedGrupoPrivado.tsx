'use client'

import { useState, useRef } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { PostGrupo, ArchivoMultimedia, ArchivoDocumento } from '../../../../tipos/gruposAvanzados'
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Camera,
  FileText,
  Smile,
  Send,
  Pin,
  Edit,
  Trash2,
  Flag,
  Eye,
  ThumbsUp,
  Laugh,
  Angry,
  Frown,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Paperclip,
  Image as ImageIcon,
  Video,
  File,
  Gift,
  Calendar
} from 'lucide-react'

interface FeedGrupoPrivadoProps {
  grupoId: string
}

type TipoReaccion = 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry'

export default function FeedGrupoPrivado({ grupoId }: FeedGrupoPrivadoProps) {
  const { 
    grupoActivo, 
    posts, 
    crearPost, 
    editarPost,
    reaccionarPost,
    comentarPost,
    puedeGestionarGrupo 
  } = useGruposAvanzados()
  
  const [nouPost, setNouPost] = useState('')
  const [tipoPost, setTipoPost] = useState<'texto' | 'imagen' | 'video' | 'documento' | 'oferta' | 'evento' | 'encuesta'>('texto')
  const [archivosSeleccionats, setArchivosSeleccionats] = useState<File[]>([])
  const [postEnEdicio, setPostEnEdicio] = useState<string | null>(null)
  const [mostrarReaccions, setMostrarReaccions] = useState<string | null>(null)
  const [comentarioActiu, setComentarioActiu] = useState<string | null>(null)
  const [nouComentari, setNouComentari] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const postsGrup = posts.filter(p => p.grupoId === grupoId)
  const puedeModerar = puedeGestionarGrupo(grupoId, 'moderar')

  const handleCrearPost = async () => {
    if (!nouPost.trim() && archivosSeleccionats.length === 0) return

    const multimedia: ArchivoMultimedia[] = []
    const documentos: ArchivoDocumento[] = []

    // Processar arxius seleccionats (simulat)
    archivosSeleccionats.forEach((file, index) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        multimedia.push({
          id: `media-${Date.now()}-${index}`,
          tipo: file.type.startsWith('image/') ? 'imagen' : 'video',
          url: URL.createObjectURL(file),
          nombre: file.name,
          tamaño: file.size,
          mimeType: file.type,
          fechaSubida: new Date(),
          subidoPor: 'user-1'
        })
      } else {
        documentos.push({
          id: `doc-${Date.now()}-${index}`,
          tipo: 'pdf', // Simplificat
          url: URL.createObjectURL(file),
          nombre: file.name,
          tamaño: file.size,
          mimeType: file.type,
          fechaSubida: new Date(),
          subidoPor: 'user-1',
          descargas: 0,
          esExclusivo: false
        })
      }
    })

    await crearPost(grupoId, {
      tipo: tipoPost,
      contenido: nouPost,
      multimedia,
      documentos,
      visibilidad: 'miembros'
    })

    // Resetear formulari
    setNouPost('')
    setArchivosSeleccionats([])
    setTipoPost('texto')
  }

  const handleReaccio = (postId: string, tipus: TipoReaccion) => {
    reaccionarPost(postId, tipus)
    setMostrarReaccions(null)
  }

  const handleComentari = async (postId: string) => {
    if (!nouComentari.trim()) return
    
    await comentarPost(postId, nouComentari)
    setNouComentari('')
    setComentarioActiu(null)
  }

  const getReaccionIcon = (tipus: TipoReaccion) => {
    const icons = {
      like: <ThumbsUp size={16} className="text-blue-500" />,
      love: <Heart size={16} className="text-red-500" />,
      wow: <span className="text-yellow-500">😮</span>,
      haha: <Laugh size={16} className="text-yellow-500" />,
      sad: <Frown size={16} className="text-yellow-600" />,
      angry: <Angry size={16} className="text-red-600" />
    }
    return icons[tipus]
  }

  const handleFileSelect = (tipus: 'imagen' | 'video' | 'document') => {
    switch (tipus) {
      case 'imagen':
        fileInputRef.current?.click()
        break
      case 'video':
        videoInputRef.current?.click()
        break
      case 'document':
        documentInputRef.current?.click()
        break
    }
  }

  const renderPostItem = (post: PostGrupo) => {
    const totalReaccions = post.reacciones.length
    const haReaccionat = post.reacciones.some(r => r.usuarioId === 'user-1')

    return (
      <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header del post */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {post.autor?.nombre?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {post.autor?.nombre || 'Usuari'}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{post.fechaCreacion.toLocaleDateString()}</span>
                  {post.visibilidad === 'miembros' && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>Només membres</span>
                      </div>
                    </>
                  )}
                  {post.esPinneado && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Pin size={12} />
                        <span>Pinnat</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Contingut del post */}
        <div className="px-4 pb-3">
          <p className="text-gray-900 whitespace-pre-wrap">{post.contenido}</p>
          
          {/* Etiquetes */}
          {post.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  #{etiqueta}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Multimedia */}
        {post.multimedia.length > 0 && (
          <div className="px-4 pb-3">
            <div className="grid gap-2">
              {post.multimedia.map((media) => (
                <div key={media.id} className="relative">
                  {media.tipo === 'imagen' ? (
                    <img
                      src={media.url}
                      alt={media.nombre}
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  ) : media.tipo === 'video' ? (
                    <div className="relative">
                      <video
                        src={media.url}
                        className="w-full rounded-lg max-h-96"
                        controls
                        preload="metadata"
                      >
                        El teu navegador no suporta el tag video.
                      </video>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {media.metadata?.duracion ? `${Math.floor(media.metadata.duracion / 60)}:${(media.metadata.duracion % 60).toString().padStart(2, '0')}` : 'Video'}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {post.documentos.length > 0 && (
          <div className="px-4 pb-3">
            <div className="space-y-2">
              {post.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <FileText size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {(doc.tamaño / 1024 / 1024).toFixed(1)} MB • {doc.descargas} descàrregues
                    </p>
                  </div>
                  <button className="flex-shrink-0 p-1 hover:bg-gray-200 rounded">
                    <Download size={16} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadístiques de reaccions i comentaris */}
        {(totalReaccions > 0 || post.comentarios.length > 0) && (
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {totalReaccions > 0 && (
                  <span className="flex items-center space-x-1">
                    <div className="flex -space-x-1">
                      {Array.from(new Set(post.reacciones.map((r: any) => r.tipo))).slice(0, 3).map((tipus: any, index: any) => (
                        <div key={index} className="flex items-center justify-center w-5 h-5 bg-white border border-white rounded-full">
                          {getReaccionIcon(tipus)}
                        </div>
                      ))}
                    </div>
                    <span>{totalReaccions}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {post.comentarios.length > 0 && (
                  <span>{post.comentarios.length} comentaris</span>
                )}
                {post.compartidos > 0 && (
                  <span>{post.compartidos} comparticions</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botons d'acció */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botó de reacció */}
              <div className="relative">
                <button
                  onClick={() => setMostrarReaccions(mostrarReaccions === post.id ? null : post.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    haReaccionat ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={16} />
                  <span className="text-sm font-medium">
                    {haReaccionat ? 'T\'agrada' : 'M\'agrada'}
                  </span>
                </button>

                {/* Panel de reaccions */}
                {mostrarReaccions === post.id && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border flex items-center space-x-2 p-2 z-10">
                    {['like', 'love', 'wow', 'haha', 'sad', 'angry'].map((tipus) => (
                      <button
                        key={tipus}
                        onClick={() => handleReaccio(post.id, tipus as TipoReaccion)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
                      >
                        {getReaccionIcon(tipus as TipoReaccion)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setComentarioActiu(comentarioActiu === post.id ? null : post.id)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageSquare size={16} />
                <span className="text-sm font-medium">Comentar</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={16} />
                <span className="text-sm font-medium">Compartir</span>
              </button>
            </div>

            {puedeModerar && (
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pin size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comentaris */}
        {comentarioActiu === post.id && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="flex items-start space-x-3 mt-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-700">Tu</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={nouComentari}
                    onChange={(e) => setNouComentari(e.target.value)}
                    placeholder="Escriu un comentari..."
                    className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleComentari(post.id)}
                  />
                  <button
                    onClick={() => handleComentari(post.id)}
                    disabled={!nouComentari.trim()}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Comentaris existents */}
            {post.comentarios.length > 0 && (
              <div className="mt-4 space-y-3">
                {post.comentarios.map((comentari) => (
                  <div key={comentari.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-700">
                        {comentari.autor?.nombre?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <p className="font-medium text-sm text-gray-900">
                          {comentari.autor?.nombre || 'Usuari'}
                        </p>
                        <p className="text-gray-800">{comentari.contenido}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{comentari.fechaCreacion.toLocaleDateString()}</span>
                        <button className="hover:underline">M'agrada</button>
                        <button className="hover:underline">Respondre</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!grupoActivo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Selecciona un grup per veure el seu feed</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formulari per crear nou post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-gray-700">Tu</span>
          </div>
          <div className="flex-1">
            <textarea
              value={nouPost}
              onChange={(e) => setNouPost(e.target.value)}
              placeholder={`Què vols compartir amb ${grupoActivo.nombre}?`}
              className="w-full min-h-[100px] p-3 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />

            {/* Arxius seleccionats */}
            {archivosSeleccionats.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Arxius seleccionats ({archivosSeleccionats.length})
                  </span>
                  <button
                    onClick={() => setArchivosSeleccionats([])}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar tots
                  </button>
                </div>
                <div className="space-y-2">
                  {archivosSeleccionats.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <File size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => setArchivosSeleccionats(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botons d'acció */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleFileSelect('imagen')}
                  className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <ImageIcon size={16} />
                  <span className="text-sm">Foto</span>
                </button>

                <button
                  onClick={() => handleFileSelect('video')}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Video size={16} />
                  <span className="text-sm">Video</span>
                </button>

                <button
                  onClick={() => handleFileSelect('document')}
                  className="flex items-center space-x-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <FileText size={16} />
                  <span className="text-sm">Document</span>
                </button>

                <button
                  onClick={() => setTipoPost('oferta')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    tipoPost === 'oferta' ? 'bg-orange-50 text-orange-600' : 'text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Gift size={16} />
                  <span className="text-sm">Oferta</span>
                </button>

                <button
                  onClick={() => setTipoPost('evento')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    tipoPost === 'evento' ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Calendar size={16} />
                  <span className="text-sm">Esdeveniment</span>
                </button>
              </div>

              <button
                onClick={handleCrearPost}
                disabled={!nouPost.trim() && archivosSeleccionats.length === 0}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>

        {/* Inputs ocults per arxius */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setArchivosSeleccionats(prev => [...prev, ...Array.from(e.target.files!)])
            }
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setArchivosSeleccionats(prev => [...prev, ...Array.from(e.target.files!)])
            }
          }}
        />
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setArchivosSeleccionats(prev => [...prev, ...Array.from(e.target.files!)])
            }
          }}
        />
      </div>

      {/* Feed de posts */}
      <div>
        {postsGrup.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aquest grup encara no té publicacions
            </h3>
            <p className="text-gray-600">
              Sigues el primer a compartir alguna cosa amb els membres!
            </p>
          </div>
        ) : (
          postsGrup.map(renderPostItem)
        )}
      </div>
    </div>
  )
}