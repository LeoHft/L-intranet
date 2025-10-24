import { useState, useEffect } from 'react';


export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAutoFocus, setIsAutoFocus] = useState(window.location.pathname === '/');


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

    // Gestion du raccourci clavier (Ctrl+b)
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
        <div>
            <form onSubmit={handleSearchSubmit} className="form-control group">
                <div className="input-group">
                    <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        autoFocus={isAutoFocus}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher... (Ctrl+B)"
                        className="input input-bordered w-40 group-hover:w-64 focus:w-64 bg-base-200/50 backdrop-blur-md border-base-300/50 text-base-content placeholder-base-content/60 focus:border-primary transition-all duration-300 text-sm hover:bg-base-200/70"
                    />
                </div>
            </form>
        </div>
    );

}