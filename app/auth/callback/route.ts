import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function splitDisplayName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=google_auth", requestUrl.origin));
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(new URL("/login?error=google_auth", requestUrl.origin));
  }

  // Google normally supplies given_name, family_name and/or name.
  // Fill missing name fields from the display name, then from the email local-part.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (user) {
    const metadata = user.user_metadata ?? {};
    const displayName = typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : "";
    const parsed = splitDisplayName(displayName);
    const emailPrefix = user.email?.split("@")[0]?.replace(/[._-]+/g, " ").trim() ?? "";
    const firstName = String(metadata.first_name ?? metadata.given_name ?? parsed.firstName ?? emailPrefix).trim();
    const lastName = String(metadata.last_name ?? metadata.family_name ?? parsed.lastName ?? "").trim();

    if (!metadata.first_name || !metadata.last_name || !metadata.full_name) {
      await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: displayName || [firstName, lastName].filter(Boolean).join(" "),
        },
      });
    }
  }

  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
