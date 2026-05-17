import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Role } from '../types/role.types';
import { useDeleteRole } from '../hooks/useDeleteRole';
import { useUpdateRole } from '../hooks/useUpdateRole';
import { RoleForm } from './RoleForm';

interface Props {
  roles: Role[];
}

export const RoleList = ({ roles }: Props) => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const handleDelete = (id: number) => {
    if (!window.confirm('Delete this role?')) return;
    setDeletingId(id);
    deleteRole(id, { onSettled: () => setDeletingId(null) });
  };

  if (roles.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">No roles yet. Create one above.</p>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="px-6 py-4 text-sm text-gray-400">{role.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {editingRole?.id === role.id ? (
                  <RoleForm
                    defaultValues={editingRole}
                    isLoading={isUpdating}
                    onCancel={() => setEditingRole(null)}
                    onSubmit={(values) =>
                      updateRole(
                        { id: role.id, payload: values },
                        { onSuccess: () => setEditingRole(null) },
                      )
                    }
                  />
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {role.name}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {editingRole?.id !== role.id && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      disabled={isDeleting && deletingId === role.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
