const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();

// Settings
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection String
const url = "mongodb://127.0.0.1:27017";
const dbName = "fee_management_system";
let db;

// Connect to MongoDB
MongoClient.connect(url)
    .then((client) => {
        db = client.db(dbName);
        console.log(" Database Connected Successfully!");
    })
    .catch(err => console.log(" Database Connection Error:", err));

// ==========================================
// 1. LOGIN ROUTES
// ==========================================
app.get('/', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const studentId = req.body.student_id.toUpperCase();
    const enteredPassword = req.body.password;
    
    const student = await db.collection('students').findOne({ 
        student_id: studentId, 
        password: enteredPassword 
    });
    
    if (student) {
        res.redirect('/dashboard/' + studentId);
    } else {
        res.render('login', { error: "Invalid Student ID or Password!" });
    }
});

// ==========================================
// 2. DASHBOARD ROUTE
// ==========================================
app.get('/dashboard/:id', async (req, res) => {
    const studentId = req.params.id;
    const student = await db.collection('students').findOne({ student_id: studentId });
    const vouchers = await db.collection('fee_vouchers').find({ student_id: studentId }).toArray();
    
    if(!student) return res.send("Student not found!");

    res.render('dashboard', { student: student, vouchers: vouchers });
});

// ==========================================
// 3. PAYMENT OPTIONS PAGE
// ==========================================
app.get('/pay/:voucher_id', async (req, res) => {
    const voucherId = req.params.voucher_id;
    const voucher = await db.collection('fee_vouchers').findOne({ voucher_id: voucherId });
    
    if(!voucher) return res.send("Voucher not found!");
    
    const student = await db.collection('students').findOne({ student_id: voucher.student_id });
    const installments = await db.collection('installments').find({ voucher_id: voucherId }).toArray();
    
    res.render('pay', { voucher: voucher, student: student, installments: installments });
});

// ==========================================
// 4. CHALLAN PREVIEW ROUTES 
// ==========================================
// Full Payment Challan
app.get('/challan/full/:voucher_id', async (req, res) => {
    const voucher = await db.collection('fee_vouchers').findOne({ voucher_id: req.params.voucher_id });
    const student = await db.collection('students').findOne({ student_id: voucher.student_id });
    
    res.render('challan', { type: 'full', data: voucher, student: student });
});

// Installment Challan
app.get('/challan/installment/:inst_id', async (req, res) => {
    const inst = await db.collection('installments').findOne({ installment_id: req.params.inst_id });
    const student = await db.collection('students').findOne({ student_id: inst.student_id });
    
    res.render('challan', { type: 'installment', data: inst, student: student });
});

// ==========================================
// 5. PROCESS PAYMENTS (DATABASE UPDATE)
// ==========================================
// Process Full Payment
app.post('/pay/full/:voucher_id', async (req, res) => {
    const voucherId = req.params.voucher_id;
    const selectedMethod = req.body.payment_method; // User ka select kiya hua method

    const voucher = await db.collection('fee_vouchers').findOne({ voucher_id: voucherId });
    
    await db.collection('fee_vouchers').updateOne({ voucher_id: voucherId }, { $set: { status: 'paid' } });
    await db.collection('installments').deleteMany({ voucher_id: voucherId });

    const paymentId = "PAY_" + Date.now();
    const receiptId = "REC_" + Date.now();

    await db.collection('payments').insertOne({
        payment_id: paymentId,
        student_id: voucher.student_id,
        installment_ids: [],
        amount: voucher.amount || voucher.total_amount,
        payment_method: selectedMethod, 
        payment_date: new Date(),
        reference_number: "REF_" + Math.floor(Math.random() * 100000),
        status: "success",
        notes: "Full Payment via Student Portal",
        created_at: new Date()
    });

    await db.collection('receipts').insertOne({
        receipt_id: receiptId,
        payment_id: paymentId,
        student_id: voucher.student_id,
        amount: voucher.amount || voucher.total_amount,
        receipt_date: new Date(),
        issued_by: "System Auto-Generated",
        payment_method: selectedMethod, 
        remarks: "Online Fee Portal Transaction",
        created_at: new Date()
    });
    
    res.redirect('/dashboard/' + voucher.student_id);
});

// Process Installment Payment
app.post('/pay/installment/:installment_id', async (req, res) => {
    const instId = req.params.installment_id;
    const selectedMethod = req.body.payment_method; // User ka select kiya hua method

    const installment = await db.collection('installments').findOne({ installment_id: instId });
    if(!installment) return res.send("Installment not found!");
    
    const voucherId = installment.voucher_id;
    
    await db.collection('installments').updateOne(
        { installment_id: instId }, 
        { $set: { status: 'paid', paid_amount: installment.amount } }
    );

    const paymentId = "PAY_" + Date.now();
    const receiptId = "REC_" + Date.now();

    await db.collection('payments').insertOne({
        payment_id: paymentId,
        student_id: installment.student_id,
        installment_ids: [instId],
        amount: installment.amount,
        payment_method: selectedMethod, 
        payment_date: new Date(),
        reference_number: "REF_" + Math.floor(Math.random() * 100000),
        status: "success",
        notes: `Installment ${installment.installment_number} Payment`,
        created_at: new Date()
    });

    await db.collection('receipts').insertOne({
        receipt_id: receiptId,
        payment_id: paymentId,
        student_id: installment.student_id,
        amount: installment.amount,
        receipt_date: new Date(),
        issued_by: "System Auto-Generated",
        payment_method: selectedMethod, 
        remarks: "Online Installment Transaction",
        created_at: new Date()
    });
    
    const pendingInst = await db.collection('installments').findOne({ voucher_id: voucherId, status: { $ne: 'paid' } });
    
    if (!pendingInst) {
        await db.collection('fee_vouchers').updateOne({ voucher_id: voucherId }, { $set: { status: 'paid' } });
    } else {
        await db.collection('fee_vouchers').updateOne({ voucher_id: voucherId }, { $set: { status: 'partial' } });
    }
    
    res.redirect('/dashboard/' + voucher.student_id);
});

// ==========================================
// START SERVER
// ==========================================
app.listen(3000, () => {
    console.log(" Server is running on http://localhost:3000");
});