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
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            {t("description")}
          </p>
          <Link href="/doctors">
            <Button className="mt-6 bg-background text-primary hover:bg-muted transition">
              {t("button")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 bg-secondary text-secondary-foreground">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<FaStethoscope className="text-blue-600 text-4xl mb-4" />}
            title={t("features.easyAccess")}
            description={t("features.easyAccessDesc")}
          />
          <FeatureCard
            icon={<FaUserMd className="text-blue-600 text-4xl mb-4" />}
            title={t("features.verifiedDoctors")}
            description={t("features.verifiedDoctorsDesc")}
          />
          <FeatureCard
            icon={<FaComments className="text-blue-600 text-4xl mb-4" />}
            title={t("features.secureChat")}
            description={t("features.secureChatDesc")}
          />
        </div>
      </section>
    </main>
  );
}

// 🔄 Reusable Feature Card
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background text-foreground p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-border hover:border-primary">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
