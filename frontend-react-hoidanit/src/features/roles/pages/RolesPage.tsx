import { useState } from 'react';
import { Plus } from 'lucide-react';
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
      <div className="flex items-center justify-center py-16 text-gray-400">
        Loading…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
        Failed to load roles. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage user roles ({roles?.length ?? 0} total)
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={15} />
          New role
        </button>
      </div>

      {showCreateForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Create role</h2>
          <RoleForm
            isLoading={isCreating}
            onCancel={() => setShowCreateForm(false)}
            onSubmit={(values) =>
              createRole(values, { onSuccess: () => setShowCreateForm(false) })
            }
          />
        </div>
      )}

      <RoleList roles={roles ?? []} />
    </div>
  );
};
