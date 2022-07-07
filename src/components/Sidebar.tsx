import { useEffect, useState } from "react";

interface SidebarProps {
    locations: google.maps.GeocoderResult[];
    setNewCoordinates: (coordinates: google.maps.LatLngLiteral) => void;
}

export default function Sidebar(props: SidebarProps) {
    return (
        <aside className="w-[470px] bg-gray-50 py-4 border-x-2">
            {props.locations.length > 0 ? (
                <p className="font-bold text-2xl leading-relaxed ml-4">Selecione o local correspondente</p>
            ): null}
            {props.locations && props.locations.map((location: google.maps.GeocoderResult) => (
                <div className="px-4" key={location.place_id}>
                    <p className="font-bold text-sm leading-relaxed mt-2 p-2 mb-2 cursor-pointer inline-block" onClick={() => {
                        props.setNewCoordinates({
                            lat: location.geometry.location.lat(),
                            lng: location.geometry.location.lng()
                        })
                        console.log('location', location.geometry.location.lat(), location.geometry.location.lng())
                    }}>{location.formatted_address}</p>
                </div>
            ))}
        </aside>
    )
}