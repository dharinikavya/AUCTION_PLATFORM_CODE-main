import { USER_API_POINT } from "@/utils/APIs";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

/* ================= LEADERBOARD ================= */
export const fetchLeaderBoard = createAsyncThunk(
  "user/fetchLeaderBoard",
  async () => {
    const { data } = await axios.get(`${USER_API_POINT}/leaderboard`);
    return data.leaderboard;
  }
);

/* ================= NOTIFICATIONS ================= */
export const fetchNotifications = createAsyncThunk(
  "user/fetchNotifications",
  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/notifications`,
      { withCredentials: true }
    );
    return data.notifications;
  }
);

export const markReadNotifications = createAsyncThunk(
  "user/markReadNotifications",
  async () => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/notifications/read`,
      {},
      { withCredentials: true }
    );
    return data.notifications;
  }
);

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: null,

    leaderboard: [],
    notifications: [],
    unreadNotificationCount: 0,
    playWinSound: false,
  },

  reducers: {
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.notifications = [];
      state.unreadNotificationCount = 0;
      state.playWinSound = false;
    },

    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    resetWinSound(state) {
      state.playWinSound = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderBoard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const oldIds = state.notifications.map(n => n._id);
        const incoming = action.payload;

        state.notifications = incoming;
        state.unreadNotificationCount = incoming.filter(n => !n.isRead).length;

        const hasNewWin = incoming.some(
          n => !oldIds.includes(n._id) && n.message?.toLowerCase().includes("won")
        );

        if (hasNewWin) state.playWinSound = true;
      })

      .addCase(markReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({
          ...n,
          isRead: true,
        }));
        state.unreadNotificationCount = 0;
      });
  },
});

/* ================= AUTH THUNKS ================= */
export const register = (formData) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/register`,
      formData,
      { withCredentials: true }
    );
    dispatch(userSlice.actions.registerSuccess(data));
    toast.success(data.message);
  } catch (err) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(err?.response?.data?.message);
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/login`,
      { email, password },
      { withCredentials: true }
    );
    dispatch(userSlice.actions.loginSuccess(data));
    toast.success(data.message);
  } catch (err) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(err?.response?.data?.message);
  }
};

export const logout = () => async (dispatch) => {
  const { data } = await axios.get(`${USER_API_POINT}/logout`, {
    withCredentials: true,
  });
  dispatch(userSlice.actions.logoutSuccess());
  toast.success(data.message);
};

export const { resetWinSound } = userSlice.actions;
export default userSlice.reducer;
