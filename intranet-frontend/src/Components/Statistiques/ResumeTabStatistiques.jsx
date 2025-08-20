export default function ResumeTabStatistiques({ statisticsData }) {
    return (
        <>
            {/* Affichage des résultats */}
            {statisticsData && statisticsData.length > 0 ? (
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="card-title justify-between mb-6">
                            <h3 className="text-2xl">
                                Tableau des statistiques
                            </h3>
                        </div>

                        <div className="card bg-base-200 p-6">

                            
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>
                                            Service
                                        </th>
                                        <th>
                                            Utilisateur
                                        </th>
                                        <th>
                                            Date
                                        </th>
                                        <th>
                                            Accès internes
                                        </th>
                                        <th>
                                            Accès externes
                                        </th>
                                        <th>
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statisticsData.map((stat, index) => (
                                        <tr key={index} className="hover">
                                            <td>
                                                {stat.service_name || `Service ${stat.service_id}`}
                                            </td>
                                            <td>
                                                {stat.user_name || `Utilisateur ${stat.user_id}`}
                                            </td>
                                            <td>
                                                {new Date(stat.click_date).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td>
                                                {stat.internal_url_click}
                                            </td>
                                            <td>
                                                {stat.external_url_click}
                                            </td>
                                            <td className="font-medium">
                                                {parseInt(stat.internal_url_click) + parseInt(stat.external_url_click)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    
                            {/* Résumé */}
                            <div className="stats stats-vertical lg:stats-horizontal shadow mt-6">
                                <div className="stat">
                                    <div className="stat-title">Total accès internes</div>
                                    <div className="stat-value text-primary">
                                        {statisticsData.reduce((sum, stat) => sum + parseInt(stat.internal_url_click), 0)}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total accès externes</div>
                                    <div className="stat-value text-secondary">
                                        {statisticsData.reduce((sum, stat) => sum + parseInt(stat.external_url_click), 0)}
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total général</div>
                                    <div className="stat-value text-accent">
                                        {statisticsData.reduce((sum, stat) => sum + parseInt(stat.internal_url_click) + parseInt(stat.external_url_click), 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : statisticsData && statisticsData.length === 0 ? (
                <div className="alert alert-warning">
                    <p>Aucune donnée trouvée pour les critères sélectionnés.</p>
                </div>
            ) : (
                <p>Comment à utiliser le dashboard pour générer des statistiques</p>
            )}
        
        </>
    );
}