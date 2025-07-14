'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/api/axios';

interface User {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function UserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<User>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<User>(`/auth/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setForm(res.data);
      })
      .catch(() => setError('Failed to fetch user'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allowedFields = ['email', 'firstName', 'lastName', 'phone'];
    const filteredForm = Object.fromEntries(
      Object.entries(form).filter(
        ([key, value]) =>
          allowedFields.includes(key) &&
          typeof value === 'string' &&
          value.trim() !== '',
      ),
    );

    try {
      await api.patch(`/auth/users/${id}`, filteredForm);
      setMessage('User updated successfully');
      setError(null);
      router.push(`/admin/users/${id}`);
    } catch (err: any) {
      console.error('Update failed', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
      setMessage(null);
    }
  };

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Edit User #{user.id}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            className="border p-2 w-full"
            name="email"
            value={form.email || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>First Name</label>
          <input
            className="border p-2 w-full"
            name="firstName"
            value={form.firstName || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            className="border p-2 w-full"
            name="lastName"
            value={form.lastName || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            className="border p-2 w-full"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
