import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../api/authService';
import './Profile.css';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // in a real app you might fetch extra info here
    setUser(username ?? getCurrentUser());
  }, [username]);

  if (!user) return <p>Loading profile…</p>;

  return (
    <div className="profile-page">
      <h2>Profile: {user}</h2>
      <div className="profile-avatar-large">
        {user.charAt(0).toUpperCase()}
      </div>
      <p>Username: {user}</p>
      {/* you can add more user info here */}
    </div>
  );
}