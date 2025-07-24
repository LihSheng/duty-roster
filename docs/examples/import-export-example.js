// Example file demonstrating import/export standards

// External/3rd party imports
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// Internal modules
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/dateUtils';

// Sibling or relative imports
import { UserAvatar } from './UserAvatar';
import { UserBadge } from './UserBadge';
import './UserProfile.css';

/**
 * UserProfile component displays user information
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {Function} props.onUpdate - Update handler
 * @returns {JSX.Element} UserProfile component
 */
const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Component logic here
  }, [user]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    onUpdate(user);
  };
  
  return (
    <div className="user-profile">
      <UserAvatar user={user} />
      <UserBadge user={user} />
      <div className="user-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Joined: {formatDate(user.joinDate)}</p>
      </div>
      {currentUser.id === user.id && (
        <Button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    joinDate: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

// Named exports for utility functions
export const isAdmin = (user) => user.role === 'admin';
export const canEditProfile = (currentUser, profileUser) => 
  currentUser.id === profileUser.id || isAdmin(currentUser);

// Constants export
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

// Default export for the main component
export default UserProfile;