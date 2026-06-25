import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, subscribe, addOrder } from '../data/store';
import './PainelGarcom.css';

const DEMO = [
  { mesa:5,  pessoas:3, itens:[{n:'Feijoada Completa',q:2},{n:'Frango com Quiabo',q:1}] },
  { mesa:12, pessoas:4, itens:[{n:'Picanha Grelhada',q:2},{n:'Mandioca Frita',q:1},{n:'Refrigerante',q:4}] },
  { mesa:8,  pessoas:2, itens:[{n:'Espeto de Carne',q:4},{n:'Caipirinha',q:2}] },
  { mesa:3,  pessoas:1, itens:[{n:'Massas',q:1},{n:'Suco Natural',q:1}] },
];
let demoIdx = 0;

export default function PainelGarcom({ onBack }) {
  const [orders, setOrders] = useState(getOrders());
  const [entregues, setEntregues] = useState([]);
  const [, tick] = useState(0);

  useEffect(() => {
    const unsub = subscribe(() => setOrders([...getOrders()]));
    const timer = setInterval(() => tick(t => t+1), 1000);
    return () => { unsub(); clearInterval(timer); };
  }, []);

  const prontos   = orders.filter(o => o.status === 'pronto');
  const proximo   = prontos[0] || null;
  const totalEntr = entregues.length;
  const time      = new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit', second:'2-digit'});

  const marcarEntregue = (id) => {
    const o = orders.find(x => x.id === id);
    if (o) setEntregues(e => [...e, o]);
    updateOrderStatus(id, 'entregue');
  };

  const adiar = () => {
    // move proximo para o fim da fila de prontos
    if (prontos.length <= 1) return;
    updateOrderStatus(prontos[0].id, '_temp_');
    setTimeout(() => updateOrderStatus(prontos[0].id, 'pronto'), 10);
  };

  const simular = () => {
    const d = DEMO[demoIdx % DEMO.length];
    demoIdx++;
    addOrder({ ...d, _forceStatus: 'pronto' });
  };

  const resumo = (itens) => itens.map(i => `${i.q}x ${i.n}`).join(', ');

  return (
    <div className="pg-root">
      <div className="pg-header">
        <div className="pg-logo">
          <div className="pg-logo-box">C</div>
          <div>
            <div className="pg-title">Painel do Garçom</div>
            <div className="pg-sub">O Casarão · Pedidos prontos</div>
          </div>
        </div>
        <div className="pg-stats">
          <div className="pg-stat"><div className="pg-stat-val">{prontos.length}</div><div className="pg-stat-lab">Para entregar</div></div>
          <div className="pg-stat"><div className="pg-stat-val">{totalEntr}</div><div className="pg-stat-lab">Entregues hoje</div></div>
        </div>
        <div>
          <div className="pg-time">{time}</div>
          <div className="pg-time-lab">Horário</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="pg-btn-sim" onClick={simular}>+ Pedido pronto</button>
          <button className="back-btn" onClick={onBack} style={{color:'#6A6460', fontSize:11}}>
            <i className="ti ti-arrow-left" /> Voltar
          </button>
        </div>
      </div>

      <div className="pg-body">
        {/* Destaque */}
        <div className="pg-destaque-wrap">
          <div className="pg-destaque-label">
            <i className="ti ti-bell pg-pulse" />
            Próximo a entregar
          </div>
          <div className="pg-destaque-box">
            {!proximo
              ? <div className="pg-destaque-empty"><i className="ti ti-mood-smile" /><span>Nenhum pedido pronto ainda — tudo tranquilo!</span></div>
              : <div className="pg-destaque-content">
                  <div className="pg-mesa-block">
                    <div className="pg-mesa-label">Mesa</div>
                    <div className="pg-mesa-num">{proximo.mesa}</div>
                    <div className="pg-mesa-pessoas"><i className="ti ti-users" />{proximo.pessoas} pessoa{proximo.pessoas>1?'s':''}</div>
                  </div>
                  <div className="pg-dest-info">
                    <div className="pg-dest-num">Pedido #{String(proximo.ordem).padStart(3,'0')} · {proximo.hora}</div>
                    <div className="pg-dest-itens">
                      {proximo.itens.map((it,i) => (
                        <div key={i} className="pg-dest-item">
                          <div className="pg-dqty">{it.q}</div>
                          <div className="pg-dname">{it.n}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pg-dest-actions">
                    <button className="pg-btn-entregar" onClick={() => marcarEntregue(proximo.id)}>
                      <i className="ti ti-check" /> Entregue
                    </button>
                    {prontos.length > 1 && (
                      <button className="pg-btn-adiar" onClick={adiar}>Adiar para depois</button>
                    )}
                  </div>
                </div>
            }
          </div>
        </div>

        {/* Fila */}
        <div className="pg-fila-wrap">
          <div className="pg-fila-label"><i className="ti ti-list-check" />Fila — por ordem de chegada</div>
          <div className="pg-fila-lista">
            {prontos.length === 0 && entregues.length === 0
              ? <div className="pg-fila-empty"><i className="ti ti-check" /><span>Fila vazia</span></div>
              : [...prontos, ...entregues].map((o, idx) => {
                  const isEntregue = entregues.some(e => e.id === o.id);
                  const isProximo  = !isEntregue && prontos[0]?.id === o.id;
                  return (
                    <div key={o.id} className={`pg-fcard${isEntregue?' entregue':''}${isProximo?' proximo':''}`}>
                      <div className="pg-fmesa">
                        <div className="pg-fmesa-lab">Mesa</div>
                        <div className="pg-fmesa-num">{o.mesa}</div>
                      </div>
                      <div className="pg-fbody">
                        <div className="pg-fnum">Pedido #{String(o.ordem).padStart(3,'0')}</div>
                        <div className="pg-fressumo">{resumo(o.itens)}</div>
                        <div className="pg-fpessoas"><i className="ti ti-users" />{o.pessoas} pessoa{o.pessoas>1?'s':''}</div>
                      </div>
                      <div className="pg-fright">
                        <div className="pg-fhora">{o.hora}</div>
                        {isEntregue
                          ? <span className="pg-badge entregue-badge"><i className="ti ti-check" /> Entregue</span>
                          : <span className="pg-badge aguard-badge">Aguardando</span>
                        }
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
