import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoadingState() {
  return <div style={{ width: '100%', textAlign: 'center', padding: '48px 16px', color: 'var(--text)' }}>Loading...</div>
}

export function RequireAuth({ children }) {
  const { loading, user } = useAuth()

  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { loading, isAdmin } = useAuth()

  if (loading) return <LoadingState />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
