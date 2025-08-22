import Link from 'next/link';
import { InfoRow } from '@/components/common/info-row';
import { EntityDates } from '@/components/common/entity-dates';
import { User } from '@/interfaces/user';

import './style.css';

export default function Details({ user }: { user: User | null }) {
  if (!user) return <div className="centered-message">Not logged in</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 User Profile</h1>

      <div className="profile-card">
        <InfoRow label="ID" value={user.id} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Role" value={user.role} />
        <InfoRow label="Last Name" value={user.lastName} />
        <InfoRow label="First Name" value={user.firstName} />
        <InfoRow label="Phone" value={user.phone} />

        <EntityDates createdAt={user.createdAt} updatedAt={user.updatedAt} />
      </div>

      <div className="profile-actions">
        <Link href="/profile/edit">
          <button className="edit-button">✏️ Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}
