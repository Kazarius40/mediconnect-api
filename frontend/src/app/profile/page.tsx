'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/axios';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<UserProfile>('/auth/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        router.push('/auth/login');
      }
    };

    void fetchProfile();
  }, [router]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      <div className="space-y-2 mb-6">
        <p>
          <strong>ID:</strong> {profile.id}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        {profile.firstName && (
          <p>
            <strong>First Name:</strong> {profile.firstName}
          </p>
        )}
        {profile.lastName && (
          <p>
            <strong>Last Name:</strong> {profile.lastName}
          </p>
        )}
        {profile.phone && (
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
        )}
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(profile.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{' '}
          {new Date(profile.updatedAt).toLocaleString()}
        </p>
      </div>

      <Link href="/profile/edit">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Edit Profile
        </button>
      </Link>
    </div>
  );
}
