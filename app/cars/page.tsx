import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Browse all rental cars',
  description: 'Browse our full selection of reliable rental cars and find the perfect match for your trip',
};

export default async function CarsPage() {
  redirect("/catalog");
}
