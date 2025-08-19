/**
 * Interfaz para representar un preview de enlace
 */
export interface LinkPreview {
  /** URL original */
  url: string;
  /** Título de la página */
  title?: string;
  /** Descripción de la página */
  description?: string;
  /** URL de la imagen de preview */
  image?: string;
  /** Nombre del sitio web */
  siteName?: string;
  /** Dominio de la URL */
  domain: string;
}

/**
 * Respuesta del endpoint de link preview
 */
export interface LinkPreviewResponse {
  success: boolean;
  data: LinkPreview;
}

/**
 * Respuesta del endpoint de múltiples link previews
 */
export interface MultipleLinkPreviewsResponse {
  success: boolean;
  data: LinkPreview[];
}

/**
 * Respuesta del endpoint de detección de URLs
 */
export interface DetectUrlsResponse {
  success: boolean;
  data: {
    urls: string[];
    count: number;
  };
}

/**
 * Request para múltiples link previews
 */
export interface MultipleLinkPreviewsRequest {
  urls: string[];
}

/**
 * Request para detección de URLs
 */
export interface DetectUrlsRequest {
  text: string;
}

/**
 * Request para obtener un link preview
 */
export interface LinkPreviewRequest {
  url: string;
}

/**
 * Configuración del servicio de link preview
 */
export interface LinkPreviewServiceConfig {
  /** Timeout en milisegundos para requests HTTP */
  timeout: number;
  /** Tamaño máximo de contenido en bytes */
  maxContentLength: number;
  /** User agent para requests */
  userAgent: string;
  /** Máximo número de URLs a procesar por mensaje */
  maxUrlsPerMessage: number;
  /** Máximo número de URLs por request API */
  maxUrlsPerRequest: number;
}

/**
 * Metadatos extraídos de una página web
 */
export interface ExtractedMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
}

/**
 * Errores específicos del sistema de link preview
 */
export enum LinkPreviewError {
  INVALID_URL = 'INVALID_URL',
  URL_NOT_ACCESSIBLE = 'URL_NOT_ACCESSIBLE',
  CONTENT_TOO_LARGE = 'CONTENT_TOO_LARGE',
  TIMEOUT = 'TIMEOUT',
  BLOCKED_DOMAIN = 'BLOCKED_DOMAIN',
  INVALID_CONTENT_TYPE = 'INVALID_CONTENT_TYPE',
  PARSING_ERROR = 'PARSING_ERROR'
}

/**
 * Resultado del procesamiento de una URL
 */
export interface UrlProcessingResult {
  url: string;
  success: boolean;
  preview?: LinkPreview;
  error?: LinkPreviewError;
  errorMessage?: string;
}

export default {
  LinkPreview,
  LinkPreviewResponse,
  MultipleLinkPreviewsResponse,
  DetectUrlsResponse,
  MultipleLinkPreviewsRequest,
  DetectUrlsRequest,
  LinkPreviewRequest,
  LinkPreviewServiceConfig,
  ExtractedMetadata,
  LinkPreviewError,
  UrlProcessingResult
};