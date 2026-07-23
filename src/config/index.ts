
const API_URL_PROD = "https://soukelfellah-backend-git-17880232745.europe-west1.run.app"

const Config = {
  // Production Fly.io URL or custom env variable
  API_URL: process.env.EXPO_PUBLIC_API_URL || API_URL_PROD,
  SUPPORT_WHATSAPP: process.env.EXPO_PUBLIC_SUPPORT_WHATSAPP || "212722957826",
  SUPPORT_PHONE: process.env.EXPO_PUBLIC_SUPPORT_PHONE || "+212722957826",
  catchErrors: "always" as const,
  exitRoutes: ["Welcome"],
}

export default Config

