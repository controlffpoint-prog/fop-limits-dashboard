"use client";

import React, { useState } from "react";

const ANNUAL_LIMIT = 6672000;

const initialFops = [
  { id: 1, name: "ФОП ЛІТВІНОВА ЛІЛІЯ ВІКТОРІВНА", inn: "2848013968", turnover: 3564302 },
  { id: 2, name: "ФОП Гоц Георгій Олександрович", inn: "3665109659", turnover: 5930814 },
  { id: 3, name: "ФОП Постольний Євгеній Віталійович", inn: "3565711577", turnover: 6105651 },
  { id: 4, name: "ФОП Левченко Анастасія Миколаївна", inn: "3506907965", turnover: 4479652 },
  { id: 5, name: "ФОП Литвинова Вікторія Вікторівна", inn: "3489120192", turnover: 6418076 },
  { id: 6, name: "ФОП РУДЕНКО АРТЕМ АНДРІЙОВИЧ", inn: "3391029384", turnover: 6732079 },
  { id: 7, name: "ФОП ЛЕВЧЕНКО ЄВГЕНІЙ ОЛЕКСАНДРОВИЧ", inn: "3291039481", turnover: 5796898 },
  { id: 8, name: "ФОП КЛАДОВ", inn: "3102938475", turnover: 4980542 },
  { id: 9, name: "ФОП МІЩЕНКО", inn: "3491029381", turnover: 6322823 },
  { id: 10, name: "ФОП МИРОНЕНКО", inn: "3201928374", turnover: 4315638 },
];

export default function Page() {
  const [search, setSearch] = useState("");

  const totalTurnover = initialFops.reduce((a, b) => a + b.turnover, 0);
  const totalFree = initialFops.length * ANNUAL_LIMIT - totalTurnover;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "30px", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#1e293b" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Шапка */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Дашборд лимитов ФОП</h1>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>2-я группа (Лимит 6,67 млн ₴ на ФОП)</p>
          </div>
          <div style={{ background: "#e2e8f0", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
            🟢 Live Sync
          </div>
        </div>

        {/* Метрики */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Общий доход сети</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a", marginTop: "5px" }}>
              {(totalTurnover / 1000000).toFixed(1)} млн ₴
            </div>
          </div>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Свободный запас</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#16a34a", marginTop: "5px" }}>
              {(totalFree / 1000000).toFixed(1)} млн ₴
            </div>
          </div>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ color: "#64748b", fontSize: "12px" }}>Всего ФОП</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a", marginTop: "5px" }}>
              {initialFops.length}
            </div>
          </div>
        </div>

        {/* Поиск и список */}
        <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <input
            type="text"
            placeholder="Поиск по имени или ИНН..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "20px", outline: "none" }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {initialFops
              .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.inn.includes(search))
              .map((fop) => {
                const pct = Math.min(100, Number(((fop.turnover / ANNUAL_LIMIT) * 100).toFixed(1)));
                const remaining = ANNUAL_LIMIT - fop.turnover;
                let color = "#16a34a"; // зеленый
                let label = "Запас";

                if (pct >= 90) { color = "#dc2626"; label = "Критично"; }
                else if (pct >= 80) { color = "#ea580c"; label = "Высокий риск"; }
                else if (pct >= 70) { color = "#d97706"; label = "Следить"; }

                return (
                  <div key={fop.id} style={{ padding: "15px", borderRadius: "8px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
                    <div style={{ width: "35%" }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>{fop.name}</div>
                      <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "3px" }}>ИНН: {fop.inn}</div>
                    </div>

                    {/* Прогресс бар */}
                    <div style={{ width: "45%", background: "#f1f5f9", height: "24px", borderRadius: "6px", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", padding: "0 10px" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, backgroundColor: color, opacity: 0.25 }} />
                      <span style={{ fontSize: "11px", fontWeight: "bold", zIndex: 1 }}>
                        остаток: {new Intl.NumberFormat("ru-RU").format(remaining)} ₴
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: "bold", marginLeft: "auto", zIndex: 1 }}>
                        {pct}%
                      </span>
                    </div>

                    <div style={{ width: "15%", textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px", backgroundColor: `${color}20`, color: color }}>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
}
