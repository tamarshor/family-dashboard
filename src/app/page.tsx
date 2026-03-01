import GroceryList from "@/components/GroceryList";
import CreativePicker from "@/components/CreativePicker";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-5 text-center">
        <h1 className="text-2xl font-semibold">Family Dashboard</h1>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <GroceryList />
        <CreativePicker />
      </main>
    </div>
  );
}
