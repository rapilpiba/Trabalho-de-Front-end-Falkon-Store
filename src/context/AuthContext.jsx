import { createContext, useContext, useState } from 'react'
import { db } from '../db/db'

const AuthContext = createContext(null)

// Credencial pré-cadastrada
const CREDENCIAL = { usuario: 'Mestre Hyan', senha: '12345' }

export function AuthProvider({ children }) {
  // Inicializa do banco — persiste após fechar aba ou servidor
  const [user, setUser] = useState(() => db.get('usuario'))

  const login = (usuario, senha) => {
    if (usuario.trim() === CREDENCIAL.usuario && senha === CREDENCIAL.senha) {
      const nome = usuario.trim()
      setUser(nome)
      db.set('usuario', nome)
      return { ok: true }
    }
    return { ok: false, erro: 'Usuário ou senha incorretos.' }
  }

  const logout = () => {
    setUser(null)
    db.remove('usuario')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
