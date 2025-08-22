'use client'

import { generarEnllacDirecte } from '../utils/enllacosDemails'

// Servei de notificacions per email
export interface EmailNotificacio {
  id: string
  tipus: 'missatge-nou' | 'mencio' | 'solicitud-connexio' | 'invitacio-grup' | 'connexio-acceptada'
  receptor: {
    email: string
    nom: string
    id: string
  }
  emissor: {
    nom: string
    avatar?: string
    id: string
  }
  contingut: {
    titol: string
    missatge: string
    linkDirecte: string
    metadata?: Record<string, any>
  }
  data: Date
  estat: 'pendent' | 'enviat' | 'error'
}

export class EmailNotificacionsService {
  private static instance: EmailNotificacionsService
  private emailsEnCua: EmailNotificacio[] = []
  private processantEmails = false

  private constructor() {}

  static getInstance(): EmailNotificacionsService {
    if (!EmailNotificacionsService.instance) {
      EmailNotificacionsService.instance = new EmailNotificacionsService()
    }
    return EmailNotificacionsService.instance
  }

  // Crear notificació d'email per missatge rebut
  async crearNotificacioMissatge(
    receptorId: string,
    receptorEmail: string,
    receptorNom: string,
    emissor: { id: string; nom: string; avatar?: string },
    missatge: string,
    conversaId: string
  ) {
    const emailNotificacio: EmailNotificacio = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipus: 'missatge-nou',
      receptor: {
        email: receptorEmail,
        nom: receptorNom,
        id: receptorId
      },
      emissor: {
        nom: emissor.nom,
        avatar: emissor.avatar,
        id: emissor.id
      },
      contingut: {
        titol: `Nou missatge de ${emissor.nom}`,
        missatge: missatge,
        linkDirecte: generarEnllacDirecte({
          tipus: 'missatge',
          id: conversaId,
          data: new Date().getTime().toString()
        }),
        metadata: {
          conversaId,
          tipusMissatge: 'directe'
        }
      },
      data: new Date(),
      estat: 'pendent'
    }

    await this.afegirACua(emailNotificacio)
  }

  // Crear notificació d'email per menció
  async crearNotificacioMencio(
    receptorId: string,
    receptorEmail: string,
    receptorNom: string,
    emissor: { id: string; nom: string; avatar?: string },
    missatge: string,
    grupId: string,
    postId?: string
  ) {
    const emailNotificacio: EmailNotificacio = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipus: 'mencio',
      receptor: {
        email: receptorEmail,
        nom: receptorNom,
        id: receptorId
      },
      emissor: {
        nom: emissor.nom,
        avatar: emissor.avatar,
        id: emissor.id
      },
      contingut: {
        titol: `${emissor.nom} t'ha mencionat`,
        missatge: missatge,
        linkDirecte: generarEnllacDirecte({
          tipus: 'grup',
          id: grupId,
          accio: postId ? `post-${postId}` : undefined,
          data: new Date().getTime().toString()
        }),
        metadata: {
          grupId,
          postId,
          tipusMencio: postId ? 'post' : 'grup'
        }
      },
      data: new Date(),
      estat: 'pendent'
    }

    await this.afegirACua(emailNotificacio)
  }

  // Crear notificació d'email per sol·licitud de connexió
  async crearNotificacioSolicitudConnexio(
    receptorId: string,
    receptorEmail: string,
    receptorNom: string,
    emissor: { id: string; nom: string; avatar?: string },
    missatgeSolicitud: string
  ) {
    const emailNotificacio: EmailNotificacio = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipus: 'solicitud-connexio',
      receptor: {
        email: receptorEmail,
        nom: receptorNom,
        id: receptorId
      },
      emissor: {
        nom: emissor.nom,
        avatar: emissor.avatar,
        id: emissor.id
      },
      contingut: {
        titol: `Nova sol·licitud de connexió de ${emissor.nom}`,
        missatge: missatgeSolicitud,
        linkDirecte: generarEnllacDirecte({
          tipus: 'notificacio',
          id: 'solicituds',
          accio: 'solicituds',
          data: new Date().getTime().toString()
        }),
        metadata: {
          tipusSolicitud: 'connexio'
        }
      },
      data: new Date(),
      estat: 'pendent'
    }

    await this.afegirACua(emailNotificacio)
  }

  // Crear notificació d'email per invitació a grup
  async crearNotificacioInvitacioGrup(
    receptorId: string,
    receptorEmail: string,
    receptorNom: string,
    emissor: { id: string; nom: string; avatar?: string },
    nomGrup: string,
    grupId: string
  ) {
    const emailNotificacio: EmailNotificacio = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipus: 'invitacio-grup',
      receptor: {
        email: receptorEmail,
        nom: receptorNom,
        id: receptorId
      },
      emissor: {
        nom: emissor.nom,
        avatar: emissor.avatar,
        id: emissor.id
      },
      contingut: {
        titol: `Invitació al grup "${nomGrup}"`,
        missatge: `${emissor.nom} t'ha convidat a unir-te al grup "${nomGrup}"`,
        linkDirecte: generarEnllacDirecte({
          tipus: 'grup',
          id: grupId,
          accio: 'join',
          data: new Date().getTime().toString()
        }),
        metadata: {
          grupId,
          nomGrup,
          tipusInvitacio: 'grup'
        }
      },
      data: new Date(),
      estat: 'pendent'
    }

    await this.afegirACua(emailNotificacio)
  }

  // Afegir email a la cua per processar
  private async afegirACua(emailNotificacio: EmailNotificacio) {
    this.emailsEnCua.push(emailNotificacio)
    
    if (!this.processantEmails) {
      await this.processarCuaEmails()
    }
  }

  // Processar cua d'emails
  private async processarCuaEmails() {
    if (this.processantEmails || this.emailsEnCua.length === 0) return

    this.processantEmails = true

    while (this.emailsEnCua.length > 0) {
      const email = this.emailsEnCua.shift()
      if (email) {
        try {
          await this.enviarEmail(email)
          email.estat = 'enviat'
          console.log(`✅ Email enviat: ${email.contingut.titol} a ${email.receptor.email}`)
        } catch (error) {
          email.estat = 'error'
          console.error(`❌ Error enviant email: ${email.contingut.titol}`, error)
          
          // Reintentarem després de 5 segons
          setTimeout(() => {
            if (email.estat === 'error') {
              email.estat = 'pendent'
              this.emailsEnCua.push(email)
            }
          }, 5000)
        }
      }
      
      // Esperar 1 segon entre emails per evitar spam
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    this.processantEmails = false
  }

  // Enviar email (simulat - en producció utilitzaríem un servei real)
  private async enviarEmail(emailNotificacio: EmailNotificacio): Promise<void> {
    // En un entorn real, aquí utilitzaríem un servei com:
    // - SendGrid, Mailgun, AWS SES, etc.
    // - API del backend que gestioni l'enviament

    const plantillaHTML = this.generarPlantillaHTML(emailNotificacio)
    
    // Simular crida a API d'email
    const emailData = {
      to: emailNotificacio.receptor.email,
      subject: emailNotificacio.contingut.titol,
      html: plantillaHTML,
      from: 'noreply@lapublica.cat',
      replyTo: 'suport@lapublica.cat'
    }

    // Simular enviament
    console.log('📧 Simulant enviament d\'email:', {
      receptor: emailNotificacio.receptor.email,
      assumpte: emailNotificacio.contingut.titol,
      link: emailNotificacio.contingut.linkDirecte
    })

    // En producció, aquí faríem:
    // await fetch('/api/enviar-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(emailData)
    // })

    return Promise.resolve()
  }

  // Generar plantilla HTML per l'email
  private generarPlantillaHTML(emailNotificacio: EmailNotificacio): string {
    const { tipus, receptor, emissor, contingut, data } = emailNotificacio
    
    // Colors i estils basats en la comunitat
    const colorsPrincipals = {
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      success: '#10b981',
      text: '#1f2937',
      textLight: '#6b7280'
    }

    const iconaPerTipus = {
      'missatge-nou': '💬',
      'mencio': '💬',
      'solicitud-connexio': '🤝',
      'invitacio-grup': '👥',
      'connexio-acceptada': '✅'
    }

    return `
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contingut.titol}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, ${colorsPrincipals.primary} 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .avatar { width: 50px; height: 50px; border-radius: 50%; margin: 0 auto 15px; display: block; }
        .title { font-size: 24px; font-weight: bold; margin: 0 0 10px 0; }
        .subtitle { font-size: 16px; opacity: 0.9; margin: 0; }
        .message-box { background-color: ${colorsPrincipals.secondary}; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .message-text { color: ${colorsPrincipals.text}; line-height: 1.6; margin: 0; }
        .cta-button { display: inline-block; background-color: ${colorsPrincipals.primary}; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .cta-button:hover { background-color: #1d4ed8; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: ${colorsPrincipals.textLight}; }
        .timestamp { color: ${colorsPrincipals.textLight}; font-size: 14px; margin-top: 15px; }
        .logo { width: 40px; height: 40px; margin: 0 auto 15px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">${iconaPerTipus[tipus]}</div>
            <h1 class="title">La Pública</h1>
            <p class="subtitle">Tens una nova notificació</p>
        </div>

        <!-- Contingut principal -->
        <div class="content">
            <h2 style="color: ${colorsPrincipals.text}; margin-bottom: 10px;">
                Hola ${receptor.nom}! 👋
            </h2>
            
            <p style="color: ${colorsPrincipals.textLight}; line-height: 1.6;">
                ${this.obtenirMissatgePerTipus(tipus, emissor.nom)}
            </p>

            ${emissor.avatar ? `<img src="${emissor.avatar}" alt="${emissor.nom}" class="avatar">` : ''}
            
            <div class="message-box">
                <p class="message-text">
                    <strong>${emissor.nom}:</strong> ${contingut.missatge}
                </p>
            </div>

            <div style="text-align: center;">
                <a href="${contingut.linkDirecte}&token=${this.generarTokenTracking(emailNotificacio.id)}" class="cta-button">
                    Veure ${tipus === 'missatge-nou' ? 'Missatge' : tipus === 'mencio' ? 'Menció' : 'Notificació'} →
                </a>
            </div>

            <p class="timestamp">
                📅 ${data.toLocaleDateString('ca-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                <strong>La Pública</strong> - Xarxa Social del Sector Públic<br>
                Aquest email s'ha enviat perquè no estaves connectat quan es va rebre la notificació.
            </p>
            <p style="margin-top: 15px;">
                <a href="${window.location.origin}/configuracio/notificacions" style="color: ${colorsPrincipals.primary};">
                    Configurar notificacions per email
                </a>
            </p>
        </div>
    </div>
</body>
</html>`
  }

  // Obtenir missatge personalitzat per tipus de notificació
  private obtenirMissatgePerTipus(tipus: string, nomEmissor: string): string {
    switch (tipus) {
      case 'missatge-nou':
        return `Has rebut un nou missatge de <strong>${nomEmissor}</strong>. Com que no estaves connectat, t'enviem aquest email per informar-te.`
      case 'mencio':
        return `<strong>${nomEmissor}</strong> t'ha mencionat en una conversa. Fes clic a continuació per veure el contingut complet.`
      case 'solicitud-connexio':
        return `<strong>${nomEmissor}</strong> vol connectar amb tu a La Pública. Revisa la seva sol·licitud i decideix si vols acceptar-la.`
      case 'invitacio-grup':
        return `<strong>${nomEmissor}</strong> t'ha convidat a unir-te a un grup. Explora les oportunitats de col·laboració.`
      case 'connexio-acceptada':
        return `<strong>${nomEmissor}</strong> ha acceptat la teva sol·licitud de connexió. Ja podeu començar a col·laborar!`
      default:
        return `Has rebut una nova notificació de <strong>${nomEmissor}</strong>.`
    }
  }

  // Comprovar si l'usuari està online (simulat)
  esUsuariOnline(usuariId: string): boolean {
    // En un entorn real, això es comprovaria amb:
    // - WebSocket status
    // - Last activity timestamp
    // - Presence API
    
    // Simulem que l'usuari està offline si no hi ha activitat recent
    const ultimaActivitat = localStorage.getItem(`user-${usuariId}-last-activity`)
    if (!ultimaActivitat) return false
    
    const tempsUltimaActivitat = new Date(ultimaActivitat)
    const ara = new Date()
    const diferencia = ara.getTime() - tempsUltimaActivitat.getTime()
    
    // Considerar offline si no hi ha activitat en els últims 10 minuts
    return diferencia < 10 * 60 * 1000 // 10 minuts en millisegons
  }

  // Actualitzar timestamp d'activitat de l'usuari
  actualitzarActivitatUsuari(usuariId: string) {
    localStorage.setItem(`user-${usuariId}-last-activity`, new Date().toISOString())
  }

  // Generar token de tracking per l'enllaç
  private generarTokenTracking(notificacioId: string): string {
    // En producció, això seria un token JWT o similar
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substr(2, 9)
    return `${notificacioId}-${timestamp}-${randomStr}`
  }

  // Obtenir configuració de notificacions per email de l'usuari
  obtenirConfiguracioEmail(usuariId: string): {
    missatges: boolean
    mencions: boolean
    solicituds: boolean
    grups: boolean
  } {
    const config = localStorage.getItem(`user-${usuariId}-email-notifications`)
    if (config) {
      return JSON.parse(config)
    }
    
    // Configuració per defecte
    return {
      missatges: true,
      mencions: true,
      solicituds: true,
      grups: true
    }
  }

  // Actualitzar configuració de notificacions per email
  actualitzarConfiguracioEmail(usuariId: string, configuracio: {
    missatges: boolean
    mencions: boolean
    solicituds: boolean
    grups: boolean
  }) {
    localStorage.setItem(`user-${usuariId}-email-notifications`, JSON.stringify(configuracio))
  }
}

// Export de la instància singleton
export const emailNotificacionsService = EmailNotificacionsService.getInstance()