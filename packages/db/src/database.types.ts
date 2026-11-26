export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          area: string | null
          city: string
          country: string
          created_at: string
          customer_id: string
          full_name: string
          id: string
          is_default: boolean
          line1: string
          line2: string | null
          phone: string | null
          postal_code: string | null
          region: string | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          city: string
          country?: string
          created_at?: string
          customer_id: string
          full_name: string
          id?: string
          is_default?: boolean
          line1: string
          line2?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          city?: string
          country?: string
          created_at?: string
          customer_id?: string
          full_name?: string
          id?: string
          is_default?: boolean
          line1?: string
          line2?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          body: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
        }
        Insert: {
          body?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
        }
        Update: {
          body?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_staff_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          actor_staff_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          actor_staff_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_staff_id_staff_users_id_fk"
            columns: ["actor_staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          badge: string | null
          body: string | null
          created_at: string
          cta_label: string | null
          ends_at: string | null
          eyebrow: string | null
          href: string | null
          id: string
          image_storage_path: string | null
          image_url: string | null
          key: string
          placement: string
          sort_order: number
          starts_at: string | null
          status: Database["public"]["Enums"]["publish_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          body?: string | null
          created_at?: string
          cta_label?: string | null
          ends_at?: string | null
          eyebrow?: string | null
          href?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          key: string
          placement: string
          sort_order?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          body?: string | null
          created_at?: string
          cta_label?: string | null
          ends_at?: string | null
          eyebrow?: string | null
          href?: string | null
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          key?: string
          placement?: string
          sort_order?: number
          starts_at?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          id: string
          quantity: number
          unit_price_amount: number
          variant_id: string
        }
        Insert: {
          cart_id: string
          id?: string
          quantity?: number
          unit_price_amount: number
          variant_id: string
        }
        Update: {
          cart_id?: string
          id?: string
          quantity?: number
          unit_price_amount?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_carts_id_fk"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          session_token: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_storage_path: string | null
          image_url: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_products: {
        Row: {
          category_id: string
          created_at: string
          product_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          product_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          product_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_products_category_id_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_products_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          created_at: string
          product_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          product_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          product_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_collections_id_fk"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          data: Json
          id: string
          key: string
          status: Database["public"]["Enums"]["publish_status"]
          type: string
        }
        Insert: {
          data?: Json
          id?: string
          key: string
          status?: Database["public"]["Enums"]["publish_status"]
          type: string
        }
        Update: {
          data?: Json
          id?: string
          key?: string
          status?: Database["public"]["Enums"]["publish_status"]
          type?: string
        }
        Relationships: []
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          created_at: string
          customer_id: string
          discount_amount: number
          id: string
          order_id: string
          released_at: string | null
          updated_at: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          customer_id: string
          discount_amount: number
          id?: string
          order_id: string
          released_at?: string | null
          updated_at?: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          customer_id?: string
          discount_amount?: number
          id?: string
          order_id?: string
          released_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usages_coupon_fk"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_customer_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          ends_at: string | null
          id: string
          is_active: number
          min_order_amount: number
          per_customer_limit: number | null
          starts_at: string | null
          type: string
          updated_at: string
          usage_limit: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: number
          min_order_amount?: number
          per_customer_limit?: number | null
          starts_at?: string | null
          type: string
          updated_at?: string
          usage_limit?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: number
          min_order_amount?: number
          per_customer_limit?: number | null
          starts_at?: string | null
          type?: string
          updated_at?: string
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          id: string
          location_id: string
          quantity: number
          variant_id: string
        }
        Insert: {
          id?: string
          location_id: string
          quantity?: number
          variant_id: string
        }
        Update: {
          id?: string
          location_id?: string
          quantity?: number
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_location_id_inventory_locations_id_fk"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_locations: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          delta: number
          id: string
          location_id: string | null
          order_id: string | null
          reason: string
          resulting_quantity: number
          staff_id: string | null
          type: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          location_id?: string | null
          order_id?: string | null
          reason: string
          resulting_quantity: number
          staff_id?: string | null
          type: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          location_id?: string | null
          order_id?: string | null
          reason?: string
          resulting_quantity?: number
          staff_id?: string | null
          type?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_location_id_inventory_locations_id_fk"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "inventory_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_staff_fk"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt: string | null
          bytes: number | null
          created_at: string
          height: number | null
          id: string
          mime_type: string
          storage_path: string
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type: string
          storage_path: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          bytes?: number | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string
          storage_path?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          href: string
          id: string
          label: string
          menu_id: string
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          href: string
          id?: string
          label: string
          menu_id: string
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          href?: string
          id?: string
          label?: string
          menu_id?: string
          parent_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_menu_id_navigation_menus_id_fk"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "navigation_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_menus: {
        Row: {
          id: string
          key: string
          name: string
        }
        Insert: {
          id?: string
          key: string
          name: string
        }
        Update: {
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          id: string
          payload: Json | null
          recipient: string
          status: string
          template: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          payload?: Json | null
          recipient: string
          status?: string
          template: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          payload?: Json | null
          recipient?: string
          status?: string
          template?: string
        }
        Relationships: []
      }
      order_addresses: {
        Row: {
          area: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          instructions: string | null
          line1: string
          line2: string | null
          order_id: string
          phone: string | null
          postal_code: string | null
          region: string | null
          type: string
          updated_at: string
        }
        Insert: {
          area?: string | null
          city: string
          country: string
          created_at?: string
          full_name: string
          id?: string
          instructions?: string | null
          line1: string
          line2?: string | null
          order_id: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          area?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          instructions?: string | null
          line1?: string
          line2?: string | null
          order_id?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_addresses_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          order_id: string
          product_id: string | null
          quantity: number
          sku: string
          title: string
          unit_price_amount: number
          updated_at: string
          variant_id: string | null
          variant_title: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id: string
          product_id?: string | null
          quantity: number
          sku: string
          title: string
          unit_price_amount: number
          updated_at?: string
          variant_id?: string | null
          variant_title: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string
          title?: string
          unit_price_amount?: number
          updated_at?: string
          variant_id?: string | null
          variant_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_product_variants_id_fk"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          from_status: string | null
          id: string
          kind: string
          note: string | null
          order_id: string
          staff_id: string | null
          to_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_status?: string | null
          id?: string
          kind: string
          note?: string | null
          order_id: string
          staff_id?: string | null
          to_status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_status?: string | null
          id?: string
          kind?: string
          note?: string | null
          order_id?: string
          staff_id?: string | null
          to_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_staff_fk"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact_name: string
          contact_phone: string
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          currency: string
          customer_id: string | null
          discount_amount: number
          email: string
          estimated_days: number | null
          id: string
          idempotency_key: string
          number: string
          shipping_amount: number
          shipping_zone_name: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          total_amount: number
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          contact_name: string
          contact_phone: string
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          email: string
          estimated_days?: number | null
          id?: string
          idempotency_key: string
          number?: string
          shipping_amount?: number
          shipping_zone_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          total_amount: number
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          discount_amount?: number
          email?: string
          estimated_days?: number | null
          id?: string
          idempotency_key?: string
          number?: string
          shipping_amount?: number
          shipping_zone_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount?: number
          total_amount?: number
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_fk"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          data: Json
          id: string
          page_id: string
          sort_order: number
          type: string
        }
        Insert: {
          data?: Json
          id?: string
          page_id: string
          sort_order?: number
          type: string
        }
        Update: {
          data?: Json
          id?: string
          page_id?: string
          sort_order?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_pages_id_fk"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          id: string
          published_at: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_accounts: {
        Row: {
          account_number: string
          account_title: string
          created_at: string
          iban: string | null
          id: string
          is_active: boolean
          kind: string
          provider: string
          updated_at: string
        }
        Insert: {
          account_number: string
          account_title: string
          created_at?: string
          iban?: string | null
          id?: string
          is_active?: boolean
          kind: string
          provider: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          account_title?: string
          created_at?: string
          iban?: string | null
          id?: string
          is_active?: boolean
          kind?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          account_snapshot: Json | null
          amount: number
          created_at: string
          currency: string
          id: string
          method: string
          order_id: string
          provider: string
          provider_ref: string | null
          receipt_path: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          account_snapshot?: Json | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          method: string
          order_id: string
          provider?: string
          provider_ref?: string | null
          receipt_path?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          account_snapshot?: Json | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          order_id?: string
          provider?: string
          provider_ref?: string | null
          receipt_path?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_verified_by_fk"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          key: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          is_hover: boolean
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string | null
          updated_at: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          is_hover?: boolean
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          is_hover?: boolean
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          compare_at_amount: number | null
          created_at: string
          id: string
          inventory_quantity: number
          is_active: boolean
          is_default: boolean
          price_amount: number
          price_currency: string
          product_id: string
          reorder_level: number
          sku: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          compare_at_amount?: number | null
          created_at?: string
          id?: string
          inventory_quantity?: number
          is_active?: boolean
          is_default?: boolean
          price_amount: number
          price_currency?: string
          product_id: string
          reorder_level?: number
          sku: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          compare_at_amount?: number | null
          created_at?: string
          id?: string
          inventory_quantity?: number
          is_active?: boolean
          is_default?: boolean
          price_amount?: number
          price_currency?: string
          product_id?: string
          reorder_level?: number
          sku?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          color: string | null
          compare_at_amount: number | null
          created_at: string
          description: string | null
          id: string
          label: string | null
          material: string | null
          name: string
          price_amount: number
          price_currency: string
          slug: string
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          color?: string | null
          compare_at_amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          label?: string | null
          material?: string | null
          name: string
          price_amount: number
          price_currency?: string
          slug: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          color?: string | null
          compare_at_amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          label?: string | null
          material?: string | null
          name?: string
          price_amount?: number
          price_currency?: string
          slug?: string
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_id: string
          reason: string | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_id: string
          reason?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_id?: string
          reason?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_payments_id_fk"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_staff_fk"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          customer_id: string | null
          id: string
          is_approved: number
          product_id: string
          rating: number
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_approved?: number
          product_id: string
          rating: number
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          is_approved?: number
          product_id?: string
          rating?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_permissions_id_fk"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_roles_id_fk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: string
          key: Database["public"]["Enums"]["staff_role"]
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: Database["public"]["Enums"]["staff_role"]
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: Database["public"]["Enums"]["staff_role"]
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          og_image_url: string | null
          title: string | null
        }
        Insert: {
          canonical_url?: string | null
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          og_image_url?: string | null
          title?: string | null
        }
        Update: {
          canonical_url?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          og_image_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string
          id: string
          order_id: string
          status: string
          tracking_number: string | null
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          id?: string
          order_id: string
          status?: string
          tracking_number?: string | null
        }
        Update: {
          carrier?: string | null
          created_at?: string
          id?: string
          order_id?: string
          status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_orders_id_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          created_at: string
          delivery_charge: number
          estimated_days: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_charge: number
          estimated_days: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_charge?: number
          estimated_days?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_users: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_users_role_id_roles_id_fk"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          updated_at: string
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          updated_at?: string
          wishlist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          updated_at?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_wishlists_id_fk"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_stock: {
        Args: {
          p_delta: number
          p_order_id?: string
          p_reason: string
          p_staff_id?: string
          p_type: string
          p_variant_id: string
        }
        Returns: number
      }
      current_customer_id: { Args: never; Returns: string }
    }
    Enums: {
      order_status:
        | "pending"
        | "paid"
        | "fulfilled"
        | "cancelled"
        | "refunded"
        | "processing"
        | "shipped"
        | "delivered"
        | "returned"
      publish_status: "draft" | "published" | "scheduled" | "archived"
      staff_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "editor"
        | "inventory_manager"
        | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "paid",
        "fulfilled",
        "cancelled",
        "refunded",
        "processing",
        "shipped",
        "delivered",
        "returned",
      ],
      publish_status: ["draft", "published", "scheduled", "archived"],
      staff_role: [
        "super_admin",
        "admin",
        "manager",
        "editor",
        "inventory_manager",
        "support",
      ],
    },
  },
} as const

