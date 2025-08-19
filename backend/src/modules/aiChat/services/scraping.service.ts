import axios from 'axios';
import cheerio from 'cheerio';
import { ApiError } from '../../../utils/ApiError';
import logger from '../../../utils/logger';
import prisma from '../../../config/database';

export class ScrapingService {
  private rateLimiter: Map<string, number> = new Map();
  private maxRequestsPerMinute = {
    BASICO: 10,     // Fase 1: No scraping
    AVANZADO: 83,   // Fase 2: 5,000/día = ~83/minuto
    EXPERTO: 833    // Fase 3: 50,000/día = ~833/minuto
  };

  constructor() {
    // Limpiar rate limiter cada minuto
    setInterval(() => {
      this.rateLimiter.clear();
    }, 60000);
  }

  // === FASE 2: SCRAPING 5,000 EMPRESAS/DÍA ===
  async scrapeCompetitorBasicData(domain: string, agentLevel: 'BASICO' | 'AVANZADO' | 'EXPERTO') {
    if (!this.checkRateLimit(domain, agentLevel)) {
      throw ApiError.tooManyRequests('Rate limit exceeded for scraping');
    }

    try {
      const response = await axios.get(`https://${domain}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LaPública Bot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const $ = cheerio.load(response.data);
      
      const basicData = {
        domain,
        title: $('title').text().trim(),
        description: $('meta[name="description"]').attr('content') || '',
        keywords: $('meta[name="keywords"]').attr('content') || '',
        services: this.extractServices($),
        contact: this.extractContactInfo($),
        pricing: this.extractPricingInfo($),
        lastScraped: new Date()
      };

      // Guardar en base de datos para análisis
      await this.saveScrapedData(basicData);

      return basicData;
    } catch (error) {
      logger.error(`Scraping error for ${domain}:`, error);
      return null;
    }
  }

  // === ANÁLISIS COMPETITIVO AUTOMATIZADO ===
  async performCompetitiveAnalysis(sector: string, specificCompetitors: string[] = [], depth: string = 'standard') {
    const competitors = specificCompetitors.length > 0 
      ? specificCompetitors 
      : await this.findCompetitorsBySector(sector);

    const analysisResults = [];
    
    for (const competitor of competitors.slice(0, 10)) { // Limitar a 10 competidores
      const competitorData = await this.scrapeCompetitorBasicData(competitor, 'AVANZADO');
      if (competitorData) {
        const analysis = await this.analyzeCompetitor(competitorData, sector);
        analysisResults.push(analysis);
      }
      
      // Delay entre requests para evitar bloqueos
      await this.delay(1000);
    }

    return {
      id: this.generateAnalysisId(),
      sector,
      competitorsAnalyzed: analysisResults.length,
      competitors: analysisResults,
      insights: await this.generateCompetitiveInsights(analysisResults, sector),
      timestamp: new Date()
    };
  }

  // === SCRAPING MASIVO FASE 3: 50,000 EMPRESAS/DÍA ===
  async massiveScraping(targets: string[], agentLevel: 'EXPERTO') {
    const results = [];
    const batchSize = 100; // Procesar en lotes de 100
    
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize);
      const batchPromises = batch.map(target => 
        this.scrapeCompetitorBasicData(target, agentLevel)
          .catch(error => {
            logger.error(`Batch scraping error for ${target}:`, error);
            return null;
          })
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => (result as PromiseFulfilledResult<any>).value)
      );
      
      // Delay entre lotes
      await this.delay(500);
    }

    return results;
  }

  // === ANÁLISIS DE OFERTAS COMPETIDORAS ===
  async analyzeCompetitorOffers(sector: string) {
    const competitors = await this.findCompetitorsBySector(sector);
    const offers = [];

    for (const competitor of competitors.slice(0, 5)) {
      const competitorOffers = await this.scrapeJobOffers(competitor);
      offers.push(...competitorOffers);
    }

    const analysis = {
      totalOffers: offers.length,
      averageSalary: this.calculateAverageSalary(offers),
      commonBenefits: this.extractCommonBenefits(offers),
      skillsDemand: this.analyzeSkillsDemand(offers),
      suggestion: this.generateOfferSuggestion(offers, sector),
      competitorsAnalyzed: competitors.length
    };

    return analysis;
  }

  // === MONITOREO DE PRECIOS COMPETIDORES ===
  async monitorCompetitorPricing(sector: string) {
    const competitors = await this.getTrackedCompetitors(sector);
    const pricingData = [];

    for (const competitor of competitors) {
      const pricing = await this.scrapePricingData(competitor.domain);
      if (pricing) {
        pricingData.push({
          competitor: competitor.name,
          ...pricing,
          lastUpdated: new Date()
        });
      }
    }

    return {
      sector,
      pricingAnalysis: pricingData,
      marketAverage: this.calculateMarketAverage(pricingData),
      recommendations: this.generatePricingRecommendations(pricingData)
    };
  }

  // === DETECCIÓN DE TENDENCIAS DE MERCADO ===
  async detectMarketTrends(sector: string, timeframe: string = '30d') {
    const historicalData = await this.getHistoricalMarketData(sector, timeframe);
    const currentData = await this.getCurrentMarketSnapshot(sector);

    return {
      sector,
      timeframe,
      trends: {
        demandTrends: this.analyzeDemandTrends(historicalData, currentData),
        pricingTrends: this.analyzePricingTrends(historicalData, currentData),
        serviceTrends: this.analyzeServiceTrends(historicalData, currentData),
        geographicTrends: this.analyzeGeographicTrends(historicalData, currentData)
      },
      predictions: this.generateMarketPredictions(historicalData, currentData),
      opportunities: this.identifyMarketOpportunities(historicalData, currentData)
    };
  }

  // === HELPERS PRIVADOS ===
  private checkRateLimit(domain: string, agentLevel: keyof typeof this.maxRequestsPerMinute): boolean {
    const key = `${domain}-${Date.now().toString().slice(0, -4)}`; // Por minuto
    const current = this.rateLimiter.get(key) || 0;
    const limit = this.maxRequestsPerMinute[agentLevel];
    
    if (current >= limit) {
      return false;
    }
    
    this.rateLimiter.set(key, current + 1);
    return true;
  }

  private extractServices($: cheerio.CheerioAPI): string[] {
    const services: string[] = [];
    
    // Buscar en diferentes estructuras comunes
    $('nav a, .services li, .menu a, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 3 && text.length < 50) {
        services.push(text);
      }
    });

    return [...new Set(services)].slice(0, 10); // Máximo 10 servicios únicos
  }

  private extractContactInfo($: cheerio.CheerioAPI) {
    return {
      email: this.extractEmail($),
      phone: this.extractPhone($),
      address: this.extractAddress($)
    };
  }

  private extractEmail($: cheerio.CheerioAPI): string | null {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const pageText = $.html();
    const match = pageText.match(emailRegex);
    return match ? match[0] : null;
  }

  private extractPhone($: cheerio.CheerioAPI): string | null {
    const phoneRegex = /(\+34|0034)?[6-9]\d{8}/;
    const pageText = $.text();
    const match = pageText.match(phoneRegex);
    return match ? match[0] : null;
  }

  private extractAddress($: cheerio.CheerioAPI): string | null {
    // Buscar patrones de direcciones españolas
    const addressSelectors = ['.address', '.location', '[class*="direccion"]', '[class*="address"]'];
    
    for (const selector of addressSelectors) {
      const address = $(selector).first().text().trim();
      if (address.length > 10) {
        return address;
      }
    }
    
    return null;
  }

  private extractPricingInfo($: cheerio.CheerioAPI) {
    const pricing: any = {};
    
    // Buscar precios en diferentes formatos
    const priceRegex = /(\d+(?:\.\d{3})*(?:,\d{2})?)\s*€/g;
    const pageText = $.text();
    const prices = pageText.match(priceRegex);
    
    if (prices) {
      pricing.detectedPrices = prices.slice(0, 5); // Máximo 5 precios
      pricing.priceRange = {
        min: Math.min(...prices.map(p => parseFloat(p.replace(/[€.,]/g, '')))),
        max: Math.max(...prices.map(p => parseFloat(p.replace(/[€.,]/g, ''))))
      };
    }
    
    return pricing;
  }

  private async saveScrapedData(data: any) {
    try {
      await prisma.scrapedCompetitor.upsert({
        where: { domain: data.domain },
        update: {
          ...data,
          scrapedAt: new Date()
        },
        create: {
          ...data,
          scrapedAt: new Date()
        }
      });
    } catch (error) {
      logger.error('Error saving scraped data:', error);
    }
  }

  private async findCompetitorsBySector(sector: string): Promise<string[]> {
    // En producción, esto vendría de una base de datos de competidores
    // Por ahora, retornamos datos mock
    const sectorCompetitors = {
      'tecnologia': ['iberdrola.es', 'endesa.com', 'naturgy.com'],
      'consultoria': ['deloitte.es', 'pwc.es', 'kpmg.es'],
      'construccion': ['acs.es', 'ferrovial.com', 'acciona.es'],
      'telecomunicaciones': ['telefonica.es', 'vodafone.es', 'orange.es']
    };
    
    return sectorCompetitors[sector as keyof typeof sectorCompetitors] || [];
  }

  private async analyzeCompetitor(competitorData: any, sector: string) {
    return {
      name: competitorData.title,
      domain: competitorData.domain,
      sector,
      services: competitorData.services,
      strengths: this.identifyStrengths(competitorData),
      weaknesses: this.identifyWeaknesses(competitorData),
      marketPosition: this.assessMarketPosition(competitorData),
      lastAnalyzed: new Date()
    };
  }

  private identifyStrengths(data: any): string[] {
    const strengths = [];
    
    if (data.services.length > 5) strengths.push('Amplia gama de servicios');
    if (data.contact.email && data.contact.phone) strengths.push('Información de contacto completa');
    if (data.description.length > 100) strengths.push('Descripción detallada de servicios');
    
    return strengths;
  }

  private identifyWeaknesses(data: any): string[] {
    const weaknesses = [];
    
    if (data.services.length < 3) weaknesses.push('Servicios limitados');
    if (!data.contact.email) weaknesses.push('Falta información de contacto');
    if (data.description.length < 50) weaknesses.push('Descripción insuficiente');
    
    return weaknesses;
  }

  private assessMarketPosition(data: any): string {
    const score = data.services.length + 
                  (data.contact.email ? 1 : 0) + 
                  (data.contact.phone ? 1 : 0) + 
                  (data.description.length > 100 ? 2 : 0);
    
    if (score >= 8) return 'Líder';
    if (score >= 5) return 'Competidor fuerte';
    if (score >= 3) return 'Competidor medio';
    return 'Competidor débil';
  }

  private async generateCompetitiveInsights(competitors: any[], sector: string) {
    return {
      marketPosition: 'Análisis basado en datos scrapeados',
      opportunities: [
        'Mejorar presencia online',
        'Expandir servicios digitales',
        'Optimizar información de contacto'
      ],
      threats: [
        'Competencia con mayor diversificación',
        'Empresas con mejor presencia web'
      ],
      recommendations: [
        'Invertir en SEO y contenido web',
        'Ampliar cartera de servicios',
        'Mejorar experiencia usuario'
      ]
    };
  }

  private generateAnalysisId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async scrapeJobOffers(domain: string) {
    // Implementar scraping específico de ofertas laborales
    return [];
  }

  private calculateAverageSalary(offers: any[]): number {
    return 0; // Implementar cálculo
  }

  private extractCommonBenefits(offers: any[]): string[] {
    return []; // Implementar extracción de beneficios
  }

  private analyzeSkillsDemand(offers: any[]): any {
    return {}; // Implementar análisis de skills
  }

  private generateOfferSuggestion(offers: any[], sector: string): string {
    return `Basándose en el análisis de ${offers.length} ofertas del sector ${sector}...`;
  }

  private async getTrackedCompetitors(sector: string) {
    return []; // Implementar obtención de competidores trackeados
  }

  private async scrapePricingData(domain: string) {
    return null; // Implementar scraping de precios
  }

  private calculateMarketAverage(pricingData: any[]): number {
    return 0; // Implementar cálculo de promedio
  }

  private generatePricingRecommendations(pricingData: any[]): string[] {
    return []; // Implementar recomendaciones de pricing
  }

  private async getHistoricalMarketData(sector: string, timeframe: string) {
    return {}; // Implementar obtención de datos históricos
  }

  private async getCurrentMarketSnapshot(sector: string) {
    return {}; // Implementar snapshot actual
  }

  private analyzeDemandTrends(historical: any, current: any) {
    return {}; // Implementar análisis de tendencias de demanda
  }

  private analyzePricingTrends(historical: any, current: any) {
    return {}; // Implementar análisis de tendencias de precios
  }

  private analyzeServiceTrends(historical: any, current: any) {
    return {}; // Implementar análisis de tendencias de servicios
  }

  private analyzeGeographicTrends(historical: any, current: any) {
    return {}; // Implementar análisis de tendencias geográficas
  }

  private generateMarketPredictions(historical: any, current: any) {
    return {}; // Implementar predicciones de mercado
  }

  private identifyMarketOpportunities(historical: any, current: any) {
    return []; // Implementar identificación de oportunidades
  }
}