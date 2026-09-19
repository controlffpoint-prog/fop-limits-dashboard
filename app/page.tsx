"use client";

import React, { useState, useMemo } from "react";
import { 
  LayoutDashboard, Users, Calendar, Receipt, Database, 
  Settings, Search, ArrowUpRight 
} from "lucide-react";

// Лимит 2-й группы ФОП
const ANNUAL_LIMIT = 6672000;

// Данные из вашей Google Таблицы
const initialFops = [
  { id: 1, name: "ФОП ЛІТВІНОВА ЛІЛІЯ ВІКТОРІВНА", inn: "2848013968", banks: ["ПУМБ", "УКРГАЗ", "НОВАПЕЙ"], turnover: 3564302, status: "active" },
  { id: 2, name: "ФОП Гоц Георгій Олександрович", inn: "3665109659", banks: ["НОВАПЕЙ", "ПРИВАТ"], turnover: 5930814, status: "pause", statusDate: "01.07" },
  { id: 3, name: "ФОП Постольний Євгеній Віталійович", inn: "3565711577", banks: ["НОВАПЕЙ", "УКРСІБ"], turnover: 6105651, status: "active" },
  { id: 4, name: "ФОП Левченко Анастасія Миколаївна", inn: "3506907965", banks: ["НОВАПЕЙ", "МОНО"], turnover: 4479652, status: "active" },
  { id: 5, name: "ФОП Литвинова Вікторія Вікторівна", inn: "3489120192", banks: ["НОВАПЕЙ"], turnover: 6418076, status: "pause", statusDate: "15.08" },
  { id: 6, name: "ФОП РУДЕНКО АРТЕМ АНДРІЙОВИЧ", inn: "3391029384", banks: ["НОВАПЕЙ"], turnover: 6732079, status: "active" },
  { id: 7, name: "ФОП ЛЕВЧЕНКО ЄВГЕНІЙ ОЛЕКСАНДРОВИЧ", inn: "3291039481", banks: ["НОВАПЕЙ", "МОНО"], turnover: 5796898, status: "active" },
  { id: 8, name: "ФОП КЛАДОВ", inn: "3102938475", banks: ["НОВАПЕЙ"], turnover: 4980542, status: "active" },
  { id: 9, name: "ФОП МІЩЕНКО", inn: "3491029381", banks: ["НОВАПЕЙ"], turnover: 6322823, status: "active" },
  { id: 10, name: "ФОП МИРОНЕНКО", inn: "3201928374", banks: ["НОВАПЕЙ"], turnover: 4315638, status: "active" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const processedFops = useMemo(() => {
    return initialFops.map((fop) => {
      const percentage = Math.min(100, Number(((fop.turnover / ANNUAL_LIMIT) * 100).toFixed(1)));
      const remaining = ANNUAL_LIMIT - fop.turnover;

      let riskCategory: "critical" | "high" | "watch" | "safe" = "safe";
      let statusLabel = "Запас";
      let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      let barClass = "bg-emerald-500";

      if (percentage >= 90) {
        riskCategory = "critical";
        statusLabel = "критично";
        badgeClass = "bg-red-50 text-red-600 border-red-200";
        barClass = "bg-red-500";
      } else if (percentage >= 80) {
        riskCategory = "high";
        statusLabel = "высокий риск";
        badgeClass = "bg-orange-50 text-orange-600 border-orange-200";
        barClass = "bg-orange-500";
      } else if (percentage >= 70) {
        riskCategory = "watch";
        statusLabel = "следить";
        badgeClass = "bg-amber-50 text-amber-600 border-amber-200";
        barClass = "bg-amber-400";
      }

      return { ...fop, percentage, remaining, riskCategory, statusLabel, badgeClass, barClass };
    });
  }, []);

  const totalTurnover = useMemo(() => processedFops.reduce((acc, item) => acc + item.turnover, 0), [processedFops]);
  const totalFreeSpace = processedFops.length * ANNUAL_LIMIT - totalTurnover;
  const criticalCount = processedFops.filter((f) => f.riskCategory === "critical").length;
  const highRiskCount = processedFops.filter((f) => f.riskCategory === "high").length;
  const watchCount = processedFops.filter((f) => f.riskCategory === "watch").length;
  const safeCount = processedFops.filter((f) => f.riskCategory === "safe").length;

  const filteredFops = processedFops.filter((fop) => {
    const matchesSearch = fop.name.toLowerCase().includes(searchQuery.toLowerCase()) || fop.inn.includes(searchQuery);
    if (activeTab === "critical") return matchesSearch && fop.riskCategory === "critical";
    if (activeTab === "high") return matchesSearch && fop.riskCategory === "high";
    if (activeTab === "watch") return matchesSearch && fop.riskCategory === "watch";
    if (activeTab === "safe") return matchesSearch && fop.riskCategory === "safe";
    return matchesSearch;
  });

  const formatMoney = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(".", ",") + " млн";
    return new Intl.NumberFormat("ru-RU").format(val) + " ₴";
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      {/* Боковое меню */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">F</div>
            <span className="font-bold text-lg text-slate-900">FOP Limits</span>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-blue-600"><LayoutDashboard className="w-4 h-4" /> Дашборд</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"><Users className="w-4 h-4" /> ФОПы</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"><Calendar className="w-4 h-4" /> Планировщик</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"><Receipt className="w-4 h-4" /> Налоги</a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"><Database className="w-4 h-4" /> Импорт</a>
          </nav>
        </div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50"><Settings className="w-4 h-4" /> Настройки</a>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
            <p className="text-xs text-slate-400 mt-1">Доход 2026 • Лимит 2 группы: 6,67 млн ₴</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
          </div>
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-400 mb-1">В красной зоне</div>
            <div className="text-3xl font-bold text-red-500">{criticalCount}</div>
            <div className="text-[11px] text-slate-400 mt-2">риск: {highRiskCount}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-400 mb-1">Доход сети</div>
            <div className="text-3xl font-bold text-slate-900">{formatMoney(totalTurnover)}</div>
            <div className="text-[11px] text-emerald-600 mt-2 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> Сумма всех ФОП</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-400 mb-1">Свободный запас</div>
            <div className="text-3xl font-bold text-slate-900">{formatMoney(totalFreeSpace)}</div>
            <div className="text-[11px] text-slate-400 mt-2">остаток лимитов</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-400 mb-1">Всего ФОП</div>
            <div className="text-3xl font-bold text-slate-900">{processedFops.length}</div>
            <div className="text-[11px] text-slate-400 mt-2">активных</div>
          </div>
        </div>

        {/* Список ФОП */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Лимиты по ФОП</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600 w-full md:w-auto overflow-x-auto">
              <button onClick={() => setActiveTab("all")} className={`px-3 py-1.5 rounded-md ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : ""}`}>Все {processedFops.length}</button>
              <button onClick={() => setActiveTab("critical")} className={`px-3 py-1.5 rounded-md ${activeTab === "critical" ? "bg-white text-slate-900 shadow-sm" : ""}`}>Критично {criticalCount}</button>
              <button onClick={() => setActiveTab("high")} className={`px-3 py-1.5 rounded-md ${activeTab === "high" ? "bg-white text-slate-900 shadow-sm" : ""}`}>Высокий риск {highRiskCount}</button>
              <button onClick={() => setActiveTab("watch")} className={`px-3 py-1.5 rounded-md ${activeTab === "watch" ? "bg-white text-slate-900 shadow-sm" : ""}`}>Следить {watchCount}</button>
              <button onClick={() => setActiveTab("safe")} className={`px-3 py-1.5 rounded-md ${activeTab === "safe" ? "bg-white text-slate-900 shadow-sm" : ""}`}>Запас {safeCount}</button>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Поиск ФОП или ИНН..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFops.map((fop) => (
              <div key={fop.id} className="p-4 rounded-xl border border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-1/3">
                  <div className="font-semibold text-sm text-slate-900">{fop.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>ИНН {fop.inn}</span>
                    <span>•</span>
                    <span>{fop.banks.join(", ")}</span>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="relative w-full h-7 bg-slate-100 rounded-lg overflow-hidden flex items-center px-3 justify-between">
                    <div className={`absolute left-0 top-0 bottom-0 ${fop.barClass} transition-all duration-500 rounded-lg`} style={{ width: `${fop.percentage}%` }} />
                    <span className="relative z-10 text-[11px] font-medium text-slate-700">
                      остаток {new Intl.NumberFormat("ru-RU").format(fop.remaining)} ₴
                      {fop.status === "pause" && ` • пауза с ${fop.statusDate}`}
                    </span>
                    <span className="relative z-10 text-xs font-bold text-slate-800">{fop.percentage}%</span>
                  </div>
                </div>

                <div className="flex justify-end w-full md:w-auto">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${fop.badgeClass}`}>{fop.statusLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
