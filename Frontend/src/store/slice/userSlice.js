import { USER_API_POINT } from "@/utils/APIs";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

/* ================= 🔔 NOTIFICATIONS THUNKS ================= */
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

    /* 🏆 Leaderboard */
    leaderboard: [],

    /* 🔔 Notifications */
    notifications: [],
    unreadNotificationCount: 0,

    /* 🔊 Sound trigger */
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

    fetchLeaderBoardRequest(state) {
      state.loading = true;
    },
    fetchLeaderBoardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderBoardFailed(state) {
      state.loading = false;
      state.leaderboard = [];
    },

    resetWinSound(state) {
      state.playWinSound = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        const previousIds = state.notifications.map(n => n._id);
        const incoming = action.payload;

        state.notifications = incoming;
        state.unreadNotificationCount = incoming.filter(
          (n) => !n.isRead
        ).length;

        const hasNewWin = incoming.some(
          (n) =>
            !previousIds.includes(n._id) &&
            n.message?.toLowerCase().includes("won")
        );

        if (hasNewWin) {
          state.playWinSound = true;
        }
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadNotificationCount = 0;
      });
  },
});

/* ================= ✅ LOGOUT THUNK ================= */
export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${USER_API_POINT}/logout`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const { resetWinSound } = userSlice.actions;
export default userSlice.reducer;
