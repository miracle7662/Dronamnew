import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/common/context/AuthContext'

import App from './App'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <BrowserRouter basename={''}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
  )
}
