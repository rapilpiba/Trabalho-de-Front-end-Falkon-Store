import { createContext, useContext, useState } from 'react'
import { db } from '../db/db'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Inicializa do banco — carrinho persiste mesmo após fechar o site
  const [items, setItems] = useState(() => db.get('carrinho') || [])

  const salvar = (novosItems) => {
    db.set('carrinho', novosItems)
    return novosItems
  }

  const addItem = (produto) => {
    setItems((prev) => {
      const encontrado = prev.find((i) => i.id === produto.id)
      const next = encontrado
        ? prev.map((i) => i.id === produto.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...produto, qty: 1 }]
      return salvar(next)
    })
  }

  const removeItem = (id) => {
    setItems((prev) => salvar(prev.filter((i) => i.id !== id)))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id)
    setItems((prev) => salvar(prev.map((i) => i.id === id ? { ...i, qty } : i)))
  }

  const clearCart = () => {
    setItems([])
    db.remove('carrinho')
  }

  const total = items.reduce((acc, i) => acc + i.preco * i.qty, 0)
  const count = items.reduce((acc, i) => acc + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
