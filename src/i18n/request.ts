import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
    const localecookie = (await cookies()).get("MYNEXTDOCTOR_LOCALE")?.value || "en";
    const locale = localecookie;
    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    }
})