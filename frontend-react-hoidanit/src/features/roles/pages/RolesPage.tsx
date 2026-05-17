import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { useCreateRole } from '../hooks/useCreateRole';
import { RoleList } from '../components/RoleList';
import { RoleForm } from '../components/RoleForm';

export const RolesPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: roles, isLoading, isError } = useRoles();
  const { mutate: createRole, isPending: isCreating } = useCreateRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Failed to load roles. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Roles</h1>
            <p className="text-sm text-gray-500">{roles?.length ?? 0} roles total</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={15} />
          New role
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Create new role</h2>
          <RoleForm
            isLoading={isCreating}
            onCancel={() => setShowCreateForm(false)}
            onSubmit={(values) =>
              createRole(values, { onSuccess: () => setShowCreateForm(false) })
            }
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <RoleList roles={roles ?? []} />
      </div>
    </div>
  );
};
