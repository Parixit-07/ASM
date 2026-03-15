import { useEffect, useState } from 'react'
import { fetchReviews, updateReview, deleteReview } from '../../api/reviews'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    fetchReviews()
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleApprove = async (id, approved) => {
    try {
      await updateReview(id, approved)
      load()
    } catch (err) {
      setError(err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return
    try {
      await deleteReview(id)
      load()
    } catch (err) {
      setError(err)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        Loading reviews...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        {error.message || 'Unable to load reviews.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
        <p className="mt-2 text-sm text-slate-600">Moderate product reviews and remove spam.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Product</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">User</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Rating</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Comment</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-900">{review.product?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{review.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{review.rating}</td>
                  <td className="px-4 py-3 text-slate-600">{review.comment}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {review.approved ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Approved</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                        onClick={() => handleApprove(review._id, !review.approved)}
                      >
                        {review.approved ? 'Reject' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
