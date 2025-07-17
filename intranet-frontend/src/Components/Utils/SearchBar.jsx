import { useState, useRef, useEffect } from 'react';


export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    // Gestion de la recherche
    const handleSearch = (query = searchQuery) => {
        if (query.trim()) {
            // Ouvrir une nouvelle page avec la recherche
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
            window.open(searchUrl, '_blank', 'noopener,noreferrer');
            setSearchQuery(''); // Réinitialiser la recherche
        }
    };


    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    // Gestion du raccourci clavier (Ctrl+K ou Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher... (Ctrl+K)"
                        className="block w-48 group-hover:w-64 pl-10 pr-12 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 focus:w-64 transition-all duration-300 text-sm hover:bg-white/15"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                        <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-white/20 text-gray-300 border border-white/20">
                            ⌘K
                        </kbd>
                    </div>
                </div>
                
            </form>
        </div>
    );

}