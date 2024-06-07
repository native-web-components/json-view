import { defineConfig, loadEnv, ConfigEnv } from "vite";
import { resolve } from "path";

export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params;
  const ENV = loadEnv(mode, process.cwd());
  console.log("node version", process.version);
  console.info(
    `running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`
  );
  return {
    server: {
      port: 9999,
    },
    build: {
      lib: {
        entry: resolve(__dirname, "src/main.ts"),
        name: "WebComponent",
        fileName: (format: string) => `json-view.${format}.js`,
        // formats: ["es", "umd"],
      },
      sourcemap: mode === "development",
      minify: mode !== "development",
      rollupOptions: {
        external: [],
        output: {
          globals: {},
        },
      },
    },
    plugins: [],
  };
});
