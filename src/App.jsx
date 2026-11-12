import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import ToastProvider from './context/ToastProvider'
import MonitoringProvider from './context/MonitoringProvider'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Monitoring from './pages/Monitoring'
import History from './pages/History'
import Devices from './pages/Devices'
import Alerts from './pages/Alerts'

// HashRouter evita configurar rewrites no deploy (funciona em qualquer hospedagem estática).
export default function App() {
  return (
    <ToastProvider>
      <MonitoringProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="mapa" element={<Monitoring />} />
              <Route path="historico" element={<History />} />
              <Route path="nos" element={<Devices />} />
              <Route path="alertas" element={<Alerts />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </MonitoringProvider>
    </ToastProvider>
  )
}
