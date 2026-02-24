export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={22} />
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>
      </div>
    </div>
  );
}
