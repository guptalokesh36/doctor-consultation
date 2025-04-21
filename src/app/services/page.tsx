import { useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { FaHeartbeat, FaUserMd, FaLaptopMedical, FaStethoscope, FaShieldAlt, FaClock } from "react-icons/fa";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return {
    title: messages?.TabTitles?.services || "Doctor Consultation",
  };
}


export default function ServicesPage() {
  const t = useTranslations("ServicesPage");

  const services = [
    {
      icon: <FaLaptopMedical className="text-blue-600 text-4xl mb-4" />,
      title: t("onlineConsultation"),
      description: t("onlineConsultationDesc"),
    },
    {
      icon: <FaUserMd className="text-blue-600 text-4xl mb-4" />,
      title: t("specialistAccess"),
      description: t("specialistAccessDesc"),
    },
    {
      icon: <FaHeartbeat className="text-blue-600 text-4xl mb-4" />,
      title: t("followUpCare"),
      description: t("followUpCareDesc"),
    },
    {
      icon: <FaStethoscope className="text-blue-600 text-4xl mb-4" />,
      title: t("healthCheckups"),
      description: t("healthCheckupsDesc"),
    },
    {
      icon: <FaClock className="text-blue-600 text-4xl mb-4" />,
      title: t("flexibleTiming"),
      description: t("flexibleTimingDesc"),
    },
    {
      icon: <FaShieldAlt className="text-blue-600 text-4xl mb-4" />,
      title: t("privacySecurity"),
      description: t("privacySecurityDesc"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-secondary text-secondary-foreground rounded-2xl p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center text-center">
              {service.icon}
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
