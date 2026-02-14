import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, PlusCircle, User, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isAuthenticated) return null;

    const navItems = [
        { name: 'Analyze', path: '/', icon: PlusCircle },
        { name: 'Library', path: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
            <div className="glass-card px-8 py-4 rounded-2xl border border-accent/20 backdrop-blur-md bg-white/5 flex items-center justify-between shadow-xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                        <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-heading text-2xl text-parchment tracking-tight">Vākya AI</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 font-medium transition-all hover:text-accent ${
                                location.pathname === item.path ? 'text-accent' : 'text-parchment/60'
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                            {location.pathname === item.path && (
                                <motion.div 
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 border-l border-accent/10 pl-6 ml-2">
                    <div className="flex items-center gap-3 pr-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-xs">
                            {user?.sub?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="hidden lg:block text-left text-xs">
                            <p className="text-parchment font-bold truncate max-w-[100px]">{user?.sub?.split('@')[0]}</p>
                            <p className="text-parchment/40">Manuscript Initiate</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="p-2 hover:bg-red-500/10 hover:text-red-400 text-parchment/40 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
