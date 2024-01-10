
import crypto from 'crypto';
import https from 'https';

const urls = {
  PAY: "/CustomerPortal/transactionmanagement/merchantform/",
  WALLET: "/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction",
  INQUIRY: "/ApplicationAPI/API/PaymentInquiry/Inquire",
  REFUND: "/ApplicationAPI/API/Purchase/domwalletrefundtransaction",
};

const fields = {
  PAY: [
    "pp_Amount",
    "pp_BankID",
    "pp_BillReference",
    "pp_Description",
    "pp_Language",
    "pp_MerchantID",
    "pp_Password",
    "pp_ProductID",
    "pp_ReturnURL",
    "pp_TxnCurrency",
    "pp_TxnDateTime",
    "pp_TxnExpiryDateTime",
    "pp_TxnRefNo",
    "pp_TxnType",
    "pp_Version",
    "ppmpf_1",
    "ppmpf_2",
    "ppmpf_3",
    "ppmpf_4",
    "ppmpf_5",
  ],
  WALLET: [
    "pp_Amount",
    "pp_BankID",
    "pp_BillReference",
    "pp_CNIC",
    "pp_Description",
    "pp_Language",
    "pp_MerchantID",
    "pp_MobileNumber",
    "pp_Password",
    "pp_ProductID",
    "pp_TxnCurrency",
    "pp_TxnDateTime",
    "pp_TxnExpiryDateTime",
    "pp_TxnRefNo",
    "ppmpf_1",
    "ppmpf_2",
    "ppmpf_3",
    "ppmpf_4",
    "ppmpf_5",
  ],
  INQUIRY: ["pp_MerchantID", "pp_Password", "pp_TxnRefNo"],
  REFUND: [
    "pp_Amount",
    "pp_MerchantID",
    "pp_MerchantMPIN",
    "pp_Password",
    "pp_TxnCurrency",
    "pp_TxnRefNo",
  ],
};

export const JazzcashController = {
  config: {
    merchantId: "MC58340",
    password: "u084tt0zf9",
    hashKey: "",
  },
  url: "",
  error: false,
  secureHash: "",
  initialized: false,
  environment: "sandbox",
  liveURL: "https://payments.jazzcash.com.pk",
  sandboxURL: "https://sandbox.jazzcash.com.pk",
  data: {
    pp_Version: "",
    pp_TxnType: "",
    pp_Language: "",
    pp_MerchantID: "",
    pp_SubMerchantID: "",
    pp_ReturnURL: "",
    pp_Password: "",
    pp_BankID: "",
    pp_ProductID: "",
    pp_TxnRefNo: "",
    pp_Amount: "",
    pp_TxnCurrency: "",
    pp_TxnDateTime: "",
    pp_BillReference: "",
    pp_Description: "",
    pp_TxnExpiryDateTime: "",
    pp_SecureHash: "",
    pp_MerchantMPIN: "",
    ppmpf_1: "",
    ppmpf_2: "",
    ppmpf_3: "",
    ppmpf_4: "",
    ppmpf_5: "",
    pp_MobileNumber: "",
    pp_CNIC: "",
  },
};

JazzcashController.credentials = (credentials) => {
  try {
    const config = credentials.config;
    if (
      config.merchantId.length &&
      config.password.length &&
      config.hashKey.length
    ) {
      JazzcashController.config = {
        merchantId: config.merchantId,
        password: config.password,
        hashKey: config.hashKey,
      };
      JazzcashController.environment =
        credentials.environment || JazzcashController.environment;
      JazzcashController.initialized = true;
    } else {
      throw new Error("Credentials are missing or of invalid length");
    }
  } catch (err) {
    JazzcashController.catchError(err);
  }
};

JazzcashController.setData = (data) => {
  if (JazzcashController.initialized && !JazzcashController.error) {
    JazzcashController.data = {
      pp_Version: data.pp_Version || "1.1",
      pp_TxnType: data.pp_TxnType || "",
      pp_Language: data.pp_Language || "EN",
      pp_MerchantID: JazzcashController.config.merchantId,
      pp_SubMerchantID: data.pp_SubMerchantID || "",
      pp_ReturnURL: data.pp_ReturnURL || "",
      pp_Password: JazzcashController.config.password,
      pp_BankID: data.pp_BankID || "",
      pp_ProductID: data.pp_ProductID || "",
      pp_TxnRefNo:
        data.pp_TxnRefNo || "T" + new Date().getTime().toString(),
      pp_Amount: data.pp_Amount * 100 || "",
      pp_TxnCurrency: data.pp_TxnCurrency || "PKR",
      pp_TxnDateTime: data.pp_TxnDateTime || getDateTime(),
      pp_BillReference: data.pp_BillReference || "",
      pp_Description: data.pp_Description || "",
      pp_TxnExpiryDateTime: data.pp_TxnExpiryDateTime || getDateTime(3),
      ppmpf_1: data.ppmpf_1 || "",
      ppmpf_2: data.ppmpf_2 || "",
      ppmpf_3: data.ppmpf_3 || "",
      ppmpf_4: data.ppmpf_4 || "",
      ppmpf_5: data.ppmpf_5 || "",
      pp_MobileNumber: data.pp_MobileNumber || "",
      pp_CNIC: data.pp_CNIC || "",
    };
  } else {
    JazzcashController.catchError(
      "Jazzcash is not initialized properly to set data."
    );
  }
};

JazzcashController.createRequest = async (request) => {
  if (JazzcashController.initialized && !JazzcashController.error) {
    if (createHash(request)) {
      const data = {};
      const dataFields = fields[request];
      dataFields.forEach((item) => {
       data[item] = JazzcashController.data[item];
      });
      data.pp_SecureHash = JazzcashController.secureHash;

      if (request === "PAY") {
        return data;
      } else {
        const dataString = JSON.stringify(data);
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(dataString),
          },
        };

        return new Promise((resolve, reject) => {
          const req = https.request(
            JazzcashController.url,
            options,
            (res) => {
              const chunks = [];
              res.on("data", (chunk) => chunks.push(chunk));
              res.on("end", () => {
                const response = Buffer.concat(chunks).toString();
                resolve(response);
              });
            }
          );
          req.on("error", (err) => {
            reject(err);
          });
          req.on("timeout", () => {
            req.destroy();
            reject(new Error("Request time out"));
          });
          req.write(dataString);
          req.end();
        });
      }
    }
  } else {
    JazzcashController.catchError(
      "Jazzcash is not initialized properly to create request."
    );
  }
};

const createHash = (request) => {
  if (urls[request]) {
    JazzcashController.url =
      (JazzcashController.environment === "live"
        ? JazzcashController.liveURL
        : JazzcashController.sandboxURL) + urls[request];
    const hashFields = fields[request];

    let unhashedString = JazzcashController.config.hashKey;
    hashFields.forEach((item) => {
      const data = JazzcashController.data;
      if (data[item]) {
        unhashedString += "&" + data[item];
      }
    });
    JazzcashController.secureHash = crypto
      .createHmac("SHA256", JazzcashController.config.hashKey)
      .update(unhashedString)
      .digest("hex");
    return true;
  } else {
    JazzcashController.catchError(
      "No such request exists. Try using PAY, WALLET, INQUIRY, or REFUND."
    );
    return false;
  }
};

JazzcashController.catchError = (err) => {
  JazzcashController.error = true;
  console.error(err);
};

function getDateTime(day) {
  let date = new Date();
  let dateStr = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let arr = dateStr.split("/");
  let d = parseInt(arr[0]) + (day || 0);
  let m = arr[1];
  let y = arr[2];

  let timeStr = date.toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  let arr2 = timeStr.split(":");
  let H = arr2[0];
  let i = arr2[1];
  let s = arr2[2];

  let ymdHms = y + m + d + H + i + s;
  return ymdHms;
}
