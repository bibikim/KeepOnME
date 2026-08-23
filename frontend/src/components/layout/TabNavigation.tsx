export type Tab = "dashboard" | "mate";

interface TabNavigationProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  mateConnected: boolean;
}

export function TabNavigation({
  activeTab,
  onChange,
  mateConnected,
}: TabNavigationProps) {
  return (
    <div className="flex justify-center px-6 pt-6">
      <div className="inline-flex gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange("dashboard")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          🧑 내 대시보드
        </button>
        <button
          type="button"
          onClick={() => onChange("mate")}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "mate"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          🕵️ 메이트 {mateConnected ? "" : " (미연결)"}
        </button>
      </div>
    </div>
  );
}
