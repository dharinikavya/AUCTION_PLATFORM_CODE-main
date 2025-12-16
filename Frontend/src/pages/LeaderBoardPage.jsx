import Spinner from '@/customComponante/Spinner'
import React from 'react'
import { useSelector } from 'react-redux'

const LeaderBoardPage = () => {
  const { leaderboard, loading } = useSelector((state) => state.user)

  return (
    <section className="w-full ml-0 h-fit pt-20 px-5 lg:pl-[320px] flex flex-col">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Title */}
          <div className="flex flex-col mb-5">
            <h1 className="text-red-500 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Bidders Leaderboard
            </h1>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border my-5 border-gray-400">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">Profile Pic</th>
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Bid Expenditure</th>
                  <th className="py-2 px-4 text-left">Auctions Won</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {leaderboard.slice(0, 100).map((element, i) => (
                  <tr
                    key={element._id}
                    className="border-b border-gray-300"
                  >
                    {/* Rank + Profile */}
                    <td className="py-2 px-4">
                      <div className="flex gap-2 items-center">
                        <span className="text-stone-400 font-semibold text-xl w-7 hidden sm:block">
                          {i + 1}
                        </span>
                        <img
                          src={element.profileImage?.url}
                          alt={element.userName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Username + Winner Badge */}
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <span>{element.userName}</span>

                        {element.auctionWon > 0 && (
                          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                            🏆 Winner
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Money Spent */}
                    <td className="py-2 px-4">
                      ₹{element.moneySpent}
                    </td>

                    {/* Auctions Won */}
                    <td className="py-2 px-4">
                      {element.auctionWon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default LeaderBoardPage
