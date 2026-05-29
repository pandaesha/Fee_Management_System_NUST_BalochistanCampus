
db = db.getSiblingDB("fee_management_system");

console.log("\n");
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║   FEE MANAGEMENT SYSTEM - COMPLETE DATA INSERTION          ║");
console.log("║    25 Students + Collective Vouchers (Tuition + Misc)      ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

console.log("Step 0: Updating Schemas to prevent validation errors...");
db.dropDatabase();

db.createCollection("students", { validator: { $jsonSchema: { bsonType: "object", required: ["student_id", "password", "name", "email", "phone", "admission_date"], properties: { student_id: { bsonType: "string" }, password: { bsonType: "string" }, name: { bsonType: "string" }, email: { bsonType: "string" }, phone: { bsonType: "string" }, father_name: { bsonType: "string" }, address: { bsonType: "object", properties: { city: { bsonType: "string" }, postal_code: { bsonType: "string" }, country: { bsonType: "string" } } }, admission_date: { bsonType: "date" }, department: { bsonType: "string" }, semester: { bsonType: "number" }, total_fee_due: { bsonType: "number" }, status: { enum: ["active", "inactive"] }, created_at: { bsonType: "date" } } } } });
db.createCollection("fee_vouchers", { validator: { $jsonSchema: { bsonType: "object", required: ["voucher_id", "student_id", "amount", "issue_date", "due_date", "status", "fee_breakdown"], properties: { voucher_id: { bsonType: "string" }, student_id: { bsonType: "string" }, amount: { bsonType: "number" }, issue_date: { bsonType: "date" }, due_date: { bsonType: "date" }, status: { enum: ["pending", "partial", "paid", "overdue"] }, description: { bsonType: "string" }, fee_breakdown: { bsonType: "array", items: { bsonType: "object", required: ["fee_type", "amount"], properties: { fee_type: { enum: ["tuition", "miscellaneous"] }, amount: { bsonType: "number" } } } }, created_at: { bsonType: "date" } } } } });
db.createCollection("installments", { validator: { $jsonSchema: { bsonType: "object", required: ["installment_id", "voucher_id", "student_id", "amount", "due_date"], properties: { installment_id: { bsonType: "string" }, voucher_id: { bsonType: "string" }, student_id: { bsonType: "string" }, installment_number: { bsonType: "number" }, amount: { bsonType: "number" }, due_date: { bsonType: "date" }, paid_amount: { bsonType: "number" }, status: { enum: ["pending", "partial", "paid", "overdue"] }, created_at: { bsonType: "date" } } } } });
db.createCollection("scholarships", { validator: { $jsonSchema: { bsonType: "object", required: ["scholarship_id", "student_id", "amount"], properties: { scholarship_id: { bsonType: "string" }, student_id: { bsonType: "string" }, type: { enum: ["merit", "need-based", "sports", "disability", "discount"] }, amount: { bsonType: "number" }, percentage: { bsonType: "number" }, start_date: { bsonType: "date" }, end_date: { bsonType: "date" }, reason: { bsonType: "string" }, status: { enum: ["active", "inactive", "expired"] }, created_at: { bsonType: "date" } } } } });
db.createCollection("payments", { validator: { $jsonSchema: { bsonType: "object", required: ["payment_id", "student_id", "amount", "payment_date"], properties: { payment_id: { bsonType: "string" }, student_id: { bsonType: "string" }, installment_ids: { bsonType: "array", items: { bsonType: "string" } }, amount: { bsonType: "number" }, payment_method: { enum: ["cash", "bank_transfer", "cheque", "online"] }, payment_date: { bsonType: "date" }, reference_number: { bsonType: "string" }, status: { enum: ["success", "pending", "failed"] }, notes: { bsonType: "string" }, created_at: { bsonType: "date" } } } } });
db.createCollection("receipts", { validator: { $jsonSchema: { bsonType: "object", required: ["receipt_id", "payment_id", "student_id", "amount"], properties: { receipt_id: { bsonType: "string" }, payment_id: { bsonType: "string" }, student_id: { bsonType: "string" }, amount: { bsonType: "number" }, receipt_date: { bsonType: "date" }, issued_by: { bsonType: "string" }, payment_method: { enum: ["cash", "bank_transfer", "cheque", "online"] }, remarks: { bsonType: "string" }, created_at: { bsonType: "date" } } } } });

console.log("✓ Database initialized with Collective Voucher schemas\n");

// ===== INSERT 25 STUDENTS =====
console.log("Step 1: Inserting 25 Students with Departments & Semesters...");
db.students.insertMany([
  { student_id: "STU001", password: "12345", name: "Ali Ahmed Khan", email: "ali.ahmed@school.com", phone: "03001234567", father_name: "Ahmed Khan", address: { city: "Karachi", postal_code: "75300", country: "Pakistan" }, admission_date: new Date("2022-06-15"), department: "Computer Science", semester: 1, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU002", password: "12345", name: "Fatima Ali", email: "fatima.ali@school.com", phone: "03109876543", father_name: "Ali Raza", address: { city: "Lahore", postal_code: "54000", country: "Pakistan" }, admission_date: new Date("2021-09-01"), department: "Civil Engineering", semester: 2, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU003", password: "12345", name: "Hassan Malik", email: "hassan.malik@school.com", phone: "03215558888", father_name: "Malik Hussain", address: { city: "Islamabad", postal_code: "44000", country: "Pakistan" }, admission_date: new Date("2023-01-10"), department: "Artificial Intelligence", semester: 3, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU004", password: "12345", name: "Zainab Khan", email: "zainab.khan@school.com", phone: "03025551111", father_name: "Khan Muhammad", address: { city: "Quetta", postal_code: "87300", country: "Pakistan" }, admission_date: new Date("2022-03-20"), department: "Computer Science", semester: 4, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU005", password: "12345", name: "Muhammad Hasan", email: "m.hasan@school.com", phone: "03335559999", father_name: "Hasan Ali", address: { city: "Rawalpindi", postal_code: "46000", country: "Pakistan" }, admission_date: new Date("2023-07-01"), department: "Civil Engineering", semester: 5, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU006", password: "12345", name: "Saira Khan", email: "saira.khan@school.com", phone: "03165559999", father_name: "Khan Muhammad", address: { city: "Multan", postal_code: "60000", country: "Pakistan" }, admission_date: new Date("2024-01-01"), department: "Artificial Intelligence", semester: 6, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU007", password: "12345", name: "Ayesha Malik", email: "ayesha.malik@school.com", phone: "03215556666", father_name: "Malik Ahmed", address: { city: "Peshawar", postal_code: "25000", country: "Pakistan" }, admission_date: new Date("2023-08-01"), department: "Computer Science", semester: 7, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU008", password: "12345", name: "Omar Farooq", email: "omar.farooq@school.com", phone: "03015557777", father_name: "Farooq Ahmed", address: { city: "Hyderabad", postal_code: "71000", country: "Pakistan" }, admission_date: new Date("2022-09-15"), department: "Civil Engineering", semester: 8, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU009", password: "12345", name: "Hira Nasir", email: "hira.nasir@school.com", phone: "03335558888", father_name: "Nasir Khan", address: { city: "Faisalabad", postal_code: "38000", country: "Pakistan" }, admission_date: new Date("2023-02-20"), department: "Artificial Intelligence", semester: 1, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU010", password: "12345", name: "Bilal Hassan", email: "bilal.hassan@school.com", phone: "03105559999", father_name: "Hassan Raza", address: { city: "Gujranwala", postal_code: "52250", country: "Pakistan" }, admission_date: new Date("2024-02-01"), department: "Computer Science", semester: 2, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU011", password: "12345", name: "Sara Ahmed", email: "sara.ahmed@school.com", phone: "03215554444", father_name: "Ahmed Malik", address: { city: "Sialkot", postal_code: "51310", country: "Pakistan" }, admission_date: new Date("2023-05-10"), department: "Civil Engineering", semester: 3, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU012", password: "12345", name: "Imran Khan", email: "imran.khan@school.com", phone: "03015553333", father_name: "Khan Sahib", address: { city: "Abbottabad", postal_code: "22010", country: "Pakistan" }, admission_date: new Date("2022-08-20"), department: "Artificial Intelligence", semester: 4, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU013", password: "12345", name: "Nida Hassan", email: "nida.hassan@school.com", phone: "03335552222", father_name: "Hassan Ahmed", address: { city: "Sargodha", postal_code: "40100", country: "Pakistan" }, admission_date: new Date("2023-06-15"), department: "Computer Science", semester: 5, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU014", password: "12345", name: "Asad Malik", email: "asad.malik@school.com", phone: "03105551111", father_name: "Malik Hassan", address: { city: "Sheikhupura", postal_code: "39350", country: "Pakistan" }, admission_date: new Date("2023-07-20"), department: "Civil Engineering", semester: 6, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU015", password: "12345", name: "Amina Khan", email: "amina.khan@school.com", phone: "03215551111", father_name: "Khan Tariq", address: { city: "Bahawalpur", postal_code: "63100", country: "Pakistan" }, admission_date: new Date("2022-10-01"), department: "Artificial Intelligence", semester: 7, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU016", password: "12345", name: "Zain Ul Abedin", email: "zain.abedin@school.com", phone: "03015552222", father_name: "Abedin Ahmed", address: { city: "Dera Ghazi Khan", postal_code: "32200", country: "Pakistan" }, admission_date: new Date("2024-01-15"), department: "Computer Science", semester: 8, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU017", password: "12345", name: "Maryam Fatima", email: "maryam.fatima@school.com", phone: "03335555555", father_name: "Fatima Malik", address: { city: "Jhang", postal_code: "35200", country: "Pakistan" }, admission_date: new Date("2023-03-10"), department: "Civil Engineering", semester: 1, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU018", password: "12345", name: "Usman Ahmed", email: "usman.ahmed@school.com", phone: "03105552222", father_name: "Ahmed Nasir", address: { city: "Kasur", postal_code: "56600", country: "Pakistan" }, admission_date: new Date("2023-09-01"), department: "Artificial Intelligence", semester: 2, total_fee_due: 270000.0, status: "active", created_at: new Date() },
  { student_id: "STU019", password: "12345", name: "Iqra Malik", email: "iqra.malik@school.com", phone: "03215552222", father_name: "Malik Iqbal", address: { city: "Okara", postal_code: "56300", country: "Pakistan" }, admission_date: new Date("2022-11-15"), department: "Computer Science", semester: 3, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU020", password: "12345", name: "Fahad Hassan", email: "fahad.hassan@school.com", phone: "03015551111", father_name: "Hassan Tariq", address: { city: "Wazirabad", postal_code: "52600", country: "Pakistan" }, admission_date: new Date("2024-02-20"), department: "Civil Engineering", semester: 4, total_fee_due: 285000.0, status: "active", created_at: new Date() },
  { student_id: "STU021", password: "12345", name: "Rukhsana Khan", email: "rukhsana.khan@school.com", phone: "03335551111", father_name: "Khan Rashid", address: { city: "Mianwali", postal_code: "42800", country: "Pakistan" }, admission_date: new Date("2023-04-05"), department: "Artificial Intelligence", semester: 5, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU022", password: "12345", name: "Danyal Ahmed", email: "danyal.ahmed@school.com", phone: "03105553333", father_name: "Ahmed Karim", address: { city: "Chakbeli", postal_code: "35000", country: "Pakistan" }, admission_date: new Date("2023-08-15"), department: "Computer Science", semester: 6, total_fee_due: 300000.0, status: "active", created_at: new Date() },
  { student_id: "STU023", password: "12345", name: "Huma Nasir", email: "huma.nasir@school.com", phone: "03215553333", father_name: "Nasir Alam", address: { city: "Jehlum", postal_code: "44700", country: "Pakistan" }, admission_date: new Date("2022-12-10"), department: "Civil Engineering", semester: 7, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU024", password: "12345", name: "Rafi Ahmed", email: "rafi.ahmed@school.com", phone: "03015554444", father_name: "Ahmed Nasir", address: { city: "Attock", postal_code: "43600", country: "Pakistan" }, admission_date: new Date("2024-03-01"), department: "Artificial Intelligence", semester: 8, total_fee_due: 315000.0, status: "active", created_at: new Date() },
  { student_id: "STU025", password: "12345", name: "Shabana Khan", email: "shabana.khan@school.com", phone: "03335554444", father_name: "Khan Wahid", address: { city: "Chakwal", postal_code: "48800", country: "Pakistan" }, admission_date: new Date("2023-05-20"), department: "Computer Science", semester: 1, total_fee_due: 270000.0, status: "active", created_at: new Date() }
]);

var studentCount = db.students.countDocuments();
console.log("✓ " + studentCount + " Students inserted\n");


console.log("Step 2: Inserting Scholarships...");

var scholarshipsData = [
  { scholarship_id: "SCH001", student_id: "STU001", type: "merit", amount: 5000, percentage: 10, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Top marks - 90%", status: "active", created_at: new Date() },
  { scholarship_id: "SCH002", student_id: "STU007", type: "merit", amount: 6000, percentage: 15, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Excellent grades", status: "active", created_at: new Date() },
  { scholarship_id: "SCH003", student_id: "STU012", type: "merit", amount: 4500, percentage: 9, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Good performance", status: "active", created_at: new Date() },
  { scholarship_id: "SCH004", student_id: "STU002", type: "need-based", amount: 15000, percentage: 20, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Financial hardship", status: "active", created_at: new Date() },
  { scholarship_id: "SCH005", student_id: "STU005", type: "need-based", amount: 12000, percentage: 25, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Low family income", status: "active", created_at: new Date() },
  { scholarship_id: "SCH006", student_id: "STU010", type: "need-based", amount: 18000, percentage: 30, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Economically backward", status: "active", created_at: new Date() },
  { scholarship_id: "SCH007", student_id: "STU003", type: "sports", amount: 7500, percentage: 15, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Cricket captain", status: "active", created_at: new Date() },
  { scholarship_id: "SCH008", student_id: "STU008", type: "sports", amount: 8000, percentage: 14, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Football player", status: "active", created_at: new Date() },
  { scholarship_id: "SCH009", student_id: "STU015", type: "disability", amount: 20000, percentage: 35, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Hearing impaired", status: "active", created_at: new Date() },
  { scholarship_id: "SCH010", student_id: "STU016", type: "discount", amount: 3000, percentage: 7, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Early enrollment", status: "active", created_at: new Date() },
  { scholarship_id: "SCH011", student_id: "STU020", type: "discount", amount: 2500, percentage: 6, start_date: new Date("2026-01-01"), end_date: new Date("2026-12-31"), reason: "Sibling discount", status: "active", created_at: new Date() },
  { scholarship_id: "SCH012", student_id: "STU025", type: "merit", amount: 4000, percentage: 8, start_date: new Date("2025-01-01"), end_date: new Date("2025-12-31"), reason: "Previous year merit", status: "expired", created_at: new Date() }
];
db.scholarships.insertMany(scholarshipsData);

// Ek dictionary banate hain jisme har student ki active scholarship amount save hogi
var activeScholarships = {};
scholarshipsData.forEach(function(s) {
  if (s.status === "active") {
    activeScholarships[s.student_id] = (activeScholarships[s.student_id] || 0) + s.amount;
  }
});
console.log("✓ " + scholarshipsData.length + " Scholarships inserted\n");

// UPDATE: Create 1 Collective Voucher per student (with Scholarship deductions)
console.log("Step 3: Inserting Collective Fee Vouchers (Deducting Scholarships)...");

var vouchers = [];
var voucherCount = 1;
// In 4 bachon ki fee sirf "paid" hogi, baqi sab ki "pending" hogi
var paidStudents = ["STU003", "STU008", "STU014", "STU021"];

db.students.find({}).forEach(function(student) {
  
  // Scholarship deduction logic
  var discount = activeScholarships[student.student_id] || 0;
  var finalFeeAfterDiscount = student.total_fee_due - discount;
  if (finalFeeAfterDiscount < 0) finalFeeAfterDiscount = 0; // Negative nahi hona chahiye
  
  // Total Fee ko 2 hisson mein taqseem kiya (Breakdown)
  var tuitionPart = Math.round(finalFeeAfterDiscount * 0.8); // 80% Tuition
  var miscPart = finalFeeAfterDiscount - tuitionPart;        // 20% Miscellaneous
  
  var vStatus = paidStudents.indexOf(student.student_id) !== -1 ? "paid" : "pending";

  vouchers.push({
    voucher_id: "VOL" + String(voucherCount).padStart(3, '0'),
    student_id: student.student_id,
    amount: finalFeeAfterDiscount,  // Yahan ab discounted amount aayega
    issue_date: new Date("2026-05-08"), // CURRENT DATE
    due_date: new Date("2026-06-30"),   // END OF JUNE
    status: vStatus,
    description: "Collective Semester Fee Voucher",
    fee_breakdown: [
      { fee_type: "tuition", amount: tuitionPart },
      { fee_type: "miscellaneous", amount: miscPart }
    ],
    created_at: new Date()
  });
  voucherCount++;
});

db.fee_vouchers.insertMany(vouchers);
console.log("✓ " + vouchers.length + " Collective Vouchers inserted (1 per student)\n");

// Create payments only for PAID vouchers
console.log("Step 4: Inserting Payments (Only for paid students)...");

var payments = [];
var paymentCount = 1;
db.fee_vouchers.find({ status: "paid" }).forEach(function(voucher) {
  var methods = ["bank_transfer", "cash", "cheque", "online"];
  var method = methods[paymentCount % 4];
  
  payments.push({
    payment_id: "PAY" + String(paymentCount).padStart(3, '0'),
    student_id: voucher.student_id,
    installment_ids: [],
    amount: voucher.amount,
    payment_method: method,
    payment_date: new Date("2026-05-08"),
    reference_number: method === "bank_transfer" ? "TXN" + paymentCount : method === "cash" ? "CASH" + paymentCount : method === "cheque" ? "CHQ" + paymentCount : "ONL" + paymentCount,
    status: "success",
    notes: "Payment received in full",
    created_at: new Date()
  });
  
  paymentCount++;
});

if(payments.length > 0) {
    db.payments.insertMany(payments);
}
console.log("✓ " + payments.length + " Payments inserted\n");

// Create receipts for successful payments
console.log("Step 5: Inserting Receipts...");

var receipts = [];
var receiptCount = 1;
db.payments.find({ status: "success" }).forEach(function(payment) {
  var issuedBy = ["Mr. Ahmed - Accountant", "Miss Aisha - Accountant", "Mr. Hassan - Manager"];
  receipts.push({
    receipt_id: "REC" + String(receiptCount).padStart(3, '0'),
    payment_id: payment.payment_id,
    student_id: payment.student_id,
    amount: payment.amount,
    receipt_date: payment.payment_date,
    issued_by: issuedBy[receiptCount % 3],
    payment_method: payment.payment_method,
    remarks: "Payment received",
    created_at: new Date()
  });
  receiptCount++;
});

if(receipts.length > 0) {
    db.receipts.insertMany(receipts);
}
console.log("✓ " + receipts.length + " Receipts inserted\n");

// UPDATE: Create installments (Dates updated according to requirement)
console.log("Step 6: Creating 2 Installments per Collective Voucher...");

var installments = [];
var instId = 1;
db.fee_vouchers.find({}).forEach(function(voucher) {
  var inst1 = Math.round(voucher.amount / 2);
  var inst2 = voucher.amount - inst1;
  
  // 1st Installment Due Date = Voucher Due Date (30 June)
  var date1 = new Date(voucher.due_date.getTime());
  
  // 2nd Installment Due Date = 15 Days after 1st Installment
  var date2 = new Date(voucher.due_date.getTime() + 15*24*60*60*1000); 
  
  installments.push({
    installment_id: "INST" + String(instId).padStart(3, '0'),
    voucher_id: voucher.voucher_id,
    student_id: voucher.student_id,
    installment_number: 1,
    amount: inst1,
    due_date: date1, // 30 June
    paid_amount: voucher.status === "paid" ? inst1 : 0,
    status: voucher.status === "paid" ? "paid" : "pending",
    created_at: new Date()
  });
  instId++;
  
  installments.push({
    installment_id: "INST" + String(instId).padStart(3, '0'),
    voucher_id: voucher.voucher_id,
    student_id: voucher.student_id,
    installment_number: 2,
    amount: inst2,
    due_date: date2, // 15 July
    paid_amount: voucher.status === "paid" ? inst2 : 0,
    status: voucher.status === "paid" ? "paid" : "pending",
    created_at: new Date()
  });
  instId++;
});

db.installments.insertMany(installments);
console.log("✓ " + installments.length + " Installments created\n");

// Create indexes
console.log("Step 7: Creating Indexes...");

db.students.createIndex({ student_id: 1 });
db.fee_vouchers.createIndex({ student_id: 1 });
db.fee_vouchers.createIndex({ status: 1 });
db.payments.createIndex({ payment_date: 1 });
db.payments.createIndex({ student_id: 1 });
db.scholarships.createIndex({ student_id: 1 });
db.installments.createIndex({ student_id: 1 });

console.log("✓ Indexes created\n");

// Display final summary securely
console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║                    DATA INSERTION COMPLETE                 ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

console.log("DATABASE STATISTICS:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

var voucherTotalCount = db.fee_vouchers.countDocuments();
var paymentTotalCount = db.payments.countDocuments();
var receiptTotalCount = db.receipts.countDocuments();
var scholarshipTotalCount = db.scholarships.countDocuments();
var installmentTotalCount = db.installments.countDocuments();

var studentAgg = db.students.aggregate([{ $group: { _id: null, total: { $sum: "$total_fee_due" } } }]).toArray();
var totalFees = studentAgg.length > 0 ? studentAgg[0].total : 0;

var paymentAgg = db.payments.aggregate([{ $match: { status: "success" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray();
var totalCollected = paymentAgg.length > 0 ? paymentAgg[0].total : 0;

var scholarshipAgg = db.scholarships.aggregate([{ $match: { status: "active" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray();
var totalScholarships = scholarshipAgg.length > 0 ? scholarshipAgg[0].total : 0;

console.log(" STUDENTS:         " + studentCount + " records");
console.log(" VOUCHERS:         " + voucherTotalCount + " records (1 per Student)");
console.log(" PAYMENTS:         " + paymentTotalCount + " records");
console.log(" RECEIPTS:         " + receiptTotalCount + " records");
console.log(" SCHOLARSHIPS:     " + scholarshipTotalCount + " records");
console.log(" INSTALLMENTS:     " + installmentTotalCount + " records (2 per Voucher)");
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(" ORIGINAL FEE DUE:     " + totalFees + " PKR");
console.log(" TOTAL COLLECTED:      " + totalCollected + " PKR");
console.log(" TOTAL SCHOLARSHIPS:   " + totalScholarships + " PKR");
console.log(" OUTSTANDING:          " + (totalFees - totalCollected - totalScholarships) + " PKR");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

console.log(" All data successfully inserted!");
console.log("\n Ready for queries and reporting!");