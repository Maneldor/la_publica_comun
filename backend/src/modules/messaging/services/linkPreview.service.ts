import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  domain: string;
}

class LinkPreviewService {
  private readonly timeout = 10000; // 10 seconds
  private readonly maxContentLength = 2 * 1024 * 1024; // 2MB
  private readonly userAgent = 'Mozilla/5.0 (compatible; La Publica Bot/1.0)';

  /**
   * Detecta URLs en un texto
   */
  public detectUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)/gi;
    const matches = text.match(urlRegex);
    return matches || [];
  }

  /**
   * Extrae metadatos de una URL
   */
  public async extractMetadata(url: string): Promise<LinkPreview | null> {
    try {
      // Validar y normalizar URL
      const normalizedUrl = this.normalizeUrl(url);
      if (!normalizedUrl) {
        return null;
      }

      // Obtener contenido de la página
      const response = await axios.get(normalizedUrl, {
        timeout: this.timeout,
        maxContentLength: this.maxContentLength,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en;q=0.6',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        validateStatus: (status) => status >= 200 && status < 400
      });

      // Verificar que el contenido sea HTML
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return this.createBasicPreview(normalizedUrl);
      }

      // Parse HTML
      const $ = cheerio.load(response.data);
      
      // Extraer metadatos
      const preview: LinkPreview = {
        url: normalizedUrl,
        domain: new URL(normalizedUrl).hostname,
        title: this.extractTitle($),
        description: this.extractDescription($),
        image: this.extractImage($, normalizedUrl),
        siteName: this.extractSiteName($)
      };

      return preview;

    } catch (error) {
      console.error('Error extrayendo metadatos de URL:', url, error);
      
      // Retornar preview básico en caso de error
      const normalizedUrl = this.normalizeUrl(url);
      return normalizedUrl ? this.createBasicPreview(normalizedUrl) : null;
    }
  }

  /**
   * Normaliza y valida una URL
   */
  private normalizeUrl(url: string): string | null {
    try {
      // Agregar protocolo si no existe
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      
      // Validar que sea HTTP o HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }

      // Validar que no sea localhost o IP privada (seguridad)
      const hostname = urlObj.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.16.') ||
        hostname.includes(':')
      ) {
        return null;
      }

      return urlObj.toString();
    } catch {
      return null;
    }
  }

  /**
   * Extrae el título de la página
   */
  private extractTitle($: cheerio.Root): string | undefined {
    // Prioridad: Open Graph > Twitter Card > title tag
    let title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      $('h1').first().text();

    if (title) {
      title = title.trim().substring(0, 200); // Limitar longitud
      return title || undefined;
    }

    return undefined;
  }

  /**
   * Extrae la descripción de la página
   */
  private extractDescription($: cheerio.Root): string | undefined {
    // Prioridad: Open Graph > Twitter Card > meta description
    let description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="Description"]').attr('content');

    if (description) {
      description = description.trim().substring(0, 300); // Limitar longitud
      return description || undefined;
    }

    return undefined;
  }

  /**
   * Extrae la imagen de la página
   */
  private extractImage($: cheerio.Root, baseUrl: string): string | undefined {
    // Prioridad: Open Graph > Twitter Card > meta image
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('link[rel="image_src"]').attr('href');

    if (imageUrl) {
      try {
        // Convertir URL relativa a absoluta
        const absoluteUrl = new URL(imageUrl, baseUrl).toString();
        return absoluteUrl;
      } catch {
        return undefined;
      }
    }

    return undefined;
  }

  /**
   * Extrae el nombre del sitio
   */
  private extractSiteName($: cheerio.Root): string | undefined {
    let siteName = 
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('meta[name="apple-mobile-web-app-title"]').attr('content');

    if (siteName) {
      siteName = siteName.trim().substring(0, 100);
      return siteName || undefined;
    }

    return undefined;
  }

  /**
   * Crea un preview básico cuando no se pueden extraer metadatos
   */
  private createBasicPreview(url: string): LinkPreview {
    const urlObj = new URL(url);
    return {
      url,
      domain: urlObj.hostname,
      title: urlObj.hostname,
      siteName: urlObj.hostname
    };
  }

  /**
   * Procesa múltiples URLs y retorna sus previews
   */
  public async processUrls(urls: string[]): Promise<LinkPreview[]> {
    const previews: LinkPreview[] = [];
    
    // Limitar a 3 URLs por mensaje para evitar sobrecarga
    const limitedUrls = urls.slice(0, 3);
    
    // Procesar URLs en paralelo con Promise.allSettled para manejar errores individuales
    const results = await Promise.allSettled(
      limitedUrls.map(url => this.extractMetadata(url))
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        previews.push(result.value);
      } else {
        console.warn(`Failed to process URL ${limitedUrls[index]}:`, 
          result.status === 'rejected' ? result.reason : 'No metadata extracted');
      }
    });

    return previews;
  }
}

export default new LinkPreviewService();