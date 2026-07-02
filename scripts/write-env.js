const fs = require("node:fs");
const path = require("node:path");

const defaultProjectId = "00000000-0000-4000-8000-000000000001";

function firstEnv(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return "";
}

const config = {
  supabaseUrl: firstEnv([
    "SUPABASE_URL",
    "VITE_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
  ]),
  supabasePublishableKey: firstEnv([
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]),
  projectId: firstEnv([
    "EEG_PROJECT_ID",
    "VITE_EEG_PROJECT_ID",
    "NEXT_PUBLIC_EEG_PROJECT_ID",
  ]) || defaultProjectId,
};

const outputPath = path.join(process.cwd(), "dist", "env.js");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.EEG_SUPABASE_CONFIG = ${JSON.stringify(config, null, 2)};\n`,
);
