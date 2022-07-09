import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'

export default function Login() {
    const {data, status} = useSession();
    const router = useRouter();

    function handleLoginWithProvider() {
        signIn('google');
    }

    if (status === 'loading') {
        return <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">Checking authentication...</div>
    }

    if (data?.user) {
        setTimeout(() => {
            router.push('/map');
        }, 2000);
        return <div className="flex flex-col justify-center items-center min-h-screen text-2xl text-white">You are signed in!</div>
    }

    return (
        <div className="cursor-pointer" onClick={handleLoginWithProvider}>Signin</div>
    )
}