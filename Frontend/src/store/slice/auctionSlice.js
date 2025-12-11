import { AUCTION_API_POINT } from '@/utils/APIs'
import { createSlice } from '@reduxjs/toolkit'
import axiosInstance from "@/utils/axiosInstance"
import { toast } from 'react-toastify'

const auctionSlice = createSlice({
  name: 'auction',
  initialState: {
    loading: false,
    itemDetail: {},
    auctionDetail: {},
    auctionBidder: [],
    myAuctions: [],
    allAuctions: [],
  },
  reducers: {
    getAllauctionRequiest: (state) => { state.loading = true },
    getAllauctionSuccess: (state, action) => {
      state.loading = false
      state.allAuctions = action.payload
    },
    getAllauctionFaild: (state) => { state.loading = false },

    getAuctionDetailRequiest: (state) => { state.loading = true },
    getAuctionDetailSuccess: (state, action) => {
      state.loading = false
      state.auctionDetail = action.payload.auctionItem
      state.auctionBidder = action.payload.bidders
    },
    getAuctionDetailFaild: (state) => { state.loading = false },

    createAuctionRequest: (state) => { state.loading = true },
    createAuctionSuccess: (state) => { state.loading = false },
    createAuctionFaild: (state) => { state.loading = false },

    getMyAuctionItemsRequest: (state) => {
      state.loading = true
      state.myAuctions = []
    },
    getMyAuctionItemsSuccess: (state, action) => {
      state.loading = false
      state.myAuctions = action.payload
    },
    getMyAuctionItemsFaild: (state) => {
      state.loading = false
      state.myAuctions = []
    },

    deleteAuctionItemRequest: (state) => { state.loading = true },
    deleteAuctionItemSuccess: (state) => { state.loading = false },
    deleteAuctionItemFaild: (state) => { state.loading = false },

    republishAuctionItemRequest: (state) => { state.loading = true },
    republishAuctionItemSuccess: (state) => { state.loading = false },
    republishAuctionItemFaild: (state) => { state.loading = false },

    resetSlice: (state) => {
      state.loading = false
    },
  },
})


// -----------------------------
//        THUNKS
// -----------------------------

// GET ALL AUCTION ITEMS
export const getAllAuctionItem = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllauctionRequiest())
  try {
    const { data } = await axiosInstance.get(`${AUCTION_API_POINT}/allitems`)
    dispatch(auctionSlice.actions.getAllauctionSuccess(data.items))
    dispatch(auctionSlice.actions.resetSlice())
  } catch (error) {
    dispatch(auctionSlice.actions.getAllauctionFaild())
    console.log(error)
    dispatch(auctionSlice.actions.resetSlice())
  }
}


// GET AUCTION DETAIL
export const getAuctionDetail = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.getAuctionDetailRequiest())
  try {
    const { data } = await axiosInstance.get(`${AUCTION_API_POINT}/auction/${id}`)
    dispatch(auctionSlice.actions.getAuctionDetailSuccess(data))
    dispatch(auctionSlice.actions.resetSlice())
  } catch (error) {
    dispatch(auctionSlice.actions.getAuctionDetailFaild())
    console.log(error)
    dispatch(auctionSlice.actions.resetSlice())
  }
}


// CREATE AUCTION
export const createAuction = (formData) => async (dispatch) => {
  dispatch(auctionSlice.actions.createAuctionRequest())
  try {
    const { data } = await axiosInstance.post(
      `${AUCTION_API_POINT}/create`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    toast.success(data.message)
    dispatch(auctionSlice.actions.createAuctionSuccess())
    dispatch(getAllAuctionItem())
  } catch (error) {
    dispatch(auctionSlice.actions.createAuctionFaild())
    console.log(error)
    toast.error(error?.response?.data?.message)
  }
}


// GET MY AUCTIONS
export const getMyAuctionItem = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getMyAuctionItemsRequest())
  try {
    const { data } = await axiosInstance.get(`${AUCTION_API_POINT}/myitems`)
    dispatch(auctionSlice.actions.getMyAuctionItemsSuccess(data.items))
  } catch (error) {
    dispatch(auctionSlice.actions.getMyAuctionItemsFaild())
    console.log(error)
  }
}


// DELETE AUCTION
export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.deleteAuctionItemRequest())
  try {
    const { data } = await axiosInstance.delete(`${AUCTION_API_POINT}/delete/${id}`)
    toast.success(data?.message)
    dispatch(auctionSlice.actions.deleteAuctionItemSuccess())
    dispatch(getMyAuctionItem())
    dispatch(getAllAuctionItem())
    dispatch(auctionSlice.actions.resetSlice())
  } catch (error) {
    dispatch(auctionSlice.actions.deleteAuctionItemFaild())
    dispatch(auctionSlice.actions.resetSlice())
    toast.error(error?.response?.data?.message)
  }
}


// REPUBLISH AUCTION
export const republishAuction = (id, formdata) => async (dispatch) => {
  dispatch(auctionSlice.actions.republishAuctionItemRequest())
  try {
    const { data } = await axiosInstance.put(
      `${AUCTION_API_POINT}/item/republish/${id}`,
      formdata,
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    toast.success(data.message)
    dispatch(auctionSlice.actions.republishAuctionItemSuccess())
    dispatch(getMyAuctionItem())
    dispatch(getAllAuctionItem())
    dispatch(auctionSlice.actions.resetSlice())
  } catch (error) {
    dispatch(auctionSlice.actions.republishAuctionItemFaild())
    dispatch(auctionSlice.actions.resetSlice())
    toast.error(error?.response?.data?.message)
  }
}

export default auctionSlice.reducer
