export default function ResumeTabStatistiques({ statisticsData }) {
    return (
        <>
            {/* Affichage des résultats */}
            {statisticsData && statisticsData.length > 0 ? (
                <div className="relative overflow-hidden">
                    {/* Grand background */}
                    <div className="absolute inset-0 rounded-3xl">
                        <div className="h-full w-full rounded-3xl bg-white/30 backdrop-blur-xl"></div>
                    </div>

                    <div className="relative z-10 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-medium">
                                Tableau des statistiques
                            </h3>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
                            <div className="relative z-10 p-6 rounded-2xl border border-white/20">

                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Utilisateur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Accès internes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Accès externes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {statisticsData.map((stat, index) => (
                                        <tr key={index} className="hover:bg-white/20 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {stat.service_name || `Service ${stat.service_id}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {stat.user_name || `Utilisateur ${stat.user_id}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(stat.click_date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {stat.internal_url_click}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {stat.external_url_click}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {parseInt(stat.internal_url_click) + parseInt(stat.external_url_click)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    
                            {/* Résumé */}
                            <div className="mt-6 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Résumé</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-700">
                                            {statisticsData.reduce((sum, stat) => sum + parseInt(stat.internal_url_click), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total accès internes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-700">
                                            {statisticsData.reduce((sum, stat) => sum + parseInt(stat.external_url_click), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total accès externes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-700">
                                            {statisticsData.reduce((sum, stat) => sum + parseInt(stat.internal_url_click) + parseInt(stat.external_url_click), 0)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total général</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) : statisticsData && statisticsData.length === 0 ? (
                <div className="bg-violet-100 border border-violet-200 rounded-lg p-4">
                    <p className="text-red-800">Aucune donnée trouvée pour les critères sélectionnés.</p>
                </div>
            ) : (
                <p>Comment à utiliser le dashboard pour générer des statistiques</p>
            )}
        
        </>
    );
}