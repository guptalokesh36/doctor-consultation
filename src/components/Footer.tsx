import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { APP_NAME } from '@/lib/constants';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg--background text--foreground border-t py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section 1: Brand & Description */}
        <div>
          <h2 className="text-xl font-semibold">{APP_NAME}</h2>
          <p className="text-gray-400 mt-2">{t("brand_description")}</p>
        </div>
        
        {/* Section 2: Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold">{t("quick_links")}</h3>
          <ul className="mt-2 space-y-2">
            <li><Link href="/about" className="text-gray-400 hover:text-secondary">{t("about_us")}</Link></li>
            <li><Link href="/services" className="text-gray-400 hover:text-secondary">{t("services")}</Link></li>
            <li><Link href="/doctors" className="text-gray-400 hover:text-secondary">{t("find_a_doctor")}</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-secondary">{t("contact")}</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Info & Socials */}
        <div>
          <h3 className="text-lg font-semibold">{t("contact_us")}</h3>
          <p className="text-gray-400 mt-2">{t("email")}</p>
          <p className="text-gray-400">{t("phone")}</p>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-secondary"><FaFacebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-secondary"><FaTwitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-secondary"><FaInstagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-secondary"><FaLinkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} {APP_NAME}. {t("copyright")}
      </div>
    </footer>
  );
}
