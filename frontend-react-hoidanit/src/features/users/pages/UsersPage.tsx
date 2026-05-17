import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useCreateUser } from '../hooks/useCreateUser';
import { UserList } from '../components/UserList';
import { UserForm } from '../components/UserForm';

export const UsersPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: users, isLoading, isError } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage system users ({users?.length ?? 0} total)
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={15} />
          New user
        </button>
      </div>

      {showCreateForm && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Create user</h2>
          <UserForm
            isLoading={isCreating}
            onCancel={() => setShowCreateForm(false)}
            onSubmit={(values) =>
              createUser(
                {
                  ...values,
                  password: values.password ?? '',
                },
                { onSuccess: () => setShowCreateForm(false) },
              )
            }
          />
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
      )}

      {isError && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. Please try again.
        </div>
      )}

      {!isLoading && !isError && <UserList users={users ?? []} />}
    </div>
  );
};
