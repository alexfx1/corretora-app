import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // Assuming you're using lucide-react for icons

interface DropdownProps {
    searchFilter: string;
    setSearchFilter: (filter: string) => void;
    dropdownOpen: boolean;
    setDropdownOpen: (open: boolean) => void;
}

const SearchFilterDropdown: React.FC<DropdownProps> = ({ searchFilter, setSearchFilter, dropdownOpen, setDropdownOpen }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setDropdownOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="w-[120px] shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {searchFilter} <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {dropdownOpen && (
                <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
                    <ul className="py-2 text-sm text-gray-700">
                    <li>
                            <button
                                type="button"
                                className="block w-full px-4 py-2 hover:bg-gray-100"
                                onClick={() => { setSearchFilter('Mercadoria'); setDropdownOpen(false); }}
                            >
                                Mercadoria
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="block w-full px-4 py-2 hover:bg-gray-100"
                                onClick={() => { setSearchFilter('Data'); setDropdownOpen(false); }}
                            >
                                Data
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="block w-full px-4 py-2 hover:bg-gray-100"
                                onClick={() => { setSearchFilter('Preço'); setDropdownOpen(false); }}
                            >
                                Preço
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="block w-full px-4 py-2 hover:bg-gray-100"
                                onClick={() => { setSearchFilter('Motorista'); setDropdownOpen(false); }}
                            >
                                Motorista
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="block w-full px-4 py-2 hover:bg-gray-100"
                                onClick={() => { setSearchFilter('Cliente'); setDropdownOpen(false); }}
                            >
                                Cliente
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchFilterDropdown;
