/**
 * Created by CTT VNPAY
 */

let express = require("express");
let router = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

router.get("/", function (req, res, next) {
  res.render("orderlist", { title: "Danh sách đơn hàng" });
});

router.get("/create_payment_url", function (req, res, next) {
  res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 });
});

router.get("/querydr", function (req, res, next) {
  let desc = "truy van ket qua thanh toan";
  res.render("querydr", { title: "Truy vấn kết quả thanh toán" });
});

router.get("/refund", function (req, res, next) { // Sửa lỗi dòng 25: xóa "req req"
  let desc = "Hoan tien GD thanh toan";
  res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" });
});

router.post("/create_payment_url", async function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require("config");

  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnpUrl = config.get("vnp_Url");
  let returnUrl = config.get("vnp_ReturnUrl");
  let orderId = moment(date).format("DDHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  let products = req.body.products || [];

  let locale = req.body.language || "vn";
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Lưu giỏ hàng vào MongoDB
  try {
    await Cart.updateOne(
      { userId: req.session.userId || "guest" },
      {
        $set: {
          orderId: orderId,
          items: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
            name: p.name,
            img: p.img,
          })),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("Lỗi khi lưu giỏ hàng:", err);
    return res.status(500).json({ message: "Lỗi khi lưu giỏ hàng" });
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false }); // Sửa lỗi dòng 131
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  console.log("🔗 Redirecting to payment URL:", vnpUrl);

  res.json({
    paymentUrl: vnpUrl,
    status: "success",
    message: "Tạo URL thanh toán thành công",
    orderId: orderId,
    amount: amount,
  });
});

router.get("/vnpay_return", async function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = require("config");
  let secretKey = config.get("vnp_HashSecret");

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Thanh toán thành công, chuyển hướng đến URL với ID động
      res.redirect(`http://localhost:3000/order-success/${vnp_Params["vnp_TxnRef"]}`);
    } else {
      // Thanh toán thất bại, render trang lỗi
      res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
    }
  } else {
    // Checksum không hợp lệ, render lỗi
    res.render("success", { code: "97" });
  }
});

router.get("/vnpay_ipn", async function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let config = require("config");
  let secretKey = config.get("vnp_HashSecret");
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  let paymentStatus = "0";
  let checkOrderId = true;
  let checkAmount = true;

  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          if (rspCode == "00") {
            try {
              // Lấy giỏ hàng để lưu đơn hàng
              const cart = await Cart.findOne({ orderId: orderId });
              if (cart) {
                await Order.create({
                  userId: cart.userId,
                  orderId: orderId,
                  products: cart.items,
                  totalAmount: vnp_Params["vnp_Amount"] / 100,
                  paymentMethod: "vnpay",
                  status: "completed",
                });
              }
              // Xóa giỏ hàng
              await clearCartForOrder(orderId);
              res.status(200).json({ RspCode: "00", Message: "Success" });
            } catch (err) {
              console.error("Lỗi khi xử lý đơn hàng:", err);
              res.status(200).json({ RspCode: "99", Message: "Lỗi khi xử lý đơn hàng" });
            }
          } else {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "Đơn hàng đã được cập nhật trạng thái thanh toán",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Số tiền không hợp lệ" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Không tìm thấy đơn hàng" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Kiểm tra checksum thất bại" });
  }
});

// Hàm xóa giỏ hàng từ MongoDB
async function clearCartForOrder(orderId) {
  try {
    await Cart.deleteOne({ orderId: orderId });
    console.log(`Giỏ hàng cho đơn hàng ${orderId} đã được xóa`);
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    throw error;
  }
}

router.post("/cart/clear", async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.session.userId || "guest" });
    res.json({ message: "Giỏ hàng đã được xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" });
  }
});

router.post("/querydr", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "querydr";
  let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let currCode = "VND";
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    }
  );
});

router.post("/refund", function (req, res, next) {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnp_Api = config.get("vnp_Api");

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = "VND";

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "refund";
  let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_TransactionNo = "0";

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TransactionType +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_Amount +
    "|" +
    vnp_TransactionNo +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateBy +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);
    }
  );
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;