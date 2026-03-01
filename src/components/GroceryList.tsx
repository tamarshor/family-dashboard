"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface GroceryItem {
  id: string;
  name: string;
  requested_by: string;
  status: "requested" | "ordered";
  created_at: string;
}

export default function GroceryList() {
  const [currentUser, setCurrentUser] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [groceryInput, setGroceryInput] = useState("");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("familyUser") || "";
    setCurrentUser(savedUser);

    // Fetch existing items
    fetchItems();

    // Listen for real-time changes
    const channel = supabase
      .channel("groceries")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groceries" },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchItems() {
    const { data } = await supabase
      .from("groceries")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) setItems(data);
    setLoaded(true);
  }

  function saveName() {
    const name = nameInput.trim();
    if (!name) return;
    setCurrentUser(name);
    localStorage.setItem("familyUser", name);
  }

  function changeName() {
    setCurrentUser("");
    setNameInput("");
    localStorage.removeItem("familyUser");
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const name = groceryInput.trim();
    if (!name) return;

    await supabase.from("groceries").insert({
      name,
      requested_by: currentUser,
      status: "requested",
    });

    setGroceryInput("");
    fetchItems();
  }

  async function markOrdered(id: string) {
    await supabase.from("groceries").update({ status: "ordered" }).eq("id", id);
    fetchItems();
  }

  async function removeItem(id: string) {
    await supabase.from("groceries").delete().eq("id", id);
    fetchItems();
  }

  if (!loaded) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-blue-500 mb-4">Grocery List</h2>

      {!currentUser ? (
        <div className="flex gap-2 items-center mb-4">
          <p className="font-medium whitespace-nowrap">Who are you?</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            placeholder="Enter your name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={saveName}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Adding as <strong className="text-gray-700">{currentUser}</strong>{" "}
            <button onClick={changeName} className="text-blue-500 hover:underline">
              change
            </button>
          </p>

          <form onSubmit={addItem} className="flex gap-2 mb-5">
            <input
              type="text"
              value={groceryInput}
              onChange={(e) => setGroceryInput(e.target.value)}
              placeholder="Add an item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </>
      )}

      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-5">No items yet. Add something!</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={item.status === "ordered" ? "line-through text-gray-400" : "font-medium"}>
                    {item.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === "ordered"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.status === "ordered" ? "Ordered" : "Requested"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Added by {item.requested_by}</p>
              </div>
              <div className="flex gap-1.5">
                {item.status === "requested" && (
                  <button
                    onClick={() => markOrdered(item.id)}
                    className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                  >
                    Mark Ordered
                  </button>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
