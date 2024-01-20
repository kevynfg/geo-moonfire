import GoogleMapReact from 'google-map-react';
import { useEffect, useRef, useState } from "react";
import Marker from '../components/Marker';
import { MarkerOps } from "../utils/types/marker.type";
import ConfirmNewPlacedMarker from "./ConfirmNewPlacedMarker";

interface MapProps {
    coordinates: {
        lat: number;
        lng: number;
    }
    setCoordinates: (coordinates: { lat: number; lng: number }) => void; 
    markers: MarkerOps[]
    findPlaceByMapClick: (lat: number, lng: number) => void;
}

type UserMarkerInfo = {
    position: {
        lat: number;
        lng: number;
    },
    title: string;
}

export default function Map(props: MapProps) {
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState<google.maps.Marker>();
    const [userMarkerInfo, setUserMarkerInfo] = useState<UserMarkerInfo>({} as UserMarkerInfo);
    const [isConfirmMarkerOpen, setIsConfirmMarkerOpen] = useState(false);
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
            // userMarker.setPosition(new google.maps.LatLng(props.coordinates.lat, props.coordinates.lng));
            // userMarker.setMap(map);
        }
        return () => {
            if (userMarker) {
                userMarker.setMap(null);
            }
        }
    }, [props.coordinates])

    const handleConfirmMarker = () => {
        setIsConfirmMarkerOpen(false);
        props.findPlaceByMapClick(userMarkerInfo.position.lat, userMarkerInfo.position.lng);
        console.log('userMarkerInfo', userMarkerInfo);
        // const newMarker = 
        // new window.google.maps.Marker({
        //     position: {
        //         lat: userMarkerInfo.position.lat,
        //         lng: userMarkerInfo.position.lng,
        //     }, 
        //     map: map,
        //     title: 'Teste',
        // });
        // setUserMarker(newMarker);
                     
        console.log('props.coordinates', props);
        props.markers.push(userMarkerInfo);
    }

    function handleCloseMarker() {
        setIsConfirmMarkerOpen(false);
    }

    console.log('rerender')
    return (
        <div className="flex flex-1" id='map-dashboard'>
            <section className="h-[90vh] w-[100%]">
                <GoogleMapReact 
                    ref={googlemap}
                    bootstrapURLKeys={ { key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string, libraries: ["places", "geometry"] } }
                    yesIWantToUseGoogleMapApiInternals={true}
                    center={ props.coordinates }
                    zoom={15}
                    defaultZoom={10}
                    margin={[50, 50, 50, 50]}
                    onChildClick={(key, childProps) => {
                    }}
                    onGoogleApiLoaded={({ map, maps, ref }) => {
                        setMap(map);
                    }}
                    onClick={(callbackEvent: any) => {       
                        console.log('edit', callbackEvent)
                        setUserMarkerInfo({
                            position: {
                                lat: callbackEvent.lat,
                                lng: callbackEvent.lng,
                            },
                            title: 'teste',
                        })
                         setIsConfirmMarkerOpen(true);
                    }}
                    >
                    {props.markers?.length > 0 && props.markers.map((marker) => {
                        if (marker.position && marker.position.lat && marker.position.lng) {
                            return (
                                <Marker 
                                    id={`${marker.position?.lat}/${marker.position?.lng}`} 
                                    key={`${marker.position?.lat}/${marker.position?.lng}`}
                                    lat={marker.position.lat} 
                                    lng={marker.position.lng} 
                                    description={marker.title} 
                                />
                            )
                        }
                    })}
                    <ConfirmNewPlacedMarker isOpen={isConfirmMarkerOpen} handleConfirm={handleConfirmMarker} handleClose={handleCloseMarker} />
                    </GoogleMapReact>
                </section>
        </div>
    )
}