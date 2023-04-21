import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, X } from "phosphor-react";
import { LatLng } from "@/utils/types/latlng.type";
import { useGoogle} from "@/hooks/useGoogle"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { formatName } from '@/utils/format-name'
import Image from "next/image";

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
        let placesChangedListener: google.maps.MapsEventListener;
        if (searchBox && googleInstance) {
            placesChangedListener = searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces()
                if (!places || places.length === 0) {
                    return;
                }

                let location = places[0].geometry?.location;
                if (places && location) {
                    setSearchLocation({
                        lat: location.lat(),
                        lng: location.lng(),
                    })

                    props.setNewMarkerBySearchBox({
                        lat: location.lat(),
                        lng: location.lng(),
                    })
                }
            })
        }

        return () => {
            if (placesChangedListener) {
              googleInstance.maps.event.removeListener(placesChangedListener);
            }
          };
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
            router.push(`/auth/signin?callbackUrl=${router.asPath}`)
        }
    }

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
                {data?.user ? (
                    <>
                        {data.user.image && ( 
                            <Image 
                                src={data.user.image!} 
                                alt="Logged user avatar" 
                                height={30} width={30} 
                                layout="fixed" className="rounded-2xl" /> 
                        )}
                        <p className="ml-4 leading-relaxed font-bold">{`Bem-vindo, ${formatName(data.user.name as string)}`}</p>
                    </>
                ): null}
                {data?.user ? "|" : null}
                <button type="button" className="leading-relaxed font-bold px-2 hover:text-blue-600" onClick={handleLogin}>{data?.user ? "Logout" : "Login"}</button>
            </div>
            <div className="flex gap-4 mr-4 bg-white rounded w-[33rem] p-2">
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