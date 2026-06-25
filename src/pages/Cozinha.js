import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, removeOrder, addOrder, subscribe } from '../data/store';
import './Cozinha.css';

const DEMO_ORDERS = [
  { mesa:5,  pessoas:3, itens:[{n:'Feijoada Completa',q:2,obs:''},{n:'Frango com Quiabo',q:1,obs:'sem quiabo'}] },
  { mesa:8,  pessoas:2, itens:[{n:'Espeto de Carne',q:4,obs:''},{n:'Caipirinha',q:2,obs:''}] },
  { mesa:12, pessoas:4, itens:[{n:'Picanha Grelhada',q:2,obs:'bem passada'},{n:'Refrigerante',q:4,obs:''}] },
  { mesa:3,  pessoas:1, itens:[{n:'Massas',q:1,obs:'Penne · Carbonara'},{n:'Suco Natural',q:1,obs:'laranja'}] },
  { mesa:7,  pessoas:5, itens:[{n:'Espeto de Frango',q:5,obs:''},{n:'Pudim de Leite',q:2,obs:''}] },
];
let demoIdx = 0;

export default function Cozinha({ onBack }) {
  const [orders, setOrders] = useState(getOrders());
  const [, tick] = useState(0);

  useEffect(() => {
    const unsub = subscribe(() => setOrders([...getOrders()]));
    const timer = setInterval(() => tick(t => t+1), 1000);
    return () => { unsub(); clearInterval(timer); };
  }, []);

  const novos  = orders.filter(o => o.status === 'novo');
  const prep   = orders.filter(o => o.status === 'prep');
  const pronto = orders.filter(o => o.status === 'pronto');

  const simular = () => {
    const d = DEMO_ORDERS[demoIdx % DEMO_ORDERS.length];
    demoIdx++;
    addOrder(d);
  };

  const Card = ({ o }) => {
    const totalItens = o.itens.reduce((s,i) => s+i.q, 0);
    return (
      <div className="kcard">
        <div className="kcard-top">
          <div className="kcard-row1">
            <div className="kcard-mesa">Mesa {o.mesa}</div>
            <div className="kcard-time"><i className="ti ti-clock" />{o.hora}</div>
          </div>
          <div className="kcard-row2">
            <span><i className="ti ti-users" />{o.pessoas} pessoa{o.pessoas>1?'s':''}</span>
            <span><i className="ti ti-clipboard-list" />{totalItens} item{totalItens>1?'s':''}</span>
          </div>
        </div>
        <div className="kcard-divider" />
        <div className="kcard-items">
          {o.itens.map((it,i) => (
            <div key={i} className="kcard-item">
              <div className="kcard-qty">{it.q}</div>
              <div>
                <div className="kcard-iname">{it.n}</div>
                {it.obs && <div className="kcard-iobs">obs: {it.obs}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="kcard-num">Pedido <span>#{String(o.ordem).padStart(3,'0')}</span></div>
        <div className="kcard-footer">
          {o.status === 'novo' && <>
            <button className="kbtn kbtn-iniciar" onClick={() => updateOrderStatus(o.id,'prep')}>Iniciar preparo</button>
            <button className="kbtn kbtn-x" onClick={() => removeOrder(o.id)}><i className="ti ti-x" /></button>
          </>}
          {o.status === 'prep' && <>
            <button className="kbtn kbtn-pronto" onClick={() => updateOrderStatus(o.id,'pronto')}>Marcar pronto</button>
            <button className="kbtn kbtn-x" onClick={() => removeOrder(o.id)}><i className="ti ti-x" /></button>
          </>}
          {o.status === 'pronto' && (
            <button className="kbtn kbtn-done" disabled>Aguardando garçom</button>
          )}
        </div>
      </div>
    );
  };

  const Col = ({ title, color, items, emptyIcon, emptyText }) => (
    <div className="kcol">
      <div className="kcol-head">
        <div className="kcol-title" style={{color}}>
          <span className="kcol-dot" style={{background:color}} />
          {title}
        </div>
        <span className="kcol-count">{items.length}</span>
      </div>
      <div className="kcol-body">
        {items.length === 0
          ? <div className="kcol-empty"><i className={`ti ${emptyIcon}`} />{emptyText}</div>
          : items.map(o => <Card key={o.id} o={o} />)
        }
      </div>
    </div>
  );

  const time = new Date().toLocaleTimeString('pt-BR');

  return (
    <div className="cozinha-root">
      <div className="k-header">
        <div className="k-logo">
          <div className="k-logo-box">C</div>
          <div>
            <div className="k-title">Cozinha — O Casarão</div>
            <div className="k-sub">Painel de pedidos em tempo real</div>
          </div>
        </div>
        <div className="k-stats">
          <div className="k-stat"><div className="k-stat-val">{novos.length}</div><div className="k-stat-lab">Novos</div></div>
          <div className="k-stat"><div className="k-stat-val">{prep.length}</div><div className="k-stat-lab">Em preparo</div></div>
          <div className="k-stat"><div className="k-stat-val">{pronto.length}</div><div className="k-stat-lab">Prontos</div></div>
        </div>
        <div className="k-right">
          <div className="k-time">{time}</div>
          <div className="k-time-lab">Horário atual</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="k-btn-sim" onClick={simular}>+ Simular pedido</button>
          <button className="back-btn" onClick={onBack} style={{color:'#6A6460'}}>
            <i className="ti ti-arrow-left" /> Voltar
          </button>
        </div>
      </div>

      <div className="k-cols">
        <Col title="Novos pedidos"      color="#E8A020" items={novos}  emptyIcon="ti-check"            emptyText="Nenhum pedido novo" />
        <Col title="Em preparo"         color="#2196F3" items={prep}   emptyIcon="ti-tools-kitchen-2"  emptyText="Nada em preparo" />
        <Col title="Pronto para servir" color="#2E9E60" items={pronto} emptyIcon="ti-bell"             emptyText="Nenhum pronto ainda" />
      </div>
    </div>
  );
}
