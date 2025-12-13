import { login } from '@/store/slice/userSlice'
import React, { useEffect, useState } from 'react'
import { RiLoader2Fill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { isAuthenticated, loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const handelLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))   // ✅ JSON NOT FormData
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo('/')
    }
  }, [isAuthenticated, navigateTo])

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <form
        onSubmit={handelLogin}
        className="bg-white p-6 rounded-md shadow-md w-[350px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 border p-2"
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? <RiLoader2Fill className="animate-spin mx-auto" /> : 'Login'}
        </button>
      </form>
    </section>
  )
}

export default Login
