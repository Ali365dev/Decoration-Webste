// ** Phase 6's /payments/methods screen already implements exactly this -
// ** toggle which store-wide payment methods are enabled, modeled on
// ** PaymentMethodCard.js - so Settings > Payments reuses it directly instead
// ** of duplicating the same card+switch UI.
import PaymentMethods from 'src/views/payments/PaymentMethods'

const TabPayments = () => {
  return <PaymentMethods />
}

export default TabPayments
