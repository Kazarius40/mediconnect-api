'use client';

import { useRouter } from 'next/navigation';
import { User } from '@/interfaces/user';

import './style.css';

export default function Table({ users }: { users: User[] }) {
  const router = useRouter();

  if (!users || users.length === 0) {
    return <div className="no-users">No users found</div>;
  }

  return (
    <div className="table-container">
      <h1 className="title">All Users</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} onClick={() => router.push(`/admin/users/${u.id}`)}>
              <td>{u.id}</td>
              <td className="email">{u.email}</td>
              <td>{`${u.firstName || ''} ${u.lastName || ''}`}</td>
              <td>{u.phone || '-'}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
