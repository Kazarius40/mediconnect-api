'use client';

import './style.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InfoRow } from '../../common/InfoRow';
import { EntityDates } from '@/components/common/EntityDates';
import { User } from '@/interfaces/user';

const roles = ['ADMIN', 'PATIENT', 'DOCTOR'] as const;
type Role = (typeof roles)[number];

export default function Details({ user: initialUser }: { user: User }) {
  const router = useRouter();

  const [user, setUser] = useState(initialUser);
  const [newRole, setNewRole] = useState<Role>(initialUser.role as Role);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleRoleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message);
        setMessage(null);
        return;
      }
      setUser({ ...user, role: newRole });
      setMessage('Role updated successfully');
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setMessage(null);
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== user.email) {
      setDeleteError('Email does not match');
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const { message } = await res.json();
        setDeleteError(message);
        return;
      }
      router.push('/admin/users');
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.message);
    }
  };

  return (
    <div className="details-wrapper">
      <h1 className="details-title">User Details</h1>

      <div className="details-card">
        <InfoRow label="ID" value={user.id} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow
          label="Name"
          value={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '-'}
        />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Role" value={user.role} />

        <EntityDates createdAt={user.createdAt} updatedAt={user.updatedAt} />
      </div>

      <div className="role-section">
        <label className="role-label">Change Role:</label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as Role)}
          className="role-select"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          disabled={newRole === user.role}
          onClick={handleRoleUpdate}
          className="btn btn-update"
        >
          Update Role
        </button>

        {message && <p className="message-success">{message}</p>}
        {error && <p className="message-error">{error}</p>}
      </div>

      <div className="danger-zone">
        <h2 className="danger-title">Danger Zone</h2>

        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="btn btn-danger"
          >
            Delete User
          </button>
        ) : (
          <div className="delete-confirm">
            <p>
              To confirm deletion, type: <strong>{user.email}</strong>
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="delete-input"
              placeholder="Enter user email"
            />
            <div className="delete-actions">
              <button onClick={handleDelete} className="btn btn-danger">
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteInput('');
                  setDeleteError(null);
                }}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
            {deleteError && <p className="delete-error">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
