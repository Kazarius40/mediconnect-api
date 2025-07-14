'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<User[]>('/auth/users');
        setUsers(res.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setError('Access denied');
          router.push('/');
        } else {
          setError('Failed to load users');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
  }, [router]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

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
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-blue-100 cursor-pointer transition-colors duration-200"
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
