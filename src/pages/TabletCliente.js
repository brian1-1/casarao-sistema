import React, { useState } from 'react';
import { menus, fmt, addOrder } from '../data/store';
import './TabletCliente.css';

const NAV = [
  { key:'pratos', icon:'ti-tools-kitchen-2', label:'Pratos' },
  { key:'espeto', icon:'ti-meat',            label:'Espeto' },
  { key:'sides',  icon:'ti-salad',           label:'Sides'  },
  { key:'drinks', icon:'ti-beer',            label:'Drinks' },
  { key:'doces',  icon:'ti-cookie',          label:'Doces'  },
];

const MASSA_OPTS = {
  base:  ['Espaguete','Penne','Talharim','Fusilli'],
  molho: ['Bolonhesa','Ao Sugo','Carbonara','Pesto'],
  acomp: ['Queijo ralado','Pão de alho','Salada verde'],
};

export default function TabletCliente({ onBack }) {
  const [section, setSection]   = useState('pratos');
  const [cart, setCart]         = useState([]);
  const [massaOpen, setMassaOpen] = useState(false);
  const [qrOpen, setQrOpen]     = useState(false);
  const [massaOpts, setMassaOpts] = useState({ base:'Espaguete', molho:'Bolonhesa', acomp:[] });
  const [pessoas, setPessoas]   = useState(2);

  const addItem = (id, name, price, obs='') => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (ex) return prev.map(c => c.id===id ? {...c, qty:c.qty+1} : c);
      return [...prev, { id, name, price, qty:1, obs }];
    });
  };

  const removeItem = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const total     = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const itemCount = cart.reduce((s,c) => s + c.qty, 0);

  const confirmar = () => {
    if (!cart.length) return;
    addOrder({ mesa:12, pessoas, itens: cart.map(c => ({ n:c.name, q:c.qty, obs:c.obs })) });
    setQrOpen(true);
  };

  const addMassa = () => {
    const obs = `${massaOpts.base} · ${massaOpts.molho}${massaOpts.acomp.length ? ' · '+massaOpts.acomp.join(', ') : ''}`;
    addItem('massas', 'Massas', 35.00, obs);
    setMassaOpen(false);
  };

  const currentItems = menus[section]?.items || [];

  return (
    <div className="tc-root">
      {/* Side nav */}
      <nav className="tc-sidenav">
        <div className="tc-logo">C</div>
        {NAV.map(n => (
          <button key={n.key} className={`tc-navitem${section===n.key?' active':''}`} onClick={() => setSection(n.key)}>
            <i className={`ti ${n.icon}`} />
            <span>{n.label}</span>
          </button>
        ))}
        <div className="tc-spacer" />
        <button className="tc-navitem" onClick={() => alert('✅ Garçom chamado! Ele virá com a maquininha.')}>
          <i className="ti ti-bell" />
          <span>Garçom</span>
        </button>
        <button className="back-btn tc-back" onClick={onBack}><i className="ti ti-arrow-left" /></button>
      </nav>

      {/* Main */}
      <main className="tc-main">
        <div className="tc-header">
          <div className="tc-resto-name">O Casarão</div>
          <div className="tc-resto-sub">Cozinha Brasileira &amp; Espetaria</div>
        </div>

        <div className="tc-content">
          <div className="tc-section-title">{menus[section]?.label}</div>
          <div className="tc-grid">
            {currentItems.map(item => (
              <div key={item.id} className="tc-card">
                <img className="tc-img" src={item.img} alt={item.name}
                  onError={e => { e.target.style.background='#e0d8d0'; e.target.src=''; }} />
                <div className="tc-body">
                  <div className="tc-name">{item.name}</div>
                  <div className="tc-desc">{item.desc}</div>
                  <div className="tc-footer">
                    <div className="tc-price">{fmt(item.price)}</div>
                    {item.personalizar
                      ? <button className="btn-personalizar" onClick={() => setMassaOpen(true)}>Personalizar</button>
                      : <button className="btn-add" onClick={() => addItem(item.id, item.name, item.price)} aria-label={`Adicionar ${item.name}`}>
                          <i className="ti ti-plus" />
                        </button>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Order panel */}
      <aside className="tc-panel">
        <div className="tc-panel-header">
          <div className="tc-panel-title">Seu Pedido</div>
          <div className="tc-panel-meta">
            Mesa 12 ·{' '}
            <select value={pessoas} onChange={e => setPessoas(+e.target.value)} className="pessoas-select">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} pessoa{n>1?'s':''}</option>)}
            </select>
          </div>
        </div>

        <div className="tc-panel-items">
          {cart.length === 0
            ? <div className="tc-empty">Seu pedido<br/>aparecerá aqui.</div>
            : cart.map(c => (
              <div key={c.id} className="tc-order-item">
                <div className="tc-oqty">{c.qty}</div>
                <div className="tc-oinfo">
                  <div className="tc-oname">{c.name}</div>
                  {c.obs && <div className="tc-oobs">{c.obs}</div>}
                </div>
                <div className="tc-oprice">{fmt(c.price*c.qty)}</div>
                <button className="tc-oremove" onClick={() => removeItem(c.id)} aria-label="Remover">
                  <i className="ti ti-x" />
                </button>
              </div>
            ))
          }
        </div>

        <div className="tc-panel-footer">
          <div className="tc-total-row">
            <span>Total</span>
            <span className="tc-total-val">{fmt(total)}</span>
          </div>
          <div className="pix-box">
            <div className="pix-icon"><i className="ti ti-qrcode" /></div>
            <div className="pix-text">
              <p>Pague via Pix</p>
              <p>QR Code gerado ao confirmar</p>
            </div>
          </div>
          <button className={`btn-confirmar${cart.length?' active':''}`} onClick={confirmar}>
            Confirmar Pedido
          </button>
          <button className="btn-garcom" onClick={() => alert('✅ Garçom chamado! Ele virá com a maquininha.')}>
            Chamar Garçom (Pagar no Cartão)
          </button>
        </div>
      </aside>

      {/* Modal massa */}
      {massaOpen && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setMassaOpen(false)}>
          <div className="modal">
            <div className="modal-title">Massas</div>
            <div className="modal-sub">Monte seu prato do jeito que você prefere</div>
            {['base','molho'].map(grp => (
              <div key={grp} className="opt-group">
                <div className="opt-label">{grp === 'base' ? 'Base' : 'Molho'}</div>
                <div className="opt-pills">
                  {MASSA_OPTS[grp].map(v => (
                    <button key={v} className={`pill${massaOpts[grp]===v?' selected':''}`}
                      onClick={() => setMassaOpts(p => ({...p, [grp]:v}))}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="opt-group">
              <div className="opt-label">Acompanhamento</div>
              <div className="opt-pills">
                {MASSA_OPTS.acomp.map(v => (
                  <button key={v}
                    className={`pill${massaOpts.acomp.includes(v)?' selected':''}`}
                    onClick={() => setMassaOpts(p => ({
                      ...p,
                      acomp: p.acomp.includes(v) ? p.acomp.filter(x=>x!==v) : [...p.acomp,v]
                    }))}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setMassaOpen(false)}>Cancelar</button>
              <span className="modal-price">R$ 35,00</span>
              <button className="btn-modal-add" onClick={addMassa}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrOpen && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setQrOpen(false)}>
          <div className="modal qr-modal">
            <div className="modal-title">Pagamento via Pix</div>
            <div className="modal-sub">Escaneie com o app do seu banco</div>
            <div className="qr-box"><i className="ti ti-qrcode" /></div>
            <div className="qr-amount">{fmt(total)}</div>
            <div className="qr-mesa">Mesa 12</div>
            <button className="btn-modal-add" style={{width:'100%'}} onClick={() => { setCart([]); setQrOpen(false); }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
