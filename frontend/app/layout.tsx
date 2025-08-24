'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../src/contextos/AuthContext'
import { ComunidadProvider } from './ComunidadContext'
import { TraduccioProvider } from '../src/contextos/TraduccioContext'
import { PostsProvider } from '../src/contextos/PostsContext'
import { NotificationsProvider } from '../src/contextos/NotificationsContext'
import { NotificacionsProvider } from '../src/contextos/NotificacionsContext'
import { MissatgesProvider } from '../src/contextos/MissatgesContext'
import { UsuarioProvider } from '../src/contextos/UsuarioContext'
// MessagesProvider eliminado
import { GroupMembershipProvider } from '../src/contextos/GroupMembershipContext'
import { GruposAvanzadosProvider } from '../src/contextos/GruposAvanzadosContext'
import { ConexionesProvider } from '../src/contextos/ConexionesContext'
import { FavoritosProvider } from '../src/contextos/FavoritosContext'
// MensajeriaGrupoProvider eliminado

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ComunidadProvider>
            <TraduccioProvider>
              <UsuarioProvider>
                <PostsProvider>
                  <NotificationsProvider>
                    <NotificacionsProvider>
                      <ConexionesProvider>
                        <FavoritosProvider usuarioId="user-1">
                          <MissatgesProvider>
                            <GroupMembershipProvider>
                              <GruposAvanzadosProvider>
                                {children}
                              </GruposAvanzadosProvider>
                            </GroupMembershipProvider>
                          </MissatgesProvider>
                        </FavoritosProvider>
                      </ConexionesProvider>
                    </NotificacionsProvider>
                  </NotificationsProvider>
                </PostsProvider>
              </UsuarioProvider>
            </TraduccioProvider>
          </ComunidadProvider>
        </AuthProvider>
      </body>
    </html>
  )
}