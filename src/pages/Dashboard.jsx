import { useMonitoring } from '../hooks/useMonitoring'
import { pickFocusNode } from '../services/analysis'
import MetricStrip from '../components/dashboard/MetricStrip'
import WaterLevelPanel from '../components/dashboard/WaterLevelPanel'
import AlertsPanel from '../components/dashboard/AlertsPanel'
import NetworkStatus from '../components/dashboard/NetworkStatus'

export default function Dashboard() {
  const { snapshot } = useMonitoring()
  const { nodes, readings, now, integrity, alerts } = snapshot
  const focus = pickFocusNode(nodes)

  return (
    <div className="space-y-4 sm:space-y-6">
      <MetricStrip focus={focus} integrity={integrity} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <WaterLevelPanel nodes={nodes} readings={readings} now={now} defaultNodeId={focus?.id ?? nodes[0]?.id} />
        </div>
        <div className="lg:col-span-4">
          <AlertsPanel alerts={alerts.active} nodes={nodes} />
        </div>
      </div>
      <NetworkStatus nodes={nodes} />
    </div>
  )
}
