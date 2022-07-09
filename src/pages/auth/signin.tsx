import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router'

export default function Signin() {
    const {data, status} = useSession()
    const router = useRouter();
    console.log('session signin', data);

    if (status === 'loading') {
        return <div>Checking authentication...</div>
    }

    if (data?.user) {
        setTimeout(() => {
            router.push('/map')
        }, 2000)
        return <div>You are signed in!</div>
    }

    function handleLoginWithProvider() {
        signIn('google');
    }
    
    return (
        <div className="cursor-pointer" onClick={handleLoginWithProvider}>Signin</div>
    )
}