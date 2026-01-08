import Link from "next/link";
import { usePathname } from "next/navigation";

function formatSegment(seg) {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build từng path đầy đủ cho từng breadcrumb
  const buildHref = (idx) => {
    return "/" + segments.slice(0, idx + 2).join("/");
  };

  return (
    <div className="sticky top-0 z-40">
      <div className="w-full flex justify-between items-center">

        {/* LEFT: Breadcrumb & Greeting */}
        <div className="flex items-center gap-2 text-2xl font-semibold">
          {segments.length === 1 && segments[0] === "admin" ? (
            <div className="flex flex-col">
              <span className="text-gray-900 flex items-center gap-2">
                Chào buổi sáng, CloudFinz! 👋
              </span>
              <p className="text-xs font-normal text-gray-500 italic">
                Sẵn sàng để đưa các dự án vươn xa chưa nào?
              </p>
            </div>
          ) : (
            /* Nếu không phải trang chủ admin, thì hiển thị Breadcrumb như cũ */
            segments.slice(1).map((seg, idx) => {
              const isLast = idx === segments.length - 2;
              return (
                <div key={idx} className="flex items-center gap-2">
                  {!isLast ? (
                    <Link
                      href={buildHref(idx)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {formatSegment(seg)}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-semibold">
                      {formatSegment(seg)}
                    </span>
                  )}
                  {!isLast && <span className="text-gray-400">›</span>}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5 ml-auto">
          <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
            <i className="fa-regular fa-envelope text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
            <i className="fa-regular fa-bell text-gray-600" />
          </button>

          <div className="flex items-center gap-3 bg-green-500 text-black px-3 py-1.5 rounded-full">
            <img
              src="/avatar1.png"
              className="w-9 h-9 rounded-full object-cover border"
              alt="Avatar"
            />
            <div className="hidden sm:block">
              <p className="text-[14px] font-semibold">CloudFinz</p>
              <p className="text-[11px] text-white">cloudfinz@gmail.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
