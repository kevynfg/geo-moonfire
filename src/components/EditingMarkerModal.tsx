type EditingMarkerModalProps = {
    isOpen: boolean;
}

export default function EditingMarkerModal({ isOpen } : EditingMarkerModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-4">
                <p className="text-sm">Editing marker</p>
                <div className="flex justify-between">
                    <button className="bg-red-500 rounded-lg text-white px-4 py-2">Cancel</button>
                    <button className="bg-green-500 rounded-lg text-white px-4 py-2">Confirm</button>
                </div>
            </div>
        </div>
    )
}