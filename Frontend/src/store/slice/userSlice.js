import { USER_API_POINT } from '@/utils/APIs'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: null,
    leaderboard: [],
  },
  reducers: {
    /* ================= AUTH ================= */
    registerRequest(state) {
      state.loading = true
    },
    registerSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
    },
    registerFailed(state) {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
    },

    loginRequest(state) {
      state.loading = true
    },
    loginSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
    },
    loginFailed(state) {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
    },

    logoutSuccess(state) {
      state.isAuthenticated = false
      state.user = null
    },

    /* ================= USER ================= */
    fetchUserRequest(state) {
      state.loading = true
    },
    fetchUserSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
    },
    fetchUserFailed(state) {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
    },

    /* ================= LEADERBOARD ================= */
    fetchLeaderBoardRequest(state) {
      state.loading = true
    },
    fetchLeaderBoardSuccess(state, action) {
      state.loading = false
      state.leaderboard = action.payload
    },
    fetchLeaderBoardFailed(state) {
      state.loading = false
      state.leaderboard = []
    },
  },
})

/* ================= REGISTER ================= */
export const register = (formData) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest())
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/register`,
      formData,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    dispatch(userSlice.actions.registerSuccess(data))
    toast.success(data.message)
  } catch (error) {
    dispatch(userSlice.actions.registerFailed())
    toast.error(error?.response?.data?.message)
  }
}

/* ================= LOGIN ================= */
export const login = ({ email, password }) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest())
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/login`,
      { email, password },
      { withCredentials: true }
    )
    dispatch(userSlice.actions.loginSuccess(data))
    toast.success(data.message)
  } catch (error) {
    dispatch(userSlice.actions.loginFailed())
    toast.error(error?.response?.data?.message)
  }
}

/* ================= LOGOUT ================= */
export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${USER_API_POINT}/logout`, {
      withCredentials: true,
    })
    dispatch(userSlice.actions.logoutSuccess())
    toast.success(data.message)
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
}

/* ================= FETCH USER ================= */
export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest())
  try {
    const { data } = await axios.get(`${USER_API_POINT}/me`, {
      withCredentials: true,
    })
    dispatch(userSlice.actions.fetchUserSuccess(data.user))
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed())
  }
}

/* ================= FETCH LEADERBOARD ================= */
export const fetchLeaderBoard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderBoardRequest())
  try {
    const { data } = await axios.get(`${USER_API_POINT}/leaderboard`, {
      withCredentials: true,
    })
    dispatch(
      userSlice.actions.fetchLeaderBoardSuccess(data.leaderboard)
    )
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderBoardFailed())
  }
}

export default userSlice.reducer
