// ** Views
import FooterEditor from 'src/views/settings/storefront/FooterEditor'
import { StorefrontUrlProvider } from 'src/views/settings/storefront/common'

// Footer and contact: storefront content the shop owner edits. Images stored as site paths (/home/…) are
// previewed from the storefront, so the page needs its address.
const Page = ({ storefrontUrl }) => (
  <StorefrontUrlProvider value={storefrontUrl}>
    <FooterEditor />
  </StorefrontUrlProvider>
)

export const getServerSideProps = () => ({
  props: { storefrontUrl: process.env.STOREFRONT_URL || 'http://127.0.0.1:3000' }
})

export default Page
