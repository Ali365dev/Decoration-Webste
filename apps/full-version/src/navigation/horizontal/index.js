const navigation = () => {
  return [
    {
      icon: 'mdi:home-outline',
      title: 'Dashboards',
      children: [
        {
          icon: 'mdi:cart-outline',
          title: 'Dashboard',
          path: '/dashboards/ecommerce'
        },
        {
          icon: 'mdi:chart-timeline-variant',
          title: 'Analytics',
          path: '/dashboards/analytics'
        }
      ]
    },
    {
      icon: 'mdi:shape-outline',
      title: 'Catalog',
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
      icon: 'mdi:warehouse',
      title: 'Inventory',
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
      icon: 'mdi:cart-outline',
      title: 'Orders',
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
      icon: 'mdi:cash-multiple',
      title: 'Payments & Finance',
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
      icon: 'mdi:truck-outline',
      title: 'Shipping & Delivery',
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
      icon: 'mdi:account-outline',
      title: 'Customers',
      path: '/customers'
    },
    {
      icon: 'mdi:bullhorn-outline',
      title: 'Marketing',
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
      icon: 'mdi:account-group-outline',
      title: 'Team Management',
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
      icon: 'mdi:chart-box-outline',
      title: 'Reports',
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
      icon: 'mdi:cog-outline',
      title: 'Settings',
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
    }
  ]
}

export default navigation
