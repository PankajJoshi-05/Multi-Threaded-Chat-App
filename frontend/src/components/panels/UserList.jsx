import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Avatar from "../ui/Avatar";
import { useUserStore } from "../../store/userStore";

const UserList = () => {
  const [searchText, setSearchText] = useState("");
  const { isNewUsersLoading, newUsers, fetchNewUsers,sendFriendRequest} = useUserStore();

  useEffect(() => {
    fetchNewUsers();
  }, [fetchNewUsers]);

  // Loading state
  if (isNewUsersLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-base-100 text-base-content">
        <p>Loading...</p>
      </div>
    );
  }

  // Filtered users based on search input
  const filteredUsers = (newUsers || []).filter((user) =>
    user.userName?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full h-full p-4 bg-base-100 text-base-content flex flex-col">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-secondary" />
        Search New Friends
      </h2>

      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full pr-10"
        />
        <Search className="absolute right-3 top-3 w-5 h-5 text-secondary" />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-secondary">No users found.</p>
        ) : (
          <div className="space-y-3 pr-1">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-xl bg-base-200 hover:bg-base-300 transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">

                  <Avatar src={user.profile} alt={user.userName} />
                  </div>
                  <span className="font-medium">{user.userName}</span>
                </div>

                <button
                  onClick={() => {sendFriendRequest(user._id);
                  }}
                  className="btn btn-sm btn-primary btn-circle disabled:opacity-50"
                  title="Send Friend Request"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;