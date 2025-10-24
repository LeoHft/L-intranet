
export default function Shortcut({ url, icon: Icon, label, className = '' }) {
    
    return (
        <div className="tooltip tooltip-left " data-tip={`https://${url}`}>
            <button
                data-tooltip-content={label || url}
                onClick={() => window.open(`https://${url}`, '_blank', 'noopener,noreferrer')}
                className={`btn btn-ghost btn-circle hover:btn-primary transition-all duration-200 ${className}`}
                aria-label={label || `Ouvrir ${url}`}
            >
                {Icon && <Icon className="h-5 w-5" />}
            </button>
        </div>
    );
}
