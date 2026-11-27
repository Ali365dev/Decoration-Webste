// ** Views
import MenuEditor from 'src/views/settings/storefront/MenuEditor'
import { StorefrontUrlProvider } from 'src/views/settings/storefront/common'

// Header menu: storefront content the shop owner edits. Images stored as site paths (/home/…) are
// previewed from the storefront, so the page needs its address.
const Page = ({ storefrontUrl }) => (
  <StorefrontUrlProvider value={storefrontUrl}>
    <MenuEditor />
  </StorefrontUrlProvider>
)

export const getServerSideProps = () => ({
  props: { storefrontUrl: process.env.STOREFRONT_URL || 'http://127.0.0.1:3000' }
})

export default Page
