import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { listUsers } from '../../api/admin'
import { useFeedback } from '../../components/ui/Feedback'
import { initials } from '../../utils/format'

export async function loader() {
  return { users: await listUsers() }
}

type UserRow = Awaited<ReturnType<typeof listUsers>>[number]
const EMPTY_FORM = { name: '', email: '', role: 'Camper', st: 'Active', phone: '' }

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>()
  const { notConnected, confirm } = useFeedback()
  const [f, setF] = useState({ q: '', role: 'all', st: 'all' })
  const [form, setForm] = useState<{ mode: 'new' | 'edit'; data: typeof EMPTY_FORM } | null>(null)
  const [viewing, setViewing] = useState<UserRow | null>(null)
  // Filtering already-loaded rows is display-only; the backend will paginate and filter.
  const list = users.filter((u) => (!f.q || `${u.name} ${u.email}`.toLowerCase().includes(f.q.toLowerCase()))
    && (f.role === 'all' || u.role === f.role) && (f.st === 'all' || u.st === f.st))
  const edit = (u: UserRow) => { setViewing(null); setForm({ mode: 'edit', data: { name: u.name, email: u.email, role: u.role, st: u.st, phone: u.phone } }) }

  return (
    <div className="wrap">
      <div className="sec">
        <div><h1 style={{ fontSize: 27 }}>User management</h1><p className="mut" style={{ marginTop: 6 }}>{users.length} accounts · {users.filter((u) => u.st === 'Suspended').length} suspended</p></div>
        <div className="row mla" style={{ marginLeft: 'auto' }}>
          <div className="fld" style={{ flex: '0 0 210px' }}><input className="inp" type="search" placeholder="Name or email" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} /></div>
          <div className="fld" style={{ flex: '0 0 150px' }}>
            <select className="inp" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              <option value="all">All roles</option><option value="Camper">Campers</option><option value="Owner">Owners</option><option value="Administrator">Administrators</option>
            </select>
          </div>
          <div className="fld" style={{ flex: '0 0 150px' }}>
            <select className="inp" value={f.st} onChange={(e) => setF({ ...f, st: e.target.value })}>
              <option value="all">All statuses</option><option value="Active">Active</option><option value="Suspended">Suspended</option>
            </select>
          </div>
          <button className="btn p" onClick={() => setForm({ mode: 'new', data: EMPTY_FORM })}>Create user</button>
        </div>
      </div>
      <div className="tw">
        <table className="tbl">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Registered</th><th>Activity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td><div className="row" style={{ gap: 9 }}><span className="av" style={{ width: 32, height: 32, fontSize: 11, background: u.color }}>{initials(u.name)}</span><span><b>{u.name}</b><div className="mut">{u.phone}</div></span></div></td>
                <td>{u.email}</td>
                <td><span className="bg mu">{u.role}</span></td>
                <td>{u.joined}</td>
                <td>{u.activity}</td>
                <td><span className={u.st === 'Active' ? 'bg ok' : 'bg er'}>{u.st}</span></td>
                <td><div className="ac">
                  <button className="btn s" onClick={() => setViewing(u)}>View</button>
                  <button className="btn s" onClick={() => edit(u)}>Edit</button>
                  <button className="btn s" onClick={() => confirm(u.st === 'Active'
                    ? { title: `Suspend ${u.name}?`, body: 'They will not be able to sign in or send booking requests until reactivated.', ok: 'Suspend', danger: true }
                    : { title: `Activate ${u.name}?`, body: 'The account can sign in again immediately.', ok: 'Activate' })}>{u.st === 'Active' ? 'Suspend' : 'Activate'}</button>
                  <button className="btn d s" onClick={() => confirm({ title: `Delete ${u.name}?`, body: 'The account is permanently removed. Their bookings and reviews stay in the platform record. This cannot be undone.', ok: 'Delete user', danger: true })}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && (
        <div className="card empty"><span className="ic">👤</span><h3>No user matches these filters</h3><button className="btn" onClick={() => setF({ q: '', role: 'all', st: 'all' })}>Clear filters</button></div>
      )}
      <div className="pg">
        <button disabled>←</button><button className="on">1</button><button onClick={notConnected}>2</button><button onClick={notConnected}>→</button>
      </div>

      {form && (
        <div className="ovl"><div className="mod">
          <div className="sec"><h3>{form.mode === 'edit' ? 'Edit user' : 'Create a user'}</h3><button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => setForm(null)}>Close</button></div>
          <div className="col" style={{ gap: 14, marginTop: 14 }}>
            <div className="fld"><span className="lbl">Full name *</span><input className="inp" type="text" value={form.data.name} onChange={(e) => setForm({ ...form, data: { ...form.data, name: e.target.value } })} /></div>
            <div className="fld"><span className="lbl">Email *</span><input className="inp" type="email" value={form.data.email} onChange={(e) => setForm({ ...form, data: { ...form.data, email: e.target.value } })} /></div>
            <div className="row" style={{ gap: 14 }}>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Role *</span>
                <select className="inp" value={form.data.role} onChange={(e) => setForm({ ...form, data: { ...form.data, role: e.target.value } })}>
                  <option value="Camper">Camper</option><option value="Owner">Campsite owner</option><option value="Administrator">Administrator</option>
                </select>
              </div>
              <div className="fld" style={{ flex: 1 }}><span className="lbl">Status</span>
                <select className="inp" value={form.data.st} onChange={(e) => setForm({ ...form, data: { ...form.data, st: e.target.value } })}><option value="Active">Active</option><option value="Suspended">Suspended</option></select>
              </div>
            </div>
            <div className="fld"><span className="lbl">Phone</span><input className="inp" type="tel" value={form.data.phone} onChange={(e) => setForm({ ...form, data: { ...form.data, phone: e.target.value } })} /></div>
            <p className="mut">Role-based access: campers book, owners manage campsites and bookings, administrators manage the platform.</p>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn p" onClick={notConnected}>{form.mode === 'edit' ? 'Save changes' : 'Create user'}</button>
            </div>
          </div>
        </div></div>
      )}

      {viewing && (
        <div className="ovl"><div className="mod">
          <div className="sec"><h3>User details</h3><button className="btn g s mla" style={{ marginLeft: 'auto' }} onClick={() => setViewing(null)}>Close</button></div>
          <div className="row" style={{ gap: 12, marginTop: 8 }}><span className="av" style={{ width: 46, height: 46, fontSize: 15 }}>{initials(viewing.name)}</span><div><b>{viewing.name}</b><div className="mut">{viewing.email}</div></div></div>
          <div className="kv" style={{ marginTop: 16 }}>
            <span className="k">Role</span><span>{viewing.role}</span>
            <span className="k">Status</span><span><span className={viewing.st === 'Active' ? 'bg ok' : 'bg er'}>{viewing.st}</span></span>
            <span className="k">Registered</span><span>{viewing.joined}</span>
            <span className="k">Phone</span><span>{viewing.phone}</span>
            <span className="k">Activity</span><span>{viewing.activity}</span>
            <span className="k">Last seen</span><span>{viewing.seen}</span>
          </div>
          <div className="row" style={{ marginTop: 18, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={() => setViewing(null)}>Close</button>
            <button className="btn p" onClick={() => edit(viewing)}>Edit user</button>
          </div>
        </div></div>
      )}
    </div>
  )
}
