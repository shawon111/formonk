
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BarChart3, Shield, Zap, Globe, ArrowRight, Star, Sparkles, Rocket, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Homepage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create beautiful forms in minutes with our intuitive drag-and-drop builder.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track form performance with detailed analytics and submission insights.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your data is always protected.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description: "Embed forms on your website or share via public links instantly.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team to build and manage forms efficiently.",
      gradient: "from-pink-400 to-pink-600"
    },
    {
      icon: CheckCircle,
      title: "No-Code Solution",
      description: "Build professional forms without writing a single line of code.",
      gradient: "from-indigo-400 to-indigo-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "Formonk has revolutionized how we collect customer feedback. The analytics are incredible!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Product Designer",
      content: "The drag-and-drop interface is so intuitive. I can create complex forms in minutes.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Event Coordinator",
      content: "Managing event registrations has never been easier. Highly recommended!",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-6 py-3 rounded-full mb-8 shadow-lg">
            <Rocket className="h-5 w-5" />
            <span className="font-medium">Trusted by 10,000+ creators worldwide</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            Build Beautiful
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Forms That Convert
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Create stunning, responsive forms with our powerful drag-and-drop builder. 
            Collect data, analyze responses, and grow your business with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
              asChild
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                {user ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link to="/demo">
                <Heart className="mr-3 h-5 w-5" />
                View Demo Forms
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Build Amazing Forms
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Powerful features that make form building simple, efficient, and delightful
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:-translate-y-2">
                <CardHeader className="pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Loved by Teams
              <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-light">
              See what our users have to say about Formonk
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="pt-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-8 text-lg italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/90 to-indigo-700/90"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your
            <span className="block">Data Collection?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            Join thousands of teams who trust Formonk to build beautiful, responsive forms 
            that convert visitors into valuable data and insights.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link to={user ? "/dashboard" : "/auth"}>
              {user ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          
          <div className="mt-8 text-blue-100 text-sm">
            ✨ Join 10,000+ happy creators • No credit card required
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900/95 backdrop-blur-xl text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
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
            <p>&copy; 2024 Formonk. All rights reserved. Made with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
