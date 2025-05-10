import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to our Kanban application
  redirect("/kanban");
}
