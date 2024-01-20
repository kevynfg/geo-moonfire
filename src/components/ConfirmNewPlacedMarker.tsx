import { createPortal } from "react-dom";

interface ConfirmNewPlacedMarkerProps {
  isOpen: boolean,
  handleConfirm: () => void;
  handleClose: () => void;
}

export default function ConfirmNewPlacedMarker({ isOpen, handleConfirm, handleClose }: ConfirmNewPlacedMarkerProps) {
  if (!isOpen) return null;
  return createPortal(
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg p-4">
      <p className="text-sm">Confirm new marker?</p>
      <div className="flex justify-between">
        <button className="bg-red-500 rounded-lg text-white px-4 py-2" onClick={handleClose} >Cancel</button>
        <button className="bg-green-500 rounded-lg text-white px-4 py-2" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  </div>
  , document.getElementById('map-dashboard')! as HTMLElement)
}