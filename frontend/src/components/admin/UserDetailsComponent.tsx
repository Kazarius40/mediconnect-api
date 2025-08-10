'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '@/interfaces/user/user';
import { InfoRow } from '../common/InfoRow';
import { formatDate } from '@/utils/formatDate';

const roles = ['ADMIN', 'PATIENT', 'DOCTOR'] as const;
type Role = (typeof roles)[number];

export default function UserDetailsComponent({
  user: initialUser,
}: {
  user: User;
}) {
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
      const res = await fetch(`/api/users/${user.id}/role`, {
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
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
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
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">User Details</h1>

      <div className="border p-4 rounded shadow-sm space-y-2 bg-white">
        <InfoRow label="ID" value={user.id} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow
          label="Name"
          value={`${user.firstName || '-'} ${user.lastName || '-'}`}
        />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Role" value={user.role} />
        <InfoRow label="Created At" value={formatDate(user.createdAt)} />
        <InfoRow label="Updated At" value={formatDate(user.updatedAt)} />
      </div>

      {/* === Role update === */}
      <div className="mt-6">
        <label className="block mb-1 font-semibold">Change Role:</label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as Role)}
          className="border p-2 rounded w-48"
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
          className={`ml-4 px-4 py-2 rounded text-white ${
            newRole === user.role
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Update Role
        </button>

        {message && (
          <p className="mt-2 text-green-600 font-medium">{message}</p>
        )}
        {error && <p className="mt-2 text-red-600 font-medium">{error}</p>}
      </div>

      {/* === Danger Zone === */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>

        {!confirmingDelete ? (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete User
          </button>
        ) : (
          <div className="space-y-4">
            <p>
              To confirm deletion, type: <strong>{user.email}</strong>
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="border p-2 rounded w-full max-w-sm"
              placeholder="Enter user email"
            />
            <div className="space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => {
                  setConfirmingDelete(false);
                  setDeleteInput('');
                  setDeleteError(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
            {deleteError && <p className="text-red-600">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
