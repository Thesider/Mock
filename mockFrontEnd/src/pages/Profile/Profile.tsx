
import React from 'react';
import './Profile.css';


const userProfile = {
  avatar: 'https://i.pravatar.cc/150?img=3',
  name: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  bio: 'Bác sĩ chuyên khoa nội tổng quát. Đam mê công nghệ và sức khỏe cộng đồng.'
};

const Profile: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="profile-avatar-section">
        <img className="profile-avatar" src={userProfile.avatar} alt="Avatar" />
      </div>
      <div className="profile-info-section">
        <h2 className="profile-name">{userProfile.name}</h2>
        <p className="profile-email">{userProfile.email}</p>
        <p className="profile-bio">{userProfile.bio}</p>
      </div>
    </div>
  );
};


export default Profile;
