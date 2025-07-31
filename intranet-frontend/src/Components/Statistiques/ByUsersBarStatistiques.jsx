import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function ByUsersBarStatistiques({ statisticsData }) {



    // Préparer les données pour le graphique Recharts
    const chartData = useMemo(() => {
        if (!statisticsData || statisticsData.length === 0) return [];

        // Grouper les données par user_id et sommer les clics
        const groupedData = statisticsData.reduce((acc, item) => {
            const userId = item.user_id;
            const userName = item.user_name;
            
            if (!acc[userId]) {
                acc[userId] = {
                    user_id: userId,
                    user_name: userName,
                    internal_clicks: 0,
                    external_clicks: 0,
                    total_clicks: 0
                };
            }
            acc[userId].internal_clicks += parseInt(item.internal_url_click) || 0;
            acc[userId].external_clicks += parseInt(item.external_url_click) || 0;
            acc[userId].total_clicks += (parseInt(item.internal_url_click) || 0) + (parseInt(item.external_url_click) || 0);
            return acc;
        }, {});

        // Convertir en array et trier par user_name
        return Object.values(groupedData).sort((a, b) => a.total_clicks + b.total_clicks);
    }, [statisticsData]);

    
    // Fonction personnalisée pour le tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum, entry) => sum + entry.value, 0);
            // Trouver le nom d'utilisateur correspondant
            const userData = chartData.find(item => item.user_name === label);
            const displayName = userData ? userData.user_name : label;
            
            return (
                <div className="bg-white/10 backdrop-blur-xl p-4 border border-white/20 rounded-2xl shadow-2xl ring-1 ring-white/10">
                    <p className="font-semibold text-gray-800 mb-2">{`${displayName}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className='text-sm mb-1' style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value} accès`}
                        </p>
                    ))}
                    <div className='border-t border-white/20 pt-2 mt-2'>
                        <p className="font-medium text-gray-700">
                            {`Total: ${total} accès`}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

  return (
    <>
        {/* Affichage du graphique */}
        {statisticsData && statisticsData.length > 0 && (
                /* Carte principale */
                <div className="relative overflow-hidden">
                    {/* Grand background */}
                    <div className="absolute inset-0 rounded-3xl">
                        <div className="h-full w-full rounded-3xl bg-white/30 backdrop-blur-xl"></div>
                    </div>
                    {/* Contenu principal */}
                    <div className="relative z-10 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-medium">
                                Graphique des accès par utilisateurs
                            </h3>
                        </div>
                        {/* Container du graphique */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                            <div className="relative z-10 p-6 rounded-2xl border border-white/20">
                                <div style={{ width: '100%', height: '400px' }}>
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 20,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="internalUrlGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.9}/>
                                                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7}/>
                                                </linearGradient>
                                                <linearGradient id="externalUrlGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ac71e3" stopOpacity={0.9}/>
                                                    <stop offset="100%" stopColor="#9c3df6" stopOpacity={0.7}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="f0f0f0" />
                                            <XAxis 
                                                dataKey="user_name" 
                                                tick={{ fontSize: 13, fill: '#1f2937', fontWeight: 600 }}
                                                tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                                                tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                                label={{ 
                                                    value: 'Nombre d\'accès', 
                                                    angle: -90, 
                                                    position: 'insideLeft',
                                                    style: { textAnchor: 'middle', fill: '#1f2937', fontWeight: 600  }
                                                }}
                                            />
                                            <Tooltip 
                                                content={<CustomTooltip />} 
                                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                            />
                                            <Legend 
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                iconType="rect"
                                            />
                                            <Bar 
                                                dataKey="internal_clicks" 
                                                stackId="clicks" 
                                                fill="url(#internalUrlGradient)"
                                                name="Accès internes"
                                                radius={[0, 0, 0, 0]}
                                            />
                                            <Bar 
                                                dataKey="external_clicks" 
                                                stackId="clicks" 
                                                fill="url(#externalUrlGradient)"
                                                name="Accès externes"
                                                radius={[8, 8, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )}
        </>
  );
}