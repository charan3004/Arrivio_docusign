import AdminSidebar from "../../components/admin/AdminSidebar";
import AddPropertyForm from "../../components/admin/AddPropertyForm";

export default function AddProperty() {
  return (
    <div className="flex bg-[#EAE8E4] min-h-screen">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-semibold mb-6">
          Add Property
        </h1>

        <AddPropertyForm />
      </div>
    </div>
  );
}


