"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/`,
    });

    if (error) {
      console.log('Deu erro', error)
    }
  };

  return (
    <div className="relative h-dvh overflow-hidden bg-auth-bg">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="absolute left-1/2 top-12 -translate-x-1/2">
        <Image src="/fitai-logo.svg" alt="FIT.AI" width={85} height={39} />
      </div>

      <div className="absolute bottom-0 left-1/2 flex w-full max-w-[402px] -translate-x-1/2 flex-col items-center gap-[60px] rounded-tl-[20px] rounded-tr-[20px] bg-primary px-5 pb-10 pt-12">
        <div className="flex w-full flex-col items-center gap-6">
          <p className="w-full text-center text-[32px] font-semibold leading-[1.05] text-primary-foreground font-[family-name:var(--font-inter-tight)]">
            O app que vai transformar a forma como você treina.
          </p>

          <Button
            className="h-[38px] gap-2 rounded-full border-none bg-card px-6 text-sm font-semibold text-card-foreground hover:bg-card/90"
            onClick={handleGoogleSignIn}
          >
            <Image src="/google-icon.svg" alt="" width={16} height={16} />
            Fazer login com Google
          </Button>
        </div>

        <p className="whitespace-nowrap text-[12px] leading-[1.4] text-primary-foreground/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
