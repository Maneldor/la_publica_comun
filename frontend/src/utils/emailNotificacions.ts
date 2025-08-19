'use client'

// Interfície per configuració d'emails
interface ConfiguracioEmail {
  smtpServer?: string
  port?: number
  usuari?: string
  contrasenya?: string
  remitent?: string
}

// Interfície per dades del missatge d'email
interface DadesEmailMissatge {
  destinatariEmail: string
  destinatariNom: string
  remitentNom: string
  remitentNick: string
  contingutMissatge: string
  urlConversa: string
}

export class EmailNotificacions {
  private static instance: EmailNotificacions
  private configuracio: ConfiguracioEmail = {}
  private enabled: boolean = true

  private constructor() {
    // Configuració per defecte (en un sistema real vindria de variables d'entorn)
    this.configuracio = {
      remitent: 'noreply@lapublica.es'
    }
  }

  static getInstance(): EmailNotificacions {
    if (!EmailNotificacions.instance) {
      EmailNotificacions.instance = new EmailNotificacions()
    }
    return EmailNotificacions.instance
  }

  // Configurar credencials d'email (en producció vindria del servidor)
  configurar(config: ConfiguracioEmail) {
    this.configuracio = { ...this.configuracio, ...config }
  }

  // Activar/desactivar emails
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('email-notifications-enabled', enabled.toString())
    }
  }

  isEnabled(): boolean {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('email-notifications-enabled')
      if (stored !== null) {
        this.enabled = stored === 'true'
      }
    }
    return this.enabled
  }

  // Generar HTML per email de missatge nou
  private generarHtmlEmailMissatge(dades: DadesEmailMissatge): string {
    return `
      <!DOCTYPE html>
      <html lang="ca">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nou missatge a La Pública</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 30px 20px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .message-preview {
            background: #f1f5f9;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
            font-style: italic;
          }
          .button {
            display: inline-block;
            background: #3b82f6;
            color: white !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💬 Nou missatge a La Pública</h1>
          <p>Has rebut un missatge nou</p>
        </div>
        
        <div class="content">
          <p>Hola <strong>${dades.destinatariNom}</strong>,</p>
          
          <p>Has rebut un missatge nou de <strong>${dades.remitentNom}</strong> (${dades.remitentNick}) a La Pública:</p>
          
          <div class="message-preview">
            "${dades.contingutMissatge}"
          </div>
          
          <p>Pots respondre directament accedint a la teva conversa:</p>
          
          <p style="text-align: center;">
            <a href="${dades.urlConversa}" class="button">
              📨 Veure Conversa
            </a>
          </p>
          
          <p>Si no pots clicar el botó, copia i enganxa aquesta URL al teu navegador:</p>
          <p style="word-break: break-all; color: #64748b; font-size: 14px;">
            ${dades.urlConversa}
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="https://lapublica.es">Web</a> |
            <a href="https://lapublica.es/ajuda">Ajuda</a> |
            <a href="https://lapublica.es/configuracio/notificacions">Configuració</a>
          </div>
          
          <p>
            Aquest email s'ha enviat automàticament des de La Pública.<br>
            Si no vols rebre aquestes notificacions, pots desactivar-les a la teva configuració.
          </p>
          
          <p>
            <strong>La Pública</strong> - Xarxa social per al sector públic<br>
            © 2024 La Pública. Tots els drets reservats.
          </p>
        </div>
      </body>
      </html>
    `
  }

  // Simular enviament d'email (en un sistema real faria una crida a l'API)
  async enviarEmailMissatgeNou(dades: DadesEmailMissatge): Promise<boolean> {
    if (!this.enabled) {
      console.log('📧 Emails desactivats - no s\'envia email')
      return false
    }

    console.log('📧 Preparant email per:', dades.destinatariEmail)

    try {
      const htmlContent = this.generarHtmlEmailMissatge(dades)

      // En un sistema real, aquí faries una crida a la teva API/servei d'email
      // Ara simulem l'enviament
      await this.simularEnviamentEmail(dades, htmlContent)

      console.log('📧 Email enviat correctament a:', dades.destinatariEmail)
      return true

    } catch (error) {
      console.error('📧 Error enviant email:', error)
      return false
    }
  }

  // Simulació d'enviament (en producció seria una crida real)
  private async simularEnviamentEmail(dades: DadesEmailMissatge, htmlContent: string): Promise<void> {
    console.log('📧 SIMULACIÓ D\'EMAIL:')
    console.log('📧 De:', this.configuracio.remitent)
    console.log('📧 Per a:', dades.destinatariEmail)
    console.log('📧 Assumpte: Nou missatge de', dades.remitentNom, 'a La Pública')
    console.log('📧 Contingut HTML generat ✅')
    
    // Simular retard de xarxa
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // En un sistema real, aquí faries:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: dades.destinatariEmail,
        subject: `Nou missatge de ${dades.remitentNom} a La Pública`,
        html: htmlContent,
        from: this.configuracio.remitent
      })
    })

    if (!response.ok) {
      throw new Error('Error enviant email')
    }
    */

    console.log('📧 Email "enviat" (simulat) correctament!')
  }

  // Obtenir dades d'usuari per email (simulat - en producció vindria de la BD)
  async obtenirDadesUsuariPerEmail(usuariId: string): Promise<{email: string, nom: string} | null> {
    // Simulació de dades d'usuaris
    const usuaris: Record<string, {email: string, nom: string}> = {
      'user-1': { email: 'tu@lapublica.es', nom: 'Tu Perfil' },
      'user-2': { email: 'maria.santos@lapublica.es', nom: 'Maria Santos' },
      'user-3': { email: 'jordi.martin@lapublica.es', nom: 'Jordi Martin' },
      'user-4': { email: 'anna.lopez@lapublica.es', nom: 'Anna López' }
    }

    await new Promise(resolve => setTimeout(resolve, 100)) // Simular consulta BD
    return usuaris[usuariId] || null
  }
}

// Export d'una instància per facilitar l'ús
export const emailNotificacions = EmailNotificacions.getInstance()