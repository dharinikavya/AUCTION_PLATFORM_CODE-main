import Spinner from '@/customComponante/Spinner'
import { getAuctionDetail } from '@/store/slice/auctionSlice'
import { placedBid } from '@/store/slice/bidSlice'
import React, { useEffect, useState } from 'react'
import { FaGreaterThan } from 'react-icons/fa'
import { RiAuctionFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

const AuctionItem = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, auctionDetail, auctionBidder } = useSelector(
    (state) => state.auction
  )
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const [amount, setAmount] = useState('')

  /* ================= PLACE BID ================= */
  const handleBid = () => {
    if (!amount) return alert('Enter bid amount')
    dispatch(placedBid(id, amount))
    dispatch(getAuctionDetail(id))
    setAmount('')
  }

  /* ================= DELETE AUCTION ================= */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auctionitem/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include', // ✅ httpOnly cookie auth
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Delete failed')
      }

      alert('Auction deleted successfully')
      navigate('/view-my-auction')
    } catch (error) {
      console.error('DELETE ERROR:', error)
      alert(error.message || 'Delete failed')
    }
  }

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    dispatch(getAuctionDetail(id))
  }, [dispatch, id, isAuthenticated, navigate])

  return (
    <section className="w-full px-5 pt-20 lg:pl-[320px]">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-[16px] items-center">
        <Link to="/" className="font-semibold hover:text-red-500">Home</Link>
        <FaGreaterThan />
        <Link to="/auctions" className="font-semibold hover:text-red-500">Auctions</Link>
        <FaGreaterThan />
        <p className="text-gray-600">{auctionDetail?.title}</p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* LEFT */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <img
              src={auctionDetail?.image?.url}
              alt={auctionDetail?.title}
              className="h-40 w-40 object-cover mb-4"
            />

            <h2 className="text-xl font-bold">{auctionDetail?.title}</h2>
            <p className="font-semibold mt-2">
              Starting Bid: ₹{auctionDetail?.startingBid}
            </p>
            <p className="mt-1">
              Condition:{' '}
              <span className="font-semibold text-green-600">
                {auctionDetail?.condition}
              </span>
            </p>

            {/* DELETE BUTTON */}
            {(user?._id === auctionDetail?.createdBy ||
              user?.role === 'Super Admin') && (
              <button
                onClick={handleDelete}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Auction
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex-1 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Bids</h3>

            {auctionBidder?.length > 0 ? (
              auctionBidder.map((bid, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <p className="font-semibold">{bid.userName}</p>
                  <p className="font-bold">₹{bid.amount}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No bids yet</p>
            )}

            {/* BID INPUT */}
            {Date.now() >= new Date(auctionDetail?.startTime) &&
            Date.now() <= new Date(auctionDetail?.endTime) ? (
              <div className="flex items-center gap-3 mt-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter bid"
                  className="border px-3 py-2 rounded w-32"
                />
                <button
                  onClick={handleBid}
                  className="bg-black text-white p-3 rounded-full"
                >
                  <RiAuctionFill />
                </button>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">Auction Ended</p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default AuctionItem
