import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import MyOrdersPage from './pages/MyOrdersPage';\n"
if "import MyOrdersPage" not in content:
    content = content.replace("import AccountPage from './pages/AccountPage';", "import AccountPage from './pages/AccountPage';\n" + import_stmt)

# Add route
route_stmt = "          <Route path=\"/my-orders\" element={<MyOrdersPage />} />\n"
if "path=\"/my-orders\"" not in content:
    content = content.replace("<Route path=\"/account\" element={<AccountPage />} />", "<Route path=\"/account\" element={<AccountPage />} />\n" + route_stmt)

with open('src/App.jsx', 'w') as f:
    f.write(content)
