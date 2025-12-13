import { catchAsyncError } from '../midellware/catchAsyncError.js'

/*
|--------------------------------------------------------------------------
| 🚫 COMMISSION CHECK DISABLED (TEMPORARY)
|--------------------------------------------------------------------------
| This middleware is intentionally bypassed to allow
| auction creation without checking unpaid commission.
| Useful for development, testing, and demo purposes.
|--------------------------------------------------------------------------
*/

export const trackCommissionStatus = catchAsyncError(async (req, res, next) => {
  // ✅ Skip commission validation completely
  next()
})
