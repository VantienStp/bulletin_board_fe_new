import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ post, variant = "small" }) {
    const isLarge = variant === "large";

    return (
        <div
            className={`
                bg-white rounded-xl shadow p-4 m-2 overflow-hidden 
                transition-all duration-300 transform
                hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md
                ${isLarge ? "grid grid-cols-1 md:grid-cols-3 gap-6" : ""}
            `}
        >
            <Link href={`/blog/${post.slug}`}>
                <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={350}
                    className={`
                        w-full object-cover rounded-xl
                        ${isLarge ? "h-[260px]" : "h-[200px]"}
                    `}
                />
            </Link>

            <div className="p-4">
                {!isLarge && post.category && (
                    <span className="text-xs text-yellow-600 font-medium">
                        {post.category}
                    </span>
                )}

                <h4 className="font-semibold text-lg mt-1 line-clamp-2">
                    {post.title}
                </h4>

                {isLarge && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {post.desc}
                    </p>
                )}

                <div className="flex items-center gap-2 text-gray-500 text-xs mt-3">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.read}</span>
                </div>
            </div>
        </div>
    );
}
