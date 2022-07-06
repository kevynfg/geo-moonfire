import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass } from "phosphor-react";

interface HeaderProps {
 setLocations: (locations: google.maps.GeocoderResult[]) => void;
}

export default function Header(props: HeaderProps) {
    const googlemaps = useRef<HTMLInputElement>(null);
    const [searchAdressInput, setSearchAdressInput] = useState("");
    let google: any;
    
    if (typeof window !== "undefined" && typeof window.google !== "undefined") {
        google = window.google;
    }

    async function getGeocodeLocation() {
        // if (searchAdressInput) {
        //     let geoCoder = new google.maps.Geocoder() as google.maps.Geocoder;
        //     geoCoder.geocode({componentRestrictions: {
        //         country: "BR",
        //     }, address: searchAdressInput}, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        //         if (status !== "OK") {
        //             console.log('zero results');
        //             return;
        //         }
                
        //         if (status === "OK") {
        //             console.log('result', results);
        //             props.setLocations(results as google.maps.GeocoderResult[]);
        //             return;
        //         }
        //     })
        // }
        if (searchAdressInput) {
            
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
            <div className="flex gap-4 mr-4 bg-white rounded w-[30rem]">
                <MagnifyingGlass weight="bold" size={32} className="mx-2 cursor-pointer" onClick={async () => await getGeocodeLocation()}/>
                <input 
                    ref={googlemaps}
                    type="text"
                    id="search-input"
                    className="border-none outline-none rounded w-full" 
                    placeholder="Insira aqui seu endereço e pressione enter para buscar"
                    onChange={(e) => {
                        setSearchAdressInput(e.target.value)
                    }}
                    onKeyDownCapture={async (e) => {
                        if (e.keyCode === 13) {
                            await getGeocodeLocation();
                        }
                    }}
                />
            </div>
        </header>
    )
} 