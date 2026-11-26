// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Tracking from 'src/views/shipping/Tracking'

const ShipmentTrackingPage = ({ id }) => {
  return <Tracking id={id} />
}

export const getStaticPaths = async () => {
  const res = await axios.get('/apps/shipments/list')
  const data = await res.data.shipments

  const paths = data.map(item => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      id: params?.id
    }
  }
}

export default ShipmentTrackingPage
