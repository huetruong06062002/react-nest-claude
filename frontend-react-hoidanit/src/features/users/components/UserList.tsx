import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { User } from '../types/user.types';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { UserForm } from './UserForm';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  banned: 'bg-red-100 text-red-700',
};

interface Props {
  users: User[];
}

export const UserList = ({ users }: Props) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    setDeletingId(id);
    deleteUser(id, { onSettled: () => setDeletingId(null) });
  };

  if (users.length === 0) {
    return <p className="text-center text-gray-400 py-8">No users yet. Create one above.</p>;
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-14">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm text-gray-400">{user.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {editingUser?.id === user.id ? (
                  <div className="py-2">
                    <UserForm
                      defaultValues={editingUser}
                      isLoading={isUpdating}
                      onCancel={() => setEditingUser(null)}
                      onSubmit={(values) =>
                        updateUser(
                          {
                            id: user.id,
                            payload: {
                              ...values,
                              password: values.password || undefined,
                            },
                          },
                          { onSuccess: () => setEditingUser(null) },
                        )
                      }
                    />
                  </div>
                ) : (
                  user.name
                )}
              </td>
              {editingUser?.id !== user.id && (
                <>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[user.status] ?? ''}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.role ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role.name}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting && deletingId === user.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
