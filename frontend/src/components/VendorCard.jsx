import React from 'react'
import { Link } from 'react-router-dom'
export default function VendorCard({ v }){
  return (
    <Link to={`/vendor/${v._id}`} className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <img src={v.avatar || '/src/assets/placeholder.jpg'} className="w-16 h-16 rounded-full object-cover" alt={v.shopName}/>
        <div>
          <div className="font-semibold">{v.shopName}</div>
          <div className="text-sm text-gray-500">{v.bio?.slice(0,60)}</div>
        </div>
      </div>
    </Link>
  )
}
