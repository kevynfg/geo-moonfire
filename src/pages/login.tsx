import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { EnvelopeSimple, GoogleLogo } from "phosphor-react";
import Loading from "../components/Loading";

export default function Login() {
  const { data, status } = useSession();
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  function handleLoginWithProvider(event: FormEvent) {
    setEmailSent(false);
    event.preventDefault();
    console.log("email", email);

    if (!email) return false;

    setIsSendingEmail(true);
    signIn("email", { email, redirect: false }).then((done) => {
        if (done?.ok) {
        setIsSendingEmail(false);
        setEmailSent(true);
      }
    }).catch(() => {
        setIsSendingEmail(false);
        setEmailSent(false);
    })
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">
        Checking authentication...
      </div>
    );
  }

  if (data?.user) {
    setTimeout(() => {
      router.push("/map");
    }, 2000);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">
        You are signed in!
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-2xl ">
      <section className="flex flex-col justify-center items-center p-8 bg-gray-700 border border-gray-500 rounded max-w-[450px]">
        <div className="mb-5 text-white">Bem-vindo!</div>
        <form className="flex flex-col" onSubmit={handleLoginWithProvider}>
          <div className="relative flex flex-col justify-center gap-2">
            <label className="text-white text-sm" htmlFor="email">Faça login apenas com seu e-mail</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                onChange={(event) => setEmail(event.target.value)}
                className="border-none outline-none rounded pl-12 py-1 w-full"
              />
              <EnvelopeSimple className="absolute inset-3.5 ml-1" weight="bold" size={16} />
            </div>
            {emailSent ? (
                <span className="text-white text-sm flex leading-relaxed">
                    E-mail enviado com sucesso, verifique sua caixa de e-mail para efetuar o login
                </span>
            ) : (
                <span className="text-white text-sm">
                    Houve um erro ao enviar o e-mail, tente novamente
                </span>
            )}
            <button
              type="submit"
              className="mt-8 bg-green-500 uppercase py-4 rounded font-bold text-sm text-white hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSendingEmail || email.length === 0}
            >
              {isSendingEmail ? <Loading /> : "Entrar"}
            </button>
            <div className="cursor-pointer relative flex justify-center items-center gap-3 bg-gray-900 uppercase py-2 rounded font-bold text-sm text-white hover:bg-gray-500 transition-colors disabled:opacity-50">
              <GoogleLogo weight="bold" size={24} />
              <button type="submit" disabled={isSendingEmail}>Entrar com Google</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
