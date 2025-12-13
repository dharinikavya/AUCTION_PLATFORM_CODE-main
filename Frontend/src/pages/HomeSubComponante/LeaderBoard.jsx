import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLeaderBoard } from '@/redux/slices/userSlice'
import { Link } from 'react-router-dom'

const LeaderBoard = () => {
  const dispatch = useDispatch()
  const { leaderboard, loading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchLeaderBoard())
  }, [dispatch])

  if (loading) {
    return <p className="text-center my-5">Loading leaderboard...</p>
  }

  return (
    <section className="my-8 lg:px-5">
      <div className="flex gap-2">
        <h3 className="font-bold text-xl">Top 10</h3>
        <h3 className="text-red-400 font-bold text-xl">
          Bidders Leaderboard
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border my-5 border-gray-400">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Profile</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Money Spent</th>
              <th className="py-2 px-4 text-left">Auctions Won</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {leaderboard.map((user, index) => (
              <tr key={user._id} className="border-b">
                <td className="py-2 px-4 font-semibold">
                  {index + 1}
                </td>

                <td className="py-2 px-4">
                  <img
                    src={user.profileImage?.url}
                    alt={user.userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </td>

                <td className="py-2 px-4">{user.userName}</td>
                <td className="py-2 px-4">₹{user.moneySpent}</td>
                <td className="py-2 px-4">{user.auctionWon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/leaderboard"
        className="border-2 border-stone-300 font-bold text-xl w-full py-2 flex justify-center rounded-md hover:border-stone-500 hover:text-red-500 transition"
      >
        See more leaderboard members
      </Link>
    </section>
  )
}

export default LeaderBoard
