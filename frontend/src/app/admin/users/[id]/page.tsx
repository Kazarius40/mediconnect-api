'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/api/axios';
import { User } from '@/interfaces/user/user';

const roles = ['ADMIN', 'PATIENT', 'DOCTOR'] as const;
type Role = (typeof roles)[number];

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newRole, setNewRole] = useState<Role>('ADMIN');

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get<User>(`/auth/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setNewRole(res.data.role as Role);
        setError(null);
      })
      .catch(() => setError('Failed to fetch user'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewRole(e.target.value as Role);
  };

  const handleRoleUpdate = async () => {
    if (!user) return;
    try {
      await api.patch(`/auth/users/${user.id}/role`, { role: newRole });
      setUser({ ...user, role: newRole });
      setMessage('Role updated successfully');
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      setMessage(null);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (deleteInput !== user.email) {
      setDeleteError('Email does not match');
      return;
    }

    try {
      await api.delete(`/auth/users/${user.id}`);
      router.push('/admin/users');
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error || !user)
    return <p className="text-red-600">{error || 'Not found'}</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">User Details</h1>
      <div className="border p-4 rounded shadow-sm space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>First Name:</strong> {user.firstName || '-'}
        </p>
        <p>
          <strong>Last Name:</strong> {user.lastName || '-'}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || '-'}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Created At:</strong>{' '}
          {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
        </p>
        <p>
          <strong>Updated At:</strong>{' '}
          {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}
        </p>

        {user && (
          <div className="mt-6">
            <button
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit User
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="block mb-1 font-semibold" htmlFor="role-select">
          Change Role:
        </label>
        <select
          id="role-select"
          value={newRole}
          onChange={handleRoleChange}
          className="border p-2 rounded w-48"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          disabled={newRole === user?.role}
          onClick={handleRoleUpdate}
          className={`ml-4 px-4 py-2 rounded text-white ${
            newRole === user?.role
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
              To confirm deletion, type the user's email:{' '}
              <strong>{user.email}</strong>
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Enter user email"
              className="border p-2 rounded w-full max-w-sm"
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
