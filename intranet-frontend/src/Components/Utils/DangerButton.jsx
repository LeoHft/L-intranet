export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `btn btn-error btn-sm uppercase tracking-widest ${
                    disabled && 'btn-disabled'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
