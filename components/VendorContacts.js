import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Linking,
  Button,
  Text,
} from "react-native";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
  Col,
} from "react-native-table-component";

import InputField from "./controls/InputField";
import CustomText from "./controls/CustomText";
import Checkbox from "expo-checkbox";
import {
  handleAPI,
  FormatPhoneLogin,
  handleWebPageOpen,
  handleParamFromURL,
} from "./controls/CommonFunctions";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
export default function VendorContacts() {
  const windowWidth = useWindowDimensions().width; // Using for small screen
  const [editCard, setEditCard] = useState({}); // To check which card is enabling for editing
  const [editCompany, setEditCompany] = useState({}); // To check which card's chane company button is checked
  const [cardInfo, setCardInfo] = useState([]); // Final JSON for saving
  const [result, setResult] = useState([]); // API result
  const [sellerInfo, setSellerInfo] = useState({}); // This will have seller info(Add additional seller, see list)
  const [isModalVisible, setModalVisible] = useState(false);
  const [queryString, setQueryString] = useState({
    LoanId: "456760",
    SessionId: "",
    IsEditRights: 0,
  });
  const [copyAgent, setCopyAgent] = useState([]);
  const [tabelProps, setTableProps] = useState({
    tableHead: ["Contact", "Company", "Company Status", "File Number"],
    tableTitle: [
      "Lender",
      "Mortgage Insurance",
      "Sell The Loan To",
      "Loan Servicer",
      "Warehouse Bank",
      "Compliance",
      "System Product",
      "FHA Connection",
      "LDP Exclusion Report – via Order Services",
      "Appraisal Management Company",
      "GSA Report – via Order Services",
    ],
    tableData: [
      // { one: 1, two: 2, three: 3, four: 4 },
      // { one: 1, two: 2, three: 3, four: 4 },
      // { one: 1, two: 2, three: 3, four: 4 },
      // { one: 1, two: 2, three: 3, four: 4 },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Lender",
        FileNumber: "2301621958",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Mortgage Insurance",
        FileNumber: "234234",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Sell The Loan To",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Asset Verification3",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Asset Verification4",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
    ],
  });
  const [sellerTabelProps, setSellerTabelProps] = useState({
    tableHead: ["Name", "Phone", "Email"],
    tableData: [
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Lender",
        FileNumber: "2301621958",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Mortgage Insurance",
        FileNumber: "234234",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Sell The Loan To",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Asset Verification3",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
      {
        CompEmail: "Testcase@gmail.com",
        Companyname: "AB",
        ContactType: 25,
        ContactTypename: "Asset Verification4",
        FileNumber: "",
        Loanid: 466132,
        VendorId: 0,
      },
    ],
  });

  // const Rows = [
  //   {
  //     AgentEmail: "DMCTestJuly6A@directcorp.com",
  //     AgentFN: "Antony Testcase",
  //     AgentID: 143448,
  //     AgentLicense: "",
  //     CompEmail: "DMCTestJuly6A@directcorp.com",
  //     CompPhone: "(111) 222-3334",
  //     CompanyAddress: "Testcast Street, Midvale, UT, 84047",
  //     CompanyCity: "Midvale",
  //     CompanyLicense: "",
  //     CompanyState: "UT",
  //     CompanyStreetAddr: "Testcast Street",
  //     CompanyZip: "84047",
  //     Companyname: "Anto Testcase",
  //     ContactType: 7,
  //     ContactTypename: "Hazard Insurance",
  //     FileNumber: "123345",
  //     Loanid: 457404,
  //     Phone: "(904) 720-8573",
  //     VendorId: 105500,
  //     isCard: 1,
  //     isEscrowSame: -1,
  //   },
  //   {
  //     AgentEmail: "DMCTestJuly8A@directcorp.com",
  //     AgentFN: "",
  //     AgentID: 143475,
  //     AgentLicense: "1234",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: ", , , ",
  //     CompanyCity: "",
  //     CompanyLicense: "4212",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "DMCTestJuly8AComp",
  //     ContactType: 0,
  //     ContactTypename: "Seller",
  //     FileNumber: "T1234T",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 105519,
  //     isCard: 1,
  //     isEscrowSame: 1,
  //   },
  //   {
  //     AgentEmail: "DMCTestJuly8A@directcorp.com",
  //     AgentFN: "",
  //     AgentID: 143475,
  //     AgentLicense: "1234",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: ", , , ",
  //     CompanyCity: "",
  //     CompanyLicense: "4212",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "DMCTestJuly8AComp",
  //     ContactType: 2,
  //     ContactTypename: "Title",
  //     FileNumber: "T1234T",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 105519,
  //     isCard: 1,
  //     isEscrowSame: 1,
  //   },
  //   {
  //     AgentEmail: "DMCTestJuly8A@directcorp.com",
  //     AgentFN: "",
  //     AgentID: 143475,
  //     AgentLicense: "1234",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: ", , , ",
  //     CompanyCity: "",
  //     CompanyLicense: "4212",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "DMCTestJuly8AComp",
  //     ContactType: 4,
  //     ContactTypename: "Escrow",
  //     FileNumber: "T1234E",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 105519,
  //     isCard: 1,
  //     isEscrowSame: -1,
  //   },
  //   {
  //     AgentEmail: "",
  //     AgentFN: "",
  //     AgentID: 0,
  //     AgentLicense: "",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: "",
  //     CompanyCity: "",
  //     CompanyLicense: "",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "",
  //     ContactType: 48,
  //     ContactTypename: "Title Seller",
  //     FileNumber: "",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 0,
  //     isCard: 1,
  //     isEscrowSame: 0,
  //   },
  //   {
  //     AgentEmail: "",
  //     AgentFN: "",
  //     AgentID: 0,
  //     AgentLicense: "",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: "",
  //     CompanyCity: "",
  //     CompanyLicense: "",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "",
  //     ContactType: 49,
  //     ContactTypename: "Escrow Seller",
  //     FileNumber: "",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 0,
  //     isCard: 1,
  //     isEscrowSame: -1,
  //   },
  //   {
  //     AgentEmail: "",
  //     AgentFN: "",
  //     AgentID: 0,
  //     AgentLicense: "",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: "",
  //     CompanyCity: "",
  //     CompanyLicense: "",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "",
  //     ContactType: 50,
  //     ContactTypename: "Real Estate Borrower",
  //     FileNumber: "",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 0,
  //     isCard: 1,
  //     isEscrowSame: -1,
  //   },
  //   {
  //     AgentEmail: "",
  //     AgentFN: "",
  //     AgentID: 0,
  //     AgentLicense: "",
  //     CompEmail: "",
  //     CompPhone: "",
  //     CompanyAddress: "",
  //     CompanyCity: "",
  //     CompanyLicense: "",
  //     CompanyState: "",
  //     CompanyStreetAddr: "",
  //     CompanyZip: "",
  //     Companyname: "",
  //     ContactType: 51,
  //     ContactTypename: "Real Estate Seller",
  //     FileNumber: "",
  //     Loanid: 457404,
  //     Phone: "",
  //     VendorId: 0,
  //     isCard: 1,
  //     isEscrowSame: -1,
  //   },
  // ];

  if (Platform.OS === "web") {
    useEffect(() => {
      const SearchURL = window.location.search;
      const searchParams = new URLSearchParams(SearchURL);
      setQueryString({
        ...queryString,
        LoanId: searchParams.get("LoanId"), //handleParamFromURL(document.location.href, "LoanId"),
        SessionId: searchParams.get("SessionId"), //handleParamFromURL(document.location.href, "SessionId"),
      });
      //searchParams.get("SessionId")
      handleAPI({
        name: "GetUsersDetails",
        params: { SessionId: searchParams.get("SessionId") }, //queryString["SessionId"] },
        method: "POST",
      })
        .then((response) => {
          console.log(response);
          let UserId = response.split("~")[0];
          let IsEditRights = response.split("~")[3];
          setQueryString({ ...queryString, IsEditRights: IsEditRights });
          if (UserId == 0) {
            if (Platform.OS === "web") {
              window.location.href =
                "https://directcorp.com/Login/Presentation/Webforms/LoginInline.aspx";
            }
            console.log(
              "---------------------------------------------------------"
            );
            console.log("Invalid session");
            console.log(
              "---------------------------------------------------------"
            );

            return;
          } else {
            GetVendoronload();
          }
        })
        .catch((e) => console.log("Get Session Info => ", e));
    }, []);
  } else {
    useEffect(() => {
      GetVendoronload();
    }, []);
  }

  const GetVendoronload = () => {
    let qString = "",
      sParams = "";
    if (Platform.OS === "web") {
      qString = window.location.search;
      sParams = new URLSearchParams(qString);
    }
    handleAPI({
      name: "Get_VendorLoanInfo",
      params: {
        LoanId:
          Platform.OS === "web" ? sParams.get("LoanId") : queryString["LoanId"],
        Fullrows: 0,
      },
      method: "POST",
    })
      .then((response) => {
        let Data = JSON.parse(response);
        //let Data = Rows;
        let sellerData = Data.filter((e) => e.ContactType === 0);
        setSellerInfo({ ...sellerInfo, RowData: sellerData });
        const isCard = Data.filter((e) => e.isCard === 1);
        if (isCard.length) {
          let CardData = isCard;

          const hasSeller = CardData.filter((e) => e.ContactType == 0);
          if (Object.keys(hasSeller).length === 0)
            CardData.splice(1, 0, { ContactType: 0, IsEmpty: true, isCard: 1 });

          const hasSellerEscrow = CardData.filter((e) => e.ContactType == 49);
          if (Object.keys(hasSellerEscrow).length === 0)
            CardData.splice(5, 0, {
              ContactType: 49,
              IsEmpty: true,
              isCard: 1,
            });
          setResult(getUniqueObjectsByKey(CardData, "ContactTypename"));
          setCardInfo(getUniqueObjectsByKey(CardData, "ContactTypename"));

          const EmptyVendors = CardData.filter(
            (e) => e.AgentID === 0 && e.VendorId === 0
          );
          const EnableSearch = EmptyVendors.map((e) => e.ContactType).reduce(
            (map, number) => {
              map[number] = true;
              return map;
            },
            {}
          );
          setEditCompany(EnableSearch);
        } else {
          let GridData = Data.filter((e) => e.isCard === 1);
          //setResult({ ...result, AllVendor: GridData });
        }
        console.log("Result from API ===> ", Data);
      })
      .catch((e) => console.log("Get API => ", e));
    // setCardInfo(rows); // Testing purpose
  };

  const handleCardChange = (index, name, value) => {
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ...PrevObj[index],
        [name]: value,
        IsModified: 1,
      };
      return updateObj;
    });
  };
  const fnAutoPopulateStateCity = (value, index) => {
    handleAPI({
      name: "GetZipCodeInfo",
      params: {
        zipcode: value,
      },
      method: "POST",
    })
      .then((response) => {
        const result = JSON.parse(response);
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ...PrevObj[index],
            ["CompanyCity"]: result[0].city,
            ["CompanyState"]: result[0].state,
            IsModified: 1,
          };
          return updateObj;
        });
        console.log("auto populate result ==>", response);
      })
      .catch((e) => console.log("While auto populate  => ", e));
  };
  const handleVedorSave = (index) => {
    console.log("vendor card info ==>", cardInfo[index]);
    const finalJson = cardInfo.filter((e, i) => i == index);
    handleAPI({
      name: "Save_VendorLoanInfo",
      params: { SaveJson: JSON.stringify(finalJson) },
      method: "POST",
    })
      .then((response) => {
        console.log(response);
        if (response === "Completed") {
          setEditCard({
            ...editCard,
            [finalJson[0]["ContactType"]]: false,
          });

          setResult((PrevObj) => {
            const updateObj = [...PrevObj];
            updateObj[index] = {
              ...PrevObj[index],
              ["AgentEmail"]: finalJson[0].AgentEmail,
              ["AgentFN"]: finalJson[0].AgentFN,
              ["AgentLicense"]: finalJson[0].AgentLicense,
              ["CompEmail"]: finalJson[0].CompEmail,
              ["CompPhone"]: finalJson[0].CompPhone,
              ["CompanyAddress"]: finalJson[0].CompanyAddress,
              ["CompanyCity"]: finalJson[0].CompanyCity,
              ["CompanyLicense"]: finalJson[0].CompanyLicense,
              ["CompanyState"]: finalJson[0].CompanyState,
              ["CompanyStreetAddr"]: finalJson[0].CompanyStreetAddr,
              ["CompanyZip"]: finalJson[0].CompanyZip,
              ["CompanyAddress"]: `${finalJson[0].CompanyStreetAddr} , ${finalJson[0].CompanyCity} , ${finalJson[0].CompanyState} , ${finalJson[0].CompanyZip}`,
              ["Companyname"]: finalJson[0].Companyname,
              ["ContactType"]: finalJson[0].ContactType,
              ["ContactTypename"]: finalJson[0].ContactTypename,
              ["Loanid"]: finalJson[0].Loanid,
              ["Phone"]: finalJson[0].Phone,
              ["VendorId"]: finalJson[0].state,
              ["isCard"]: finalJson[0].isCard,
              ["isEscrowSame"]: finalJson[0].isEscrowSame,
              ["FileNumber"]: finalJson[0].FileNumber,
            };
            return updateObj;
          });
        }
      })
      .catch((e) => console.log("Error While saving vendor details => ", e));
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const getUniqueObjectsByKey = (objects, key) => {
    const uniqueValues = new Set();
    const uniqueObjects = [];

    objects.forEach((obj) => {
      const value = obj[key];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        uniqueObjects.push(obj);
      }
    });

    return uniqueObjects;
  };
  return (
    <View>
      {result.length === 0 && (
        <CustomText style={styles["card-Loading"]}>Loading...</CustomText>
      )}
      {/* Cards Section */}
      <View
        style={[
          styles["card-parent"],
          windowWidth < 1000 && styles["card-small"],
        ]}
      >
        {result?.map((row, index) => (
          <View
            key={index}
            style={[
              styles["card-container"],
              (index === 1 && row["IsEmpty"]) || (index === 5 && row["IsEmpty"])
                ? styles["card-hide"]
                : "",
              (index === 1 && row["IsEmpty"] && windowWidth < 1000) ||
              (index === 5 && row["IsEmpty"] && windowWidth < 1000)
                ? { display: "none" }
                : "",
            ]}
          >
            <View style={styles["card-child"]}>
              <View style={styles["card-header"]}>
                <CustomText style={styles["card-Title"]}>
                  {row.ContactTypename}
                </CustomText>
                {/* To show the header buttons based on the vendor "0" is for Seller */}
                {row["ContactType"] != 0 ? (
                  <>
                    <>
                      {!editCard[row["ContactType"]] && (
                        <>
                          <TouchableOpacity
                            onPress={(e) => {
                              setEditCard({
                                ...editCard,
                                [row["ContactType"]]:
                                  editCard[row["ContactType"]] === undefined
                                    ? true
                                    : !editCard[row["ContactType"]],
                              });
                            }}
                            style={[styles.buttonContainer]}
                          >
                            <CustomText style={styles["btn"]}>
                              {"Edit"}
                            </CustomText>
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                    <>
                      {editCard[row["ContactType"]] ? (
                        <View style={styles["btn"]}>
                          <TouchableOpacity
                            style={[styles.buttonContainer]}
                            onPress={(e) => {
                              handleVedorSave(index);
                            }}
                          >
                            <CustomText style={styles["btn"]}>
                              {"Save"}
                            </CustomText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={(e) => {
                              setEditCard({
                                ...editCard,
                                [row["ContactType"]]:
                                  editCard[row["ContactType"]] === undefined
                                    ? false
                                    : !editCard[row["ContactType"]],
                              });
                            }}
                            style={[styles.buttonContainer]}
                          >
                            <CustomText style={styles["btn"]}>
                              {"Cancel"}
                            </CustomText>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </>
                  </>
                ) : (
                  <>
                    {sellerInfo["AddSeller"] !== true ? (
                      <View style={styles["btn"]}>
                        <TouchableOpacity
                          style={[styles.buttonContainer]}
                          onPress={(e) => {
                            setSellerInfo({ ...sellerInfo, AddSeller: true });
                          }}
                        >
                          <CustomText style={styles["btn"]}>
                            {"Add Additional Seller"}
                          </CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={toggleModal}
                          style={[styles.buttonContainer]}
                        >
                          <CustomText style={styles["btn"]}>
                            {"See list"}
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles["btn"]}>
                        <TouchableOpacity
                          style={[styles.buttonContainer]}
                          onPress={(e) => {
                            setSellerInfo({ ...sellerInfo, AddSeller: true });
                          }}
                        >
                          <CustomText style={styles["btn"]}>
                            {"Save"}
                          </CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={(e) => {
                            setSellerInfo({ ...sellerInfo, AddSeller: false });
                          }}
                          style={[styles.buttonContainer]}
                        >
                          <CustomText style={styles["btn"]}>
                            {"Cancel"}
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
              {/* To show the body buttons based on the vendor "0" is for Seller */}
              {row["ContactType"] == 0 ? (
                <>
                  <View
                    style={[
                      styles["card-body"],
                      {
                        minHeight: Platform.OS === "web" ? 250 : null,
                      },
                    ]}
                  >
                    {sellerInfo["AddSeller"] && (
                      <>
                        <View
                          style={[styles["card-item"], { alignSelf: "center" }]}
                        ></View>
                        {/* <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="Contact for Property Entry"
                            autoFocus
                            type="default"
                            name="ContactforPropertyEntry"
                            // value={cardInfo[index]["CompanyAddress"]}
                            placeholder="Contact for Property Entry"
                            onPress={(e) => {
                              setEditCard({
                                ...editCard,
                                [index]: true,
                              });
                            }}
                          />
                        </View> */}
                        <View
                          style={[styles["card-item"], { alignSelf: "center" }]}
                        >
                          <CustomText bold={true}>
                            {"Contact for Property Entry"}
                          </CustomText>
                        </View>
                      </>
                    )}
                    <View
                      style={[styles["card-item"], { alignSelf: "center" }]}
                    >
                      <CustomText>{row.AgentFN}</CustomText>
                    </View>
                    {sellerInfo["AddSeller"] ? (
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Name"
                          type="default"
                          name="Name"
                          // value={cardInfo[index]["CompanyAddress"]}
                          placeholder="Name"
                          onPress={(e) => {
                            setEditCard({
                              ...editCard,
                              [index]: true,
                            });
                          }}
                        />
                      </View>
                    ) : (
                      <View style={[styles["card-item"]]}></View>
                    )}
                    <View
                      style={[styles["card-item"], { alignSelf: "center" }]}
                    >
                      <CustomText>{row.AgentEmail}</CustomText>
                    </View>
                    {sellerInfo["AddSeller"] ? (
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Phone"
                          type="default"
                          name="Phone"
                          // value={cardInfo[index]["CompanyAddress"]}
                          placeholder="Phone"
                          onPress={(e) => {
                            setEditCard({
                              ...editCard,
                              [index]: true,
                            });
                          }}
                        />
                      </View>
                    ) : (
                      <View style={[styles["card-item"]]}></View>
                    )}
                    <View
                      style={[styles["card-item"], { alignSelf: "center" }]}
                    >
                      <CustomText>{row.Phone}</CustomText>
                    </View>
                    {sellerInfo["AddSeller"] ? (
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Email"
                          type="default"
                          name="Email"
                          // value={cardInfo[index]["CompanyAddress"]}
                          placeholder="Email"
                          onPress={(e) => {
                            setEditCard({
                              ...editCard,
                              [index]: true,
                            });
                          }}
                        />
                      </View>
                    ) : (
                      <View style={[styles["card-item"]]}></View>
                    )}
                  </View>
                </>
              ) : (
                <>
                  {!editCard[row["ContactType"]] ||
                  (queryString["IsEditRights"] != 1 &&
                    row["isEditRestricted"] == 1) ? (
                    <>
                      {editCard[row["ContactType"]] &&
                        row["isEditRestricted"] == 1 &&
                        queryString["IsEditRights"] == 0 && (
                          <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                            <CustomText style={{ fontSize: 11, color: "red" }}>
                              Editing this Vendor is Restricted.
                            </CustomText>
                            <CustomText style={{ fontSize: 11, color: "red" }}>
                              Email{" "}
                              <CustomText
                                style={[
                                  { fontSize: 11, color: "red" },
                                  styles["card-text-underline"],
                                ]}
                                onPress={() => {
                                  let subject = "",
                                    body = "";
                                  const emailUrl = `mailto:MakeMeAware@directcorp.com?subject=${encodeURIComponent(
                                    subject
                                  )}&body=${encodeURIComponent(body)}`;
                                  Linking.openURL(emailUrl);
                                }}
                              >
                                MakeMeAware@directcorp.com
                              </CustomText>{" "}
                              to remove this Restriction
                            </CustomText>
                          </View>
                        )}
                      <View
                        style={[
                          styles["card-body"],
                          {
                            minHeight: Platform.OS === "web" ? 250 : null,
                            gridTemplateColumns: editCompany[row["ContactType"]]
                              ? "repeat(1,1fr)"
                              : "repeat(2,1fr)",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles["card-item"],
                            {
                              flexDirection: !editCompany[row["ContactType"]]
                                ? "row"
                                : "column",
                            },
                          ]}
                        >
                          {!editCompany[row["ContactType"]] ? (
                            <>
                              <CustomText
                                bold={true}
                                style={[
                                  Platform.OS === "web" &&
                                    styles["card-text-underline"],
                                  {
                                    marginRight: 5,
                                    flexWrap: "wrap",
                                    width: Platform.OS !== "web" && "60%",
                                  },
                                ]}
                                onPress={(e) =>
                                  handleWebPageOpen(
                                    row["VendorId"],
                                    Platform.OS === "web" &&
                                      handleParamFromURL(
                                        document.location.href,
                                        "SessionId"
                                      )
                                    //queryString["SessionId"]
                                  )
                                }
                              >
                                {row.Companyname}
                              </CustomText>
                              <TouchableOpacity
                                onPress={(e) => {
                                  setEditCompany({
                                    ...editCompany,
                                    [row["ContactType"]]:
                                      editCompany[row["ContactType"]] ===
                                      undefined
                                        ? true
                                        : !editCompany[row["ContactType"]],
                                  });
                                }}
                                style={[
                                  [styles.buttonContainer],
                                  { alignSelf: "center", padding: 5 },
                                ]}
                              >
                                <CustomText
                                  style={[styles["btn"], { fontSize: 10 }]}
                                >
                                  {"Change"}
                                </CustomText>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <View
                                style={[
                                  styles["card-input"],
                                  // styles["card-item"],
                                  Platform.OS !== "web" && {
                                    flexDirection: "row",
                                  },
                                ]}
                              >
                                <InputField
                                  label="Company or Agent Name, Email or Cell Phone"
                                  type="default"
                                  name="EmailorCellPhone"
                                  // value={cardInfo[index]["CompanyAddress"]}
                                  placeholder="Company or Agent Name, Email or Cell Phone"
                                  onPress={(e) => {
                                    setEditCard({
                                      ...editCard,
                                      [index]: true,
                                    });
                                  }}
                                />
                              </View>
                              <View style={{ marginTop: 10 }}>
                                <TouchableOpacity
                                  onPress={(e) => {
                                    setEditCompany({
                                      ...editCompany,
                                      [row["ContactType"]]:
                                        editCompany[row["ContactType"]] ===
                                        undefined
                                          ? true
                                          : false,
                                    });
                                  }}
                                  style={[
                                    [styles.buttonContainer],
                                    {
                                      alignSelf: !editCompany[
                                        row["ContactType"]
                                      ]
                                        ? "center"
                                        : "baseline",
                                      marginLeft: 5,
                                    },
                                  ]}
                                >
                                  <CustomText style={styles["btn"]}>
                                    {"Cancel"}
                                  </CustomText>
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
                        </View>

                        <>
                          {!editCompany[row["ContactType"]] ? (
                            <>
                              <View
                                style={[
                                  styles["card-item"],
                                  { alignSelf: "center" },
                                ]}
                              >
                                <CustomText bold={true}>
                                  {row.AgentFN}
                                </CustomText>
                              </View>
                              <View style={styles["card-item"]}>
                                <CustomText>
                                  {row.CompanyAddress?.split(",")[0]}
                                </CustomText>
                                <CustomText>
                                  {row.CompanyAddress?.split(",")
                                    .slice(1)
                                    .join(" ")
                                    .trim()}
                                </CustomText>
                              </View>
                              {row["ContactType"] !== 7 ? (
                                <View style={styles["card-item"]}>
                                  <CustomText
                                    bold={true}
                                    style={styles["card-lablebold"]}
                                  >
                                    {"Agent License :"}
                                  </CustomText>
                                  <CustomText>{row.AgentLicense}</CustomText>
                                </View>
                              ) : (
                                <View style={styles["card-item"]}></View>
                              )}
                              {row["ContactType"] !== 7 ? (
                                <View style={styles["card-item"]}>
                                  <CustomText
                                    bold={true}
                                    style={styles["card-lablebold"]}
                                  >
                                    {"License :"}
                                  </CustomText>
                                  <CustomText>{row.CompanyLicense}</CustomText>
                                </View>
                              ) : (
                                <View style={styles["card-item"]}></View>
                              )}
                              <View style={styles["card-item"]}>
                                <CustomText
                                  onPress={() => {
                                    let phoneNumber = row.Phone?.replaceAll(
                                      "-",
                                      ""
                                    )
                                      .replaceAll("(", "")
                                      .replaceAll(")", "")
                                      .replaceAll(" ", "");

                                    phoneNumber = `tel:${phoneNumber}`;

                                    Linking.canOpenURL(phoneNumber)
                                      .then((supported) => {
                                        return Linking.openURL(phoneNumber);
                                      })
                                      .catch((err) => console.log(err));
                                  }}
                                  style={styles["card-text-underline"]}
                                >
                                  {row.Phone}
                                </CustomText>
                              </View>
                              <View style={styles["card-item"]}>
                                <CustomText
                                  onPress={() => {
                                    let phoneNumber = row.CompPhone?.replaceAll(
                                      "-",
                                      ""
                                    )
                                      .replaceAll("(", "")
                                      .replaceAll(")", "")
                                      .replaceAll(" ", "");

                                    phoneNumber = `tel:${phoneNumber}`;

                                    Linking.canOpenURL(phoneNumber)
                                      .then((supported) => {
                                        if (!supported) {
                                          return Linking.openURL(phoneNumber);
                                        }
                                      })
                                      .catch((err) => console.log(err));
                                  }}
                                  style={styles["card-text-underline"]}
                                >
                                  {row.CompPhone}
                                </CustomText>
                              </View>
                              <View style={styles["card-item"]}>
                                <CustomText
                                  onPress={() => {
                                    let subject = "",
                                      body = "";
                                    const emailUrl = `mailto:${
                                      row.AgentEmail
                                    }?subject=${encodeURIComponent(
                                      subject
                                    )}&body=${encodeURIComponent(body)}`;
                                    Linking.openURL(emailUrl);
                                  }}
                                  style={styles["card-text-underline"]}
                                >
                                  {row.AgentEmail}
                                </CustomText>
                              </View>
                              {[7, 2, 4].includes(row["ContactType"]) && (
                                <>
                                  {queryString["IsEditRights"] == 1 ||
                                  !editCard[row["ContactType"]] ? (
                                    <View style={styles["card-item"]}>
                                      <CustomText
                                        bold={true}
                                        style={styles["card-lablebold"]}
                                      >
                                        {row["ContactType"] === 7
                                          ? "Policy Number :"
                                          : "File Number :"}
                                      </CustomText>
                                      <CustomText>{row.FileNumber}</CustomText>
                                    </View>
                                  ) : (
                                    <>
                                      {[7, 2, 4].includes(
                                        row["ContactType"]
                                      ) && (
                                        <View
                                          style={[
                                            styles["card-input"],
                                            styles["card-item"],
                                          ]}
                                        >
                                          <InputField
                                            label={
                                              row["ContactType"] === 7
                                                ? "Policy Number"
                                                : "File Number"
                                            }
                                            //autoFocus
                                            type="default"
                                            name={
                                              row["ContactType"] === 7
                                                ? "Policy Number"
                                                : "File Number"
                                            }
                                            value={
                                              cardInfo[index]["FileNumber"]
                                            }
                                            placeholder="File Number"
                                            onChangeText={(Text) => {
                                              handleCardChange(
                                                index,
                                                "FileNumber",
                                                Text
                                              );
                                            }}
                                            // style ={styles.InputField}
                                          />
                                        </View>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      </View>
                    </>
                  ) : (
                    //Editing view Starts here
                    <View style={styles["card-body"]}>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company Name"
                          autoFocus
                          type="default"
                          name="CompanyName"
                          value={cardInfo[index]["Companyname"]}
                          placeholder="Company Name"
                          onChangeText={(Text) => {
                            handleCardChange(index, "Companyname", Text);
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Agent Name"
                          //autoFocus
                          type="default"
                          name="AgentName"
                          value={cardInfo[index]["AgentFN"]}
                          placeholder="Name"
                          onChangeText={(Text) => {
                            handleCardChange(index, "AgentFN", Text);
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company Street Address"
                          //   autoFocus
                          type="default"
                          name="CompanyStreetAddr"
                          value={cardInfo[index]["CompanyStreetAddr"]}
                          placeholder="Street Address"
                          onChangeText={(Text) => {
                            handleCardChange(index, "CompanyStreetAddr", Text);
                          }}
                        />
                      </View>
                      {row["ContactType"] !== 7 ? (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="Agent License "
                            // autoFocus
                            type="default"
                            name=""
                            value={cardInfo[index]["AgentLicense"]}
                            placeholder="Agent License "
                            onChangeText={(Text) => {
                              handleCardChange(index, "AgentLicense", Text);
                            }}
                            // style ={styles.InputField}
                          />
                        </View>
                      ) : (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        ></View>
                      )}

                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company Zip"
                          //   autoFocus
                          type="default"
                          name="CompanyAddress"
                          value={cardInfo[index]["CompanyZip"]}
                          placeholder="Company Zip"
                          onChangeText={(Text) => {
                            handleCardChange(index, "CompanyZip", Text);
                          }}
                          onBlur={(e) => {
                            fnAutoPopulateStateCity(
                              cardInfo[index]["CompanyZip"],
                              index
                            );
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Agent Phone"
                          // autoFocus
                          type="default"
                          name=""
                          value={cardInfo[index]["Phone"]}
                          placeholder="Agent Phone"
                          onChangeText={(Text) => {
                            handleCardChange(index, "Phone", Text);
                          }}
                          onBlur={(e) => {
                            let number = FormatPhoneLogin(
                              cardInfo[index]["Phone"]
                            );
                            handleCardChange(index, "Phone", number);
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company City"
                          //   autoFocus
                          type="default"
                          name="CompanyAddress"
                          value={cardInfo[index]["CompanyCity"] || ""}
                          placeholder="Company City"
                          onChangeText={(Text) => {
                            handleCardChange(index, "CompanyCity", Text);
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Agent Email"
                          //autoFocus
                          type="default"
                          name=""
                          value={cardInfo[index]["AgentEmail"]}
                          placeholder="Agent Email"
                          onChangeText={(Text) => {
                            handleCardChange(index, "AgentEmail", Text);
                          }}
                        />
                      </View>
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company State"
                          //   autoFocus
                          type="default"
                          name="CompanyState"
                          value={cardInfo[index]["CompanyState"] || ""}
                          placeholder="Company State"
                          onChangeText={(Text) => {
                            handleCardChange(index, "CompanyState", Text);
                          }}
                        />
                      </View>
                      {cardInfo[index]["ContactType"] !== 7 && (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        ></View>
                      )}
                      {cardInfo[index]["ContactType"] !== 7 ? (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="License "
                            // autoFocus
                            type="default"
                            name=""
                            value={cardInfo[index]["CompanyLicense"]}
                            placeholder="License "
                            onChangeText={(Text) => {
                              handleCardChange(index, "CompanyLicense", Text);
                            }}
                          />
                        </View>
                      ) : cardInfo[index]["ContactType"] == 7 ? null : (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        ></View>
                      )}
                      <View
                        style={[styles["card-input"], styles["card-item"]]}
                      ></View>
                      {/* Phone */}
                      <View style={[styles["card-input"], styles["card-item"]]}>
                        <InputField
                          label="Company Phone"
                          //autoFocus
                          type="default"
                          name=""
                          value={cardInfo[index]["CompPhone"]}
                          placeholder="Company Phone"
                          onChangeText={(Text) => {
                            handleCardChange(index, "CompPhone", Text);
                          }}
                          onBlur={(e) => {
                            let number = FormatPhoneLogin(
                              cardInfo[index]["CompPhone"]
                            );
                            handleCardChange(index, "CompPhone", number);
                          }}
                        />
                      </View>
                      <View
                        style={[styles["card-input"], styles["card-item"]]}
                      ></View>
                      {[7, 2, 4].includes(row["ContactType"]) && (
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label={
                              row["ContactType"] === 7
                                ? "Policy Number"
                                : "File Number"
                            }
                            //autoFocus
                            type="default"
                            name={
                              row["ContactType"] === 7
                                ? "Policy Number"
                                : "File Number"
                            }
                            value={cardInfo[index]["FileNumber"]}
                            placeholder="File Number"
                            onChangeText={(Text) => {
                              handleCardChange(index, "FileNumber", Text);
                            }}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </>
              )}
              {![51, 50].includes(row["ContactType"]) && (
                <View style={styles["card-footer"]}>
                  <TouchableOpacity
                    style={[
                      [styles.buttonContainer],
                      { alignSelf: "center", padding: 5 },
                    ]}
                  >
                    <CustomText style={[styles["btn"]]}>
                      {`Print ${row.ContactTypename} Request`}
                    </CustomText>
                  </TouchableOpacity>
                  {[2, 48].includes(row["ContactType"]) && (
                    <View
                      style={[
                        styles["card-item"],
                        { flexDirection: "row", alignItems: "center" },
                      ]}
                    >
                      <CustomText
                        bold={true}
                        style={[styles["card-lablebold"], { color: "white" }]}
                      >
                        {`Same for ${
                          row["ContactType"] === 2
                            ? ` Escrow `
                            : ` Escrow Seller `
                        }:`}
                      </CustomText>
                      <Checkbox
                        style={styles["card-checkbox"]}
                        value={copyAgent[row["ContactTypename"]]}
                        color={
                          copyAgent[row["ContactTypename"]] ? "#5e9cd3" : ""
                        }
                        onValueChange={(e) => {
                          setCopyAgent({
                            ...copyAgent,
                            [row["ContactTypename"]]:
                              copyAgent[row["ContactTypename"]] === undefined
                                ? true
                                : !copyAgent[row["ContactTypename"]],
                          });
                        }}
                      ></Checkbox>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles["table-container"]}>
        <ScrollView>
          <Table borderStyle={{ borderWidth: 1, borderColor: "transparent" }}>
            <Row
              data={tabelProps.tableHead}
              //flexArr={[1, 2, 1, 1]}
              style={styles["table-head"]}
              // textStyle={[styles["table-text"], { color: "#fff" }]}
            />

            {tabelProps.tableData.map((rowData, index) => (
              <TableWrapper
                key={index - 1}
                style={[
                  styles["table-row"],
                  { backgroundColor: index % 2 == 0 ? "#d9ecff" : "#fff" },
                ]}
              >
                {/* {rowData.map((cellData, cellIndex) => ( */}
                <Cell
                  key={"cell1"}
                  data={rowData.ContactTypename}
                  // textStyle={styles["table-text"]}
                />

                <Col
                  data={[
                    <CustomText style={{ fontSize: 12 }}>
                      {rowData.Companyname}
                    </CustomText>,
                    <CustomText style={{ flexDirection: "row", fontSize: 12 }}>
                      <CustomText bold={true} style={{ fontSize: 12 }}>
                        {" Expiration :"}
                      </CustomText>
                      {"10/10/10"}
                    </CustomText>,
                  ]}
                  // textStyle={styles["table-text"]}
                />
                <Cell
                  key={"cell3"}
                  data={"Approved"}
                  // textStyle={styles["table-text"]}
                />
                <Cell
                  key={"cell5"}
                  data={
                    index === 3 ? (
                      <TouchableOpacity
                        style={[
                          [styles.buttonContainer],
                          { alignSelf: "center", padding: 5 },
                        ]}
                        onPress={(e) => {
                          console.log(`${index} ${rowData.ContactTypename}`);
                        }}
                      >
                        <CustomText style={[styles["btn"], { fontSize: 10 }]}>
                          {"Change"}
                        </CustomText>
                      </TouchableOpacity>
                    ) : (
                      rowData.FileNumber
                    )
                  }
                  //  textStyle={styles["table-text"]}
                />
                {/* ))} */}
              </TableWrapper>
            ))}
            {/* </Table>
            </View> */}
          </Table>
        </ScrollView>
      </View>

      <View style={{ alignItems: "center" }}>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{
            backgroundColor: "#fff",
            maxWidth: Platform.OS === "web" ? "600px" : null,
            flex: null,
            alignSelf: Platform.OS === "web" ? "center" : null,
          }}
        >
          <View style={styles["modal-header"]}>
            <CustomText style={styles["modal-header-title"]}>
              {"Seller List"}
            </CustomText>
            <AntDesign
              name="close"
              style={styles["modal-close"]}
              size={24}
              color={"black"}
              onPress={toggleModal}
            />
          </View>
          <View style={styles["modal-container"]}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "transparent" }}>
              <Row
                data={sellerTabelProps.tableHead}
                // flexArr={[1, 2, 1, 1]}
                style={[styles["table-head"], { color: "#999" }]}
                textStyle={[styles["table-text"], { color: "#fff" }]}
              />

              {sellerInfo.RowData?.map((rowData, index) => (
                <TableWrapper
                  key={index - 1}
                  style={[
                    styles["table-row"],
                    { backgroundColor: index % 2 == 0 ? "#d9ecff" : "#fff" },
                  ]}
                >
                  {/* {rowData.map((cellData, cellIndex) => ( */}
                  <Cell
                    key={"cell1"}
                    data={[
                      <CustomText style={{ fontSize: 12 }}>
                        {rowData.AgentFN}
                      </CustomText>,
                    ]}
                  />

                  <Cell
                    data={[
                      <CustomText style={{ fontSize: 12 }}>
                        {rowData.Phone}
                      </CustomText>,
                    ]}
                  />
                  <Cell
                    data={[
                      <CustomText style={{ fontSize: 12 }}>
                        {rowData.AgentEmail}
                      </CustomText>,
                    ]}
                  />
                </TableWrapper>
              ))}
            </Table>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const width = Dimensions.get("window").width / 2 - 40;
const styles = StyleSheet.create({
  "card-parent":
    Platform.OS === "web"
      ? {
          display: "grid",
          //"grid-template-columns": "repeat(auto-fit,minmax(480px,1fr))",
          "grid-template-columns": "repeat(2,1fr)",
          "grid-gap": "10px",
          // flexDirection: "row",
          // flexWrap: "wrap",
          maxWidth: "1000px",
        }
      : {},
  "card-child": {
    //  flex: 1,
  },
  "card-container": {
    ...{
      padding: 0,
      margin: 10,
      borderColor: "#5e9cd3",
      borderWidth: 1,
      height: Platform.OS === "web" ? "min-content" : null,
    },
    ...(Platform.OS === "web"
      ? {
          minWidth: "450px",
          maxWidth: "450px",
        }
      : {}),
  },
  "card-header": {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    backgroundColor: "#5e9cd3",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  "card-footer": {
    marginTop: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: Platform.OS === "web" ? 10 : 10,
    paddingLeft: 10,
    backgroundColor: "#428bca",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  "card-Title": {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },
  btn: {
    color: "#fff",
    alignSelf: "flex-end",
    flexDirection: "row",
    textAlign: "center",
    fontSize: 13,
  },
  "card-body":
    Platform.OS === "web"
      ? {
          display: "grid",
          "grid-template-columns": "repeat(2, 1fr)",
          gap: "10px",
          padding: 10,
          paddingTop: 15,
        }
      : {
          flexDirection: "row",
          flexWrap: "wrap",
          paddingTop: 10,
          gap: 10,
        },
  "card-item":
    Platform.OS !== "web"
      ? {
          flexBasis: width,
          marginLeft: 10,
          paddingBottom: 5,
        }
      : {},
  "card-input": {
    paddingTop: 15,
  },
  "card-hide":
    Platform.OS === "web"
      ? {
          visibility: "hidden",
        }
      : {
          display: "none",
        },
  "card-text-underline": {
    ...{
      color: "blue",
      textDecorationLine: Platform.OS === "android" ? "none" : "underline",
      borderBottomWidth: Platform.OS === "android" ? 1 : 0,
      borderBottomColor: "blue",
      flex: 1,
      alignSelf: Platform.OS !== "web" ? "flex-start" : null,
    },
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  "card-Loading":
    Platform.OS === "web"
      ? {
          display: "grid",
          justifyContent: "center",
          padding: 100,
          fontWeight: "bold",
        }
      : {
          display: "none",
        },
  buttonContainer: {
    backgroundColor: "#428bca",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    borderColor: "#b0cce5",
    borderWidth: 1,
  },
  "card-small": {
    "grid-template-columns": "repeat(1,1fr)",
  },
  "card-lablebold": {
    color: "#8089A0",
  },
  "card-checkbox": {
    marginLeft: 5,
  },
  "table-container": {
    padding: 0,
    paddingTop: 30,
    margin: 10,
    backgroundColor: "#fff",
    width: Platform.OS === "web" ? "450px" : null,
    display: "none",
  },
  "table-head": {
    //height: Platform.OS === "web" ? 40 : 50,
    backgroundColor: "#428bca",
    padding: 10,
  },
  "table-wrapper": { flexDirection: "row" },
  "table-title": { flex: 1, backgroundColor: "#428bca" },
  "table-row": {
    flexDirection: "row",
    backgroundColor: "#FFF1C1",
    padding: 10,
  },
  "table-text": {
    textAlign: "left",
    margin: Platform.OS === "web" ? 6 : 8,
    fontSize: 12,
  },
  "modal-container": {
    flex: Platform.OS === "web" ? 1 : 0,
    justifyContent: "center",
    flexDirection: Platform.OS === "web" ? "row" : null,
    // alignItems: Platform.OS === "web" ? "center" : null,
    marginTop: 10,
    margin: 50,
  },
  "modal-header": {
    backgroundColor: "#428bca",
    display: Platform.OS === "web" ? "inline-block" : null,
    padding: 10,
  },
  "modal-header-title": {
    padding: 10,
    color: "white",
    fontSize: 18,
  },
  "modal-close": {
    right: 0,
    position: "absolute",
    color: "white",
  },
});
