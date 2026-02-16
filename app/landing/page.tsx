import { redirect } from "next/navigation";

// Redirect /landing to root for backward compatibility
export default function Landing() {
  redirect("/");
}
