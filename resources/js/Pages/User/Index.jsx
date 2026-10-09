import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '../../Components/Pagination';
import TextInput from '@/Components/TextInput';
import TableHeading from '@/Components/TableHeading';

export default function Index({ auth, users, queryParams = null, success }) {
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('user.index'), queryParams);
    };

    const deleteUser = (user) => {
        if (!window.confirm('Are You Sure You Want To Delete The User!?')) {
            return;
        }
        router.delete(route('user.destroy', user.id));
    };

    const onKeyDown = (name, e) => {
        if (e.key === 'Enter') {
            searchFieldChanged(name, e.target.value);
        }
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('user.index'), queryParams);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Users
                    </h2>
                    <Link
                        href={route('user.create')}
                        className="whitespace-nowrap rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
                    >
                        Add New
                    </Link>
                </div>
            }
        >
            <Head title="Users" />
            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {success && (
                        <div className="mb-4 rounded bg-emerald-500 px-4 py-2 text-white">
                            {success}
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
                            {/* Filters: stacked on mobile, side by side on larger screens */}
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name || ''}
                                    placeholder="User Name"
                                    onBlur={(e) =>
                                        searchFieldChanged('name', e.target.value)
                                    }
                                    onKeyDown={(e) => onKeyDown('name', e)}
                                />
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.email || ''}
                                    placeholder="User Email"
                                    onBlur={(e) =>
                                        searchFieldChanged('email', e.target.value)
                                    }
                                    onKeyDown={(e) => onKeyDown('email', e)}
                                />
                            </div>

                            <div className="overflow-auto">
                                <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                                    <thead className="border-b-2 border-gray-500 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                        <tr className="text-nowrap">
                                            <TableHeading
                                                name="id"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                ID
                                            </TableHeading>
                                            <TableHeading
                                                name="name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                NAME
                                            </TableHeading>
                                            <TableHeading
                                                name="email"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                EMAIL
                                            </TableHeading>
                                            <TableHeading
                                                name="created_at"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                CREATE_DATE
                                            </TableHeading>
                                            <th className="px-3 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <td className="px-3 py-2">{user.id}</td>
                                                <td className="whitespace-nowrap px-3 py-2 text-gray-900 dark:text-white">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-2">
                                                    {user.email}
                                                </td>
                                                <td className="text-nowrap px-3 py-2">
                                                    {user.created_at}
                                                </td>
                                                <td className="text-nowrap px-3 py-2">
                                                    <Link
                                                        href={route('user.edit', user.id)}
                                                        className="mx-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteUser(user)}
                                                        className="mx-1 font-medium text-red-600 hover:underline dark:text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination Links={users.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}