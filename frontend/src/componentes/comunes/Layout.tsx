'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Usuario } from '../../../tipos/redSocial';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  usuario: Usuario;
}

export default function Layout({ children, usuario }: LayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <Header usuario={usuario} />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
