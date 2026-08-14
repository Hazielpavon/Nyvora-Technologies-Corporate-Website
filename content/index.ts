import * as es from "./es";

export const defaultLocale = "es" as const;
export const locales = { es } as const;

export const { companyPrinciples, mykeBenefits, mykeCapabilities, navigation } = locales[defaultLocale];
