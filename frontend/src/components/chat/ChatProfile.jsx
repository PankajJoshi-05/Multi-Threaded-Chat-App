import React, { useState, useRef, useEffect } from 'react';
import {
  Edit2,
  Save,
  X,
  Users,
  Crown,
  UserMinus,
  LogOut,
  Trash2,
  Camera,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import useChatStore from '../../store/chatStore';
import Avatar from '../ui/Avatar';

const ChatProfile = ({ onClose }) => {
  const {
    selectedChat,
    setSelectedChat,
    changeGroupName,
    changeGroupBio,
    changeGroupProfile,
    addMemberstoGroup,
    removeMembersFromGroup,
    getGroupMembers,
    groupMembers,
    fetchAllUsers,
    allUsers,
    leaveGroup,
    deleteChat
  } = useChatStore();

  const { user } = useAuthStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedName, setEditedName] = useState(selectedChat?.name || '');
  const [editedBio, setEditedBio] = useState(selectedChat?.bio || '');
  const [showMemberList, setShowMemberList] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = useState('');
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const isGroupChat = selectedChat?.groupChat;
  const isCreator = isGroupChat && selectedChat?.creator === user._id;
  console.log(selectedChat);
  console.log("creator :", isCreator);
  const members = groupMembers || [];

  useEffect(() => {
    if (selectedChat) {
      setEditedName(selectedChat.name || '');
      setEditedBio(selectedChat.bio || '');
      if (isGroupChat) {
        getGroupMembers(selectedChat._id);
        fetchAllUsers();
      }
    }
  }, [selectedChat, isGroupChat]);

  const handleProfilePictureClick = () => {
    if (isGroupChat && isCreator) {
      fileInputRef.current?.click();
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', selectedChat._id);

      setIsLoading(true);
      try {
        await changeGroupProfile(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) return;
    setIsLoading(true);
    try {
      await changeGroupName(selectedChat._id, editedName.trim());
      setIsEditingName(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBio = async () => {
    setIsLoading(true);
    try {
      await changeGroupBio(selectedChat._id, editedBio.trim());
      setIsEditingBio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (isCreator) {
      setShowTransferModal(true);
    } else {
      const confirmLeave = window.confirm('Are you sure you want to leave this group?');
      if (!confirmLeave) return;

      setIsLoading(true);
      try {
        await leaveGroup(selectedChat._id);
        onClose();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedNewOwner) return;

    setIsLoading(true);
    try {
      await leaveGroup(selectedChat._id,selectedNewOwner);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) return;

    setIsLoading(true);
    try {
      await addMemberstoGroup(selectedChat._id, selectedMembers);
      setSelectedMembers([]);
      setShowAddMembers(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (memberId === user._id) return handleLeaveGroup();

    setIsLoading(true);
    try {
      await removeMembersFromGroup(selectedChat._id, memberId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    const confirmDelete = window.confirm(
      isGroupChat
        ? 'Are you sure you want to delete this group?'
        : 'Are you sure you want to delete this chat?'
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await deleteChat(selectedChat._id);
      setSelectedChat(null);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const availableUsers = allUsers.filter(
    u => !members?.some(member => member._id === u._id)
  );

  const otherMembers = members.filter(member => member._id !== user._id);

  return (
    <div className="absolute inset-0 bg-base-100 z-10 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-base-300">
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold">{isGroupChat ? 'Group Info' : 'Chat Info'}</h2>
        <div className="w-8"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`relative w-24 h-24 rounded-full overflow-hidden ${isGroupChat && isCreator ? 'cursor-pointer hover:opacity-80' : ''
              }`}
            onClick={handleProfilePictureClick}
          > 
            <Avatar src={selectedChat?.profile} alt={selectedChat?.name} size="full" />
            {isGroupChat && isCreator && (
              <div className="absolute bottom-2 right-3 bg-base-100 rounded-full p-1">
                <Camera className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Name Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-secondary mb-1">
            {isGroupChat ? 'Group Name' : 'Name'}
          </label>
          {isEditingName && isGroupChat && isCreator ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="input input-bordered w-full input-sm"
                placeholder="Enter name"
              />
              <button
                onClick={handleSaveName}
                disabled={isLoading}
                className="btn btn-primary btn-sm"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setEditedName(selectedChat?.name || '');
                }}
                className="btn btn-ghost btn-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {selectedChat?.name || 'Unknown'}
              </span>
              {isGroupChat && isCreator && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bio Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary mb-1">
            Bio
          </label>
          {isEditingBio && isGroupChat && isCreator ? (
            <div className="space-y-2">
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="textarea textarea-bordered w-full"
                rows="3"
                placeholder="Enter bio"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  disabled={isLoading}
                  className="btn btn-primary btn-sm"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingBio(false);
                    setEditedBio(selectedChat?.bio || '');
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <p className="text-base-content/80">
                {selectedChat?.bio || 'No bio available'}
              </p>
              {isGroupChat && isCreator && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="btn btn-ghost btn-sm"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Group Members Section */}
        {isGroupChat && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-secondary">
                Members ({members.length})
              </h3>
              <div className="flex gap-2">
                {isCreator && (
                  <button
                    onClick={() => setShowAddMembers(!showAddMembers)}
                    className="btn btn-ghost btn-sm"
                    title="Add members"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowMemberList(!showMemberList)}
                  className="btn btn-ghost btn-sm"
                >
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add Members Section */}
            {showAddMembers && (
              <div className="mb-4 p-3 bg-base-200 rounded-lg">
                <h4 className="font-medium mb-2">Select members to add</h4>
                <div className="max-h-40 overflow-y-auto mb-3">
                  {availableUsers.length > 0 ? (
                    availableUsers.map(user => (
                      <div key={user._id} className="flex items-center gap-2 p-2 hover:bg-base-300 rounded">
                        <input
                          type="checkbox"
                          id={`user-${user._id}`}
                          checked={selectedMembers.includes(user._id)}
                          onChange={() => toggleMemberSelection(user._id)}
                          className="checkbox checkbox-sm"
                        />
                        <label htmlFor={`user-${user._id}`} className="flex items-center gap-2 cursor-pointer">
                          <div className='h-10 w-10 rounded-full overflow-hidden'>
                            <Avatar src={user.profile} alt={user.userName}size="xs" />
                          </div>
                          <span>{user.userName}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-base-content/70">No available users to add</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddMembers(false)}
                    className="btn btn-sm btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMembers}
                    disabled={selectedMembers.length === 0 || isLoading}
                    className="btn btn-sm btn-primary"
                  >
                    Add Selected
                  </button>
                </div>
              </div>
            )}

            {showMemberList && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-2 bg-base-200 rounded">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Avatar src={member.profile} alt={member.userName} size="sm" />
                      </div>
                      <span className="font-medium">{member.userName}</span>
                      {member._id === selectedChat?.creator && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    {isCreator && member._id !== user._id && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={isLoading}
                        className="btn btn-ghost btn-xs text-error"
                        title="Remove member"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isGroupChat ? (
            <>
              {groupMembers?.length > 1 &&(<button
                onClick={handleLeaveGroup}
                disabled={isLoading}
                className="btn btn-warning w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                Leave Group
              </button>)}
              {isCreator && (
                <button
                  onClick={handleDeleteChat}
                  disabled={isLoading}
                  className="btn btn-error w-full gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Group
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleDeleteChat}
              disabled={isLoading}
              className="btn btn-error w-full gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Chat
            </button>
          )}
        </div>
      </div>

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-200 rounded-lg p-6 w-80 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Transfer Group Ownership</h3>
            <p className="text-sm text-base-content/80 mb-4">
              You must transfer ownership before leaving the group. Select a new owner:
            </p>
            <select
              value={selectedNewOwner}
              onChange={(e) => setSelectedNewOwner(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="">Select new owner</option>
              {otherMembers.map((member) => (
                <option key={member._id} value={member._id}>
                   {member.userName}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleTransferOwnership}
                disabled={!selectedNewOwner || isLoading}
                className="btn btn-primary flex-1 gap-2"
              >
                Transfer & Leave
              </button>
              <button
                onClick={() => setShowTransferModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatProfile;