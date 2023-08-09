import { Platform } from "react-native";
const handleAPI = async ({ name, params, method, signal }) => {
   let protocol = Platform.OS === "web" ? "https" : "http";
  params = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  // let domain =
  //     window.location.hostname === "localhost"
  //       ? "https://www.solutioncenter.biz/"
  //       : "../../../",
    URL = `${protocol}://www.solutioncenter.biz/VendorAPI/api/${name}?${params}`;
    //URL = `${domain}VendorAPI/api/${name}?${params}`;

  return fetch(URL, {
    method: method || "POST",
    signal: signal,
    // mode: "cors",
    crossDomain: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .catch(function (err) {
      console.log(`Error: ${err}`);
    });
};

const handleParamFromURL = (url, param) => {
  const include = url.includes(param);

  if (!include) return null;

  const params = url.split(/([&,?,=])/);
  const index = params.indexOf(param);
  const value = params[index + 2];
  return value;
};
const handleWebPageOpen = (RowData, SessionId, url, position) => {
  const { VendorId, AgentID } = RowData;
  const { Height, Width, Left, Top } = JSON.parse(position);

  var sURL =
    url +
    SessionId +
    "&VendorId=" +
    VendorId +
    "&AgentID=" +
    AgentID +
    "&changeid=&changeaction=Edit&PageUse=Edit";
  window.open(
    sURL,
    "",
    `height=${Height},width=${Width},top=${Top},left=${Left},resizable=1,scrollbars=yes`
  );
};

const FormatPhoneLogin = (PhoneNo) => {
  console.log("phone number is converting");
  if (PhoneNo != "") {
    PhoneNo = PhoneNo.replaceAll("-", "");
    PhoneNo = PhoneNo.replaceAll("(", "");
    PhoneNo = PhoneNo.replaceAll(")", "");
    PhoneNo = PhoneNo.replaceAll(" ", "");
    if (
      PhoneNo.indexOf("@") == -1 &&
      Number(PhoneNo) &&
      PhoneNo.length === 10
    ) {
      PhoneNo = PhoneNo.replace(/D/g, "");
      if (PhoneNo.length < 10) {
        return PhoneNo;
      }
      let p = /^([\d]{3})([\d]{3})([\d]{4,})$/.exec(PhoneNo);
      PhoneNo = "(" + p[1] + ") " + p[2] + "-" + p[3];
      return PhoneNo;
    }
  }
  return PhoneNo;
};
export { handleAPI, handleParamFromURL, handleWebPageOpen, FormatPhoneLogin };
