import { Sparkles } from 'lucide-react';
import {Button} from '@/components/ui/button'
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
    const {user} = useAuth();
    return (
        <header className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/formonk-logo.png" alt="formonk logo" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Formonk
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" asChild className="text-gray-700 hover:text-blue-600">
                            <Link to="/demo">View Demos</Link>
                        </Button>
                        {user ? (
                            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                                <Link to="/dashboard">Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild className="text-gray-700 hover:text-blue-600">
                                    <Link to="/auth">Sign In</Link>
                                </Button>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                                    <Link to="/auth">Get Started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;