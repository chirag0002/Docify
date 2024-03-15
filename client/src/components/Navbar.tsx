import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img from '../assets/logo.png';

export const Navbar = ({name}:{name:string}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
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
                    <img src={img} alt="Docify Logo" className="flex flex-shrink-0 justify-center items-center w-10 h-12" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">Docify</span>
                </Link>
                <div className="relative flex ">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-10 focus:outline-none border-blue-700"
                    />
                    <button
                        type="button"
                        onClick={toggleDropdown}
                    >
                        <div className="flex text-2xl font-medium bg-sky-400 text-white w-10 h-10 rounded-full oveflow-hidden justify-center flex-col ">
                            {name[0]}
                        </div>
                    </button>
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                            <ul className="py-2">
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Documents</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >My Account</a>
                                </li>
                                <li>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >Logout</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
