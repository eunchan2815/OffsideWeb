import { Outlet, Link, useLocation } from "react-router-dom";

export const Rootlayout = () => {
  const { pathname } = useLocation();

  const tabs = [
    { name: "팀 순위", path: "/" },
    { name: "득점왕/선수 기록", path: "/many-goal" },
    { name: "경기 일정", path: "/matchday" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="text-xl italic font-semibold">Offside</div>
        <div className="flex space-x-4 text-sm text-gray-600">
          <button className="hover:text-black">실시간 기록</button>
          <button className="hover:text-black">순위</button>
          <button className="hover:text-black">일정</button>
        </div>
      </header>

      <div className="w-full border-b border-gray-200">
        <div className="max-w-[600px] mx-auto flex justify-between">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (pathname === "/" && tab.path === "/");
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`px-8 py-3 text-sm ${
                  isActive
                    ? "text-black font-semibold border-b-2 border-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
