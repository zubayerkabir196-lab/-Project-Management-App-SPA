import { Link } from "@inertiajs/react";

export default function Pagination({ Links }) {
    const base = "inline-block px-3 py-2 rounded-lg text-xs mx-0.5 ";

    return (
        <nav className="text-center mt-4">
            {Links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={
                            base +
                            (link.active
                                ? "bg-gray-950 text-gray-200"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-950")
                        }
                    >
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className={base + "text-gray-400"}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </nav>
    );
}