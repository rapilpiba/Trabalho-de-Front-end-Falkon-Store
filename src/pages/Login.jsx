import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha]     = useState('')
  const [erro, setErro]       = useState('')
  const [loading, setLoading] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino  = location.state?.from?.pathname || '/'

  // Se já estiver logado, redireciona
  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    setTimeout(() => {
      const result = login(usuario, senha)
      if (result.ok) {
        navigate(destino, { replace: true })
      } else {
        setErro(result.erro)
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚡ FALKONSTORE</div>
        <h2 className="login-title">Acessar conta</h2>

        <div className="login-hint-box">
          <span>👤 <b>Mestre Hyan</b></span>
          <span>🔑 <b>12345</b></span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field">
            <label htmlFor="usuario">Nome de usuário</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Mestre Hyan"
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && <p className="login-error">⚠ {erro}</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  )
}
