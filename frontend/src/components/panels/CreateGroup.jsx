import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import useChatStore from "../../store/chatListStore";

const API_URL = "http://localhost:3000/api/v1/chats";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchChats } = useChatStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-all-users`, {
          withCredentials: true,
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

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
      alert("Please select at least 1 users to create a group.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/create-group`,
        {
          name: groupName,
          members: selectedUsers,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.groupData) {
        console.log("Group Created:", response.data.groupData);
        await fetchChats();
        setGroupName("");
        setSelectedUsers([]);
        alert("Group created successfully!");
      }
    } catch (error) {
      console.error("Error creating group:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create New Group</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Members</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2">
              {users.map((user) => {
                const selected = selectedUsers.includes(user._id);
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleUser(user._id)}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition ${
                      selected ? "bg-blue-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-gray-800">{user.userName}</span>
                    {selected && <Check className="text-blue-600 w-5 h-5" />}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
