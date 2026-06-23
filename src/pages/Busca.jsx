import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { produtos, categorias } from '../data/produtos'
import ProductCard from '../components/ProductCard'
import './Busca.css'

export default function Busca() {
  const [search, setSearch]    = useState('')
  const [categoria, setCateg]  = useState('Todas')
  const [ordenacao, setOrdem]  = useState('relevancia')
  const [soPro, setSoPro]      = useState(false)

  const promoCount = produtos.filter((p) => p.promocao).length

  const lista = useMemo(() => {
    let r = [...produtos]
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((p) =>
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      )
    }
    if (categoria !== 'Todas') r = r.filter((p) => p.categoria === categoria)
    if (soPro) r = r.filter((p) => p.promocao)
    if (ordenacao === 'preco-asc')  r.sort((a, b) => a.preco - b.preco)
    if (ordenacao === 'preco-desc') r.sort((a, b) => b.preco - a.preco)
    if (ordenacao === 'desconto')   r.sort((a, b) => b.desconto - a.desconto)
    return r
  }, [search, categoria, ordenacao, soPro])

  const hasFilters = search || categoria !== 'Todas' || ordenacao !== 'relevancia' || soPro
  const clearAll = () => { setSearch(''); setCateg('Todas'); setOrdem('relevancia'); setSoPro(false) }

  return (
    <div className="busca-page">

      {/* Header simples */}
      <div className="busca-header">
        <h1 className="busca-heading">Vitrine <span className="cyan">Geek</span></h1>
        <Link to="/promocoes" className="promo-link-badge">
          🔥 {promoCount} promoções ativas
        </Link>
      </div>

      {/* Filtros */}
      <div className="filter-box">
        {/* Search */}
        <div className="search-wrap">
          <span className="s-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* Categorias */}
        <div className="cats">
          {categorias.map((c) => (
            <button
              key={c}
              className={`cat-chip ${categoria === c ? 'active' : ''}`}
              onClick={() => setCateg(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort + toggle */}
        <div className="sort-row">
          <select className="sort-select" value={ordenacao} onChange={(e) => setOrdem(e.target.value)}>
            <option value="relevancia">Relevância</option>
            <option value="preco-asc">Menor preço ↑</option>
            <option value="preco-desc">Maior preço ↓</option>
            <option value="desconto">Maior desconto</option>
          </select>

          <label className="toggle-wrap">
            <input type="checkbox" hidden checked={soPro} onChange={(e) => setSoPro(e.target.checked)} />
            <div className={`toggle ${soPro ? 'on' : ''}`}><div className="thumb" /></div>
            <span>🔥 Só promoções</span>
          </label>

          {hasFilters && <button className="clear-all" onClick={clearAll}>↺ Limpar</button>}
        </div>
      </div>

      {/* Resultado */}
      <p className="results-info">
        {lista.length} produto{lista.length !== 1 ? 's' : ''} encontrado{lista.length !== 1 ? 's' : ''}
        {categoria !== 'Todas' && <span className="tag">{categoria}</span>}
        {soPro && <span className="tag">🔥 Promoções</span>}
      </p>

      {lista.length === 0 ? (
        <div className="empty">
          <div>🔭</div>
          <p>Nenhum produto encontrado.</p>
          <button onClick={clearAll}>Limpar filtros</button>
        </div>
      ) : (
        <div className="grid">
          {lista.map((p) => <ProductCard key={p.id} produto={p} />)}
        </div>
      )}
    </div>
  )
}
