import { X } from "lucide-react";
import AddPropertyForm from "./AddPropertyForm";

export default function AddPropertyModal({ onClose, onSaved }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <h1 className="text-2xl font-semibold">Add Property</h1>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="p-8">
          <AddPropertyForm
            onSuccess={() => {
              onSaved();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
