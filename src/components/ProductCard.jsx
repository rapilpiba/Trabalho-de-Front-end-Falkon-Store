import { useCart } from '../context/CartContext'
import { useEstoque } from '../context/EstoqueContext'
import './ProductCard.css'

export default function ProductCard({ produto, highlight = false }) {
  const { addItem, items } = useCart()
  const { getEstoque }    = useEstoque()

  const estoqueAtual  = getEstoque(produto.id)
  const qtdNoCarrinho = items.find((i) => i.id === produto.id)?.qty || 0
  const esgotado      = estoqueAtual === 0
  const limiteAtingido = qtdNoCarrinho >= estoqueAtual
  const inCart        = qtdNoCarrinho > 0

  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const economia = produto.precoOriginal - produto.preco

  const handleAdd = () => {
    if (!esgotado && !limiteAtingido) addItem(produto)
  }

  const btnLabel = () => {
    if (esgotado)       return '✕ Esgotado'
    if (limiteAtingido) return `✓ No Carrinho (max: ${estoqueAtual})`
    if (inCart)         return `✓ No Carrinho (+1)`
    if (produto.promocao) return '🔥 Garantir Oferta'
    return '+ Adicionar'
  }

  const btnClass = [
    'btn-cart',
    produto.promocao && !esgotado && !limiteAtingido ? 'btn-promo' : '',
    inCart && !esgotado ? 'in-cart' : '',
    esgotado ? 'esgotado' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={['product-card', produto.promocao ? 'em-promocao' : '', highlight ? 'highlight' : ''].filter(Boolean).join(' ')}>

      {produto.promocao && !esgotado && (
        <div className="discount-badge">-{produto.desconto}%</div>
      )}
      {produto.promocao && produto.selo && !esgotado && (
        <div className="opportunity-seal">{produto.selo}</div>
      )}
      {esgotado && <div className="esgotado-badge">ESGOTADO</div>}

      <div className={`card-emoji-area ${esgotado ? 'op-50' : ''}`}>{produto.emoji}</div>

      <div className="card-body">
        <span className="card-category">{produto.categoria}</span>
        <h3 className="card-title">{produto.nome}</h3>
        <p className="card-desc">{produto.descricao}</p>

        <div className="card-pricing">
          {produto.promocao && !esgotado && (
            <>
              <span className="price-original">{fmt(produto.precoOriginal)}</span>
              <span className="economy-tag">Economize {fmt(economia)}</span>
            </>
          )}
          <span className={`price-current ${esgotado ? 'faded' : ''}`}>{fmt(produto.preco)}</span>
        </div>

        <div className="stock-info">
          {esgotado
            ? <span className="stock-zero">Sem estoque</span>
            : estoqueAtual <= 5
            ? <span className="stock-low">⚠ Apenas {estoqueAtual} restantes</span>
            : <span className="stock-ok">Em estoque: {estoqueAtual}</span>
          }
        </div>

        <button className={btnClass} onClick={handleAdd} disabled={esgotado || limiteAtingido}>
          {btnLabel()}
        </button>
      </div>
    </div>
  )
}
