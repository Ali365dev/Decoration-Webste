// ** Components Imports
import Settings from 'src/views/settings/Settings'

const SettingsTab = ({ tab }) => {
  return <Settings tab={tab} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'general' } },
      { params: { tab: 'store' } },
      { params: { tab: 'payments' } },
      { params: { tab: 'shipping' } },
      { params: { tab: 'tax' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'seo' } }
    ],
    fallback: false
  }
}

export const getStaticProps = ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default SettingsTab
