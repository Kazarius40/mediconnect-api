import Link from 'next/link';
import { User } from '@/interfaces/user/user';
import { InfoRow } from '@/components/common/InfoRow';
import { formatDate } from '@/utils/formatDate';

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
        <InfoRow label="Created At" value={formatDate(user.createdAt)} />
        <InfoRow label="Updated At" value={formatDate(user.updatedAt)} />
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

// export function ProfileRow({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | number;
// }) {
//   return (
//     <div className="flex justify-between items-center border-b border-gray-100 py-2">
//       <span className="text-gray-600 font-medium">{label}:</span>
//       <span className="text-gray-900">{value || '-'}</span>
//     </div>
//   );
// }
//
// export function formatDate(value?: string): string {
//   if (!value) return '-';
//   try {
//     return new Date(value).toISOString();
//   } catch {
//     return '-';
//   }
// }
