import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import TasksTable from './TasksTable';

export default function Index({ auth, tasks, success, queryParams = null }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Tasks
                    </h2>
                    <Link
                        href={route('task.create')}
                        className="whitespace-nowrap rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
                    >
                        Add New
                    </Link>
                </div>
            }
        >
            <Head title="Tasks" />
            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-4 text-gray-900 dark:text-gray-100 sm:p-6">
                            <TasksTable
                                tasks={tasks}
                                queryParams={queryParams}
                                success={success}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}