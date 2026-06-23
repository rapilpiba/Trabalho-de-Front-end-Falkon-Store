import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart }    from '../context/CartContext'
import { useEstoque } from '../context/EstoqueContext'
import { usePedidos } from '../context/PedidosContext'
import './Carrinho.css'

const METODOS = [
  { id: 'pix',     label: 'PIX',     icon: '⚡', info: '5% de desconto', desconto: 0.05 },
  { id: 'credito', label: 'Crédito', icon: '💳', info: 'até 12x',         desconto: 0    },
  { id: 'debito',  label: 'Débito',  icon: '🏦', info: 'à vista',          desconto: 0    },
  { id: 'boleto',  label: 'Boleto',  icon: '📄', info: '3 dias úteis',     desconto: 0    },
]

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Carrinho() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart()
  const { getEstoque, decrementar } = useEstoque()
  const { criarPedido } = usePedidos()

  const [pagamento, setPagamento] = useState('pix')
  const [parcelas, setParcelas]   = useState(1)
  const [pedidoId, setPedidoId]   = useState(null)

  const metodo    = METODOS.find((m) => m.id === pagamento)
  const desconto  = metodo.desconto
  const totalFinal = total * (1 - desconto)

  const finalizarCompra = () => {
    items.forEach((item) => decrementar(item.id, item.qty))
    const id = criarPedido(items, totalFinal, {
      metodo: metodo.label,
      parcelas: pagamento === 'credito' ? parcelas : 1,
    })
    clearCart()
    setPedidoId(id)
  }

  /* ── Sucesso ── */
  if (pedidoId) {
    return (
      <div className="carrinho-page">
        <div className="carrinho-success">
          <span className="success-icon">🎉</span>
          <h2>Pedido realizado!</h2>
          <p>Pedido <strong>{pedidoId}</strong> confirmado com sucesso.</p>
          <div className="success-actions">
            <Link to="/pedidos" className="btn-ver-pedido">📦 Acompanhar Pedido</Link>
            <Link to="/"        className="btn-voltar">← Continuar comprando</Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Vazio ── */
  if (items.length === 0) {
    return (
      <div className="carrinho-page">
        <div className="carrinho-empty">
          <span className="empty-icon">🛒</span>
          <h2>Carrinho vazio</h2>
          <p>Nenhum produto adicionado ainda.</p>
          <Link to="/" className="btn-voltar">← Ir para a Vitrine</Link>
        </div>
      </div>
    )
  }

  /* ── Carrinho ── */
  return (
    <div className="carrinho-page">
      <h1 className="carrinho-title">
        Carrinho
        <span className="count-badge">{count} {count === 1 ? 'item' : 'itens'}</span>
      </h1>

      <div className="carrinho-layout">

        {/* ── Itens ── */}
        <div className="carrinho-items">
          {items.map((item) => {
            const estDisp = getEstoque(item.id)
            return (
              <div key={item.id} className="cart-item">
                <span className="item-emoji">{item.emoji}</span>
                <div className="item-info">
                  <span className="item-name">{item.nome}</span>
                  <span className="item-price">{fmt(item.preco)} / un.</span>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    disabled={item.qty >= estDisp}
                  >+</button>
                </div>
                <span className="item-subtotal">{fmt(item.preco * item.qty)}</span>
                <button className="btn-remove" onClick={() => removeItem(item.id)} title="Remover">✕</button>
              </div>
            )
          })}
        </div>

        {/* ── Resumo + Pagamento ── */}
        <div className="carrinho-summary">
          <h3>Resumo</h3>

          <div className="summary-rows">
            {items.map((item) => (
              <div key={item.id} className="summary-line">
                <span className="sl-nome">{item.nome.split('—')[0].trim()} ×{item.qty}</span>
                <span>{fmt(item.preco * item.qty)}</span>
              </div>
            ))}
          </div>

          {/* Método de pagamento */}
          <div className="payment-section">
            <h4 className="payment-title">Método de Pagamento</h4>
            <div className="payment-grid">
              {METODOS.map((m) => (
                <button
                  key={m.id}
                  className={`method-btn ${pagamento === m.id ? 'active' : ''}`}
                  onClick={() => { setPagamento(m.id); setParcelas(1) }}
                >
                  <span className="m-icon">{m.icon}</span>
                  <span className="m-label">{m.label}</span>
                  <span className="m-info">{m.info}</span>
                </button>
              ))}
            </div>

            {pagamento === 'credito' && (
              <select
                className="parcelas-select"
                value={parcelas}
                onChange={(e) => setParcelas(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 6, 12].map((n) => (
                  <option key={n} value={n}>
                    {n === 1
                      ? `À vista — ${fmt(total)}`
                      : `${n}x de ${fmt(total / n)}${n > 3 ? ' (com juros)' : ' sem juros'}`}
                  </option>
                ))}
              </select>
            )}

            {pagamento === 'pix' && (
              <div className="payment-note success-note">
                💰 Você economiza <strong>{fmt(total * 0.05)}</strong> pagando com PIX!
              </div>
            )}

            {pagamento === 'boleto' && (
              <div className="payment-note">
                📄 O boleto será gerado após a confirmação. Vence em 3 dias úteis.
              </div>
            )}
          </div>

          {/* Desconto PIX */}
          {desconto > 0 && (
            <div className="discount-line">
              <span>Desconto PIX ({desconto * 100}%)</span>
              <span className="discount-val">− {fmt(total * desconto)}</span>
            </div>
          )}

          <div className="summary-total">
            <span>Total</span>
            <span>{fmt(totalFinal)}</span>
          </div>

          {pagamento === 'credito' && parcelas > 1 && (
            <p className="parcela-detalhe">
              {parcelas}x de {fmt(totalFinal / parcelas)}
              {parcelas > 3 ? ' (com juros)' : ' sem juros'}
            </p>
          )}

          <button className="btn-finalizar" onClick={finalizarCompra}>
            Finalizar Compra →
          </button>

          <Link to="/" className="btn-continuar-loja">← Continuar comprando</Link>
        </div>
      </div>
    </div>
  )
}
