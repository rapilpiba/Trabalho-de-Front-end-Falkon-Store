// ============================================================
// db.js — Banco de dados simples usando localStorage
//
// Os dados ficam salvos no navegador e persistem:
//   quando a aba é fechada
//   quando o servidor local (npm run dev) é encerrado
//   quando o computador é reiniciado
//
// Os dados só são perdidos se o usuário limpar
// manualmente os dados do navegador.
// ============================================================

const PREFIXO = 'falkon_db_'

export const db = {
  // Busca um valor pelo nome da chave
  get(chave) {
    try {
      const valor = localStorage.getItem(PREFIXO + chave)
      return valor ? JSON.parse(valor) : null
    } catch {
      return null
    }
  },

  // Salva um valor com o nome da chave
  set(chave, valor) {
    try {
      localStorage.setItem(PREFIXO + chave, JSON.stringify(valor))
      return true
    } catch {
      return false
    }
  },

  // Remove uma chave específica
  remove(chave) {
    localStorage.removeItem(PREFIXO + chave)
  },

  // Apaga todos os dados do banco
  limpar() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIXO))
      .forEach((k) => localStorage.removeItem(k))
  },
}
