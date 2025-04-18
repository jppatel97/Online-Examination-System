import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

function Home() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: "For Teachers",
      description: "Create and manage exams, track student progress, and analyze results with powerful tools.",
      benefits: [
        "Easy exam creation",
        "Real-time monitoring",
        "Detailed analytics",
        "Student performance tracking"
      ]
    },
    {
      icon: UserIcon,
      title: "For Students",
      description: "Take exams online, view results instantly, and track your academic progress seamlessly.",
      benefits: [
        "User-friendly interface",
        "Instant results",
        "Progress tracking",
        "Practice materials"
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Reliable",
      description: "Built with security in mind, ensuring a safe environment for online examinations.",
      benefits: [
        "Anti-cheating measures",
        "Data encryption",
        "24/7 availability",
        "Auto-save feature"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-primary/10 to-white">
      {/* Hero Section */}
      <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Online Examination
              <span className="block text-primary mt-2">Made Simple</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8">
              A modern platform for conducting and taking online examinations. Perfect for
              educational institutions and training programs.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-100"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teachers and students who are already using our platform
            for seamless online examinations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-100 text-center"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-50 transition-all duration-200 border border-primary text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <AcademicCapIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">Exam System</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">About</Link>
              <Link to="/features" className="text-gray-600 hover:text-primary transition-colors">Features</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Exam System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 