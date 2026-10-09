import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Pagination from '../../Components/Pagination';
import {
    PROJECT_STATUS_CLASS_MAP,
    PROJECT_STATUS_TEXT_MAP,
} from '@/constants.jsx';
import TextInput from '@/Components/TextInput';
import TableHeading from '@/Components/TableHeading';
import SelectInput from '@/Components/SelectInput';

export default function Index({ auth, projects, queryParams = null, success }) {
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('project.index'), queryParams);
    };

    const deleteProject = (project) => {
        if (!window.confirm('Are You Sure You Want To Delete The Project!?')) {
            return;
        }
        router.delete(route('project.destroy', project.id));
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
        router.get(route('project.index'), queryParams);
    };

    // If the image is missing (404), hide it instead of showing broken alt text
    const hideBrokenImage = (e) => {
        e.currentTarget.style.visibility = 'hidden';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Projects
                    </h2>
                    <Link
                        href={route('project.create')}
                        className="whitespace-nowrap rounded bg-emerald-500 px-3 py-1 text-white shadow transition-all hover:bg-emerald-600"
                    >
                        Add New
                    </Link>
                </div>
            }
        >
            <Head title="Projects" />
            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    {success && (
                        <div className="mb-4 rounded bg-emerald-500 px-4 py-2 text-white">
                            {success}
                        </div>
                    )}

                    {/* No overflow-hidden here, so nothing gets cut off */}
                    <div className="bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-3 text-gray-900 dark:text-gray-100 sm:p-6">
                            {/* Filters: stacked on mobile, side by side on larger screens */}
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name || ''}
                                    placeholder="Project Name"
                                    onBlur={(e) =>
                                        searchFieldChanged('name', e.target.value)
                                    }
                                    onKeyDown={(e) => onKeyDown('name', e)}
                                />
                                <SelectInput
                                    className="w-full"
                                    defaultValue={queryParams.status || ''}
                                    onChange={(e) =>
                                        searchFieldChanged('status', e.target.value)
                                    }
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </div>

                            {/* ========== MOBILE: cards (hidden on md and up) ========== */}
                            <div className="space-y-3 md:hidden">
                                {projects.data.length === 0 && (
                                    <p className="py-6 text-center text-gray-500 dark:text-gray-400">
                                        No projects found.
                                    </p>
                                )}
                                {projects.data.map((project) => (
                                    <div
                                        key={project.id}
                                        className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="flex gap-3">
                                            <img
                                                src={project.image_path}
                                                alt={project.name}
                                                onError={hideBrokenImage}
                                                className="h-16 w-20 flex-shrink-0 rounded bg-gray-200 object-cover dark:bg-gray-700"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={route('project.show', project.id)}
                                                    className="block break-words font-semibold text-gray-900 hover:underline dark:text-white"
                                                >
                                                    {project.name}
                                                </Link>
                                                <span
                                                    className={`mt-1 inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs text-white ${
                                                        PROJECT_STATUS_CLASS_MAP[project.status]
                                                    }`}
                                                >
                                                    {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                #{project.id}
                                            </span>
                                        </div>

                                        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            <dt>Created</dt>
                                            <dd className="text-right text-gray-900 dark:text-gray-200">
                                                {project.created_at}
                                            </dd>
                                            <dt>Due</dt>
                                            <dd className="text-right text-gray-900 dark:text-gray-200">
                                                {project.due_date}
                                            </dd>
                                            <dt>Created by</dt>
                                            <dd className="text-right text-gray-900 dark:text-gray-200">
                                                {project.createdBy.name}
                                            </dd>
                                        </dl>

                                        <div className="mt-3 flex justify-end gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                            <Link
                                                href={route('project.edit', project.id)}
                                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteProject(project)}
                                                className="font-medium text-red-600 hover:underline dark:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ========== DESKTOP: table (hidden below md) ========== */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full table-auto text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
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
                                            <th className="px-3 py-3">Image</th>
                                            <TableHeading
                                                name="name"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                NAME
                                            </TableHeading>
                                            <TableHeading
                                                name="status"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                STATUS
                                            </TableHeading>
                                            <TableHeading
                                                name="created_at"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                CREATE_DATE
                                            </TableHeading>
                                            <TableHeading
                                                name="due_date"
                                                sort_field={queryParams.sort_field}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                DUE_DATE
                                            </TableHeading>
                                            <th className="px-3 py-3">Created By</th>
                                            <th className="px-3 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <td className="px-3 py-2">{project.id}</td>
                                                <td className="px-3 py-2">
                                                    <img
                                                        src={project.image_path}
                                                        alt={project.name}
                                                        onError={hideBrokenImage}
                                                        className="h-12 w-16 max-w-none rounded bg-gray-200 object-cover dark:bg-gray-700"
                                                    />
                                                </td>
                                                {/* Name can wrap onto several lines, so the table stays narrow */}
                                                <td className="min-w-[10rem] px-3 py-2 text-gray-900 hover:underline dark:text-white">
                                                    <Link href={route('project.show', project.id)}>
                                                        {project.name}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span
                                                        className={`whitespace-nowrap rounded px-2 py-1 text-white ${
                                                            PROJECT_STATUS_CLASS_MAP[project.status]
                                                        }`}
                                                    >
                                                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                    </span>
                                                </td>
                                                <td className="text-nowrap px-3 py-2">
                                                    {project.created_at}
                                                </td>
                                                <td className="text-nowrap px-3 py-2">
                                                    {project.due_date}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {project.createdBy.name}
                                                </td>
                                                <td className="text-nowrap px-3 py-2 text-right">
                                                    <Link
                                                        href={route('project.edit', project.id)}
                                                        className="mx-1 font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProject(project)}
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

                            <Pagination Links={projects.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}