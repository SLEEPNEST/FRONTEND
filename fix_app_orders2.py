import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import OrderDetailPage from './pages/OrderDetailPage';\n"
if "import OrderDetailPage" not in content:
    content = content.replace("import MyOrdersPage from './pages/MyOrdersPage';", "import MyOrdersPage from './pages/MyOrdersPage';\n" + import_stmt)

# Add route
route_stmt = "          <Route path=\"/my-orders/:orderId\" element={<OrderDetailPage />} />\n"
if "path=\"/my-orders/:orderId\"" not in content:
    content = content.replace("<Route path=\"/my-orders\" element={<MyOrdersPage />} />", "<Route path=\"/my-orders\" element={<MyOrdersPage />} />\n" + route_stmt)

with open('src/App.jsx', 'w') as f:
    f.write(content)
