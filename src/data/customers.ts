// Extended order data with customer information for search functionality
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  preferredPaymentMethod: string;
  customerType: 'retail' | 'wholesale' | 'regular';
}

export interface OrderItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  total: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  discount: string;
  tax: string;
  total: string;
  staffId?: string;
  staffName?: string;
  invoiceId?: string;
  trackingNumber?: string;
  notes?: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'রহিম এন্টারপ্রাইজ',
    email: 'rahim@example.com',
    phone: '+880 1712-345678',
    address: 'House 45, Road 12, Dhanmondi',
    city: 'Dhaka',
    postalCode: '1209',
    joinDate: '2023-08-15',
    totalOrders: 8,
    totalSpent: 185430,
    averageOrderValue: 23179,
    lastOrderDate: '2024-03-28',
    preferredPaymentMethod: 'Bank Transfer',
    customerType: 'wholesale'
  },
  {
    id: 'CUST-002',
    name: 'Green Valley Nursery',
    email: 'greenvalley@example.com',
    phone: '+880 1823-456789',
    address: '23/A, Mirpur Road',
    city: 'Dhaka',
    postalCode: '1216',
    joinDate: '2023-10-20',
    totalOrders: 6,
    totalSpent: 142890,
    averageOrderValue: 23815,
    lastOrderDate: '2024-04-01',
    preferredPaymentMethod: 'Bank Transfer',
    customerType: 'wholesale'
  },
  {
    id: 'CUST-003',
    name: 'Agriculture Solutions Ltd',
    email: 'agrisol@example.com',
    phone: '+880 1934-567890',
    address: 'Plot 78, Sector 11, Uttara',
    city: 'Dhaka',
    postalCode: '1230',
    joinDate: '2023-05-10',
    totalOrders: 12,
    totalSpent: 345680,
    averageOrderValue: 28807,
    lastOrderDate: '2024-04-05',
    preferredPaymentMethod: 'Bank Transfer',
    customerType: 'wholesale'
  },
  {
    id: 'CUST-004',
    name: 'Modern Farming Co.',
    email: 'modernfarm@example.com',
    phone: '+880 1745-678901',
    address: 'Village: Savar, Upazila: Savar',
    city: 'Dhaka',
    postalCode: '1340',
    joinDate: '2024-01-05',
    totalOrders: 4,
    totalSpent: 89500,
    averageOrderValue: 22375,
    lastOrderDate: '2024-03-22',
    preferredPaymentMethod: 'bKash',
    customerType: 'regular'
  },
  {
    id: 'CUST-005',
    name: 'Eco Garden Supplies',
    email: 'ecogarden@example.com',
    phone: '+880 1856-789012',
    address: '156, Kalabagan',
    city: 'Dhaka',
    postalCode: '1205',
    joinDate: '2023-11-15',
    totalOrders: 5,
    totalSpent: 78900,
    averageOrderValue: 15780,
    lastOrderDate: '2024-03-25',
    preferredPaymentMethod: 'Bank Transfer',
    customerType: 'regular'
  },
  {
    id: 'CUST-006',
    name: 'Harvest Time Traders',
    email: 'harvesttime@example.com',
    phone: '+880 1967-890123',
    address: 'Shop 12, Karwan Bazar',
    city: 'Dhaka',
    postalCode: '1215',
    joinDate: '2024-02-28',
    totalOrders: 3,
    totalSpent: 67800,
    averageOrderValue: 22600,
    lastOrderDate: '2024-03-30',
    preferredPaymentMethod: 'COD',
    customerType: 'regular'
  },
  {
    id: 'CUST-007',
    name: 'Fresh Fields Limited',
    email: 'freshfields@example.com',
    phone: '+880 1678-901234',
    address: 'Plot 45, EPZ',
    city: 'Gazipur',
    postalCode: '1704',
    joinDate: '2023-07-22',
    totalOrders: 9,
    totalSpent: 456700,
    averageOrderValue: 50744,
    lastOrderDate: '2024-04-03',
    preferredPaymentMethod: 'Bank Transfer',
    customerType: 'wholesale'
  }
];

export const mockAllOrders: Order[] = [
  // Orders for CUST-001 (রহিম এন্টারপ্রাইজ)
  {
    id: 'ORD-001',
    orderNumber: 'WHL-2024-101',
    customerId: 'CUST-001',
    customerName: 'রহিম এন্টারপ্রাইজ',
    customerEmail: 'rahim@example.com',
    customerPhone: '+880 1712-345678',
    customerAddress: 'House 45, Road 12, Dhanmondi, Dhaka-1209',
    date: '2024-03-15',
    status: 'delivered',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    items: [
      {
        id: 1,
        name: 'Geo Bags - 12x12 inch',
        sku: 'GB-1212',
        quantity: 500,
        unitPrice: '৳15',
        total: '৳7,500',
        image: '🛍️'
      },
      {
        id: 2,
        name: 'Grow Bags - 24x24 inch',
        sku: 'GRB-2424',
        quantity: 200,
        unitPrice: '৳45',
        total: '৳9,000',
        image: '🌱'
      },
      {
        id: 3,
        name: 'Drip Irrigation Kit',
        sku: 'DRK-100',
        quantity: 10,
        unitPrice: '৳850',
        total: '৳8,500',
        image: '💧'
      }
    ],
    subtotal: '৳25,000',
    shipping: '৳500',
    discount: '৳1,250',
    tax: '৳0',
    total: '৳24,250',
    staffId: 'STF-001',
    staffName: 'Karim Ahmed',
    invoiceId: 'INV-001',
    trackingNumber: 'TRK-2024-0315-001',
    notes: 'Bulk order discount applied (5%)'
  },
  {
    id: 'ORD-002',
    orderNumber: 'WHL-2024-106',
    customerId: 'CUST-001',
    customerName: 'রহিম এন্টারপ্রাইজ',
    customerEmail: 'rahim@example.com',
    customerPhone: '+880 1712-345678',
    customerAddress: 'House 45, Road 12, Dhanmondi, Dhaka-1209',
    date: '2024-03-28',
    status: 'delivered',
    paymentMethod: 'Nagad',
    paymentStatus: 'paid',
    items: [
      {
        id: 1,
        name: 'Plant Support Stakes',
        sku: 'PSS-100',
        quantity: 500,
        unitPrice: '৳12',
        total: '৳6,000',
        image: '🌿'
      },
      {
        id: 2,
        name: 'Gardening Gloves - Premium',
        sku: 'GG-PREM',
        quantity: 50,
        unitPrice: '৳120',
        total: '৳6,000',
        image: '🧤'
      },
      {
        id: 3,
        name: 'Watering Cans - 10L',
        sku: 'WC-10',
        quantity: 30,
        unitPrice: '৳280',
        total: '৳8,400',
        image: '🪣'
      }
    ],
    subtotal: '৳20,400',
    shipping: '৳400',
    discount: '৳1,020',
    tax: '৳0',
    total: '৳19,780',
    staffId: 'STF-001',
    staffName: 'Karim Ahmed',
    invoiceId: 'INV-006',
    trackingNumber: 'TRK-2024-0328-001',
    notes: 'Repeat customer discount (5%)'
  },

  // Orders for CUST-002 (Green Valley Nursery)
  {
    id: 'ORD-003',
    orderNumber: 'WHL-2024-102',
    customerId: 'CUST-002',
    customerName: 'Green Valley Nursery',
    customerEmail: 'greenvalley@example.com',
    customerPhone: '+880 1823-456789',
    customerAddress: '23/A, Mirpur Road, Dhaka-1216',
    date: '2024-03-18',
    status: 'processing',
    paymentMethod: 'COD',
    paymentStatus: 'unpaid',
    items: [
      {
        id: 1,
        name: 'Organic Fertilizer - 50kg',
        sku: 'OF-50',
        quantity: 20,
        unitPrice: '৳1,200',
        total: '৳24,000',
        image: '🌾'
      },
      {
        id: 2,
        name: 'Garden Hand Tools Set',
        sku: 'GHT-SET',
        quantity: 15,
        unitPrice: '৳450',
        total: '৳6,750',
        image: '🔧'
      }
    ],
    subtotal: '৳30,750',
    shipping: '৳800',
    discount: '৳0',
    tax: '৳0',
    total: '৳31,550',
    staffId: 'STF-002',
    staffName: 'Salma Begum',
    invoiceId: 'INV-002',
    notes: 'Cash on Delivery'
  },
  {
    id: 'ORD-004',
    orderNumber: 'WHL-2024-108',
    customerId: 'CUST-002',
    customerName: 'Green Valley Nursery',
    customerEmail: 'greenvalley@example.com',
    customerPhone: '+880 1823-456789',
    customerAddress: '23/A, Mirpur Road, Dhaka-1216',
    date: '2024-04-01',
    status: 'delivered',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    items: [
      {
        id: 1,
        name: 'NPK Fertilizer - 25kg',
        sku: 'NPK-25',
        quantity: 40,
        unitPrice: '৳950',
        total: '৳38,000',
        image: '🌾'
      },
      {
        id: 2,
        name: 'Potting Soil Mix - 50L',
        sku: 'PSM-50',
        quantity: 60,
        unitPrice: '৳320',
        total: '৳19,200',
        image: '🪴'
      }
    ],
    subtotal: '৳57,200',
    shipping: '৳1,200',
    discount: '৳2,860',
    tax: '৳0',
    total: '৳55,540',
    staffId: 'STF-002',
    staffName: 'Salma Begum',
    invoiceId: 'INV-008',
    trackingNumber: 'TRK-2024-0401-001',
    notes: 'Bulk order discount (5%)'
  },

  // Orders for CUST-003 (Agriculture Solutions Ltd)
  {
    id: 'ORD-005',
    orderNumber: 'WHL-2024-103',
    customerId: 'CUST-003',
    customerName: 'Agriculture Solutions Ltd',
    customerEmail: 'agrisol@example.com',
    customerPhone: '+880 1934-567890',
    customerAddress: 'Plot 78, Sector 11, Uttara, Dhaka-1230',
    date: '2024-03-20',
    status: 'shipped',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'partial',
    items: [
      {
        id: 1,
        name: 'Vegetable Seeds Package',
        sku: 'VSP-100',
        quantity: 50,
        unitPrice: '৳250',
        total: '৳12,500',
        image: '🌱'
      },
      {
        id: 2,
        name: 'Flower Seeds Mix',
        sku: 'FSM-50',
        quantity: 30,
        unitPrice: '৳180',
        total: '৳5,400',
        image: '🌸'
      },
      {
        id: 3,
        name: 'Sprinkler System',
        sku: 'SPR-200',
        quantity: 5,
        unitPrice: '৳3,500',
        total: '৳17,500',
        image: '💦'
      }
    ],
    subtotal: '৳35,400',
    shipping: '৳1,000',
    discount: '৳1,770',
    tax: '৳0',
    total: '৳34,630',
    staffId: 'STF-001',
    staffName: 'Karim Ahmed',
    invoiceId: 'INV-003',
    trackingNumber: 'TRK-2024-0320-001',
    notes: 'Partial payment received. Balance due by due date.'
  },
  {
    id: 'ORD-006',
    orderNumber: 'WHL-2024-110',
    customerId: 'CUST-003',
    customerName: 'Agriculture Solutions Ltd',
    customerEmail: 'agrisol@example.com',
    customerPhone: '+880 1934-567890',
    customerAddress: 'Plot 78, Sector 11, Uttara, Dhaka-1230',
    date: '2024-04-05',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'unpaid',
    items: [
      {
        id: 1,
        name: 'Greenhouse Construction Kit',
        sku: 'GCK-500',
        quantity: 1,
        unitPrice: '৳85,000',
        total: '৳85,000',
        image: '🏠'
      },
      {
        id: 2,
        name: 'Climate Control System',
        sku: 'CCS-AUTO',
        quantity: 1,
        unitPrice: '৳45,000',
        total: '৳45,000',
        image: '🌡️'
      }
    ],
    subtotal: '৳1,30,000',
    shipping: '৳2,500',
    discount: '৳6,500',
    tax: '৳0',
    total: '৳1,26,000',
    staffId: 'STF-003',
    staffName: 'Rashid Hassan',
    invoiceId: 'INV-010',
    notes: 'Large project order. 50% advance required.'
  },

  // Orders for CUST-004 (Modern Farming Co.)
  {
    id: 'ORD-007',
    orderNumber: 'WHL-2024-104',
    customerId: 'CUST-004',
    customerName: 'Modern Farming Co.',
    customerEmail: 'modernfarm@example.com',
    customerPhone: '+880 1745-678901',
    customerAddress: 'Village: Savar, Upazila: Savar, Dhaka',
    date: '2024-03-22',
    status: 'delivered',
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    items: [
      {
        id: 1,
        name: 'Mulching Film - 100m roll',
        sku: 'MF-100',
        quantity: 25,
        unitPrice: '৳680',
        total: '৳17,000',
        image: '📦'
      },
      {
        id: 2,
        name: 'Seedling Trays - 128 cells',
        sku: 'ST-128',
        quantity: 100,
        unitPrice: '৳85',
        total: '৳8,500',
        image: '🌱'
      }
    ],
    subtotal: '৳25,500',
    shipping: '৳600',
    discount: '৳0',
    tax: '৳0',
    total: '৳26,100',
    staffId: 'STF-003',
    staffName: 'Rashid Hassan',
    invoiceId: 'INV-004',
    trackingNumber: 'TRK-2024-0322-001',
    notes: 'Paid via bKash. Transaction ID: BK2024032201'
  },

  // Orders for CUST-005 (Eco Garden Supplies)
  {
    id: 'ORD-008',
    orderNumber: 'WHL-2024-105',
    customerId: 'CUST-005',
    customerName: 'Eco Garden Supplies',
    customerEmail: 'ecogarden@example.com',
    customerPhone: '+880 1856-789012',
    customerAddress: '156, Kalabagan, Dhaka-1205',
    date: '2024-03-25',
    status: 'processing',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'unpaid',
    items: [
      {
        id: 1,
        name: 'Compost Bin - 300L',
        sku: 'CB-300',
        quantity: 8,
        unitPrice: '৳2,200',
        total: '৳17,600',
        image: '♻️'
      },
      {
        id: 2,
        name: 'Garden Hose - 50ft',
        sku: 'GH-50',
        quantity: 20,
        unitPrice: '৳350',
        total: '৳7,000',
        image: '🚿'
      }
    ],
    subtotal: '৳24,600',
    shipping: '৳700',
    discount: '৳0',
    tax: '৳0',
    total: '৳25,300',
    staffId: 'STF-002',
    staffName: 'Salma Begum',
    invoiceId: 'INV-005',
    notes: 'Payment overdue - reminder sent'
  },

  // Orders for CUST-006 (Harvest Time Traders)
  {
    id: 'ORD-009',
    orderNumber: 'WHL-2024-107',
    customerId: 'CUST-006',
    customerName: 'Harvest Time Traders',
    customerEmail: 'harvesttime@example.com',
    customerPhone: '+880 1967-890123',
    customerAddress: 'Shop 12, Karwan Bazar, Dhaka-1215',
    date: '2024-03-30',
    status: 'pending',
    paymentMethod: 'COD',
    paymentStatus: 'unpaid',
    items: [
      {
        id: 1,
        name: 'Greenhouse Shade Net - 50%',
        sku: 'GSN-50',
        quantity: 100,
        unitPrice: '৳180',
        total: '৳18,000',
        image: '🏕️'
      },
      {
        id: 2,
        name: 'Anti-Bird Net',
        sku: 'ABN-100',
        quantity: 50,
        unitPrice: '৳220',
        total: '৳11,000',
        image: '🦅'
      }
    ],
    subtotal: '৳29,000',
    shipping: '৳900',
    discount: '৳0',
    tax: '৳0',
    total: '৳29,900',
    staffId: 'STF-003',
    staffName: 'Rashid Hassan',
    invoiceId: 'INV-007',
    notes: 'New customer - COD order'
  },

  // Orders for CUST-007 (Fresh Fields Limited)
  {
    id: 'ORD-010',
    orderNumber: 'WHL-2024-109',
    customerId: 'CUST-007',
    customerName: 'Fresh Fields Limited',
    customerEmail: 'freshfields@example.com',
    customerPhone: '+880 1678-901234',
    customerAddress: 'Plot 45, EPZ, Gazipur-1704',
    date: '2024-04-03',
    status: 'shipped',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'partial',
    items: [
      {
        id: 1,
        name: 'Automated Irrigation Controller',
        sku: 'AIC-PRO',
        quantity: 3,
        unitPrice: '৳12,500',
        total: '৳37,500',
        image: '⚙️'
      },
      {
        id: 2,
        name: 'Pressure Pump - 1HP',
        sku: 'PP-1HP',
        quantity: 2,
        unitPrice: '৳8,500',
        total: '৳17,000',
        image: '💪'
      }
    ],
    subtotal: '৳54,500',
    shipping: '৳1,500',
    discount: '৳0',
    tax: '৳0',
    total: '৳56,000',
    staffId: 'STF-001',
    staffName: 'Karim Ahmed',
    invoiceId: 'INV-009',
    trackingNumber: 'TRK-2024-0403-001',
    notes: 'Advance payment received. Balance due on delivery.'
  }
];

// Helper functions
export const getCustomerById = (customerId: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === customerId);
};

export const getCustomerByPhone = (phone: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.phone === phone);
};

export const getCustomerByEmail = (email: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.email === email);
};

export const searchCustomers = (searchTerm: string): Customer[] => {
  const term = searchTerm.toLowerCase();
  return mockCustomers.filter(customer =>
    customer.id.toLowerCase().includes(term) ||
    customer.name.toLowerCase().includes(term) ||
    customer.email.toLowerCase().includes(term) ||
    customer.phone.includes(searchTerm)
  );
};

export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return mockAllOrders.filter(order => order.customerId === customerId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  return mockAllOrders.find(order => order.id === orderId);
};

export const getOrdersByStaffId = (staffId: string): Order[] => {
  return mockAllOrders.filter(order => order.staffId === staffId);
};

// Calculate customer analytics
export const getCustomerAnalytics = (customerId: string) => {
  const orders = getOrdersByCustomerId(customerId);
  const customer = getCustomerById(customerId);
  
  if (!customer) return null;

  // Calculate product frequency
  const productFrequency: { [key: string]: number } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productFrequency[item.name] = (productFrequency[item.name] || 0) + item.quantity;
    });
  });

  const favoriteProducts = Object.entries(productFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  // Payment method frequency
  const paymentMethods: { [key: string]: number } = {};
  orders.forEach(order => {
    paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
  });

  return {
    customer,
    orders,
    totalOrders: orders.length,
    totalSpent: customer.totalSpent,
    averageOrderValue: customer.averageOrderValue,
    favoriteProducts,
    paymentMethods,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length
  };
};
