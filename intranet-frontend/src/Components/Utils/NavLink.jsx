import { Link } from 'react-router-dom';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-rose-300 text-gray focus:border-rose-400'
                    : 'border-transparent text-gray-500 hover:border-rose-300 hover:text-gray-700 focus:border-rose-400 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
