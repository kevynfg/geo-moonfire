import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GoogleLogo } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function Login() {
  const { data, status } = useSession();
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    return () => {
      setLoginStatus("")
    }
  }, [])

  function handleLoginWithoutProvider(event: FormEvent) {
    event.preventDefault();

    if (!email) return false;

    setIsSendingEmail(true);
    signIn("email", { email, redirect: false }).then((done) => {
      if (done?.ok) {
        handleLoginStatus("success");
        setIsSendingEmail(false);
      }
    }).catch(() => {
      handleLoginStatus("error");
      setIsSendingEmail(false);
    })
  }

  function loginWithProvider(provider: string) {
    signIn(provider).then((done) => {
      if (done?.ok) {
        handleLoginStatus("success");
        router.push("/map");
      }
    }).catch(() => {
      handleLoginStatus("error")
    })
  }

  function handleLoginStatus(status: string) {
    setLoginStatus(status)
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">
        <Loading />
      </div>
    );
  }

  if (data?.user) {
    setTimeout(() => {
      router.push("/map");
    }, 2000);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">
        <Loading />
        Sendo redirecionado...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-2xl ">
      <section className="flex flex-col justify-center items-center p-8 bg-gray-700 border border-gray-500 rounded max-w-[450px]">
        <div className="mb-5 text-white">Bem-vindo!</div>
        <form className="flex flex-col" onSubmit={handleLoginWithoutProvider}>
          <div className="relative flex flex-col justify-center gap-2">
            <div className="px-4 cursor-pointer relative flex justify-center items-center gap-3 bg-gray-900 uppercase py-2 rounded font-bold text-sm text-white hover:bg-gray-500 transition-colors disabled:opacity-50">
              <GoogleLogo weight="bold" size={24} />
              <button type="button" disabled={isSendingEmail} onClick={() => loginWithProvider("google")}>Entrar com Google</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
