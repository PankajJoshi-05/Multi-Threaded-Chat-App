import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import Avatar from "../ui/Avatar"; 
const API_URL = "http://localhost:3000/api/v1/user";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState({}); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/search-user`, {
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const sendRequest = async (userId) => {
    try {
      setRequesting((prev) => ({ ...prev, [userId]: true }));
      await axios.put(`${API_URL}/send-request`, { receiverId: userId }, { withCredentials: true });

      alert("Request sent!");
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("Failed to send request.");
    } finally {
      setRequesting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Search New Friend</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <Avatar src={user.avatar} alt={user.userName} />
                <span className="text-gray-800 font-medium">{user.userName}</span>
              </div>

              <button
                onClick={() => sendRequest(user._id)}
                disabled={requesting[user._id]}
                className="text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
                title="Send Friend Request"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
