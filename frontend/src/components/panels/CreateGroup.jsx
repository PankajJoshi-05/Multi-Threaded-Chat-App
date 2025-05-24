import React, { useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import Avatar from "../ui/Avatar";
import useChatStore from "../../store/chatStore";
import { toast } from "react-hot-toast";
const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    allUsers,
    fetchAllUsers,
    createGroup,
    isGroupCreating,
    isAllUsersLoading,
  } = useChatStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUsers.length < 1) {
      toast.error("Please select at least 1 user to create a group.");
      return;
    }

    const result = await createGroup({
      name: groupName,
      members: selectedUsers,
    });

    if (result.success) {
      setGroupName("");
      setSelectedUsers([]);
      toast.success("Group created successfully!");
    } else {
      toast.success(result.message || "Failed to create group.");
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredUsers);
  return (
    <div className="w-full h-screen bg-base-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full bg-base-100 shadow-xl rounded-2xl flex flex-col p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-base-content">
          Create New Group
        </h2>

        <div className="mb-3">
          <label className="text-sm font-medium text-base-content mb-1 block">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-base-content" />
          <input
            type="text"
            className="input input-sm input-bordered flex-1"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-1 space-y-3 pr-1">
          {isAllUsersLoading?(
            <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
            </div>
          ):filteredUsers.length === 0 ? (
            <p className="text-center text-secondary">No users found.</p>
          ) : (
            filteredUsers.map((user) => {
              const selected = selectedUsers.includes(user._id);
              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors shadow-sm ${
                    selected
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 hover:bg-base-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 border-2 overflow-hidden rounded-full">
                      <Avatar src={user.profile} alt={user.userName} />
                    </div>
                    <span className="font-medium">{user.userName}</span>
                  </div>
                  {selected && (
                    <Check className="w-5 h-5 text-primary-content" />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isGroupCreating}
            className="btn btn-primary w-full"
          >
            {isGroupCreating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
