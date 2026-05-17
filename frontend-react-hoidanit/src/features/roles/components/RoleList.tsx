import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Role } from '../types/role.types';
import { useDeleteRole } from '../hooks/useDeleteRole';
import { useUpdateRole } from '../hooks/useUpdateRole';
import { RoleForm } from './RoleForm';

interface Props {
  roles: Role[];
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  customer: 'bg-green-100 text-green-700',
};

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
      <p className="text-center text-gray-400 text-sm py-12">
        No roles yet. Create one above.
      </p>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-100">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {roles.map((role) => (
          <tr key={role.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-3.5 text-sm text-gray-400 tabular-nums">{role.id}</td>
            <td className="px-6 py-3.5 text-sm font-medium text-gray-900">
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
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ROLE_COLORS[role.name] ?? 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {role.name}
                </span>
              )}
            </td>
            <td className="px-6 py-3.5 text-right">
              {editingRole?.id !== role.id && (
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    disabled={isDeleting && deletingId === role.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
