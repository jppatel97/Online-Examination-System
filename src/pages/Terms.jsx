import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Terms of Service
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 mb-4">
                By accessing and using the Online Examination System, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. User Responsibilities
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">You agree to:</p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Not share your account access with others</li>
                  <li>Not engage in any unauthorized activities</li>
                  <li>Comply with all local, state, national, and international laws and regulations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Examination Rules
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">During examinations, you must:</p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Complete the exam independently without assistance</li>
                  <li>Not use unauthorized materials or aids</li>
                  <li>Not copy or distribute examination content</li>
                  <li>Complete the exam within the specified time limit</li>
                  <li>Follow all instructions provided by the examination system</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-4">
                All content, features, and functionality of the Online Examination System, including but not limited to text, graphics, logos, and software, are the exclusive property of our organization and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Termination
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-4">
                In no event shall the Online Examination System be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: legal@examonline.com
                <br />
                Phone: +91 8799254168
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 