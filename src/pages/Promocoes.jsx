import { useState, useMemo } from 'react'
import { produtos } from '../data/produtos'
import ProductCard from '../components/ProductCard'
import './Promocoes.css'

export default function Promocoes() {
  const [ordenacao, setOrdem] = useState('desconto')

  // Somente itens com promocao: true
  const lista = useMemo(() => {
    const promos = produtos.filter((p) => p.promocao)
    if (ordenacao === 'preco-asc')  return [...promos].sort((a, b) => a.preco - b.preco)
    if (ordenacao === 'preco-desc') return [...promos].sort((a, b) => b.preco - a.preco)
    return [...promos].sort((a, b) => b.desconto - a.desconto)
  }, [ordenacao])

  const maxDesc = Math.max(...lista.map((p) => p.desconto))
  const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const economia = lista.reduce((acc, p) => acc + (p.precoOriginal - p.preco), 0)

  return (
    <div className="promo-page">

      {/* Header */}
      <div className="promo-header">
        <span className="promo-eyebrow">🔥 LIMPA ESTOQUE</span>
        <h1 className="promo-heading">
          Vitrine de <span className="pink">Promoções</span>
        </h1>
        <p className="promo-sub">
          {lista.length} ofertas •&nbsp;até <b>{maxDesc}% off</b> •&nbsp;economize até {fmt(economia)}
        </p>
      </div>

      {/* Controls */}
      <div className="promo-controls">
        <div className="urgency">⚡ ESTOQUE LIMITADO — Garanta o seu antes que acabe!</div>
        <div className="sort-row-promo">
          <label className="sort-lbl">Ordenar:</label>
          <select className="sort-sel" value={ordenacao} onChange={(e) => setOrdem(e.target.value)}>
            <option value="desconto">Maior desconto</option>
            <option value="preco-asc">Menor preço ↑</option>
            <option value="preco-desc">Maior preço ↓</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="promo-grid">
        {lista.map((p) => <ProductCard key={p.id} produto={p} highlight />)}
      </div>

      <p className="promo-disclaimer">
        Descontos válidos enquanto durar o estoque. Preços sujeitos a alteração.
      </p>
    </div>
  )
}
