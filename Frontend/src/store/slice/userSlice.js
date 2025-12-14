import { USER_API_POINT } from "@/utils/APIs";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

/* ================= FETCH USER ================= */
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${USER_API_POINT}/me`, {
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* ================= LEADERBOARD ================= */
export const fetchLeaderBoard = createAsyncThunk(
  "user/fetchLeaderBoard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${USER_API_POINT}/leaderboard`);
      return data.leaderboard;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

/* ================= 🔔 NOTIFICATIONS ================= */
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
    resetWinSound(state) {
      state.playWinSound = false;
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.notifications = [];
      state.unreadNotificationCount = 0;
      state.playWinSound = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ================= USER ================= */
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

      /* ================= LEADERBOARD ================= */
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

      /* ================= NOTIFICATIONS ================= */
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const prevIds = state.notifications.map((n) => n._id);
        const incoming = action.payload;

        state.notifications = incoming;
        state.unreadNotificationCount = incoming.filter(
          (n) => !n.isRead
        ).length;

        const hasNewWin = incoming.some(
          (n) =>
            !prevIds.includes(n._id) &&
            n.message?.toLowerCase().includes("won")
        );

        if (hasNewWin) {
          state.playWinSound = true;
        }
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

/* ================= AUTH THUNKS ================= */
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
    toast.success(data.message);
    dispatch(fetchUser());
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
    toast.success(data.message);
    dispatch(fetchUser());
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${USER_API_POINT}/logout`, {
      withCredentials: true,
    });
    toast.success(data.message);
    dispatch(userSlice.actions.logoutSuccess());
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

/* ================= EXPORTS ================= */
export const { resetWinSound } = userSlice.actions;

export {
  fetchUser,
  fetchLeaderBoard,
  fetchNotifications,
  markReadNotifications,
};

export default userSlice.reducer;
