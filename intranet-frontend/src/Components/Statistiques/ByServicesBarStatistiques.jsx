import SecondaryButton from '@/Components/Utils/SecondaryButton';

import ServiceSelect from '@/Components/Services/ServiceSelect';
import UsersSelect from '@/Components/Users/UsersSelect';
import ByUsersBarStatistiques from '@/Components/Statistiques/ByUsersBarStatistiques';

import { getBarStatByUserByServiceByDate } from '@/api/modules/statistiques';

import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function ByServicesBarStatistiques({ statisticsData }) {

    const chartData = useMemo(() => {
        if (!statisticsData || statisticsData.length === 0) return [];

        const groupedData = statisticsData.reduce((acc, item) => {
            const serviceId = item.service_id;
            const serviceName = item.service_name;
            
            if (!acc[serviceId]) {
                acc[serviceId] = {
                    service_id: serviceId,
                    service_name: serviceName,
                    internal_clicks: 0,
                    external_clicks: 0,
                    total_clicks:0
                };
            }
            acc[serviceId].internal_clicks += parseInt(item.internal_url_click) || 0;
            acc[serviceId].external_clicks += parseInt(item.external_url_click) || 0;
            acc[serviceId].total_clicks += (parseInt(item.internal_url_click) || 0) + (parseInt(item.external_url_click) || 0);
            return acc;
        }, {});

        return Object.values(groupedData).sort((a, b) => a.total_clicks + b.total_clicks);
    }, [statisticsData]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum, entry) => sum + entry.value, 0);
            const serviceData = chartData.find(item => item.service_name === label);
            const displayName = serviceData ? serviceData.service_name : label;

            return (
                <div className="bg-white/10 backdrop-blur-xl p-4 border border-white/20 rounded-2xl shadow-2xl ring-1 ring-white/10"> 
                    <p className="font-semibold text-gray-800 mb-2">{`${displayName}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm mb-1" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value} accès`}
                        </p>
                    ))}
                    <div className="border-t border-white/20 pt-2 mt-2">
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
                                Graphique des accès par services
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
                                                dataKey="service_name" 
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