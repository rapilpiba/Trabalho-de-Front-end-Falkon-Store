import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePedidos, STATUS_PEDIDO } from '../context/PedidosContext'
import './Pedidos.css'

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function StatusTracker({ pedido, getEtapa }) {
  const { idx } = getEtapa(pedido)
  const progresso = idx === 0 ? 0 : (idx / (STATUS_PEDIDO.length - 1)) * 100

  return (
    <div className="tracker">
      <div className="tracker-bar">
        <div className="tracker-fill" style={{ width: `${progresso}%` }} />
      </div>
      <div className="tracker-steps">
        {STATUS_PEDIDO.map((s, i) => (
          <div
            key={i}
            className={[
              'tstep',
              i < idx  ? 'done'    : '',
              i === idx ? 'current' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="tstep-dot">
              {i < idx ? '✓' : i === idx ? s.icon : ''}
            </div>
            <span className="tstep-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Pedidos() {
  const { pedidos, getEtapa } = usePedidos()
  const [, tick] = useState(0)

  // Atualiza status automaticamente a cada 30 segundos
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  if (pedidos.length === 0) {
    return (
      <div className="pedidos-page">
        <h1 className="pedidos-title">Meus Pedidos</h1>
        <div className="pedidos-empty">
          <span>📦</span>
          <p>Você ainda não fez nenhum pedido.</p>
          <Link to="/" className="btn-voltar">← Ir para a Vitrine</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pedidos-page">
      <h1 className="pedidos-title">
        Meus Pedidos
        <span className="pedidos-count">{pedidos.length}</span>
      </h1>

      <div className="pedidos-lista">
        {pedidos.map((pedido) => {
          const etapa = getEtapa(pedido)
          const data = new Date(pedido.data).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })

          return (
            <div key={pedido.id} className="pedido-card">
              {/* Cabeçalho */}
              <div className="pedido-header">
                <div className="pedido-id-wrap">
                  <span className="pedido-id">{pedido.id}</span>
                  <span className="pedido-data">{data}</span>
                </div>
                <div className="pedido-valores">
                  <span className="pedido-pagamento">
                    {pedido.pagamento.metodo}
                    {pedido.pagamento.parcelas > 1
                      ? ` · ${pedido.pagamento.parcelas}x de ${fmt(pedido.total / pedido.pagamento.parcelas)}`
                      : ''}
                  </span>
                  <span className="pedido-total">{fmt(pedido.total)}</span>
                </div>
              </div>

              {/* Status atual em destaque */}
              <div className={`status-badge ${etapa.idx === STATUS_PEDIDO.length - 1 ? 'entregue' : 'andamento'}`}>
                {etapa.icon} {etapa.label}
              </div>

              {/* Tracker de progresso */}
              <StatusTracker pedido={pedido} getEtapa={getEtapa} />

              {/* Itens do pedido */}
              <div className="pedido-itens">
                {pedido.itens.map((item) => (
                  <div key={item.id} className="pedido-item">
                    <span className="pi-emoji">{item.emoji}</span>
                    <span className="pi-nome">{item.nome}</span>
                    <span className="pi-qty">×{item.qty}</span>
                    <span className="pi-valor">{fmt(item.preco * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
