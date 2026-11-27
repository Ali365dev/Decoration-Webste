// ** Delivery Charges is folded into Shipping Zones (Phase 6 decision - each
// ** zone already carries its own deliveryCharge, so this route renders the
// ** same ShippingZones screen rather than duplicating the table).
import ShippingZones from 'src/views/shipping/ShippingZones'

const DeliveryChargesPage = () => {
  return <ShippingZones />
}

export default DeliveryChargesPage
