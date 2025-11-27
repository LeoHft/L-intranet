import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const truncateText = (text, maxLength = 15) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function ByUsersBarStatistiques({ statisticsData }) {
  const [themeColors, setThemeColors] = useState({
    primary: "#570df8",   // Fallback violet
    secondary: "#f000b8", // Fallback rose
    content: "#1f2937",   // Fallback gris
  });

  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const updateColors = () => {
      const getColor = (ref) => ref.current ? getComputedStyle(ref.current).color : null;
      
      const p = getColor(primaryRef);
      const s = getColor(secondaryRef);
      const c = getColor(contentRef);
      
      if (p && s && c) {
        setThemeColors({ primary: p, secondary: s, content: c });
      }
    };

    updateColors();
  }, []);

  const chartData = useMemo(() => {
    if (!statisticsData || statisticsData.length === 0) return [];

    const groupedData = statisticsData.reduce((acc, item) => {
      const userId = item.user_id;
      const userName = item.user_name;

      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          user_name: userName,
          internal_clicks: 0,
          external_clicks: 0,
          total_clicks: 0,
        };
      }
      
      const internal = parseInt(item.internal_url_click) || 0;
      const external = parseInt(item.external_url_click) || 0;

      acc[userId].internal_clicks += internal;
      acc[userId].external_clicks += external;
      acc[userId].total_clicks += internal + external;
      return acc;
    }, {});

    return Object.values(groupedData).sort(
      (a, b) => b.total_clicks - a.total_clicks
    );
  }, [statisticsData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      const userData = chartData.find((item) => item.user_name === label);
      const displayName = userData ? userData.user_name : label;

      return (
        <div className="card bg-base-100 border border-base-300 p-4 shadow-xl z-50">
          <p className="font-bold text-base-content mb-2">{displayName}</p>
          <div className="divider my-0 h-0"></div>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <p
                key={index}
                className="text-sm flex justify-between gap-4 text-base-content"
              >
                <span className="flex items-center gap-2">
                   <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                   ></span>
                   {entry.name}:
                </span>
                <span className="font-mono font-bold">{entry.value}</span>
              </p>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-base-200">
             <p className="font-bold text-base-content text-center">
               {`Total: ${total}`}
             </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="hidden">
        <span ref={primaryRef} className="text-primary"></span>
        <span ref={secondaryRef} className="text-secondary"></span>
        <span ref={contentRef} className="text-base-content"></span>
      </div>

      {statisticsData && statisticsData.length > 0 && (
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-4 sm:p-8">
            <div className="card-title justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                Graphique des accès par utilisateurs
              </h3>
            </div>
            
            <div className="card bg-base-200/50 p-2 sm:p-6 rounded-box">
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      {/* Gradient pour Interne (Primary) */}
                      <linearGradient id="userInternalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.6} />
                      </linearGradient>
                      
                      {/* Gradient pour Externe (Secondary) */}
                      <linearGradient id="userExternalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColors.secondary} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={themeColors.secondary} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        vertical={false}
                        stroke={themeColors.content} 
                        strokeOpacity={0.1} 
                    />

                    <XAxis
                      dataKey="user_name"
                      tickFormatter={(val) => truncateText(val)}
                      tick={{ fontSize: 12, fill: themeColors.content, opacity: 0.7, fontWeight: 500 }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={{ stroke: themeColors.content, opacity: 0.2 }}
                      interval={0} // Force l'affichage de tous les labels
                    />

                    <YAxis
                      tick={{ fontSize: 12, fill: themeColors.content, opacity: 0.7 }}
                      tickLine={false}
                      axisLine={false}
                      label={{
                        value: "Nombre d'accès",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                          fill: themeColors.content,
                          fontWeight: 600,
                          opacity: 0.8
                        },
                      }}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: themeColors.content, opacity: 0.05 }}
                    />

                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: themeColors.content }} className="ml-1 font-medium">{value}</span>
                      )}
                    />

                    <Bar
                      dataKey="internal_clicks"
                      stackId="userClicks"
                      fill="url(#userInternalGradient)"
                      name="Accès internes"
                      radius={[0, 0, 0, 0]}
                    />
                    
                    <Bar
                      dataKey="external_clicks"
                      stackId="userClicks"
                      fill="url(#userExternalGradient)"
                      name="Accès externes"
                      radius={[6, 6, 0, 0]} // Arrondi sur le dessus
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}