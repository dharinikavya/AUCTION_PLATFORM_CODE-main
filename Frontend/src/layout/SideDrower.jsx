import React, { useState } from 'react'
import { RiOctagonFill } from 'react-icons/ri'
import { MdLeaderboard, MdDashboard } from 'react-icons/md'
import { SiGooglesearchconsole } from 'react-icons/si'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { FaFacebook, FaUser } from 'react-icons/fa'
import { RiInstagramFill } from 'react-icons/ri'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdCloseCircleOutline, IoIosCreate } from 'react-icons/io'
import { FaFileInvoiceDollar, FaEye } from 'react-icons/fa6'
import { IoNotifications } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/slice/userSlice'
import { Link } from 'react-router-dom'

const SideDrower = () => {
  const [show, setShow] = useState(false)

  const { isAuthenticated, user, unreadNotificationCount } = useSelector(
    (state) => state.user
  )

  const dispatch = useDispatch()
  const handelLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-red-500 text-white text-3xl rounded-md p-2 hover:bg-red-400 lg:hidden"
      >
        <GiHamburgerMenu />
      </div>

      <div
        className={`w-[100%] sm:w-[300px] bg-white h-full fixed top-0 ${
          show ? 'left-0' : 'left-[-100%]'
        } transition-all duration-100 p-4 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-slate-500`}
      >
        <div className="relative">
          <Link to="/">
            <h4 className="text-2xl font-semibold mb-4">
              Auc<span className="text-red-600">Xchange</span>
            </h4>
          </Link>

          {/* MAIN MENU */}
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/auctions" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                <RiOctagonFill />
                Auctions
              </Link>
            </li>

            <li>
              <Link to="/leaderboard" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                <MdLeaderboard />
                Leaderboard
              </Link>
            </li>

            {/* 🔔 NOTIFICATIONS (ADDED — NO UI CHANGE) */}
            {isAuthenticated && (
              <li>
                <Link to="/notifications" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                  <IoNotifications />
                  <span className="flex items-center gap-2">
                    Notifications
                    {unreadNotificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            )}

            {isAuthenticated && user?.role === 'Auctioner' && (
              <>
                <li>
                  <Link to="/submit-commission" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                    <FaFileInvoiceDollar />
                    Submit Commission
                  </Link>
                </li>
                <li>
                  <Link to="/create-auction" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                    <IoIosCreate />
                    Create Auction
                  </Link>
                </li>
                <li>
                  <Link to="/view-my-auction" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                    <FaEye />
                    View My Auctions
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === 'Super Admin' && (
              <li>
                <Link to="/dashboard" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                  <MdDashboard />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* AUTH BUTTONS */}
          {!isAuthenticated ? (
            <div className="my-4 flex gap-2">
              <Link to="/sign-up" className="border px-3 bg-red-500 text-white font-semibold rounded-sm">
                Sign Up
              </Link>
              <Link to="/login" className="border px-3 bg-green-500 text-white font-semibold rounded-sm">
                Login
              </Link>
            </div>
          ) : (
            <div className="my-4">
              <button onClick={handelLogout} className="border px-3 bg-red-500 text-white font-semibold rounded-sm">
                Logout
              </button>
            </div>
          )}

          <hr className="mb-4 border-t-red-400" />

          {/* FOOTER LINKS */}
          <ul className="flex flex-col gap-3">
            {isAuthenticated && (
              <li>
                <Link to="/me" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                  <FaUser />
                  Profile
                </Link>
              </li>
            )}

            <li>
              <Link to="/how-it-works-info" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                <SiGooglesearchconsole />
                How it works
              </Link>
            </li>

            <li>
              <Link to="/about" className="flex text-lg font-semibold gap-2 items-center hover:text-red-500">
                <BsFillInfoSquareFill />
                About Us
              </Link>
            </li>
          </ul>

          <IoMdCloseCircleOutline
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[28px] sm:hidden"
          />
        </div>

        {/* BOTTOM */}
        <div>
          <div className="flex gap-2 mb-2">
            <FaFacebook className="text-2xl text-stone-500 hover:text-blue-700" />
            <RiInstagramFill className="text-2xl text-stone-500 hover:text-pink-500" />
          </div>
          <p className="text-stone-500">&copy; AucXchange</p>
          <p className="text-stone-500">Designed by Kavya</p>
        </div>
      </div>
    </>
  )
}

export default SideDrower
