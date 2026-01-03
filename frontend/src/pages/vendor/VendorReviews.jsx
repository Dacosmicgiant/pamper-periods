// src/pages/vendor/VendorReviews.jsx
import React, { useEffect, useState } from "react";
import VendorSidebar from "../../components/vendor/VendorSidebar";
import VendorTopbar from "../../components/vendor/VendorTopbar";
import API from "../../api/api";

export default function VendorReviews() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sort, setSort] = useState("newest");

  // reply editing state
  const [editingReplyFor, setEditingReplyFor] = useState(null); // reviewId
  const [replyText, setReplyText] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);




  const loadStats = React.useCallback(async () => {
    try {
      const { data } = await API.get("/vendor/reviews/stats");
      setStats(data);
    } catch (err) {
      console.error("Rating stats error:", err);
    }
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await API.get("/vendor/reviews");
        setReviews(data);
        setFiltered(data);
      } catch (err) {
        console.error("Review fetch error:", err);
        alert("Failed to load reviews");
      }
    };
    loadReviews();
    loadStats();
  }, [loadStats]);

  // filter by rating
  const filterByRating = (rating) => {
    setRatingFilter(rating);
    if (rating === 0) {
      setFiltered(reviews);
      applySort(reviews, sort);
      return;
    }
    const arr = reviews.filter((r) => r.rating === rating);
    setFiltered(arr);
    applySort(arr, sort);
  };

  // sort wrapper
  const applySort = (arr, sortType) => {
    const copy = [...arr];
    if (sortType === "newest") {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortType === "oldest") {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortType === "highest") {
      copy.sort((a, b) => b.rating - a.rating);
    }
    return copy;
  };

  // sort handler
  const sortReviews = (type) => {
    setSort(type);
    const sorted = applySort(filtered, type);
    setFiltered(sorted);
  };

  // delete review (vendor only)
  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      setLoadingAction(true);
      await API.delete(`/vendor/reviews/${reviewId}`);
      // remove locally
      const newReviews = reviews.filter(r => r._id !== reviewId);
      setReviews(newReviews);
      setFiltered(newReviews.filter(r => (ratingFilter === 0 ? true : r.rating === ratingFilter)));
      await loadStats();
      setLoadingAction(false);
    } catch (err) {
      console.error("Delete review error:", err);
      alert(err.response?.data?.message || "Failed to delete review");
      setLoadingAction(false);
    }
  };

  // start reply (open editor)
  const startReply = (review) => {
    setEditingReplyFor(review._id);
    setReplyText(review.reply?.text || "");
    // scroll into view or focus logic can be added
  };

  // cancel reply edit/create
  const cancelReply = () => {
    setEditingReplyFor(null);
    setReplyText("");
  };

  // submit reply (create or edit)
  const submitReply = async (reviewId) => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty");
      return;
    }
    try {
      setLoadingAction(true);
      // if review already has reply -> PUT else POST (we can just call PUT which sets reply)
      await API.put(`/vendor/reviews/${reviewId}/reply`, { text: replyText.trim() });
      // update local copy
      const updated = reviews.map(r => {
        if (r._id === reviewId) {
          return { ...r, reply: { text: replyText.trim(), date: new Date().toISOString() } };
        }
        return r;
      });
      setReviews(updated);
      setFiltered(updated.filter(r => (ratingFilter === 0 ? true : r.rating === ratingFilter)));
      setEditingReplyFor(null);
      setReplyText("");
      setLoadingAction(false);
    } catch (err) {
      console.error("Submit reply error:", err);
      alert(err.response?.data?.message || "Failed to save reply");
      setLoadingAction(false);
    }
  };

  // delete reply
  const deleteReply = async (reviewId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      setLoadingAction(true);
      await API.delete(`/vendor/reviews/${reviewId}/reply`);
      const updated = reviews.map(r => r._id === reviewId ? { ...r, reply: undefined } : r);
      setReviews(updated);
      setFiltered(updated.filter(r => (ratingFilter === 0 ? true : r.rating === ratingFilter)));
      setLoadingAction(false);
    } catch (err) {
      console.error("Delete reply error:", err);
      alert(err.response?.data?.message || "Failed to delete reply");
      setLoadingAction(false);
    }
  };

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1">
        <VendorTopbar title="Product Reviews" />

        <main className="p-6">
          {/* filter + sort */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => filterByRating(star)}
                  className={`px-3 py-1 rounded-lg border ${ratingFilter === star ? "bg-pink-600 text-white" : "bg-white"}`}
                >
                  {star === 0 ? "All" : `${star} ⭐`}
                </button>
              ))}
            </div>

            <select value={sort} onChange={(e) => sortReviews(e.target.value)} className="border p-2 rounded-lg bg-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>

          {/* rating stats */}
          <div className="mb-6 bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-3">Average Rating Per Product</h3>
            {stats.length === 0 ? (
              <p className="text-gray-600">No ratings yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.map(item => (
                  <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg">
                    {/* product image - populate client will request product details separately; safe fallback */}
                    <img src={item._id.images?.[0] || "/placeholder.png"} alt="" className="w-14 h-14 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{item._id.title || "Product"}</p>
                      <p className="text-sm text-gray-500">Avg: <b>{item.avgRating ? item.avgRating.toFixed(1) : "0.0"}</b> ⭐</p>
                      <p className="text-xs text-gray-400">{item.totalReviews} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* reviews list */}
          {filtered.length === 0 ? (
            <p className="text-gray-500">No reviews found.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map(r => (
                <div key={r._id} className="p-4 bg-white border rounded-xl shadow-sm flex gap-4">
                  <img src={r.product?.images?.[0] || "/placeholder.png"} alt="" className="w-20 h-20 rounded object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{r.product?.title || "Product"}</h3>
                        <p className="text-sm text-gray-600">{r.user?.name} ({r.user?.email || "—"})</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-yellow-500 text-sm">
                          {"⭐".repeat(r.rating)}{"✩".repeat(5 - r.rating)}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mt-2">{r.text}</p>

                    {r.photos?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {r.photos.map((p, i) => (
                          <img key={i} src={p} alt="" className="w-16 h-16 object-cover rounded border" />
                        ))}
                      </div>
                    )}

                    {/* vendor reply area */}
                    <div className="mt-3">
                      {r.reply ? (
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-gray-800">You replied:</p>
                              <p className="text-gray-700 mt-1">{r.reply.text}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(r.reply.date).toLocaleString()}</p>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <button onClick={() => { startReply(r); }} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg">Edit</button>
                              <button onClick={() => deleteReply(r._id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">Delete</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <button onClick={() => startReply(r)} className="px-3 py-1 text-sm bg-pink-600 text-white rounded-lg">Reply</button>
                          <button onClick={() => deleteReview(r._id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg">Delete Review</button>
                        </div>
                      )}

                      {/* Reply editor */}
                      {editingReplyFor === r._id && (
                        <div className="mt-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            className="w-full p-3 border rounded-lg"
                            placeholder="Write your reply to the customer..."
                          />
                          <div className="flex gap-2 mt-2">
                            <button disabled={loadingAction} onClick={() => submitReply(r._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                              {loadingAction ? "Saving..." : "Save Reply"}
                            </button>
                            <button disabled={loadingAction} onClick={cancelReply} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
