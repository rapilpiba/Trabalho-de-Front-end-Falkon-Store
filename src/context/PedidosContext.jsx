import { createContext, useContext, useState } from 'react'
import { db } from '../db/db'

const PedidosCtx = createContext(null)

export const STATUS_PEDIDO = [
  { label: 'Aguardando Pagamento', icon: '⏳' },
  { label: 'Pagamento Confirmado', icon: '✅' },
  { label: 'Em Separação',          icon: '📦' },
  { label: 'A Caminho',             icon: '🚚' },
  { label: 'Entregue',              icon: '🎉' },
]

// Minutos para avançar para cada etapa após o pedido
const MINUTOS = [2, 6, 20, 50]

function calcularEtapa(dataPedido) {
  const min = (Date.now() - new Date(dataPedido).getTime()) / 60000
  let etapa = 0
  for (const t of MINUTOS) {
    if (min >= t) etapa++
    else break
  }
  return Math.min(etapa, STATUS_PEDIDO.length - 1)
}

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => db.get('pedidos') || [])

  const criarPedido = (itens, total, pagamento) => {
    const id = 'PED-' + String(Date.now()).slice(-6)
    const pedido = { id, data: new Date().toISOString(), itens, total, pagamento }
    const lista = [pedido, ...pedidos]
    setPedidos(lista)
    db.set('pedidos', lista)
    return id
  }

  // Retorna a etapa atual de um pedido com base no tempo decorrido
  const getEtapa = (pedido) => {
    const idx = calcularEtapa(pedido.data)
    return { ...STATUS_PEDIDO[idx], idx }
  }

  return (
    <PedidosCtx.Provider value={{ pedidos, criarPedido, getEtapa }}>
      {children}
    </PedidosCtx.Provider>
  )
}

export const usePedidos = () => useContext(PedidosCtx)
