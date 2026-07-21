import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

interface FooterProps {
  settings: any;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings?.site_name || 'EduOS';
  const tagline =
    settings?.tagline ||
    'Empowering institutions with modern education management and learning solutions.';

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{siteName}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Col 2: Quick Links 1 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-white transition-colors">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-white transition-colors">
                  Academics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links 2 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-white transition-colors">
                  Notices
                </Link>
              </li>
              <li>
                <Link href="/faculty" className="hover:text-white transition-colors">
                  Faculty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              {settings?.contact_email ? (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                  <span>info@eduos.org</span>
                </div>
              )}

              {settings?.contact_phone ? (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                  <span>+1 (555) 000-0000</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          © {currentYear} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}