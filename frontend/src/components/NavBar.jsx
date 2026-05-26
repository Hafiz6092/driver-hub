import { FaBusinessTime, FaCarSide, FaRegCalendarAlt } from 'react-icons/fa';
import { IoHome } from 'react-icons/io5';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: IoHome },
  { id: 'shifts', label: 'Shift Log', icon: FaBusinessTime },
  { id: 'records', label: 'Records', icon: FaRegCalendarAlt }
];

const NavBar = ({ activePage, setActivePage }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/30">
            <FaCarSide className="text-2xl" />
          </div>

          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-wide text-slate-800">
              Driver Hub
            </h1>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              Shift tracking for smarter driving
            </p>
          </div>
        </div>

        <nav className="rounded-2xl border border-slate-200 bg-white/90 p-1.5 shadow-lg shadow-slate-200/70">
          <div className="flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activePage === id;

              return (
                <button
                  key={id}
                  onClick={() => setActivePage(id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all md:px-5 md:text-base ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-300'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`text-base ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
