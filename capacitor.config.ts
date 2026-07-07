import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "os.ledgermind.app",
  appName: "LedgerMind OS",
  webDir: "apps/web/public",
  bundledWebRuntime: false,
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    backgroundColor: "#07111f"
  }
};

export default config;
