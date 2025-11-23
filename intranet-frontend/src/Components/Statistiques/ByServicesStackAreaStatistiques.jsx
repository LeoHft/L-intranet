import React, { useState, useEffect, useMemo } from "react";
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

const generateColors = (count) => {
  const colors = [];

  const baseColors = [
    { stroke: "#ec4899", fill: "#f472b6" }, // Rose
    { stroke: "#9c3df6", fill: "#ac71e3" }, // Violet
    { stroke: "#e879f9", fill: "#f0abfc" }, // Rose-violet clair
    { stroke: "#a855f7", fill: "#c084fc" }, // Violet moyen
    { stroke: "#db2777", fill: "#f9a8d4" }, // Rose profond
    { stroke: "#7c3aed", fill: "#a78bfa" }, // Violet profond
    { stroke: "#be185d", fill: "#f8bbd9" }, // Rose sombre
    { stroke: "#6d28d9", fill: "#c4b5fd" }, // Violet sombre
    { stroke: "#fb7185", fill: "#fda4af" }, // Rose pastel
    { stroke: "#d946ef", fill: "#e879f9" }, // Magenta
  ];

  for (let i = 0; i < count; i++) {
    if (i < baseColors.length) {
      // Utiliser les couleurs de base d'abord
      colors.push(baseColors[i]);
    } else {
      // Générer des variations pour les services supplémentaires
      const baseIndex = i % baseColors.length;
      const variation = Math.floor(i / baseColors.length);

      // Créer des variations en ajustant la teinte dans la gamme rose-violet (300-330°)
      const baseHue = 300 + baseIndex * 6; // Étaler sur 60° (300-360°)
      const hueVariation = (variation * 15) % 60;
      const finalHue = (baseHue + hueVariation) % 360;

      // Varier légèrement la saturation et la luminosité
      const saturation = Math.max(60, 85 - variation * 8);
      const lightness = Math.max(50, 70 - variation * 5);
      const strokeLightness = Math.max(40, lightness - 15);

      const stroke = `hsl(${finalHue}, ${saturation}%, ${strokeLightness}%)`;
      const fill = `hsl(${finalHue}, ${Math.max(
        50,
        saturation - 10
      )}%, ${lightness}%)`;

      colors.push({ stroke, fill });
    }
  }

  return colors;
};

// Fonction pour tronquer les noms longs > 20 caractères
const truncateServiceName = (name, maxLength = 20) => {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
};

export default function ByServicesStackAreaStatistiques({ statisticsData }) {
  const [visibleServices, setVisibleServices] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  // Générer un tableau [{ date, [serviceName1]: total_clicks, [serviceName2]: total_clicks, ... }]
  const { chartData, serviceNames, serviceStats } = useMemo(() => {
    if (!statisticsData || statisticsData.length === 0) {
      return { chartData: [], serviceNames: [], serviceStats: [] };
    }

    // Obtenir toutes les dates uniques triées
    const datesSet = new Set(statisticsData.map((item) => item.click_date));
    const dates = Array.from(datesSet).sort();

    const dateServiceClicks = {};
    const serviceClickTotals = {};

    statisticsData.forEach((item) => {
      const date = item.click_date;
      const service = item.service_name;
      const internal = parseInt(item.internal_url_click) || 0;
      const external = parseInt(item.external_url_click) || 0;
      const total = internal + external;

      if (!dateServiceClicks[date]) dateServiceClicks[date] = {};
      if (!dateServiceClicks[date][service])
        dateServiceClicks[date][service] = 0;
      if (!serviceClickTotals[service]) serviceClickTotals[service] = 0;

      dateServiceClicks[date][service] += total;
      serviceClickTotals[service] += total;
    });

    // Trier les services par nombre total de clics (décroissant)
    const serviceStats = Object.entries(serviceClickTotals)
      .map(([service, total]) => ({ service, total }))
      .sort((a, b) => b.total - a.total);

    const serviceNames = serviceStats.map((stat) => stat.service);

    // Générer le tableau final pour recharts
    const chartData = dates.map((date) => {
      const entry = { date };
      serviceNames.forEach((service) => {
        entry[service] = dateServiceClicks[date][service] || 0;
      });
      return entry;
    });

    return { chartData, serviceNames, serviceStats };
  }, [statisticsData]);

  // Initialiser les services visibles (top 10 par défaut)
  useEffect(() => {
    if (serviceNames.length > 0) {
      const topServices = serviceNames.slice(
        0,
        Math.min(10, serviceNames.length)
      );
      setVisibleServices(new Set(topServices));
    }
  }, [serviceNames]);

  // Générer les couleurs dynamiquement
  const colors = useMemo(
    () => generateColors(serviceNames.length),
    [serviceNames.length]
  );

  // Filtrer les données du graphique selon les services visibles
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

  // Services à afficher dans le graphique
  const displayedServices = showAll
    ? serviceNames
    : serviceNames.filter((service) => visibleServices.has(service));

  // Gestionnaire pour basculer la visibilité d'un service
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
      // Trier les services par valeur décroissante dans le tooltip
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      const total = sortedPayload.reduce((sum, entry) => sum + entry.value, 0);

      return (
        <div className="card bg-base-200/80 p-4 shadow-xl">
          <p className="font-semibold text-base-content mb-3">
            {`Date : ${label}`}
          </p>
          <div className="divider my-0"></div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {sortedPayload
              .filter((entry) => entry.value > 0)
              .map((entry, index) => (
                <p
                  key={index}
                  className="text-sm flex justify-between items-center"
                >
                  <span className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="truncate" title={entry.name}>
                      {truncateServiceName(entry.name, 15)}
                    </span>
                  </span>
                  <span className="font-medium ml-2 flex-shrink-0">
                    {entry.value}
                  </span>
                </p>
              ))}
          </div>
          {total > 0 && (
            <div>
              <div className="divider my-2"></div>
              <p className="font-semibold text-base-content text-center">
                {`Total: ${total} accès`}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="mt-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {payload.map((entry, index) => (
            <button
              key={entry.value}
              onClick={() => toggleService(entry.value)}
              className={`btn btn-sm gap-2 ${
                visibleServices.has(entry.value) || showAll
                  ? "btn-active btn-ghost"
                  : "btn-ghost btn-outline opacity-50 hover:opacity-100"
              }`}
              title={entry.value}
            >
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="truncate max-w-32">
                {truncateServiceName(entry.value, 15)}
              </span>
              <span className="badge badge-sm">
                {serviceStats.find((s) => s.service === entry.value)?.total ||
                  0}
              </span>
            </button>
          ))}
        </div>

        {serviceNames.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-primary btn-sm"
            >
              {showAll
                ? "Masquer certains services"
                : `Afficher tous les ${serviceNames.length} services`}
            </button>
            {!showAll && (
              <button
                onClick={() =>
                  setVisibleServices(new Set(serviceNames.slice(0, 10)))
                }
                className="btn btn-secondary btn-sm"
              >
                Top 10
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {statisticsData && statisticsData.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="card-title justify-between mb-6">
              <div>
                <h3 className="text-2xl">
                  Evolution des accès par services au cours du temps
                </h3>
                <p className="text-sm text-base-content/70 mt-1">
                  {serviceNames.length} service
                  {serviceNames.length > 1 ? "s" : ""} •
                  {showAll
                    ? " Tous affichés"
                    : ` ${visibleServices.size} affiché${
                        visibleServices.size > 1 ? "s" : ""
                      }`}
                </p>
              </div>
            </div>

            <div className="card bg-base-200 p-6">
              <div style={{ width: "100%", height: "500px" }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={filteredChartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      opacity={0.7}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#1f2937", fontWeight: 500 }}
                      tickLine={{ stroke: "rgba(0,0,0,0.2)" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={{ stroke: "rgba(0,0,0,0.2)" }}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                      tickLine={{ stroke: "rgba(0,0,0,0.2)" }}
                      axisLine={{ stroke: "rgba(0,0,0,0.2)" }}
                      label={{
                        value: "Nombre d'accès",
                        angle: -90,
                        position: "insideLeft",
                        style: {
                          textAnchor: "middle",
                          fill: "#1f2937",
                          fontWeight: 600,
                        },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      content={<CustomLegend />}
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                    {displayedServices
                      .slice()
                      .reverse()
                      .map((service, idx) => {
                        const colorIndex = serviceNames.indexOf(service);
                        return (
                          <Area
                            key={service}
                            type="monotone"
                            dataKey={service}
                            stroke={colors[colorIndex]?.stroke || "#8884d8"}
                            fillOpacity={0.7}
                            fill={colors[colorIndex]?.fill || "#8884d8"}
                            name={service}
                            stackId="1"
                            strokeWidth={2}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                        );
                      })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
