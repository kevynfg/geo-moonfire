import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GoogleLogo, MagnifyingGlass, X } from "phosphor-react";
import { LatLng } from "@/utils/types/latlng.type";
import { useGoogle} from "@/hooks/useGoogle"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { formatName } from '@/utils/format-name'

interface HeaderProps {
 setLocations: (locations: google.maps.GeocoderResult[]) => void;
 newPlaceClickedOnMap?: LatLng;
 setNewMarkerBySearchBox: (coordinates: LatLng) => void;
}

export default function Header(props: HeaderProps) {
    const googlemapsRef = useRef<HTMLInputElement>(null);
    const [searchAdressInput, setSearchAdressInput] = useState("");
    const [searchLocation, setSearchLocation] = useState({
        lat: 0,
        lng: 0,
    });
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
    const router = useRouter();
    const {data, status} = useSession();
    let googleInstance = useGoogle();

    if (!data?.user) {
        router.push('/login');
    }
    
    if (typeof window !== "undefined" && typeof window.google !== "undefined") {
        googleInstance = window.google;
    }

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.google !== "undefined") {
            const input = document.getElementById("search-input") as HTMLInputElement;
            setSearchBox(new google.maps.places.SearchBox(input, {
                bounds: new google.maps.LatLngBounds()
            }));
        }

        return () => {
            if (searchBox && googleInstance) {
                googleInstance.maps.event.clearInstanceListeners(searchBox);
            }
        }
    }, [googleInstance])

    useEffect(() => {
        if (searchBox && googleInstance) {
            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces()
                if (!places || places.length === 0) {
                    return;
                }

                if (places && places[0].geometry?.location) {
                    setSearchLocation({
                        lat: places[0].geometry.location.lat(),
                        lng: places[0].geometry.location.lng(),
                    })

                    props.setNewMarkerBySearchBox({
                        lat: places[0].geometry.location.lat(),
                        lng: places[0].geometry.location.lng(),
                    })
                }
            })
        }
    }, [searchBox, googleInstance])

    useEffect(() => {
        if (props.newPlaceClickedOnMap) {
            setSearchLocation(props.newPlaceClickedOnMap);
        }
    }, [props.newPlaceClickedOnMap])

    useEffect(() => {
        if (searchLocation) {
            geocodeLocation(true);
        }
    }, [searchLocation])

    async function geocodeLocation(byLocation: boolean) {
        if (searchAdressInput && !byLocation && googleInstance) {
            let geoCoder = new googleInstance.maps.Geocoder() as google.maps.Geocoder;
            geoCoder.geocode({componentRestrictions: {
                country: "BR",
            }, address: searchAdressInput}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === "OK") {
                    props.setLocations(results as google.maps.GeocoderResult[]);
                    return;
                }
            })
        } else if (byLocation && googleInstance) {
            let geoCoder = new googleInstance.maps.Geocoder() as google.maps.Geocoder;
            geoCoder.geocode({location: searchLocation}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === "OK") {
                    props.setLocations(results as google.maps.GeocoderResult[]);
                    return;
                }
            })
        }
    }

    async function handleLogin() {
        if (data?.user) {
            signOut();
        } else {
            console.log('asPath', router.asPath)
            router.push(`/auth/signin?callbackUrl=${router.asPath}`)
        }
    }
    console.log('sesseion', data)
    return (
        <header className="flex justify-between items-center py-4 bg-green-400 border-b border-gray-600 mb-4 sm:gap-12">
            <h1 className="text-2xl font-bold">
                <Link href="/">
                    <a>
                        <span className="text-black ml-4">
                            <span className="font-bold leading-relaxed">Green</span>
                            <span className="font-thin leading-relaxed">way</span>
                        </span>
                    </a>
                </Link>
            </h1>
            <div className="flex items-center relative px-4 gap-2">
                <GoogleLogo weight="bold" className="" size={32}/>
                {data?.user ? (
                    <p className="ml-4 leading-relaxed font-bold">{`Bem-vindo, ${formatName(data.user.name as string)}`}</p>
                    
                ): null}
                {data?.user ? "|" : null}
                <button type="button" className="leading-relaxed font-bold px-2 hover:text-blue-600" onClick={handleLogin}>{data?.user ? "Logout" : "Login"}</button>
            </div>
            <div className="flex gap-4 mr-4 bg-white rounded w-[30rem] p-2">
                <input 
                    ref={googlemapsRef}
                    type="text"
                    id="search-input"
                    className="border-none outline-none rounded w-full" 
                    placeholder="Insira aqui seu endereço e pressione enter para buscar"
                    onChange={(e) => {
                        setSearchAdressInput(e.target.value)
                    }}
                    onKeyDownCapture={async (e) => {
                        if (e.keyCode === 13) {
                            await geocodeLocation(false);
                        }
                    }}
                />
                <MagnifyingGlass weight="bold" size={32} className="cursor-pointer" onClick={async () => await geocodeLocation(false)}/>
                |
                <X weight="bold" className="cursor-pointer" size={32} />
            </div>
        </header>
    )
} 