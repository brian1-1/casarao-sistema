import React, { useState } from 'react';
import './PainelGerente.css';

const fmt = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

const restos = [
  { nome:'Casarão Centro', faturamento:3847.50, pedidos:47, ticketMedio:81.86, cancelamentos:4,
    maisVendidos:[
      {n:'Picanha Grelhada',q:18,r:1259.20},
      {n:'Feijoada Completa',q:15,r:733.50},
      {n:'Espeto de Carne',q:12,r:264.00},
      {n:'Frango com Quiabo',q:9,r:378.00},
      {n:'Caipirinha',q:8,r:144.00},
    ]},
  { nome:'Casarão Barra', faturamento:2104.00, pedidos:28, ticketMedio:75.14, cancelamentos:2,
    maisVendidos:[
      {n:'Espeto de Frango',q:14,r:252.00},
      {n:'Massas',q:11,r:385.00},
      {n:'Pudim de Leite',q:9,r:144.00},
      {n:'Suco Natural',q:8,r:96.00},
      {n:'Sorvete Artesanal',q:6,r:78.00},
    ]},
];

const cancelamentosData = [
  [
    {hora:'11:42',garcom:'Lucas M.',prato:'Frango com Quiabo',mesa:3,motivo:'reclamacao',label:'Reclamação'},
    {hora:'12:15',garcom:'Lucas M.',prato:'Caipirinha',mesa:7,motivo:'duplicado',label:'Duplicado'},
    {hora:'13:50',garcom:'Ana P.',prato:'Mandioca Frita',mesa:1,motivo:'sem-estoque',label:'Sem estoque'},
    {hora:'14:22',garcom:'Lucas M.',prato:'Picanha Grelhada',mesa:9,motivo:'erro',label:'Erro no pedido'},
  ],
  [
    {hora:'12:08',garcom:'Carla S.',prato:'Pudim de Leite',mesa:4,motivo:'reclamacao',label:'Reclamação'},
    {hora:'14:55',garcom:'Carla S.',prato:'Espeto de Queijo',mesa:6,motivo:'sem-estoque',label:'Sem estoque'},
  ],
];

const initCardapios = [
  [
    {n:'Picanha Grelhada',p:69.90,ativo:true,dias:null},
    {n:'Feijoada Completa',p:48.90,ativo:true,dias:null},
    {n:'Frango com Quiabo',p:42.00,ativo:true,dias:null},
    {n:'Massas',p:35.00,ativo:true,dias:null},
    {n:'Camarão na Chapa',p:89.90,ativo:false,dias:'Sex–Sáb'},
    {n:'Espeto de Carne',p:22.00,ativo:true,dias:null},
    {n:'Mandioca Frita',p:14.00,ativo:true,dias:null},
    {n:'Caipirinha',p:18.00,ativo:true,dias:null},
  ],
  [
    {n:'Espeto de Frango',p:18.00,ativo:true,dias:null},
    {n:'Massas',p:35.00,ativo:true,dias:null},
    {n:'Pudim de Leite',p:16.00,ativo:true,dias:null},
    {n:'Suco Natural',p:12.00,ativo:true,dias:null},
    {n:'Sorvete Artesanal',p:13.00,ativo:true,dias:null},
    {n:'Frutos do Mar',p:79.90,ativo:false,dias:'Sex'},
  ],
];

const PAGES = [
  { id:'dashboard',     label:'Dashboard',     icon:'ti-chart-bar' },
  { id:'cancelamentos', label:'Cancelamentos', icon:'ti-receipt-off' },
  { id:'cardapio',      label:'Cardápio',      icon:'ti-clipboard-list' },
  { id:'comparativo',   label:'Comparativo',   icon:'ti-arrows-diff' },
];

export default function PainelGerente({ onBack }) {
  const [restoIdx, setRestoIdx]   = useState(0);
  const [page, setPage]           = useState('dashboard');
  const [cardapios, setCardapios] = useState(initCardapios);
  const [modal, setModal]         = useState(null); // { idx, nome, preco }
  const [modalVal, setModalVal]   = useState('');

  const r = restos[restoIdx];

  const toggleItem = (idx) => {
    setCardapios(prev => prev.map((lista, ri) =>
      ri !== restoIdx ? lista :
      lista.map((item, i) => i === idx ? {...item, ativo:!item.ativo} : item)
    ));
  };

  const abrirModal = (idx) => {
    const item = cardapios[restoIdx][idx];
    setModal({ idx, nome:item.n });
    setModalVal(item.p.toFixed(2));
  };

  const salvarPreco = () => {
    const val = parseFloat(modalVal);
    if (isNaN(val) || val <= 0) return;
    setCardapios(prev => prev.map((lista, ri) =>
      ri !== restoIdx ? lista :
      lista.map((item, i) => i === modal.idx ? {...item, p:val} : item)
    ));
    setModal(null);
  };

  const motClass = { reclamacao:'mot-rec', erro:'mot-erro', duplicado:'mot-dup', 'sem-estoque':'mot-est' };

  const renderDashboard = () => {
    const maxQ = r.maisVendidos[0].q;
    return (
      <>
        <div className="metrics">
          {[
            {label:'Faturamento hoje', val:fmt(r.faturamento), sub:'+12% vs ontem', up:true},
            {label:'Pedidos',          val:r.pedidos,          sub:'Caixa aberto', up:null},
            {label:'Ticket médio',     val:fmt(r.ticketMedio), sub:'+R$ 4,20 vs ontem', up:true},
            {label:'Cancelamentos',    val:r.cancelamentos,    sub:'Ver motivos', up:false},
          ].map((m,i) => (
            <div key={i} className="mcard">
              <div className="mcard-label">{m.label}</div>
              <div className="mcard-val">{m.val}</div>
              <div className={`mcard-sub ${m.up===true?'up':m.up===false?'down':''}`}>
                {m.up===true && <i className="ti ti-arrow-up" />}
                {m.up===false && <i className="ti ti-alert-triangle" />}
                {m.up===null && <i className="ti ti-clock" />}
                {m.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="section">
          <div className="section-head"><div className="section-title">Pratos mais vendidos hoje</div></div>
          {r.maisVendidos.map((p, i) => (
            <div key={i} className="prato-row">
              <div className="prato-rank">{i+1}</div>
              <div className="prato-name">{p.n}</div>
              <div className="prato-bar-wrap"><div className="prato-bar" style={{width:`${Math.round(p.q/maxQ*100)}%`}} /></div>
              <div className="prato-qty">{p.q}x</div>
              <div className="prato-rec">{fmt(p.r)}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderCancelamentos = () => {
    const lista = cancelamentosData[restoIdx];
    const porGarcom = lista.reduce((acc,c) => { acc[c.garcom]=(acc[c.garcom]||0)+1; return acc; }, {});
    return (
      <>
        <div className="section">
          <div className="section-head">
            <div className="section-title">Cancelamentos de hoje</div>
            <div className="section-count">{lista.length} ocorrência{lista.length!==1?'s':''}</div>
          </div>
          <table className="g-table">
            <thead><tr><th>Hora</th><th>Garçom</th><th>Prato</th><th>Mesa</th><th>Motivo</th></tr></thead>
            <tbody>
              {lista.map((c,i) => (
                <tr key={i}>
                  <td style={{color:'var(--muted)',fontVariantNumeric:'tabular-nums'}}>{c.hora}</td>
                  <td>{c.garcom}</td>
                  <td>{c.prato}</td>
                  <td style={{fontWeight:700}}>Mesa {c.mesa}</td>
                  <td><span className={`mot ${motClass[c.motivo]}`}>{c.label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section">
          <div className="section-head"><div className="section-title">Por garçom</div></div>
          {Object.entries(porGarcom).map(([nome,qt],i) => (
            <div key={i} className="prato-row">
              <div style={{flex:1,fontSize:12,fontWeight:600}}>{nome}</div>
              <div style={{fontSize:12,fontWeight:800,color:'var(--red)'}}>{qt} cancelamento{qt!==1?'s':''}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderCardapio = () => {
    const items = cardapios[restoIdx];
    return (
      <div className="section">
        <div className="section-head">
          <div className="section-title">Pratos — {r.nome}</div>
          <div className="section-count">Alterações de preço valem só para novos pedidos</div>
        </div>
        <div className="cardapio-grid">
          {items.map((item,idx) => (
            <div key={idx} className="citem">
              <div className="citem-info">
                <div className="citem-name">{item.n}</div>
                <div className="citem-price">{fmt(item.p)}</div>
                {item.dias && <div className={`dia-badge ${item.ativo?'dia-on':'dia-off'}`}>Disponível: {item.dias}</div>}
              </div>
              <div className="citem-controls">
                <button className="btn-preco" onClick={() => abrirModal(idx)}><i className="ti ti-pencil" /></button>
                <button className={`toggle ${item.ativo?'on':'off'}`} onClick={() => toggleItem(idx)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparativo = () => {
    const r0 = restos[0], r1 = restos[1];
    return (
      <>
        <div className="section">
          <div className="section-head"><div className="section-title">Performance hoje</div></div>
          <div className="resto-compare">
            {[r0,r1].map((rx,i) => (
              <div key={i} className="rc-card">
                <div className="rc-name"><i className="ti ti-building-store" />{rx.nome}</div>
                {[
                  ['Faturamento',fmt(rx.faturamento)],
                  ['Pedidos',rx.pedidos],
                  ['Ticket médio',fmt(rx.ticketMedio)],
                  ['Cancelamentos',rx.cancelamentos],
                ].map(([lab,val],j) => (
                  <div key={j} className="rc-row">
                    <span className="rc-lab">{lab}</span>
                    <span className="rc-val" style={lab==='Cancelamentos'?{color:'var(--red)'}:{}}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="section">
          <div className="section-head"><div className="section-title">Top prato de cada unidade</div></div>
          {[r0,r1].map((rx,i) => (
            <div key={i} className="prato-row">
              <div style={{width:110,fontSize:10,fontWeight:800,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{rx.nome.split(' ')[1]}</div>
              <div className="prato-name">{rx.maisVendidos[0].n}</div>
              <div className="prato-bar-wrap"><div className="prato-bar" style={{width:`${Math.round(rx.maisVendidos[0].q/18*100)}%`}} /></div>
              <div className="prato-qty">{rx.maisVendidos[0].q}x</div>
              <div className="prato-rec">{fmt(rx.maisVendidos[0].r)}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="gg-root">
      {/* Sidebar */}
      <div className="gg-side">
        <div className="gg-side-header">
          <div className="gg-logo">
            <div className="gg-logo-box">C</div>
            <div>
              <div className="gg-logo-name">Gerente</div>
              <div className="gg-logo-role">Painel central</div>
            </div>
          </div>
          <div className="resto-switcher">
            {restos.map((rx,i) => (
              <button key={i} className={`resto-btn${restoIdx===i?' active':''}`} onClick={() => setRestoIdx(i)}>
                <i className="ti ti-building-store" />{rx.nome}
              </button>
            ))}
          </div>
        </div>
        <div className="gg-nav">
          <div className="nav-section-label">Visão Geral</div>
          {PAGES.slice(0,2).map(p => (
            <button key={p.id} className={`gg-nav-btn${page===p.id?' active':''}`} onClick={() => setPage(p.id)}>
              <i className={`ti ${p.icon}`} />{p.label}
            </button>
          ))}
          <div className="nav-section-label">Gestão</div>
          {PAGES.slice(2).map(p => (
            <button key={p.id} className={`gg-nav-btn${page===p.id?' active':''}`} onClick={() => setPage(p.id)}>
              <i className={`ti ${p.icon}`} />{p.label}
            </button>
          ))}
          <div style={{flex:1}} />
          <button className="back-btn gg-back" onClick={onBack}><i className="ti ti-arrow-left" /> Voltar</button>
        </div>
      </div>

      {/* Main */}
      <div className="gg-main">
        <div className="gg-topbar">
          <div>
            <div className="gg-page-title">{PAGES.find(p=>p.id===page)?.label}</div>
            <div className="gg-page-sub">{restos[restoIdx].nome} · {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
          <span className="gg-badge">{restos[restoIdx].nome}</span>
        </div>
        <div className="gg-content">
          {page==='dashboard'     && renderDashboard()}
          {page==='cancelamentos' && renderCancelamentos()}
          {page==='cardapio'      && renderCardapio()}
          {page==='comparativo'   && renderComparativo()}
        </div>
      </div>

      {/* Modal preço */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-title">{modal.nome}</div>
            <div className="modal-sub">Altere o preço a partir de agora</div>
            <div className="modal-warn">
              <i className="ti ti-alert-triangle" />
              Pedidos já realizados mantêm o preço original. Somente novos pedidos usarão o valor atualizado.
            </div>
            <div className="modal-label">Novo preço (R$)</div>
            <input className="modal-input" type="number" step="0.01" min="0"
              value={modalVal} onChange={e => setModalVal(e.target.value)} autoFocus />
            <div className="modal-btns">
              <button className="btn-cancel-m" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-save" onClick={salvarPreco}>Salvar preço</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
