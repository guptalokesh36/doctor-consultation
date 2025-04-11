import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { APP_NAME } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-background text-foreground border-t border-border pt-10 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* Brand & Description */}
        <div>
          <h2 className="text-xl font-bold">{APP_NAME}</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {t("brand_description")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("quick_links")}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary"
              >
                {t("about_us")}
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-primary"
              >
                {t("services")}
              </Link>
            </li>
            <li>
              <Link
                href="/doctors"
                className="text-muted-foreground hover:text-primary"
              >
                {t("find_a_doctor")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("contact_us")}</h3>
          <p className="text-muted-foreground text-sm">{t("email")}</p>
          <p className="text-muted-foreground text-sm">{t("phone")}</p>

          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-muted-foreground text-xs mt-10 pt-6 border-t border-border">
        &copy; {new Date().getFullYear()} {APP_NAME}. {t("copyright")}
      </div>
    </footer>
  );
}
