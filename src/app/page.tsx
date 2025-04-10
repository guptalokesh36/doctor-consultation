import { useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { FaStethoscope, FaUserMd, FaComments } from "react-icons/fa";
import Link from "next/link";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });
  return {
    title: messages?.TabTitles?.home || "Doctor Consultation",
  };
}

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen bg--background text--foreground">
      {/* Hero Section */}
      <section className="bg--primary text--primary-foreground py-20 text-center">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg">{t("description")}</p>
        <Link href={"/doctors"}>
          <Button className="mt-6 bg--foreground text-blue-600 hover:bg-gray-200">
            {t("button")}
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-background text-foreground p-6 rounded-2xl shadow-lg">
          <FaStethoscope className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl  font-semibold">{t("features.easyAccess")}</h3>
          <p>{t("features.easyAccessDesc")}</p>
        </div>
        <div className="bg-background text-foreground p-6 rounded-2xl shadow-lg">
          <FaUserMd className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">
            {t("features.verifiedDoctors")}
          </h3>
          <p>{t("features.verifiedDoctorsDesc")}</p>
        </div>
        <div className="bg-background text-foreground p-6 rounded-2xl shadow-lg">
          <FaComments className="text-blue-600 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">{t("features.secureChat")}</h3>
          <p>{t("features.secureChatDesc")}</p>
        </div>
      </section>
    </div>
  );
}
