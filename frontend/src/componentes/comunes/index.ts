// Exportaciones centralizadas de componentes comunes
export { 
  Header,
  default as HeaderDefault 
} from './Header';

export { 
  Footer,
  default as FooterDefault 
} from './Footer';

export { 
  default as Layout,
  default as LayoutDefault 
} from './Layout';

// Re-exportar tipos si es necesario
export type { PropiedadesHeader } from './Header';
export type { PropiedadesFooter } from './Footer';