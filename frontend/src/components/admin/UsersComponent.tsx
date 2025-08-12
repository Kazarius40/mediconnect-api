'use client';

import React from 'react';
import { User } from '@/interfaces/user/user';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface Props {
  users: User[];
}

export default function UsersComponent({ users }: Props) {
  const { user: currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <p>Access denied</p>;
  }

  const router = useRouter();

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
              onClick={() => router.push(`/admin/users/${u.id}`)}
            >
              <td className="border p-2">{u.id}</td>
              <td className="border p-2 text-blue-600 hover:underline">
                {u.email}
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
