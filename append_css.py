css = """

/* NEW ORDERS LAYOUT CSS */
.account-content-new {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.orders-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.orders-breadcrumbs a {
  color: #333;
  text-decoration: none;
}

.orders-breadcrumbs span {
  color: #666;
}

.orders-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.orders-tabs {
  display: flex;
  gap: 12px;
}

.orders-tab-pill {
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.orders-tab-pill.active {
  border-color: #8c2b2b;
  color: #8c2b2b;
  background: #fffafa;
}

.orders-date-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.orders-list-new {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card-new {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: box-shadow 0.2s;
  cursor: pointer;
}

.order-card-new:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.order-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.order-status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.order-status-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.order-status-pill.in-progress {
  background: #fff5e6;
  color: #d97706;
}
.order-status-pill.in-progress .dot {
  background: #d97706;
}

.order-status-pill.delivered {
  background: #f0fdf4;
  color: #166534;
}
.order-status-pill.delivered .dot {
  background: #166534;
}

.order-pipe {
  color: #ccc;
}

.order-date-new {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.order-card-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.oc-img-col {
  flex-shrink: 0;
}

.oc-img-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
}

.oc-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.oc-img-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  padding: 2px 0;
}

.oc-info-col {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.oc-id {
  color: #8c2b2b;
  font-weight: 700;
  font-size: 15px;
}

.oc-desc {
  color: #555;
  font-size: 15px;
  line-height: 1.4;
}

.oc-price {
  color: #111;
  font-weight: 600;
  font-size: 16px;
}

.oc-arrow-col {
  flex-shrink: 0;
  padding-left: 20px;
}

@media (max-width: 768px) {
  .orders-filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .orders-tabs {
    flex-wrap: wrap;
  }
  .oc-desc {
    font-size: 13px;
  }
  .oc-arrow-col {
    padding-left: 0;
  }
}
"""
with open('src/pages/AccountPage.css', 'a') as f:
    f.write(css)
