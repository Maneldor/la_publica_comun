// Modelos para el sistema de chat empresa-agente IA

export interface ChatSession {
  id: string;
  companyId: string;
  agentId: string;
  status: 'active' | 'waiting' | 'completed';
  context: string; // Contexto actual de la conversacion
  currentTask?: string; // Tarea que está ejecutando
  createdAt: Date;
  lastInteraction: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  metadata?: {
    taskType?: string;
    requiresApproval?: boolean;
    attachments?: string[];
    suggestedActions?: string[];
  };
  timestamp: Date;
}

export interface TaskExecution {
  id: string;
  sessionId: string;
  taskType: string;
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'failed';
  input: any;
  output?: any;
  approvalRequired: boolean;
  approvedAt?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface CompanyProfile {
  id: string;
  companyId: string;
  data: {
    basicInfo: {
      name: string;
      sector: string;
      description: string;
      services: string[];
      website?: string;
      founded?: number;
    };
    branding: {
      logo?: string;
      colors: {
        primary: string;
        secondary: string;
      };
      tone: string; // formal, friendly, professional
    };
    contact: {
      email: string;
      phone?: string;
      address?: string;
      social?: {
        linkedin?: string;
        twitter?: string;
      };
    };
  };
  status: 'draft' | 'review' | 'published';
  createdBy: 'user' | 'ai';
  versions: CompanyProfileVersion[];
  publishedAt?: Date;
}

export interface CompanyProfileVersion {
  id: string;
  version: number;
  data: any;
  changes: string[];
  createdAt: Date;
}

export interface JobOffer {
  id: string;
  companyId: string;
  agentId?: string; // Si fue creada por IA
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: {
    min?: number;
    max?: number;
    type: 'monthly' | 'yearly' | 'hourly';
  };
  location: string;
  remote: boolean;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  targetAudience: {
    communities: string[];
    categories: string[];
    experience: string[];
  };
  status: 'draft' | 'review' | 'published' | 'expired';
  analytics: {
    views: number;
    applications: number;
    bookmarks: number;
    ctr: number;
  };
  createdAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
}

export interface CompetitiveAnalysis {
  id: string;
  companyId: string;
  targetSector: string;
  competitors: CompetitorData[];
  insights: {
    marketPosition: string;
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  };
  lastUpdated: Date;
  nextUpdate: Date;
}

export interface CompetitorData {
  name: string;
  website: string;
  sector: string;
  services: string[];
  strengths: string[];
  weaknesses: string[];
  pricing?: any;
  marketShare?: number;
  lastAnalyzed: Date;
}

export interface LeadEngagement {
  id: string;
  companyId: string;
  employeeId: string;
  agentId: string;
  interactions: LeadInteraction[];
  score: number;
  status: 'cold' | 'warm' | 'hot' | 'converted';
  lastContact: Date;
  nextAction: {
    type: string;
    scheduledFor: Date;
    description: string;
  };
}

export interface LeadInteraction {
  id: string;
  type: 'message' | 'email' | 'call' | 'meeting';
  content: string;
  response?: string;
  engagement: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
}

export interface AutomatedReport {
  id: string;
  companyId: string;
  type: 'weekly' | 'monthly' | 'competitive' | 'performance';
  data: {
    metrics: Record<string, number>;
    insights: string[];
    recommendations: string[];
    charts?: any[];
  };
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
}