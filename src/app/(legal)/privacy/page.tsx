import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - EduOS',
  description: 'Privacy Policy and data protection terms for EduOS.',
};

export default function PrivacyPage() {
  return (
    <main>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: October 24, 2023</p>

      <h2>1. Information We Collect</h2>
      <p>
        We collect information to provide better services to all our users. The types of information we collect include:
      </p>
      <ul>
        <li><strong>Account Information:</strong> Your name, email address, and account credentials when you register.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our platform, including progress, completed tasks, and preferences.</li>
        <li><strong>Device Information:</strong> IP address, browser type, and operating system details to ensure compatible service delivery.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect in various ways, including to:
      </p>
      <ul>
        <li>Provide, operate, and maintain our educational environment.</li>
        <li>Improve, personalize, and expand our platform features and learning pathways.</li>
        <li>Understand and analyze how you interact with our services to optimize system performance.</li>
        <li>Communicate with you for technical support, administrative updates, and essential service announcements.</li>
      </ul>

      <h2>3. Data Security</h2>
      <p>
        We are committed to protecting your personal data. We implement industry-standard technical and organizational security measures to prevent unauthorized access, disclosure, alteration, or destruction of your information.
      </p>
      <p>
        While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
      </p>
    </main>
  );
}