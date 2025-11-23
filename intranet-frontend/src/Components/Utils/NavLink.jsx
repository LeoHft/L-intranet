import { Link } from "react-router-dom";

export default function NavLink({
  active = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Link
      {...props}
      className={
        "tab tab-bordered " +
        (active
          ? "tab-active text-base-content"
          : "text-base-content/70 hover:text-base-content") +
        className
      }
    >
      {children}
    </Link>
  );
}
