import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMonitoring } from '../hooks/useMonitoring'
import Panel from '../components/ui/Panel'
import Modal from '../components/ui/Modal'
import { Button } from '../components/ui/Controls'
import { EmptyState } from '../components/ui/States'
import DeviceList from '../components/devices/DeviceList'
import DeviceDetail from '../components/devices/DeviceDetail'
import NodeForm from '../components/devices/NodeForm'
import { CONNECTION_LABELS } from '../data/domain'

export default function Devices() {
  const { snapshot, actions } = useMonitoring()
  const { nodes } = snapshot
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState(null) // null | 'detail' | 'create' | 'edit'
  const selected = nodes.find((n) => n.id === selectedId) ?? null

  const close = () => setMode(null)
  const open = (id) => { setSelectedId(id); setMode('detail') }

  const counts = Object.keys(CONNECTION_LABELS).map((k) => [k, nodes.filter((n) => n.connection === k).length])

  const create = async (values) => {
    const res = await actions.createNode(values)
    if (res.ok) close()
    return res
  }
  const update = async (values) => {
    const res = await actions.updateNode(selected.id, values)
    if (res.ok) setMode('detail')
    return res
  }
  const remove = async () => {
    const res = await actions.deleteNode(selected.id)
    if (res.ok) { setSelectedId(null); close() }
  }

  return (
    <div className="space-y-4">
      <Panel
        title="Nós ESP32"
        subtitle="Dispositivos de campo e estado de conexão. O estado de conexão não indica o risco do ponto."
        actions={<Button variant="primary" onClick={() => setMode('create')}><Plus className="h-3.5 w-3.5" aria-hidden="true" />Cadastrar nó</Button>}
      >
        <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-zinc-400">
          {counts.map(([k, c]) => <li key={k}>{CONNECTION_LABELS[k]}: <span className="text-zinc-200">{c}</span></li>)}
        </ul>
        {nodes.length === 0 ? (
          <EmptyState title="Nenhum nó cadastrado" hint="Cadastre o primeiro nó para começar a acompanhar um ponto." />
        ) : (
          <DeviceList nodes={nodes} onSelect={open} />
        )}
      </Panel>

      {mode === 'detail' && selected && (
        <Modal side title="Detalhes do nó" onClose={close}>
          <DeviceDetail node={selected} onEdit={() => setMode('edit')} onDelete={remove} />
        </Modal>
      )}
      {mode === 'create' && (
        <Modal title="Cadastrar nó" onClose={close}>
          <NodeForm onSubmit={create} onCancel={close} />
        </Modal>
      )}
      {mode === 'edit' && selected && (
        <Modal title={`Editar ${selected.id}`} onClose={() => setMode('detail')}>
          <NodeForm node={selected} onSubmit={update} onCancel={() => setMode('detail')} />
        </Modal>
      )}
    </div>
  )
}
