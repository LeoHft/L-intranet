import { Link } from "react-router-dom";

export default function ResponsiveNavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Link
      {...props}
      className={`menu-item w-full border-l-4 ${
        active
          ? "border-primary bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary"
          : "border-transparent text-base-content/70 hover:border-base-300 hover:bg-base-200 hover:text-base-content focus:border-base-300 focus:bg-base-200 focus:text-base-content"
      } transition-all duration-150 focus:outline-none ${className}`}
    >
      {children}
    </Link>
  );
}
