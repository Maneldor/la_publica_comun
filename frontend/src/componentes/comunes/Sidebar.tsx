// src/componentes/comunes/Sidebar.tsx
'use client';

import { Briefcase, FileText, Home, MessageSquare, User, Users } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useComunidad } from '../../../hooks/useComunidad';
import './Sidebar.css';

// El componente NavLink ahora es más inteligente
const NavLink = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const { configuracion } = useComunidad();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  const handleClick = () => {
    console.log(`🔗 Clicking on: ${label} -> ${href}`);
    console.log('🔍 Router:', router);
    try {
      router.push(href);
      console.log('✅ Navigation successful');
    } catch (error) {
      console.error('❌ Navigation error:', error);
      // Fallback a navegación manual
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
      style={{
        ...(isActive ? { backgroundColor: configuracion.tema.colorPrimario, color: 'white' } : {}),
        border: 'none',
        background: isActive ? undefined : 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left'
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Sidebar = () => {
  const { configuracion } = useComunidad();

  console.log('🔧 Sidebar - Configuración:', configuracion);

  if (!configuracion) {
    console.log('⚠️ Sidebar - No hay configuración, no se renderiza');
    return null;
  }

  // Definimos la estructura de la navegación en un array para que sea más fácil de mantener
  const navSections = [
    {
      title: 'Navegación Principal',
      links: [
        { href: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
        { href: '/perfil', label: 'Mi Perfil', icon: <User size={20} /> },
        { href: '/grupos-avanzados', label: 'Grupos', icon: <Users size={20} /> },
        { href: '/mensajes', label: 'Mensajes', icon: <MessageSquare size={20} /> },
        { href: '/foros', label: 'Foros', icon: <FileText size={20} /> },
      ],
    },
    {
      title: 'Empresas y Negocios',
      links: [
        { href: '/empresas', label: 'Empresas y Colabora...', icon: <Briefcase size={20} /> },
        { href: '/ofertas', label: 'Ofertas', icon: <Users size={20} /> },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div
          className="sidebar__logo"
          style={{ backgroundColor: configuracion.tema.colorPrimario }}
        >
          <span>LP</span>
        </div>
        <div>
          <h1 className="sidebar__title">La Pública</h1>
          <p className="sidebar__subtitle">{configuracion.nombre}</p>
        </div>
      </div>
      <nav className="sidebar__nav">
        {navSections.map((section) => (
          <div key={section.title} className="mt-6 first:mt-0">
            <h2 className="sidebar__nav-title">{section.title}</h2>
            {section.links.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar__footer">{/* ... tu perfil de admin ... */}</div>
    </aside>
  );
};

export default Sidebar;
