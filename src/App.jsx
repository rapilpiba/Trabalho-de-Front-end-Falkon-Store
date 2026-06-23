import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { EstoqueProvider } from './context/EstoqueContext'
import { PedidosProvider } from './context/PedidosContext'
import Navbar from './components/Navbar'
import Busca from './pages/Busca'
import Promocoes from './pages/Promocoes'
import Login from './pages/Login'
import Carrinho from './pages/Carrinho'
import Pedidos from './pages/Pedidos'
import './App.css'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />
}

function AppRoutes() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  return (
    <>
      {!isLogin && <Navbar />}
      <main className={isLogin ? '' : 'main-content'}>
        <Routes>
          <Route path="/login"          element={<Login />} />
          <Route path="/"               element={<ProtectedRoute><Busca /></ProtectedRoute>} />
          <Route path="/promocoes"      element={<ProtectedRoute><Promocoes /></ProtectedRoute>} />
          <Route path="/limpa-estoque"  element={<ProtectedRoute><Promocoes /></ProtectedRoute>} />
          <Route path="/carrinho"       element={<ProtectedRoute><Carrinho /></ProtectedRoute>} />
          <Route path="/pedidos"        element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <EstoqueProvider>
        <CartProvider>
          <PedidosProvider>
            <Router>
              <div className="app">
                <AppRoutes />
              </div>
            </Router>
          </PedidosProvider>
        </CartProvider>
      </EstoqueProvider>
    </AuthProvider>
  )
}
