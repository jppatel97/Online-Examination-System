import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About Online Examination System
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              We strive to revolutionize the way educational institutions conduct examinations by providing a secure, efficient, and user-friendly online examination platform that enhances the learning experience for both students and teachers.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 mb-6">
              We are a team of dedicated educators and technology experts committed to improving the assessment process through innovative digital solutions. Our platform is designed to meet the evolving needs of modern education.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What We Offer
            </h2>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Secure and reliable online examination platform</li>
              <li>Real-time assessment and instant results</li>
              <li>Comprehensive analytics and reporting</li>
              <li>User-friendly interface for students and teachers</li>
              <li>24/7 technical support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">Continuously improving our platform with cutting-edge technology</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">Maintaining high standards of security and fairness</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600">Making quality assessment available to all</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">Striving for the highest quality in everything we do</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 