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

/* ================= USER THUNKS ================= */
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const { data } = await axios.get(`${USER_API_POINT}/me`, {
    withCredentials: true,
  });
  return data.user;
});

export const fetchLeaderBoard = createAsyncThunk(
  "user/fetchLeaderBoard",
  async () => {
    const { data } = await axios.get(`${USER_API_POINT}/leaderboard`);
    return data.leaderboard;
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
    /* ================= AUTH ================= */
    registerSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.notifications = [];
      state.unreadNotificationCount = 0;
      state.playWinSound = false;
    },

    /* 🔇 RESET SOUND FLAG */
    resetWinSound(state) {
      state.playWinSound = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== FETCH USER ===== */
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      /* ===== LEADERBOARD ===== */
      .addCase(fetchLeaderBoard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderBoard.rejected, (state) => {
        state.loading = false;
        state.leaderboard = [];
      })

      /* ===== FETCH NOTIFICATIONS ===== */
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;

        const previousIds = state.notifications.map((n) => n._id);
        const incoming = action.payload;

        state.notifications = incoming;
        state.unreadNotificationCount = incoming.filter(
          (n) => !n.isRead
        ).length;

        /* 🔊 Detect NEW WIN notification */
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

      /* ===== MARK READ ===== */
      .addCase(markReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadNotificationCount = 0;
      });
  },
});

/* ================= AUTH ACTIONS ================= */
export const register = (formData) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/register`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(data));
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/login`,
      { email, password },
      { withCredentials: true }
    );
    dispatch(userSlice.actions.loginSuccess(data));
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

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

/* ================= EXPORTS ================= */
export const { resetWinSound } = userSlice.actions;
export default userSlice.reducer;
