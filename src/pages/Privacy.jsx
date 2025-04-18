import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                At Online Examination System, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our online examination platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Name and contact information</li>
                    <li>Educational institution details</li>
                    <li>Email address</li>
                    <li>Login credentials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Usage Data</h3>
                  <ul className="list-disc pl-6 text-gray-600">
                    <li>Exam responses and results</li>
                    <li>Time spent on examinations</li>
                    <li>System usage patterns</li>
                    <li>Technical information about your device</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-gray-600">
                <li>To provide and maintain our examination platform</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our services</li>
                <li>To monitor the usage of our services</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your information. These measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Regular security assessments</li>
                <li>Encryption of sensitive data</li>
                <li>Secure user authentication</li>
                <li>Regular backups</li>
                <li>Access controls and monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to our processing of your data</li>
                <li>Receive a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@examonline.com
                <br />
                Phone: +1 (555) 123-4567
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 