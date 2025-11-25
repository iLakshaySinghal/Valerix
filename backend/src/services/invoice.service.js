const PDFDocument = require("pdfkit");

class InvoiceService {
  static generateInvoicePdf(order, res) {
    const doc = new PDFDocument({ margin: 50 });

    const filename = `invoice-${order.invoiceNumber || order._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text("Valerix - Invoice", { align: "center" })
      .moveDown();

    // Order / invoice meta
    doc.fontSize(12);
    doc.text(`Invoice No: ${order.invoiceNumber || "-"}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.moveDown();

    // Customer
    doc.text(`Customer: ${order.userId?.name || ""}`);
    doc.text(`Email: ${order.userId?.email || ""}`);
    doc.moveDown();

    doc.text(`Shipping Address:`, { underline: true });
    doc.text(order.address || "");
    doc.moveDown();

    // Items table
    doc.moveDown().fontSize(13).text("Items:", { underline: true }).moveDown(0.5);

    doc.fontSize(11);
    let total = 0;

    order.items.forEach((it) => {
      const name = it.productId?.name || "Product";
      const qty = it.quantity;
      const price = it.price;
      const lineTotal = qty * price;
      total += lineTotal;

      doc.text(`${name}  x${qty}  @ ₹${price}  =  ₹${lineTotal}`);
    });

    doc.moveDown();
    doc.fontSize(13).text(`Total: ₹${total}`, { align: "right" });

    doc.end();
  }
}

module.exports = InvoiceService;
