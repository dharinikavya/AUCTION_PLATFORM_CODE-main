import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SideDrower from './layout/SideDrower'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import SubmitCommission from './pages/SubmitCommission'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLeaderBoard,
  fetchUser,
  fetchNotifications,
  resetWinSound, // 🔇 reset sound flag
} from './store/slice/userSlice'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import { getAllAuctionItem } from './store/slice/auctionSlice'
import LeaderBoardPage from './pages/LeaderBoardPage'
import Auctions from './pages/Auctions'
import AuctionItem from './pages/AuctionItem'
import CreateAuction from './pages/CreateAuction'
import ViewMyAuctions from './pages/ViewMyAuctions'
import ViewAuctionDetail from './pages/ViewAuctionDetail'
import Dashboard from './pages/DashBoard/Dashboard'
import ContactUs from './pages/ContactUs'
import UserProfile from './pages/UserProfile'
import Notifications from './pages/Notifications'

const App = () => {
  const dispatch = useDispatch()
  const { playWinSound } = useSelector((state) => state.user)

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    dispatch(fetchUser())
    dispatch(getAllAuctionItem())
    dispatch(fetchLeaderBoard())
    dispatch(fetchNotifications())
  }, [])

  /* ================= AUTO FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchNotifications())
    }, 30000) // ⏱️ every 30 seconds

    return () => clearInterval(interval)
  }, [])

  /* ================= 🔊 PLAY WIN SOUND ================= */
  useEffect(() => {
    if (playWinSound) {
      const audio = new Audio('/sounds/win.mp3')
      audio.play().catch(() => {})

      dispatch(resetWinSound()) // 🔇 reset after play
    }
  }, [playWinSound])

  return (
    <BrowserRouter>
      <SideDrower />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit-commission" element={<SubmitCommission />} />
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<LeaderBoardPage />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/auction/item/:id" element={<AuctionItem />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/view-my-auction" element={<ViewMyAuctions />} />
        <Route path="/auction/details/:id" element={<ViewAuctionDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/me" element={<UserProfile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      <ToastContainer position="top-right" />
    </BrowserRouter>
  )
}

export default App
