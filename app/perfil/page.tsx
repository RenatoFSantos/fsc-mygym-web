import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/app/_lib/auth-client";
import { getCurrentUserTrainData } from "@/app/_lib/fetch-generated";
import { Navbar } from "@/app/_components/navbar";
import { Scale, Ruler, BicepsFlexed, User } from "lucide-react";
import { SignOutButton } from "./_components/sign-out-button";

export default async function PerfilPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const trainDataResponse = await getCurrentUserTrainData();
  const trainData =
    trainDataResponse.status === 200 ? trainDataResponse.data : null;

  const weightKg = trainData
    ? (trainData.weightInGrams / 1000).toString()
    : "—";
  const heightCm = trainData
    ? trainData.heightInCentimeters.toString()
    : "—";
  const bodyFat = trainData ? `${trainData.bodyFatPercentage}%` : "—";
  const age = trainData ? trainData.age.toString() : "—";

  return (
    <main className="flex flex-col pb-24">
      <div className="flex h-14 items-center px-5">
        <span className="text-foreground text-[22px] uppercase font-anton">
          FIT.AI
        </span>
      </div>

      <div className="flex flex-col gap-5 items-center p-5 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center">
            {session.data.user.image ? (
              <Image
                src={session.data.user.image}
                alt={session.data.user.name ?? ""}
                width={52}
                height={52}
                className="rounded-full object-cover size-[52px]"
              />
            ) : (
              <div className="size-[52px] rounded-full bg-muted flex items-center justify-center">
                <User className="size-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <span className="text-[18px] font-semibold font-inter-tight text-foreground leading-[1.05]">
                {session.data.user.name}
              </span>
              <span className="text-[14px] font-inter-tight text-foreground/70 leading-[1.15]">
                Plano Básico
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center size-[34px]">
              <Scale className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {weightKg}
              </span>
              <span className="text-[12px] font-inter-tight text-stats-label uppercase">
                Kg
              </span>
            </div>
          </div>

          <div className="bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center size-[34px]">
              <Ruler className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {heightCm}
              </span>
              <span className="text-[12px] font-inter-tight text-stats-label uppercase">
                Cm
              </span>
            </div>
          </div>

          <div className="bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center size-[34px]">
              <BicepsFlexed className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {bodyFat}
              </span>
              <span className="text-[12px] font-inter-tight text-stats-label uppercase">
                Gc
              </span>
            </div>
          </div>

          <div className="bg-stats-card-bg rounded-[12px] p-5 flex flex-col gap-5 items-center">
            <div className="bg-stats-card-bg rounded-[99px] p-[9px] flex items-center justify-center size-[34px]">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[24px] font-semibold font-inter-tight text-foreground leading-[1.15]">
                {age}
              </span>
              <span className="text-[12px] font-inter-tight text-stats-label uppercase">
                Anos
              </span>
            </div>
          </div>
        </div>

        <SignOutButton />
      </div>

      <Navbar />
    </main>
  );
}
