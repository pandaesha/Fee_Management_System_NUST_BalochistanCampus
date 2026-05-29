# 🎓 Fee Management System – NUST Balochistan Campus

A web-based portal for automated student fee calculation, scholarship deduction, payment management, and financial record-keeping. Designed for modern universities and colleges, this system offers students a secure, self-service dashboard to manage all fee-related matters.

---

## 📋 Features

- **Secure Student Login:** Student ID & password authentication.
- **Personalized Dashboard:** View department, semester, and all pending/paid fee vouchers.
- **Automatic Scholarship Deduction:** Active scholarship is auto-deducted from your fee.
- **Flexible Payments:** Full voucher or 2-installment payment options (15-day gap).
- **Multi-Method Payment:** Online (JazzCash/EasyPaisa), Bank transfer, or Cash deposit.
- **Printable Fee Challan:** Auto-generated, printable for each payment (full/partial).
- **Receipts & History:** Every payment auto-generates a receipt with method and reference number.
- **Admin/Seed Script:** Master script to initialize all students, scholarships, vouchers, and payments into MongoDB.

---

## 🚦 How it Works

1. **Login:** Student logs in with their Student ID (e.g., `STU001`) and password (`12345`).
2. **Dashboard:** View all current dues, scholarship status, and payment options.
3. **Choose Payment:** Pay entire fee or select an installment; select payment method.
4. **Challan Generation:** Download/print the official NUST challan.
5. **Receipt:** Upon payment confirmation, get an auto-generated receipt and updated dashboard.

---

## 💻 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS templating, Bootstrap 5, HTML5, CSS3
- **DB:** MongoDB (`students`, `fee_vouchers`, `scholarships`, `installments`, `payments`, `receipts`)
- **DB Seed:** `MASTER_insert_all_data.js` (run via `mongosh`)

---

## 📂 Project Structure

```
/public
  └── images, css, js
/views
  ├── login.ejs
  ├── dashboard.ejs
  ├── pay.ejs
  └── challan.ejs
MASTER_insert_all_data.js
server.js
package.json
README.md
```

---

## 🛠️ Quick Setup

1. `git clone https://github.com/yourusername/fee-management-system`
2. `cd fee-management-system`
3. `npm install`
4. `mongosh MASTER_insert_all_data.js`   *(to seed demo data)*
5. `node server.js`
6. Visit [http://localhost:3000](http://localhost:3000)

### **Student Demo Login**
- **ID:** `STU001` – `STU025`
- **Password:** `12345`

---

## 📖 License

For academic/demo purposes only.  
_© 2026 NUST Balochistan Campus_

---
