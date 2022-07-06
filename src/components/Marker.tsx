import { Alien } from "phosphor-react";
import { useEffect, useState } from "react";

interface MarkerProps {
    id?: string
    lat: number
    lng: number
    description: string
    title?: string
    popover?: boolean
    setIsOpen: (value: boolean) => void
}

export default function Marker(props: MarkerProps) {
    console.log('props marker', props)
        return (
        <div className="hover:cursor-pointer" onClick={() => props.setIsOpen(!props.popover)}>
            <Alien weight="fill" size={30}></Alien> 
            {props.popover && (
                <div className="absolute bg-white rounded-lg shadow-lg p-4">
                    <p className="text-sm">{props.description}</p>
                </div>
            )}
        </div>
    )
}