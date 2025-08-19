export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `label-text font-medium ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
