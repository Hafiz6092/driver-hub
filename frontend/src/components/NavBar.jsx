import { FaCarSide } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaBusinessTime } from "react-icons/fa";

const NavBar = ({ activePage, setActivePage }) => {
  return (
    // Fixed height h-16 (64px) ensures the bar doesn't grow if text changes
    <nav className="h-16 bg-white shadow-sm border-b border-slate-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 h-full">
        {/* items-center keeps everything vertically aligned in the middle of the 64px */}
        <div className="flex items-center h-full space-x-8">
          
          {/* Logo Section */}
          <div className="flex flex-row space-x-3">
          <FaCarSide className="text-3xl text-blue-600 mt-1" />
            <h1 className="font-serif text-3xl font-medium tracking-wide text-slate-800">
              Driver Hub
            </h1>
          </div>

          {/* Buttons Section - Sitting directly next to the name */}
          <div className=" h-full space-x-6">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`inline-flex items-center h-full px-1 border-b-2 text-xl font-semibold transition-colors ${
                activePage === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            ><IoHome className="m-2"/>
              Dashboard
            </button>
            
            <button
              onClick={() => setActivePage('shifts')}
              className={`inline-flex items-center h-full px-1 border-b-2 text-xl font-semibold transition-colors ${
                activePage === 'shifts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            ><FaBusinessTime className="m-2" />
              Shift Log
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;