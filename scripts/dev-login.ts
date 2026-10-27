// Local testing only: prints a one-time sign-in link for a test account (no email is sent).
// Usage: npm run dev-login -- someone@example.test
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });

async function main() {
  const email = process.argv[2];
  if (!email?.endsWith(".test")) throw new Error("Use a test address ending in .test");
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  // Ignore "already registered"; generateLink below fails loudly if the user really can't sign in.
  await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { full_name: "Test Tester" } });
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;
  console.log(`http://localhost:3000/auth/confirm?token_hash=${data.properties.hashed_token}&type=magiclink`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
