import Permissions from "@/components/AccessControl/permissions";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Permission",
  description: "Scheduling System",
};

export default function DashboardPage() {
  return (
    <>
      <DefaultLayout>
        <Permissions />
      </DefaultLayout>
    </>
  );
}
