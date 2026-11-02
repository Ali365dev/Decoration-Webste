# Payments

`getPaymentProvider()` defaults to `noop` (auto-succeeds for local checkout).
Set `PAYMENT_PROVIDER=stripe` and implement the Stripe adapter behind the same interface.
