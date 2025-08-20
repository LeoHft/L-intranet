export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btn btn-outline btn-sm uppercase tracking-widest ${
                    disabled && 'btn-disabled'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
