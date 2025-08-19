import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Empresa - La Pública',
  description: 'Panel de control empresarial con asistente IA integrado',
};

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}