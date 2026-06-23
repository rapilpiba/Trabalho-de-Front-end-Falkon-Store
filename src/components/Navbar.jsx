import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { usePedidos } from '../context/PedidosContext'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { user, logout }  = useAuth()
  const { count }         = useCart()
  const { pedidos }       = usePedidos()

  const isPromo  = ['/promocoes', '/limpa-estoque'].includes(location.pathname)
  const isCart   = location.pathname === '/carrinho'
  const isPed    = location.pathname === '/pedidos'

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-bolt">🛒</span>
        <span className="logo-text">Falkon<span className="logo-accent">Store</span></span>
      </Link>

      {user ? (
        <>
          <div className="navbar-links">
            <Link to="/"          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Busca</Link>
            <Link to="/promocoes" className={`nav-link promo-nav ${isPromo ? 'active-promo' : ''}`}>🔥 Promoções</Link>
            <Link to="/pedidos"   className={`nav-link ${isPed ? 'active' : ''}`}>
              Pedidos
              {pedidos.length > 0 && <span className="pedidos-badge">{pedidos.length}</span>}
            </Link>
          </div>

          <div className="navbar-user">
            <Link to="/carrinho" className={`cart-btn ${isCart ? 'active' : ''}`}>
              🛒
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <span className="user-greeting">Olá, <b>{user}</b></span>
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </>
      ) : (
        <Link to="/login" className="nav-link">Entrar</Link>
      )}
    </nav>
  )
}
