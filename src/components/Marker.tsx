import { House } from "phosphor-react";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface MarkerProps {
    id?: string
    lat: number
    lng: number
    description: string
    title?: string
}

// function Popover() {
//     return (
//         <div className="absolute bg-white rounded-lg shadow-lg p-4">
//             <p className="text-sm">Confirm new marker?</p>
//             <div className="flex justify-between">
//                 <button className="bg-red-500 rounded-lg text-white px-4 py-2">Cancel</button>
//                 <button className="bg-green-500 rounded-lg text-white px-4 py-2">Confirm</button>
//             </div>
//         </div>
//     )
// }

export default function Marker(props: MarkerProps) {
    console.log('clicou')
    const portalRoot = document.getElementById(`${props.lat}/${props.lng}`);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    function handleMouseEnter(event: any) {
        const targetRect = event.nativeEvent.target.getBoundingClientRect();
        const portalRect = portalRoot?.getBoundingClientRect();

        const top = targetRect.bottom + window.scrollY;
        const left = targetRect.left + window.scrollX - portalRect?.left!;

        setIsOpen(true);
        if (popoverRef?.current) {
            popoverRef.current.style.top = `${top}px`;
            popoverRef.current.style.left = `${left}px`;
        }
    }

    function handleMouseLeave() {
        setIsOpen(false);
    }

    return (
        <div ref={popoverRef} 
            className="hover:cursor-pointer flex flex-col flex-wrap" 
            id={props.id} 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            <House weight="fill" size={38}></House>
            {/* {isOpen && (
                createPortal(
                    <div className="absolute bg-white rounded-lg shadow-lg p-4">
                        <p className="text-sm">Descrição: {props.description}</p>
                    </div>
                , portalRoot!)
            )} */}
            <Popover>
                <PopoverTrigger>Editar</PopoverTrigger>
                <PopoverContent>
                    <span style={{fontSize: '30px'}}>Editar</span>
                </PopoverContent>
            </Popover>
            {/* <EditingMarkerModal isOpen={isEditing} /> */}
        </div>
    )
}