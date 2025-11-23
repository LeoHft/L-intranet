export default function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      className={
        `btn btn-primary btn-sm uppercase tracking-widest ${
          disabled && "btn-disabled"
        } ` + className
      }
      disabled={disabled}
    >
      {children}
    </button>
  );
}
