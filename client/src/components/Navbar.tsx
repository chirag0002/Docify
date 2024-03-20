import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img from '../assets/logo.png';

export const Navbar = ({ name }: { name: string }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate()

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        navigate('/signin');
    };

    useEffect(() => {
        const handleOutsideClick = () => {
            if (dropdownRef.current) closeDropdown();
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <nav className="w-full">
            <div className=" flex items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={img} alt="Docify Logo" className="flex flex-shrink-0 justify-center items-center w-6 h-8 md:w-10 md:h-12" />
                    <span className="self-center text-xl md:text-2xl font-semibold whitespace-nowrap">Docify</span>
                </Link>
                <div className="relative flex ">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="hidden md:block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-10 focus:outline-none border-blue-700"
                    />
                    <button
                        type="button"
                        onClick={toggleDropdown}
                    >
                        <div className="flex text-md md:text-2xl font-medium bg-sky-400 text-white h-7 w-7 md:w-10 md:h-10 rounded-full oveflow-hidden justify-center flex-col ">
                            {name[0]}
                        </div>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                            <ul className="py-2">
                                <li className='cursor-pointer' onClick={handleLogout}>
                                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
