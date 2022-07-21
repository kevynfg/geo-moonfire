import GoogleMapReact from 'google-map-react'
import { useEffect, useRef, useState } from "react";
import Marker from '../components/Marker'
import { MarkerOps } from "../utils/types/marker.type";

interface MapProps {
    coordinates: {
        lat: number;
        lng: number;
    }
    setCoordinates: (coordinates: { lat: number; lng: number }) => void; 
    markers: MarkerOps[]
    findPlaceByMapClick: (lat: number, lng: number) => void;
}

export default function Map(props: MapProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState<google.maps.Marker>();
    const googlemap = useRef(null);
    let google: any;
    
    if (typeof window !== "undefined" && typeof window.google !== "undefined") {
        google = window.google;
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
            props.setCoordinates({
                lat: latitude,
                lng: longitude,
            })
        });
    }, [])

    useEffect(() => {
        if (!userMarker && typeof google !== "undefined") {
            setUserMarker(new google.maps.Marker());
        }

        return () => {
            if (userMarker) {
                userMarker.setMap(null);
            }
        }
    }, [userMarker, google])

    useEffect(() => {
        if (userMarker) {
            userMarker.setPosition(new google.maps.LatLng(props.coordinates.lat, props.coordinates.lng));
            userMarker.setMap(map);
        }
    }, [props.coordinates])

    console.log('props.coordinates', props.coordinates)
    return (
        <div className="flex flex-1">
            <section className="h-[90vh] w-[100%]">
                <GoogleMapReact 
                    ref={googlemap}
                    bootstrapURLKeys={ { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string, libraries: ["places", "geometry"] } }
                    yesIWantToUseGoogleMapApiInternals={true}
                    center={ props.coordinates }
                    zoom={15}
                    defaultZoom={10}
                    margin={[50, 50, 50, 50]}
                    // onChange={(({ bounds }) => {
                    //     console.log('center', bounds)
                        
                    // })}
                    onChildClick={(key, childProps) => {
                        console.log('key and childProps', key, childProps)
                    }}
                    onGoogleApiLoaded={({ map, maps, ref }) => {
                        setMap(map);
                    }}
                    onClick={(event: GoogleMapReact.ClickEventValue) => {
                        console.log('event', event)
                        console.log('ref', googlemap.current)
                        
                        if (userMarker) {
                            userMarker.setMap(null)
                            setUserMarker(new window.google.maps.Marker({
                                position: {
                                    lat: event.lat,
                                    lng: event.lng,
                                }, 
                                map: map,
                                title: 'Localização',
                            }))

                            props.findPlaceByMapClick(event.lat, event.lng)
                        }
                    }}
                    >
                        {props.markers.length > 0 && props.markers.map((marker) => {
                            if (marker.position) {
                                return (
                                    <Marker 
                                    key={`${marker.position?.lat}/${marker.position?.lng}`} 
                                    lat={marker.position.lat} 
                                    lng={marker.position.lng} 
                                    description={marker.title} 
                                    popover={isOpen} 
                                    setIsOpen={setIsOpen}
                                    />
                                )
                            }
                        })}
                    </GoogleMapReact>
                </section>
        </div>
    )
}