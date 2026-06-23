import { createContext, useContext, useState } from 'react'
import { db } from '../db/db'
import { produtos } from '../data/produtos'

const EstoqueCtx = createContext(null)

// Carrega do banco ou inicializa dos valores padrão dos produtos
function carregarEstoque() {
  const salvo = db.get('estoque')
  if (salvo) return salvo
  const inicial = {}
  produtos.forEach((p) => { inicial[p.id] = p.estoque })
  db.set('estoque', inicial)
  return inicial
}

export function EstoqueProvider({ children }) {
  const [estoque, setEstoque] = useState(carregarEstoque)

  // Retorna quantidade disponível de um produto
  const getEstoque = (id) => estoque[id] ?? 0

  // Diminui estoque ao finalizar compra
  const decrementar = (id, qty = 1) => {
    setEstoque((prev) => {
      const novo = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) - qty) }
      db.set('estoque', novo)
      return novo
    })
  }

  return (
    <EstoqueCtx.Provider value={{ getEstoque, decrementar }}>
      {children}
    </EstoqueCtx.Provider>
  )
}

export const useEstoque = () => useContext(EstoqueCtx)
