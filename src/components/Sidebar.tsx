interface SidebarProps {
    locations: google.maps.GeocoderResult[];
}

export default function Sidebar(props: SidebarProps) {
    return (
        <aside className="w-[470px] bg-white py-4">
            {props.locations && props.locations.map((location: google.maps.GeocoderResult) => (
                <div className="px-4" key={location.place_id}>
                    <p className="font-bold text-sm leading-relaxed mt-2 p-2 cursor-pointer inline-block">{location.formatted_address}</p>
                </div>
            ))}
        </aside>
    )
}