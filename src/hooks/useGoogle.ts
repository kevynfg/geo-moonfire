import { useEffect, useState } from "react";

export function useGoogle() {
    const [google, setGoogle] = useState<any>();
    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.google !== "undefined") {
        setGoogle(window.google);
        }
    }, []);
    return google;
}