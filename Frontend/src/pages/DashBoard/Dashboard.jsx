import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentsProof,
  getAllUsers,
  getMonthlyRevenue,
} from '@/store/slice/superAdminSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuctionItemDelete from './SubComponantes/AuctionItemDelete'
import BiddersAuctionersGraf from './SubComponantes/BiddersAuctionersGraf'
import PaymentGraph from './SubComponantes/PaymentGraph'
import PaymentProof from './SubComponantes/PaymentProof'
import Spinner from '@/customComponante/Spinner'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading } = useSelector((state) => state.superAdmin)
  const { user, isAuthenticated } = useSelector((state) => state.user)

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    dispatch(getMonthlyRevenue())
    dispatch(getAllUsers())
    dispatch(getAllPaymentsProof())
    dispatch(clearAllSuperAdminSliceErrors())
  }, [dispatch])

  /* ================= AUTH & ROLE PROTECTION ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    if (user && user.role !== 'Super Admin') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  /* ================= UI ================= */
  if (loading) return <Spinner />

  return (
    <div className="w-full ml-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
      <h1 className="text-red-500 text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
        Dashboard
      </h1>

      <div className="flex flex-col gap-10">
        <div>
          <h3 className="text-black font-bold text-xl">
            Monthly Total Payment Received
          </h3>
          <PaymentGraph />
        </div>

        <div>
          <h3 className="text-black font-bold text-xl">Users</h3>
          <BiddersAuctionersGraf />
        </div>

        <div>
          <h3 className="text-black font-bold text-xl">Payment Proofs</h3>
          <PaymentProof />
        </div>

        <div>
          <h3 className="text-black font-bold text-xl">
            Delete Item From Auction
          </h3>
          <AuctionItemDelete />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
