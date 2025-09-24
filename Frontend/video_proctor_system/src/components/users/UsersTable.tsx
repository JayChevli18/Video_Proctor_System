"use client";

import { useState } from "react";
import { User } from "@/types";
import { useDeleteUser, useToggleUserStatus } from "@/hooks/useUsers";
import { Button } from "@/components/ui/Button";
import { UserModal } from "@/components/users/UserModal";
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MoreVertical,
  Shield,
  User as UserIcon,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";

interface UsersTableProps {
  users: User[];
  onUserUpdate: () => void;
  onUserDelete: () => void;
}

export const UsersTable=({
  users,  
  onUserUpdate,
  onUserDelete,
}: UsersTableProps) => {
  console.log("UsersTable - users:", users);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  // const menuRef = useRef<HTMLDivElement>(null);

  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();


  const handleEdit = (user: User) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setShowEditModal(true);
    setActionMenuOpen(null);
  };

  const handleDelete = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        onUserDelete();
      } catch (error) {
        console.error("Delete user error:", error);
        // Error is handled by the mutation
      }
    }
    setActionMenuOpen(null);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: userId,
        isActive: !currentStatus,
      });
      onUserUpdate();
    } catch (error) {
      console.error("Toggle status error:", error);
      // Error is handled by the mutation
    }
    setActionMenuOpen(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-purple-600" />;
      case "interviewer":
        return <UserIcon className="h-4 w-4 text-blue-600" />;
      case "candidate":
        return <GraduationCap className="h-4 w-4 text-green-600" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "interviewer":
        return "bg-blue-100 text-blue-800";
      case "candidate":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No users found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or add a new user.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRoleIcon(user.role)}
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActionMenuOpen(

                          actionMenuOpen === user._id ? null : user._id
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {actionMenuOpen === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[100] border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleEdit(user)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(user._id, user.isActive)
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            disabled={toggleStatusMutation.isPending}
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <UserModal
          user={editingUser}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onUserSaved={() => {
            setShowEditModal(false);
            setEditingUser(null);
            onUserUpdate();
          }}
        />
      )}
    </>
  );
};
