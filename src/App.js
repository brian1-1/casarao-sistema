import React, { useState } from 'react';
import './App.css';
import TabletCliente from './pages/TabletCliente';
import Cozinha from './pages/Cozinha';
import PainelGarcom from './pages/PainelGarcom';
import PainelGerente from './pages/PainelGerente';

const MODULES = [
  { id: 'cliente',  label: 'Tablet do Cliente', icon: 'ti-device-tablet', desc: 'Mesa 12 — Cardápio interativo' },
  { id: 'cozinha',  label: 'Tela da Cozinha',   icon: 'ti-tools-kitchen-2', desc: 'Pedidos em tempo real' },
  { id: 'garcom',   label: 'Painel do Garçom',  icon: 'ti-bell', desc: 'Pedidos prontos para entregar' },
  { id: 'gerente',  label: 'Painel do Gerente', icon: 'ti-chart-bar', desc: 'Dashboard, estoque e finanças' },
];

export default function App() {
  const [active, setActive] = useState(null);

  if (active === 'cliente')  return <TabletCliente onBack={() => setActive(null)} />;
  if (active === 'cozinha')  return <Cozinha       onBack={() => setActive(null)} />;
  if (active === 'garcom')   return <PainelGarcom  onBack={() => setActive(null)} />;
  if (active === 'gerente')  return <PainelGerente onBack={() => setActive(null)} />;

  return (
    <div className="home">
      <div className="home-header">
        <div className="home-logo">
          <div className="home-logo-box">C</div>
          <div>
            <div className="home-title">O Casarão</div>
            <div className="home-sub">Cozinha Brasileira &amp; Espetaria — Sistema de Gestão</div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        {MODULES.map(m => (
          <button key={m.id} className="module-card" onClick={() => setActive(m.id)}>
            <div className="module-icon"><i className={`ti ${m.icon}`} /></div>
            <div className="module-label">{m.label}</div>
            <div className="module-desc">{m.desc}</div>
            <div className="module-arrow"><i className="ti ti-arrow-right" /></div>
          </button>
        ))}
      </div>

      <div className="home-footer">
        Sistema integrado · Todos os módulos compartilham pedidos em tempo real
      </div>
    </div>
  );
}
