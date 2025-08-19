// src/app/dashboard/page.tsx
'use client';

import { RedSocial } from '../../componentes/comunes/especificos-comunidad/RedSocial';
import { Usuario } from '../../../tipos/redSocial';

const DashboardPage = () => {
  // En una aplicación real, el usuario vendría de un hook de autenticación
  const usuarioEjemplo: Usuario = {
    id: 'user-01',
    nombre: 'Manel',
    apellidos: 'Dor',
    email: 'manel@email.com',
    tipo: 'miembro',
    comunidadId: 'catalunya',
    verificado: true,
    activo: true,
    fechaRegistro: new Date('2023-01-15'),
    perfil: {
      biografia: 'Usuario de La Pública',
      ubicacion: 'Barcelona',
      cargo: 'Empleado Público',
      configuracionPrivacidad: {
        perfilPublico: true,
        mostrarEmail: false,
        mostrarUbicacion: true,
        mostrarOrganizacion: true,
        permitirMensajes: true,
        permitirInvitacionesGrupos: true
      },
      porcentajeCompletado: 100
    },
    configuracion: {
      idioma: 'ca',
      tema: 'claro',
      notificaciones: {
        email: {
          mensajes: true,
          grupoNuevoPost: true,
          invitacionGrupo: true,
          tablonAnuncios: true,
          eventos: true
        },
        push: {
          mensajes: true,
          grupoNuevoPost: true,
          invitacionGrupo: true,
          menciones: true
        }
      }
    },
    estadisticas: {
      gruposCreados: 0,
      gruposUnido: 0,
      postsCreados: 0,
      comentarios: 0,
      conexiones: 0,
      puntuacionReputacion: 0
    }
  };

  return <RedSocial />;
};

export default DashboardPage;
