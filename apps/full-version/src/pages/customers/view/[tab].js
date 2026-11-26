// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const CustomerView = ({ tab }) => {
  return <UserViewPage tab={tab} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'overview' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing-plan' } },
      { params: { tab: 'notification' } },
      { params: { tab: 'connection' } }
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

export default CustomerView
