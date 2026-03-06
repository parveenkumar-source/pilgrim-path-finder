

## Plan: Test Full Booking Flow End-to-End

I will use browser automation to test the complete user journey:

1. **Sign Up** -- Navigate to `/auth`, create a new test account, verify auto-confirm works and user is redirected
2. **Browse Packages** -- Navigate to `/packages`, verify all 4 packages render with correct details
3. **View Package Details** -- Click into a package, verify price breakdown, hotel info, and food plan display
4. **Complete Booking** -- Fill out the booking form with test data, submit, verify success toast
5. **Verify Booking** -- Confirm redirect to `/my-bookings` and that the booking appears with correct details

No code changes required -- this is purely a browser-based verification.

