import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export function StarRating({ rating = 0, size = 12 }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: fullStars }).map((_, idx) => (
        <FaStar key={`full-${idx}`} size={size} />
      ))}
      {hasHalf ? <FaStarHalfAlt size={size} /> : null}
      {Array.from({ length: emptyStars }).map((_, idx) => (
        <FaRegStar key={`empty-${idx}`} size={size} className="text-slate-300" />
      ))}
    </span>
  )
}
