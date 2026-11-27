const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      children: [
        {
          title: 'Dashboard',
          path: '/dashboards/ecommerce'
        },
        {
          title: 'Analytics',
          path: '/dashboards/analytics'
        }
      ]
    },
    {
      title: 'Catalog',
      icon: 'mdi:shape-outline',
      children: [
        {
          title: 'Products',
          path: '/catalog/products'
        },
        {
          title: 'Categories',
          path: '/catalog/categories'
        },
        {
          title: 'Collections',
          path: '/catalog/collections'
        },
        {
          title: 'Reviews',
          path: '/catalog/reviews'
        }
      ]
    },
    {
      title: 'Inventory',
      icon: 'mdi:warehouse',
      children: [
        {
          title: 'Overview',
          path: '/inventory/overview'
        },
        {
          title: 'Stock Management',
          path: '/inventory/stock'
        },
        {
          title: 'Low Stock',
          path: '/inventory/low-stock'
        },
        {
          title: 'Stock History',
          path: '/inventory/history'
        }
      ]
    },
    {
      title: 'Orders',
      icon: 'mdi:cart-outline',
      children: [
        {
          title: 'All Orders',
          path: '/sales/orders'
        },
        {
          title: 'Pending',
          path: '/sales/orders?status=pending'
        },
        {
          title: 'Processing',
          path: '/sales/orders?status=processing'
        },
        {
          title: 'Shipped',
          path: '/sales/orders?status=shipped'
        },
        {
          title: 'Delivered',
          path: '/sales/orders?status=delivered'
        },
        {
          title: 'Cancelled',
          path: '/sales/orders?status=cancelled'
        },
        {
          title: 'Returns',
          path: '/sales/orders?status=returned'
        }
      ]
    },
    {
      title: 'Payments & Finance',
      icon: 'mdi:cash-multiple',
      children: [
        {
          title: 'Overview',
          path: '/payments/overview'
        },
        {
          title: 'Transactions',
          path: '/payments/transactions'
        },
        {
          title: 'Payment Verification',
          path: '/payments/verification'
        },
        {
          title: 'Payment Methods',
          path: '/payments/methods'
        },
        {
          title: 'Bank Accounts',
          path: '/payments/bank-accounts'
        },
        {
          title: 'Wallet Accounts',
          path: '/payments/wallet-accounts'
        },
        {
          title: 'COD Reconciliation',
          path: '/payments/cod-reconciliation'
        },
        {
          title: 'Refunds',
          path: '/payments/refunds'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: 'mdi:truck-outline',
      children: [
        {
          title: 'Overview',
          path: '/shipping/overview'
        },
        {
          title: 'Shipping Zones',
          path: '/shipping/zones'
        },
        {
          title: 'Delivery Charges',
          path: '/shipping/delivery-charges'
        },
        {
          title: 'Couriers',
          path: '/shipping/couriers'
        },
        {
          title: 'Shipments',
          path: '/shipping/shipments'
        }
      ]
    },
    {
      title: 'Customers',
      icon: 'mdi:account-outline',
      path: '/customers'
    },
    {
      title: 'Marketing',
      icon: 'mdi:bullhorn-outline',
      children: [
        {
          title: 'Coupons',
          path: '/marketing/coupons'
        },
        {
          title: 'Discounts',
          path: '/marketing/discounts'
        },
        {
          title: 'Flash Sales',
          path: '/marketing/flash-sales'
        },
        {
          title: 'Campaigns',
          path: '/marketing/campaigns'
        },
        {
          title: 'Newsletter',
          path: '/marketing/newsletter'
        }
      ]
    },
    {
      title: 'Team Management',
      icon: 'mdi:account-group-outline',
      children: [
        {
          title: 'Staff Members',
          path: '/team/staff'
        },
        {
          title: 'Roles',
          path: '/team/roles'
        },
        {
          title: 'Permissions',
          path: '/team/permissions'
        },
        {
          title: 'Activity Logs',
          path: '/team/activity-logs'
        }
      ]
    },
    {
      title: 'Reports',
      icon: 'mdi:chart-box-outline',
      children: [
        {
          title: 'Sales',
          path: '/reports/sales'
        },
        {
          title: 'Products',
          path: '/reports/products'
        },
        {
          title: 'Customers',
          path: '/reports/customers'
        },
        {
          title: 'Inventory',
          path: '/reports/inventory'
        },
        {
          title: 'Payments',
          path: '/reports/payments'
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'mdi:cog-outline',
      children: [
        {
          title: 'General',
          path: '/settings/general'
        },
        {
          title: 'Store Information',
          path: '/settings/store'
        },
        {
          title: 'Payments',
          path: '/settings/payments'
        },
        {
          title: 'Shipping',
          path: '/settings/shipping'
        },
        {
          title: 'Tax',
          path: '/settings/tax'
        },
        {
          title: 'Notifications',
          path: '/settings/notifications'
        },
        {
          title: 'SEO',
          path: '/settings/seo'
        }
      ]
    },
    {
      title: 'Storefront',
      icon: 'mdi:storefront-outline',
      children: [
        {
          title: 'Home page',
          path: '/settings/storefront/home'
        },
        {
          title: 'Header menu',
          path: '/settings/storefront/header'
        },
        {
          title: 'Footer and contact',
          path: '/settings/storefront/footer'
        }
      ]
    }
  ]
}

export default navigation
