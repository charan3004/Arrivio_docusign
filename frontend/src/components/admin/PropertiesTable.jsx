import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function PropertiesTable({ properties }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {properties.map((property) => (
            <tr
              key={property.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">
                {property.title}
              </td>

              <td className="px-4 py-3">
                {property.city}
              </td>

              <td className="px-4 py-3">
                ₹{property.price}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {new Date(property.created_at).toLocaleDateString()}
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() =>
                    navigate(`/admin/properties/${property.id}/edit`)
                  }
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
