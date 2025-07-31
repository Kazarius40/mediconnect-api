'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/interfaces/user/user';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function AdminUsersPageClient() {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchUsers() {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          setError(errorText);
          setUsers(null);
          return;
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (e) {
        console.error('Failed to load users', e);
        setError('Failed to load users');
        setUsers(null);
      } finally {
        setFetching(false);
      }
    }

    void fetchUsers();
  }, [user, accessToken]);

  if (!user) {
    return (
      <div className="p-4 text-red-500">Access denied. Please log in.</div>
    );
  }

  if (fetching) return <div className="p-4">Loading users...</div>;

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  if (!users || users.length === 0) {
    return <div className="p-4">No users found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-blue-100 cursor-pointer transition-colors duration-200"
            >
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {u.email}
                </Link>
              </td>
              <td className="border p-2">{`${u.firstName || ''} ${u.lastName || ''}`}</td>
              <td className="border p-2">{u.phone || '-'}</td>
              <td className="border p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
