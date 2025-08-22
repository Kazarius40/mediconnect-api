import Link from 'next/link';
import { InfoRow } from '@/components/common/InfoRow';
import { EntityDates } from '@/components/common/EntityDates';
import { User } from '@/interfaces/user';

export default function ProfileComponent({ user }: { user: User | null }) {
  if (!user) return <div>Not logged in</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        👤 User Profile
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4 border border-gray-200">
        <InfoRow label="ID" value={user.id} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Role" value={user.role} />
        <InfoRow label="Last Name" value={user.lastName} />
        <InfoRow label="First Name" value={user.firstName} />
        <InfoRow label="Phone" value={user.phone} />

        <EntityDates createdAt={user.createdAt} updatedAt={user.updatedAt} />
      </div>

      <div className="mt-6 text-center">
        <Link href="/profile/edit">
          <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-md transition duration-300">
            ✏️ Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
