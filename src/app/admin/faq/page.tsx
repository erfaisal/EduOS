import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/services/faq";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default async function AdminFaqPage() {
  const allFaqs = await getFaqs();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage FAQs</h1>
      <FaqManager initialData={allFaqs} />
    </div>
  );
}

"use client";

export function FaqManager({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    order_index: 0,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ question: "", answer: "", category: "", order_index: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "",
      order_index: faq.order_index ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq(id);
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateFaq(editingId, formData);
    } else {
      await createFaq(formData);
    }
    router.refresh();
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ question: "", answer: "", category: "", order_index: 0 });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleOpenAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Add FAQ
      </button>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 font-semibold">Question</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Order</th>
              <th className="p-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialData && initialData.length > 0 ? (
              initialData.map((faq: any) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{faq.question}</td>
                  <td className="p-3 text-gray-600">{faq.category}</td>
                  <td className="p-3 text-gray-600">{faq.order_index}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No FAQs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order Index</label>
                <input
                  type="number"
                  required
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}