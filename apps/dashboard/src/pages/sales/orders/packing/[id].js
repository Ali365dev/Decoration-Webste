// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PackingSlip from 'src/views/apps/invoice/packing/PackingSlip'

const PackingSlipPage = ({ id }) => {
  return <PackingSlip id={id} />
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps = ({ params }) => {
  return { props: { id: params?.id } }
}

PackingSlipPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
PackingSlipPage.setConfig = () => ({ mode: 'light' })

export default PackingSlipPage
