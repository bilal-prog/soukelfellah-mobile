
const API_URL_DEV = "https://illusion-chubby-backtalk.ngrok-free.dev"

const Config = {
  // We can swap this with an ngrok url or environment variable when testing on a physical device.
  API_URL: API_URL_DEV,
  catchErrors: "always" as const,
  exitRoutes: ["Welcome"],
}

export default Config
