import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const truncateServiceName = (name, maxLength = 20) => {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

const THEME_CLASSES = [
  "text-primary",
  "text-secondary",
  "text-accent",
  "text-neutral",
  "text-info",
  "text-success",
  "text-warning",
  "text-error"
];

export default function ByServicesStackAreaStatistiques({ statisticsData }) {
  const [visibleServices, setVisibleServices] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const [palette, setPalette] = useState([]); 
  const [axisColor, setAxisColor] = useState("#666666"); // Fallback
  
  const paletteRefs = useRef([]);
  const axisRef = useRef(null);

  useEffect(() => {
    const updateColors = () => {
      const newPalette = paletteRefs.current.map(ref => {
        if (ref) return getComputedStyle(ref).color;
        return "#8884d8"; // Fallback si ref manquante
      });
      setPalette(newPalette);

      if (axisRef.current) {
        setAxisColor(getComputedStyle(axisRef.current).color);
      }
    };

    updateColors();
  }, []);

  const { chartData, serviceNames, serviceStats } = useMemo(() => {
    if (!statisticsData || statisticsData.length === 0) {
      return { chartData: [], serviceNames: [], serviceStats: [] };
    }

    const datesSet = new Set(statisticsData.map((item) => item.click_date));
    const dates = Array.from(datesSet).sort();
    const dateServiceClicks = {};
    const serviceClickTotals = {};

    statisticsData.forEach((item) => {
      const date = item.click_date;
      const service = item.service_name;
      const total = (parseInt(item.internal_url_click) || 0) + (parseInt(item.external_url_click) || 0);

      if (!dateServiceClicks[date]) dateServiceClicks[date] = {};
      if (!dateServiceClicks[date][service]) dateServiceClicks[date][service] = 0;
      if (!serviceClickTotals[service]) serviceClickTotals[service] = 0;

      dateServiceClicks[date][service] += total;
      serviceClickTotals[service] += total;
    });

    const serviceStats = Object.entries(serviceClickTotals)
      .map(([service, total]) => ({ service, total }))
      .sort((a, b) => b.total - a.total);
    const serviceNames = serviceStats.map((stat) => stat.service);
    const chartData = dates.map((date) => {
      const entry = { date };
      serviceNames.forEach((service) => {
        entry[service] = dateServiceClicks[date][service] || 0;
      });
      return entry;
    });

    return { chartData, serviceNames, serviceStats };
  }, [statisticsData]);

  useEffect(() => {
    if (serviceNames.length > 0) {
      const topServices = serviceNames.slice(0, Math.min(10, serviceNames.length));
      setVisibleServices(new Set(topServices));
    }
  }, [serviceNames]);

  // Générer les objets couleurs pour le graphique à partir de la palette récupérée
  const colors = useMemo(() => {
    if (palette.length === 0) return [];
    
    // On mappe chaque service à une couleur de la palette
    return serviceNames.map((_, index) => {
        const color = palette[index % palette.length];
        return {
            stroke: color,
            fill: color, // On utilisera des dégradés basés sur cette couleur
            name: serviceNames[index]
        };
    });
  }, [palette, serviceNames]);

  const filteredChartData = useMemo(() => {
    if (showAll) return chartData;
    return chartData.map((entry) => {
      const filteredEntry = { date: entry.date };
      visibleServices.forEach((service) => {
        filteredEntry[service] = entry[service] || 0;
      });
      return filteredEntry;
    });
  }, [chartData, visibleServices, showAll]);

  const displayedServices = showAll
    ? serviceNames
    : serviceNames.filter((service) => visibleServices.has(service));

  const toggleService = (service) => {
    const newVisibleServices = new Set(visibleServices);
    if (newVisibleServices.has(service)) {
      newVisibleServices.delete(service);
    } else {
      newVisibleServices.add(service);
    }
    setVisibleServices(newVisibleServices);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      const total = sortedPayload.reduce((sum, entry) => sum + entry.value, 0);

      return (
        <div className="card bg-base-100 border border-base-300 p-4 shadow-xl z-50">
          <p className="font-bold text-base-content mb-2">{`Date : ${label}`}</p>
          <div className="divider my-0 h-0"></div>
          <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
            {sortedPayload.filter((entry) => entry.value > 0).map((entry, index) => (
              <p key={index} className="text-sm flex justify-between items-center gap-4 text-base-content">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="truncate max-w-[150px]" title={entry.name}>
                    {truncateServiceName(entry.name, 20)}
                  </span>
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

  const CustomLegend = ({ payload }) => {
    if (!payload || payload.length === 0) return null;
    return (
      <div className="mt-8 flex flex-col items-center">
        <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
          {payload.map((entry) => {
            const isVisible = visibleServices.has(entry.value) || showAll;
            return (
              <button
                key={entry.value}
                onClick={() => toggleService(entry.value)}
                className={`btn btn-xs sm:btn-sm gap-2 transition-all duration-200 ${
                  isVisible
                    ? "btn-outline border-opacity-40"
                    : "btn-ghost opacity-40 grayscale"
                }`}
                style={isVisible ? { borderColor: entry.color, color: axisColor } : { color: axisColor }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span>{truncateServiceName(entry.value, 15)}</span>
              </button>
            );
          })}
        </div>
        
        {serviceNames.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button onClick={() => setShowAll(!showAll)} className="btn btn-primary btn-sm btn-outline">
              {showAll ? "Vue simplifiée" : "Voir tous les services"}
            </button>
            {!showAll && (
              <button onClick={() => setVisibleServices(new Set(serviceNames.slice(0, 10)))} className="btn btn-ghost btn-sm">
                Reset Top 10
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
        {/* --- ELEMENTS INVISIBLES POUR L'EXTRACTION DES COULEURS --- */}
        <div className="hidden">
            {THEME_CLASSES.map((cls, index) => (
                <span 
                    key={cls} 
                    ref={el => paletteRefs.current[index] = el} 
                    className={cls}
                ></span>
            ))}
            <span ref={axisRef} className="text-base-content"></span>
        </div>

      {statisticsData && statisticsData.length > 0 && (
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-base-content">
                  Accès par services
                </h3>
                <p className="text-sm text-base-content/60 mt-1">
                  Répartition temporelle des accès
                </p>
              </div>
            </div>

            <div className="w-full h-[500px] select-none">
              <ResponsiveContainer>
                <AreaChart
                  data={filteredChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Génération des dégradés avec les vraies couleurs RGB récupérées */}
                    {colors.map((colorObj, index) => (
                      <linearGradient key={`grad-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colorObj.stroke} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={colorObj.stroke} stopOpacity={0.05} />
                      </linearGradient>
                    ))}
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={axisColor}
                    strokeOpacity={0.1}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fill: axisColor, fontSize: 12, opacity: 0.6 }}
                    tickLine={false}
                    axisLine={{ stroke: axisColor, opacity: 0.2 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    tick={{ fill: axisColor, fontSize: 12, opacity: 0.6 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: axisColor, strokeOpacity: 0.2 }} />
                  
                  <Legend content={<CustomLegend />} />

                  {displayedServices.slice().reverse().map((service, idx) => {
                    const originalIndex = serviceNames.indexOf(service);
                    // On récupère l'objet couleur correspondant
                    const colorObj = colors[originalIndex % colors.length] || { stroke: '#000' };

                    return (
                      <Area
                        key={service}
                        type="monotone"
                        dataKey={service}
                        stroke={colorObj.stroke}
                        // On référence l'ID unique du dégradé
                        fill={`url(#color-${originalIndex % colors.length})`}
                        strokeWidth={2}
                        stackId="1"
                        activeDot={{ 
                            r: 6, 
                            strokeWidth: 0, 
                            fill: colorObj.stroke,
                            className: "animate-pulse" 
                        }}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}