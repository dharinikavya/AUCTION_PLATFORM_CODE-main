import React, { useEffect, useState } from 'react'
import {
  RiOctagonFill,
  RiInstagramFill
} from 'react-icons/ri'
import {
  MdLeaderboard,
  MdDashboard,
  MdNotifications
} from 'react-icons/md'
import { SiGooglesearchconsole } from 'react-icons/si'
import { BsFillInfoSquareFill } from 'react-icons/bs'
import { FaFacebook, FaUser, FaEye } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdCloseCircleOutline, IoIosCreate } from 'react-icons/io'
import { FaFileInvoiceDollar } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import {
  logout,
  fetchNotifications,
  markReadNotifications
} from '@/store/slice/userSlice'
import { Link } from 'react-router-dom'

const SideDrawer = () => {
  const [show, setShow] = useState(false)
  const [showNotify, setShowNotify] = useState(false)

  const dispatch = useDispatch()
  const {
    isAuthenticated,
    user,
    notifications,
    unreadNotificationCount
  } = useSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, isAuthenticated])

  const handleLogout = () => {
    dispatch(logout())
  }

  const openNotifications = () => {
    setShowNotify(!showNotify)
    dispatch(markReadNotifications())
  }

  return (
    <>
      {/* MOBILE MENU ICON */}
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-red-500 text-white text-3xl rounded-md p-2 lg:hidden z-50"
      >
        <GiHamburgerMenu />
      </div>

      {/* SIDEDRAWER */}
      <div
        className={`w-full sm:w-[300px] bg-white h-full fixed top-0 ${
          show ? 'left-0' : 'left-[-100%]'
        } transition-all duration-200 p-4 flex flex-col justify-between lg:left-0 border-r border-slate-300 z-40`}
      >
        <div className="relative">
          <Link to="/">
            <h4 className="text-2xl font-semibold mb-4">
              Auc<span className="text-red-600">Xchange</span>
            </h4>
          </Link>

          {/* 🔔 NOTIFICATION ICON */}
          {isAuthenticated && (
            <div className="relative mb-4">
              <button
                onClick={openNotifications}
                className="flex items-center gap-2 font-semibold"
              >
                <MdNotifications size={24} />
                Notifications
                {unreadNotificationCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* 🔽 DROPDOWN */}
              {showNotify && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded p-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-2 border-b text-sm ${
                          !n.isRead ? 'bg-red-50' : ''
                        }`}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* MENU */}
          <ul className="flex flex-col gap-3">
            <li>
              <Link to="/auctions" className="flex gap-2 items-center">
                <RiOctagonFill /> Auctions
              </Link>
            </li>

            <li>
              <Link to="/leaderboard" className="flex gap-2 items-center">
                <MdLeaderboard /> Leaderboard
              </Link>
            </li>

            {isAuthenticated && user?.role === 'Auctioner' && (
              <>
                <li>
                  <Link to="/submit-commission" className="flex gap-2">
                    <FaFileInvoiceDollar /> Submit Commission
                  </Link>
                </li>
                <li>
                  <Link to="/create-auction" className="flex gap-2">
                    <IoIosCreate /> Create Auction
                  </Link>
                </li>
                <li>
                  <Link to="/view-my-auction" className="flex gap-2">
                    <FaEye /> View My Auctions
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === 'Super Admin' && (
              <li>
                <Link to="/dashboard" className="flex gap-2">
                  <MdDashboard /> Dashboard
                </Link>
              </li>
            )}
          </ul>

          <hr className="my-4" />

          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link to="/sign-up" className="btn-red">Sign Up</Link>
              <Link to="/login" className="btn-green">Login</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn-red">
              Logout
            </button>
          )}

          <IoMdCloseCircleOutline
            onClick={() => setShow(false)}
            className="absolute top-0 right-2 text-2xl sm:hidden"
          />
        </div>

        {/* FOOTER */}
        <div>
          <div className="flex gap-2 mb-2">
            <FaFacebook />
            <RiInstagramFill />
          </div>
          <p className="text-sm text-gray-500">
            © AucXchange | Designed by Kavya
          </p>
        </div>
      </div>
    </>
  )
}

export default SideDrawer
