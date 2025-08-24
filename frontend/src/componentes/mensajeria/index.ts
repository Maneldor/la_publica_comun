// ✅ BARREL EXPORTS: Componentes de mensajería optimizados
// Arquitectura modular para sistema de mensajería en tiempo real

export { default as ModalMensajeria } from './ModalMensajeria'
export { default as ListaConversaciones } from './ListaConversaciones'
export { default as ChatWindow } from './ChatWindow'
export { default as MessageInput } from './MessageInput'
export { default as CallInterface } from './CallInterface'

// ✅ TIPOS EXPORTADOS
export type {
  PropietatsListaConversacions,
  PropietatsChatWindow,
  PropietatsMessageInput,
  PropietatsCallInterface
} from '../../../tipos/mensajes'