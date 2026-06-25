// Shared state store — simple pub/sub so all modules stay in sync
const listeners = new Set();
let _orders = []; // { id, ordem, mesa, pessoas, itens, status, hora }
let _nextOrdem = 1;

export function getOrders() { return _orders; }

export function addOrder(order) {
  _orders = [..._orders, { ...order, ordem: _nextOrdem++, id: Date.now() + Math.random(), status: 'novo', hora: new Date().toLocaleTimeString('pt-BR') }];
  notify();
}

export function updateOrderStatus(id, status) {
  _orders = _orders.map(o => o.id === id ? { ...o, status } : o);
  notify();
}

export function removeOrder(id) {
  _orders = _orders.filter(o => o.id !== id);
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() { listeners.forEach(fn => fn()); }

// ─── Menu data ────────────────────────────────────────────────────────────────
const UNSPLASH = 'https://images.unsplash.com/';

export const menus = {
  pratos: { label: 'Pratos do Dia', items: [
    { id:'feijoada',  name:'Feijoada Completa',   desc:'Arroz, farofa, couve mineira e laranja. Serve uma pessoa.', price:48.90, img: UNSPLASH+'photo-1556909114-f6e7ad7d3136?w=400&h=240&fit=crop' },
    { id:'frango',    name:'Frango com Quiabo',    desc:'Acompanha polenta cremosa e arroz branco fresquinho.',      price:42.00, img: UNSPLASH+'photo-1598515214211-89d3c73ae83b?w=400&h=240&fit=crop' },
    { id:'massas',    name:'Massas',               desc:'Escolha base, molho e acompanhamentos. Monte do seu jeito.', price:35.00, img: UNSPLASH+'photo-1563379926898-05f4575a45d8?w=400&h=240&fit=crop', personalizar:true },
    { id:'picanha',   name:'Picanha Grelhada',     desc:'Ponto a gosto. Acompanha mandioca frita e vinagrete.',      price:69.90, img: UNSPLASH+'photo-1544025162-d76694265947?w=400&h=240&fit=crop' },
  ]},
  espeto: { label: 'Espetinhos', items: [
    { id:'esp-frango', name:'Espeto de Frango',  desc:'Temperado com alho e ervas finas. Serve 3 unidades.', price:18.00, img: UNSPLASH+'photo-1529563021893-cc83c992d75d?w=400&h=240&fit=crop' },
    { id:'esp-carne',  name:'Espeto de Carne',   desc:'Alcatra macia na brasa. Serve 3 unidades.',           price:22.00, img: UNSPLASH+'photo-1555939594-58d7cb561ad1?w=400&h=240&fit=crop' },
    { id:'esp-queijo', name:'Espeto de Queijo',  desc:'Coalho dourado com mel e orégano. Serve 2 unidades.', price:16.00, img: UNSPLASH+'photo-1589302168068-964664d93dc0?w=400&h=240&fit=crop' },
    { id:'esp-leg',    name:'Espeto de Legumes', desc:'Abobrinha, pimentão e cebola grelhados. Vegano.',     price:14.00, img: UNSPLASH+'photo-1512058564366-18510be2db19?w=400&h=240&fit=crop' },
  ]},
  sides: { label: 'Acompanhamentos', items: [
    { id:'mandioca', name:'Mandioca Frita',   desc:'Crocante por fora, macia por dentro. Com maionese da casa.', price:14.00, img: UNSPLASH+'photo-1630614025809-5cc4e1e3a7ac?w=400&h=240&fit=crop' },
    { id:'farofa',   name:'Farofa Especial',  desc:'Farofa de bacon com ovos e cebolinha.',                     price:12.00, img: UNSPLASH+'photo-1598524695673-f73ac0a2fd83?w=400&h=240&fit=crop' },
    { id:'couve',    name:'Couve Refogada',   desc:'Couve mineira no alho e azeite.',                           price:10.00, img: UNSPLASH+'photo-1576045057995-568f588f82fb?w=400&h=240&fit=crop' },
    { id:'arroz',    name:'Arroz Branco',     desc:'Arroz soltinho temperado com alho e sal.',                  price:8.00,  img: UNSPLASH+'photo-1536304993881-ff86e0c9b29f?w=400&h=240&fit=crop' },
  ]},
  drinks: { label: 'Bebidas', items: [
    { id:'caip',  name:'Caipirinha',   desc:'Cachaça artesanal, limão, açúcar e gelo.',     price:18.00, img: UNSPLASH+'photo-1541614101331-1a5a3a194e92?w=400&h=240&fit=crop' },
    { id:'suco',  name:'Suco Natural', desc:'Laranja, maracujá, abacaxi ou melão. 300ml.',  price:12.00, img: UNSPLASH+'photo-1600271886742-f049cd451bba?w=400&h=240&fit=crop' },
    { id:'agua',  name:'Água Mineral', desc:'Sem gás ou com gás. 500ml.',                  price:6.00,  img: UNSPLASH+'photo-1548839140-29a749e1cf4d?w=400&h=240&fit=crop' },
    { id:'refri', name:'Refrigerante', desc:'Coca-Cola, Guaraná ou Sprite. Lata 350ml.',   price:8.00,  img: UNSPLASH+'photo-1629203851122-3726ecdf080e?w=400&h=240&fit=crop' },
  ]},
  doces: { label: 'Sobremesas', items: [
    { id:'pudim',       name:'Pudim de Leite',      desc:'Receita da casa com calda de caramelo.',      price:16.00, img: UNSPLASH+'photo-1551024506-0bccd828d307?w=400&h=240&fit=crop' },
    { id:'brigadeiro',  name:'Trio de Brigadeiros', desc:'Tradicional, pistache e maracujá.',           price:14.00, img: UNSPLASH+'photo-1599599810769-bcde5a160d32?w=400&h=240&fit=crop' },
    { id:'sorvete',     name:'Sorvete Artesanal',   desc:'Creme, chocolate ou morango. 2 bolas.',       price:13.00, img: UNSPLASH+'photo-1563805042-7684c019e1cb?w=400&h=240&fit=crop' },
  ]},
};

export const fmt = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
