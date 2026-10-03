import re

with open('src/pages/MyOrdersPage.jsx', 'r') as f:
    content = f.read()

# Replace the dummy orders array with mattress data
old_orders = """  const dummyOrders = [
    {
      id: 'ABC-6457325',
      date: '10 May 2021',
      status: 'In progress',
      desc: 'Blue & pink Silk Saree | Linen Kurta | Printed black & white short kurti & 2 more items',
      price: '12,500',
      image: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=200',
      badge: '+4',
      statusColor: 'in-progress'
    },
    {
      id: 'ABC-6457325',
      date: '10 May 2021',
      status: 'Delivered',
      desc: 'Two-seater wooden polished dinning table',
      price: '8,999',
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=200',
      statusColor: 'delivered'
    },
    {
      id: 'ABC-6457325',
      date: '10 May 2021',
      status: 'Delivered',
      desc: 'Two-seater wooden polished dinning table',
      price: '8,999',
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=200',
      statusColor: 'delivered'
    }
  ];"""

new_orders = """  const dummyOrders = [
    {
      id: 'ABC-6457325',
      date: '10 May 2021',
      status: 'In progress',
      desc: 'SleepNest Ortho Mattress | Cloud Pillows | Waterproof Protector & 2 more items',
      price: '12,500',
      image: '/images/generated/sleepnest_mattress_card.jpg',
      badge: '+4',
      statusColor: 'in-progress'
    },
    {
      id: 'ABC-6457324',
      date: '02 April 2021',
      status: 'Delivered',
      desc: 'Premium Cotton Bedsheet (Queen Size)',
      price: '2,499',
      image: '/images/generated/sleepnest_bedsheet.jpg',
      statusColor: 'delivered'
    },
    {
      id: 'ABC-6457323',
      date: '15 March 2021',
      status: 'Delivered',
      desc: 'Memory Foam Contour Pillow (Pack of 2)',
      price: '1,899',
      image: '/images/generated/sleepnest_pillow.jpg',
      statusColor: 'delivered'
    }
  ];"""

content = content.replace(old_orders, new_orders)

with open('src/pages/MyOrdersPage.jsx', 'w') as f:
    f.write(content)
