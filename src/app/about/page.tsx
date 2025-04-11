import Head from "next/head";
import Image from "next/image";
import doctorImage from "./../../assets/doctor-consultantion.jpg";
import whyChooseUs from "./../../assets/Doctor measuring blood pressure to male patient.jpg";
import contactUs from "./../../assets/5124556.jpg";
import { useTranslations } from "next-intl";
import { APP_NAME } from "@/lib/constants";
import { getMessages } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });
  return {
    title: messages?.TabTitles?.about_us || "Doctor Consultation",
  };
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <>
      <Head>
        <title>{t("aboutUsTitle", { appName: APP_NAME })}</title>
        <meta name="description" content={t("metaDescription")} />
        <meta property="og:title" content={t("aboutUsTitle", { appName: APP_NAME })} />
        <meta property="og:description" content={t("metaDescription")} />
        <meta property="og:image" content="/assets/doctor-consultation.jpg" />
      </Head>

      <div className="container mx-auto px-6 py-12 text-primary">
        <h1 className="text-4xl font-bold text-center mb-12">{t("aboutUs")}</h1>

        {/* Who We Are */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-semibold">{t("whoWeAreTitle")}</h2>
            <p className="text-muted-foreground">{t("whoWeAreDescription")}</p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={doctorImage}
              alt={t("doctorImageAlt")}
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
        </section>

        {/* Mission */}
        <section className="bg-secondary rounded-xl shadow p-8 text-center mb-16">
          <h2 className="text-3xl font-semibold">{t("ourMissionTitle")}</h2>
          <p className="mt-4 text-muted-foreground">{t("ourMissionDescription")}</p>
        </section>

        {/* Why Choose Us */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <Image
              src={whyChooseUs}
              alt={t("whyChooseUsImageAlt")}
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-semibold">{t("whyChooseUsTitle")}</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>{t("expertDoctors")}</strong> {t("expertDoctorsDescription")}
              </li>
              <li>
                <strong>{t("convenience")}</strong> {t("convenienceDescription")}
              </li>
              <li>
                <strong>{t("secureConfidential")}</strong> {t("secureConfidentialDescription")}
              </li>
              <li>
                <strong>{t("affordableHealthcare")}</strong> {t("affordableHealthcareDescription")}
              </li>
              <li>
                <strong>{t("support24x7")}</strong> {t("support24x7Description")}
              </li>
            </ul>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-secondary rounded-xl shadow p-8 text-center mb-16">
          <h2 className="text-3xl font-semibold">{t("howItWorksTitle")}</h2>
          <ol className="list-decimal list-inside text-muted-foreground mt-4 space-y-2">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
            <li>{t("step4")}</li>
            <li>{t("step5")}</li>
          </ol>
        </section>

        {/* Contact Us */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-6">
          <div className="md:w-1/2 space-y-3">
            <h2 className="text-3xl font-semibold">{t("contactUsTitle")}</h2>
            <p className="text-muted-foreground">📧 {t("email")}: support@doctorconsultation.com</p>
            <p className="text-muted-foreground">📞 {t("phone")}: +1 234 567 890</p>
            <p className="text-muted-foreground">📍 {t("address")}: 123 Health St, Wellness City, Country</p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={contactUs}
              alt={t("contactUsImageAlt")}
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
        </section>
      </div>
    </>
  );
}
