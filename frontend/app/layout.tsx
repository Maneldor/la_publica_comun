'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../src/contextos/AuthContext'
import { ComunidadProvider } from './ComunidadContext'
import { PostsProvider } from '../src/contextos/PostsContext'
import { NotificationsProvider } from '../src/contextos/NotificationsContext'
import { NotificacionsProvider } from '../src/contextos/NotificacionsContext'
import { MissatgesProvider } from '../src/contextos/MissatgesContext'
import { UsuarioProvider } from '../src/contextos/UsuarioContext'
// MessagesProvider eliminado
import { GroupMembershipProvider } from '../src/contextos/GroupMembershipContext'
import { GruposAvanzadosProvider } from '../src/contextos/GruposAvanzadosContext'
import { ConexionesProvider } from '../src/contextos/ConexionesContext'
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
            <UsuarioProvider>
              <PostsProvider>
                <NotificationsProvider>
                  <NotificacionsProvider>
                    <ConexionesProvider>
                      <MissatgesProvider>
                        <GroupMembershipProvider>
                          <GruposAvanzadosProvider>
                            {children}
                          </GruposAvanzadosProvider>
                        </GroupMembershipProvider>
                      </MissatgesProvider>
                    </ConexionesProvider>
                  </NotificacionsProvider>
                </NotificationsProvider>
              </PostsProvider>
            </UsuarioProvider>
          </ComunidadProvider>
        </AuthProvider>
      </body>
    </html>
  )
}