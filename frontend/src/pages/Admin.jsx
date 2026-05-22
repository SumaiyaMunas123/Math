import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const { profile, refreshProfile } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    if (!supabase) {
      setError('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.')
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error: loadError } = await supabase
      .from('profiles')
      .select('id, full_name, email, contact_number, role, content_access, created_at')
      .order('created_at', { ascending: false })

    if (loadError) {
      setError(loadError.message)
      setUsers([])
    } else {
      setError('')
      setUsers(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleAccess = async (user) => {
    if (!supabase) return

    setBusyId(user.id)
    const nextValue = !user.content_access
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ content_access: nextValue })
      .eq('id', user.id)

    setBusyId('')

    if (updateError) {
      alert(updateError.message)
      return
    }

    setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, content_access: nextValue } : entry)))
    await refreshProfile()
  }

  return (
    <div className="auth-shell" style={{ alignItems: 'flex-start' }}>
      <div className="auth-card" style={{ width: 'min(100%, 1000px)' }}>
        <h1>Admin Users</h1>
        <p>Only admin accounts can open this page. Use it to manually unlock recordings after payment.</p>

        {profile && (
          <p style={{ marginTop: 12, marginBottom: 20 }}>
            Signed in as <strong>{profile.full_name || profile.email}</strong>
          </p>
        )}

        {loading && <p>Loading users...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Content Access</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name || '-'}</td>
                    <td>{user.email}</td>
                    <td>{user.contact_number || '-'}</td>
                    <td>{user.role}</td>
                    <td>{user.content_access ? 'Unlocked' : 'Locked'}</td>
                    <td>
                      <button type="button" onClick={() => toggleAccess(user)} disabled={busyId === user.id}>
                        {busyId === user.id ? 'Saving...' : user.content_access ? 'Lock Access' : 'Unlock Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
