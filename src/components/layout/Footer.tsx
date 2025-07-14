import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-gray-900/95 backdrop-blur-xl text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <img src="/formonk-logo.png" alt="formonk logo" />
                            </div>
                            <h3 className="text-2xl font-bold">Formonk</h3>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                            Build beautiful forms with ease. Collect data, analyze responses,
                            and grow your business with our powerful form builder.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/demo" className="hover:text-white transition-colors">Demo Forms</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">Templates</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-lg">Support</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/auth" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">API Docs</Link></li>
                            <li><Link to="/auth" className="hover:text-white transition-colors">Status</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Formonk. All rights reserved. Made with ❤️ by Shawon Ahmmed</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;