import React, { useMemo, useState, useEffect, useRef } from "react";
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

export default function ByServicesBarStatistiques({ statisticsData }) {
  const [themeColors, setThemeColors] = useState({
    primary: "#570df8",   // Valeur par défaut (violet)
    secondary: "#f000b8", // Valeur par défaut (rose)
    content: "#1f2937",   // Valeur par défaut (gris foncé)
  });

  const primaryRef = useRef(null);
  const secondaryRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const getComputedColor = (ref) => {
      if (ref.current) {
        return getComputedStyle(ref.current).color;
      }
      return null;
    };

    const updateColors = () => {
      const p = getComputedColor(primaryRef);
      const s = getComputedColor(secondaryRef);
      const c = getComputedColor(contentRef);
      
      if (p && s && c) {
        setThemeColors({ primary: p, secondary: s, content: c });
      }
    };

    updateColors();
  }, []);


  const chartData = useMemo(() => {
    if (!statisticsData || statisticsData.length === 0) return [];

    const groupedData = statisticsData.reduce((acc, item) => {
      const serviceId = item.service_id;
      if (!acc[serviceId]) {
        acc[serviceId] = {
          service_id: serviceId,
          service_name: item.service_name,
          internal_clicks: 0,
          external_clicks: 0,
          total_clicks: 0,
        };
      }
      const internal = parseInt(item.internal_url_click) || 0;
      const external = parseInt(item.external_url_click) || 0;
      acc[serviceId].internal_clicks += internal;
      acc[serviceId].external_clicks += external;
      acc[serviceId].total_clicks += internal + external;
      return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => b.total_clicks - a.total_clicks);
  }, [statisticsData]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      const serviceData = chartData.find((item) => item.service_name === label);
      const displayName = serviceData ? serviceData.service_name : label;

      return (
        <div className="card bg-base-100 border border-base-300 shadow-xl p-3 z-50">
          <p className="font-bold text-base-content border-b border-base-200 pb-2 mb-2">
            {displayName}
          </p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <span className="flex items-center gap-2 text-base-content/80">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: entry.color }} 
                  ></span>
                  {entry.name}:
                </span>
                <span className="font-mono font-bold text-base-content">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
          <div className="divider my-1"></div>
          <p className="text-right font-bold text-base-content text-sm">
            Total : {total}
          </p>
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
          <div className="card-body">
            <div className="card-title justify-between mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                Répartition des accès
              </h3>
            </div>
            
            <p className="text-sm text-base-content/60 mb-6">
              Comparaison des clics internes vs externes par service
            </p>

            <div className="card bg-base-100 p-2 sm:p-4 rounded-xl border border-base-200/50">
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="internalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.6} />
                      </linearGradient>
                      
                      <linearGradient id="externalGradient" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="service_name"
                      tickFormatter={(val) => truncateText(val)}
                      tick={{ 
                        fontSize: 12, 
                        fill: themeColors.content, 
                        opacity: 0.7,
                        fontWeight: 500 
                      }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={{ stroke: themeColors.content, opacity: 0.2 }}
                      interval={0}
                    />

                    <YAxis
                      tick={{ 
                        fontSize: 12, 
                        fill: themeColors.content, 
                        opacity: 0.7 
                      }}
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: themeColors.content, opacity: 0.05 }}
                    />

                    <Legend 
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{ color: themeColors.content }} className="font-medium ml-1">
                          {value}
                        </span>
                      )}
                    />

                    <Bar
                      dataKey="internal_clicks"
                      stackId="clicks"
                      fill="url(#internalGradient)"
                      name="Accès internes"
                    />

                    <Bar
                      dataKey="external_clicks"
                      stackId="clicks"
                      fill="url(#externalGradient)"
                      name="Accès externes"
                      radius={[6, 6, 0, 0]}
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