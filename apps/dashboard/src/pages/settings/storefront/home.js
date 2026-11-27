// ** Views
import HomeSections from 'src/views/settings/storefront/HomeSections'
import { StorefrontUrlProvider } from 'src/views/settings/storefront/common'

// Home page: storefront content the shop owner edits. Images stored as site paths (/home/…) are
// previewed from the storefront, so the page needs its address.
const Page = ({ storefrontUrl }) => (
  <StorefrontUrlProvider value={storefrontUrl}>
    <HomeSections />
  </StorefrontUrlProvider>
)

export const getServerSideProps = () => ({
  props: { storefrontUrl: process.env.STOREFRONT_URL || 'http://127.0.0.1:3000' }
})

export default Page
