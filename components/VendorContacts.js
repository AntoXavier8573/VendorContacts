import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Linking,
  Pressable,
  FlatList,
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
import ArrowSpinner from "./controls/Spinner";
import Checkbox from "expo-checkbox";
import {
  handleAPI,
  FormatPhoneLogin,
  handleWebPageOpen,
  handleParamFromURL,
} from "./controls/CommonFunctions";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
export default function VendorContacts() {
  const windowWidth = useWindowDimensions().width; // Using for small screen
  const [editCard, setEditCard] = useState({}); // To check which card is enabling for editing
  const [editCompany, setEditCompany] = useState({}); // To check which card's chane company button is checked
  const [cardInfo, setCardInfo] = useState([]); // Final JSON for saving
  const [result, setResult] = useState([]); // API result
  const [sellerInfo, setSellerInfo] = useState({}); // This will have seller info(Add additional seller, see list)
  const [isModalVisible, setModalVisible] = useState({
    Seller: false,
    Confirmation: false,
  });
  const [queryString, setQueryString] = useState({
    LoanId: "456760",
    SessionId: "",
    IsEditRights: 0,
  });
  const [copyAgent, setCopyAgent] = useState([]);
  const [AutoCinput, setInput] = useState({});
  const [AutoCompdata, setData] = useState({});
  const [apiController, setApiController] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [otherProps, setOtherProps] = useState({});
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
    tableHead: ["First Name", "Last Name", "Phone", "Email", ""],
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
    EditRow: [],
    ModifiedJson: [],
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [validation, setValidation] = useState({});
  const [focusInput, setFocusInpt] = useState({});

  //useRef
  const btnAddNewRef = useRef(null);
  const flatListRef = useRef(null);
  const searchInputRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log("onchange triggerrd");

      //if (selectedItemIndex === 0) btnAddNewRef.current.focus();
      if (e.key === "ArrowUp" && selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1);

        setTimeout(() => {
          flatListRef.current.scrollToItem({
            animated: true,
            item: AutoCompdata[Object.keys(AutoCompdata)[0]][
              selectedItemIndex - 1
            ],
            viewPosition: 0.5,
          });
        }, 100);
      } else if (
        e.key === "ArrowDown" &&
        selectedItemIndex < otherProps.ComponySearchCount - 1
      ) {
        setSelectedItemIndex(selectedItemIndex + 1);
        setTimeout(() => {
          flatListRef.current.scrollToItem({
            animated: true,
            item: AutoCompdata[Object.keys(AutoCompdata)[0]][
              selectedItemIndex + 1
            ],
            viewPosition: 0,
          });
        }, 100);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const index = fnGetIndex(Object.keys(AutoCompdata)[0]);
        handleCompanySelection(
          AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex],
          index,
          "Confirmation"
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemIndex, otherProps]);
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
          setQueryString({
            ...queryString,
            IsEditRights: IsEditRights,
            EmpNum: UserId,
          });
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
  console.log("focusInput", focusInput);
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
        setSellerTabelProps({
          ...sellerTabelProps,
          ["ModifiedJson"]: sellerData,
        });

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
          const uniqueRows = getUniqueObjectsByKey(CardData, "ContactTypename");
          setResult(uniqueRows);
          setCardInfo(uniqueRows);
          setCopyAgent({
            ...copyAgent,
            2: uniqueRows[2].isEscrowSame == 0 ? false : true,
            48: uniqueRows[4].isEscrowSame == 0 ? false : true,
          });
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
          setValidation(EnableSearch);

          // setData((prevState) => {
          //   var updatedData = { ...prevState };
          //   EmptyVendors.forEach((e) => {
          //     updatedData[e.ContactType] = [
          //       {
          //         id: "0",
          //         ValType: "V",
          //         Type: [e.ContactType],
          //         UserType: "V",
          //         ActualType: [e.ContactType],
          //         label: "Add New",
          //         AgentCompName: "Add New",
          //       },
          //     ];
          //   });

          //   return updatedData;
          // });
        } else {
          let GridData = Data.filter((e) => e.isCard === 1);
          //setResult({ ...result, AllVendor: GridData });
        }
        console.log("Result from API ===> ", Data);
      })
      .catch((e) => console.log("Get API => ", e));
    // setCardInfo(rows); // Testing purpose
  };
  const fnFocusInput = (e, row) => {
    // console.log("on key press triggerrd");
    // if (e.key === "ArrowUp" && selectedItemIndex == 0) {
    //   setFocusInpt({ ...focusInput, ...{ [row["ContactType"]]: false } });
    //   // alert();
    // }
    // if (e.key === "ArrowUp" && selectedItemIndex > 0) {
    //   setSelectedItemIndex(selectedItemIndex - 1);
    //   setTimeout(() => {
    //     flatListRef.current.scrollToItem({
    //       animated: true,
    //       item: AutoCompdata[Object.keys(AutoCompdata)[0]][
    //         selectedItemIndex - 1
    //       ],
    //       viewPosition: 0.5,
    //     });
    //   }, 100);
    // } else if (
    //   e.key === "ArrowDown" &&
    //   selectedItemIndex < otherProps.ComponySearchCount - 1
    // ) {
    //   // if (selectedItemIndex === 0) btnAddNewRef.current.focus();
    //   setSelectedItemIndex(selectedItemIndex + 1);
    //   setTimeout(() => {
    //     flatListRef.current.scrollToItem({
    //       animated: true,
    //       item: AutoCompdata[Object.keys(AutoCompdata)[0]][
    //         selectedItemIndex + 1
    //       ],
    //       viewPosition: 0,
    //     });
    //   }, 0);
    // }
    if (e.key === "ArrowDown" && selectedItemIndex === 0) {
      // setTimeout(() => {
      //   btnAddNewRef.current.focus();
      // }, 0);
      flatListRef.current.scrollToItem({
        animated: true,
        item: AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex + 1],
        viewPosition: 0.5,
      });
    }
  };
  const handleCardChange = (index, name, value) => {
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ...PrevObj[index],
        [name]: value,
        IsModified: cardInfo[index].isNew === 1 ? 0 : 1,
        isNew: cardInfo[index].isNew !== 1 ? 0 : 1,
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
  const handleVedorSave = (index, TypeName) => {
    console.log("vendor card info ==>", cardInfo[index]);
    let finalJson = [];
    if (TypeName !== "Seller")
      finalJson = cardInfo.filter((e, i) => i == index);
    else
      finalJson = sellerTabelProps["ModifiedJson"].filter((e, i) => i == index);

    handleAPI({
      name: "Save_VendorLoanInfo",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        SaveJson: JSON.stringify(finalJson),
      },
      method: "POST",
    })
      .then((response) => {
        console.log(response);
        if (response === "Completed") {
          if (TypeName !== "Seller") {
            setEditCard({
              ...editCard,
              [finalJson[0]["ContactType"]]: false,
            });
            let AgentName = `${finalJson[0].FirstName}${finalJson[0].Nickname}${finalJson[0].LastName}`;
            setResult((PrevObj) => {
              const updateObj = [...PrevObj];
              updateObj[index] = {
                ...PrevObj[index],
                ["AgentEmail"]: finalJson[0].AgentEmail,
                ["AgentFN"]: finalJson[0].AgentFN,
                ["AgentFNN"]: AgentName,
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
          } else {
            setSellerInfo((prevState) => {
              const newRowData = [...prevState.RowData];
              const updatedItem = {
                ...newRowData[index],
                ["FirstName"]: finalJson[0].FirstName,
                ["LastName"]: finalJson[0].LastName,
                ["AgentEmail"]: finalJson[0].AgentEmail,
                ["Phone"]: finalJson[0].Phone,
              };
              newRowData[index] = updatedItem;
              return { ...prevState, RowData: newRowData };
            });
          }
        }
      })
      .catch((e) => console.log("Error While saving vendor details => ", e));
  };
  const toggleModal = (Type) => {
    setModalVisible({ isModalVisible, [Type]: !isModalVisible[Type] });
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
  const fnPrintVendor = (Type) => {
    let ReportNo = Type == 7 ? 270 : 610;
    handleAPI({
      name: "CreateNewSSRSReports",
      params: {
        LoanID: handleParamFromURL(document.location.href, "LoanId"),
        EmpNum: queryString.EmpNum,
        Report: ReportNo,
        ScandocID: 0,
        CustIDs: handleParamFromURL(document.location.href, "CustId"),
      },
      method: "POST",
    })
      .then((response) => {
        console.log("print file name", response);
        var retval = response;
        retval = retval.replace("%20", " ");
        retval = retval.replace("\\", "/");
        if (retval == "/PDF/No File Generated")
          console.log("No File Generated");
        else {
          let iWidth = 1200;
          let iHeight = 925;
          var sURL = "";
          sURL = "../../../pdf/" + retval;

          window.open(
            sURL,
            "",
            "height=" +
              iHeight +
              "px,width=" +
              iWidth +
              "px,resizable=1,scrollbars=yes"
          );
        }
      })
      .catch((e) => console.log("Error in fnPrintVendor method => ", e));
  };
  const GetTypeaheadAgentInfo = (value, type, signal) => {
    setOtherProps({ ...otherProps, [type]: true });
    handleAPI({
      name: "GetTypeaheadAgentInfo",
      signal: signal,
      params: {
        SearchVal: value,
        Type: type,
        UserType: "V",
        ValType: "V",
      },
      method: "POST",
    })
      .then((response) => {
        let result = [];
        if (response !== undefined && response != "undefined") {
          result = JSON.parse(response);
          console.log("search count", result.length);
          setOtherProps({
            ...otherProps,
            [type]: false,
            ComponySearchCount: result.length,
          });
          setSelectedItemIndex(0);
          setData({ [type]: result });
          setTimeout(() => {
            btnAddNewRef.current.focus();
          }, 0);
        } else {
          // setOtherProps({
          //   ...otherProps,
          //   IsShowSpinner: false,
          //   ComponySearchCount: result.length,
          // });
          setData({ ...AutoCompdata, IsshowButton: 1 });
        }
        console.log("auto complete result ==>", result);
      })

      .catch((e) => console.log("While auto complete  => ", e));
  };
  const GetItemText = (item, index) => {
    const views = [];
    const vstyle = {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      color: "gray",
    };
    //const v_style = { marginLeft: 10, flexShrink: 1 }
    let showButton =
      item.label === undefined ? 1 : item.label.indexOf("Add New");
    views.push(
      item.IsshowButton === undefined ? (
        showButton == -1 ? (
          <CustomText
            onPress={(e) => {
              handleCompanySelection(item, index, "Confirmation");
            }}
            key={item.id}
            style={[[vstyle]]}
          >
            {item.label}
          </CustomText>
        ) : (
          <TouchableOpacity
            autoFocus
            onPress={(e) => {
              handleAddNew(item);
            }}
            style={[
              [styles.buttonContainer],
              {
                width: Platform.OS === "web" ? "fit-content" : null,
                margin: 10,
              },
            ]}
          >
            <CustomText style={[styles["btn"]]}>{"Add New"}</CustomText>
          </TouchableOpacity>
        )
      ) : null
      // (
      //   <TouchableOpacity
      //     onPress={(e) => {
      //       setEditCard({
      //         ...editCard,
      //         [item.ActualType]: true,
      //       });
      //     }}
      //     style={[
      //       [styles.buttonContainer],
      //       { width: Platform.OS === "web" ? "fit-content" : null, margin: 10 },
      //     ]}
      //   >
      //     <CustomText style={[styles["btn"]]}>{"Add New"}</CustomText>
      //   </TouchableOpacity>
      // )
    );
    return <>{views}</>;
  };
  const handleCompanySearch = (event, type) => {
    setInput({ [type]: event });
    if (apiController) {
      apiController.abort(); // Abort previous API call
    }
    const newApiController = new AbortController();
    setApiController(newApiController);
    //if (apiController)
    GetTypeaheadAgentInfo(event, type, newApiController.signal);
  };
  const handleCompanySelection = (event, index, Type) => {
    if (event.ActualType == 2 || event.ActualType == 48) {
      setModalVisible({
        isModalVisible,
        [Type]: !isModalVisible[Type],
        AgentType: event.ActualType,
        Event: event,
        Index: index,
      });
    } else {
      handleIfSameTitle(event, index, 0);
    }
  };

  const handleIfSameTitle = (event, index, IsSame) => {
    if (event == "") {
      event = isModalVisible["Event"];
      index = isModalVisible.Index;
    }
    handleAPI({
      name: "AddNewVendorSigner",
      params: {
        UserId: event.id,
        UserType: event.ValType,
        strSessionId: handleParamFromURL(document.location.href, "SessionId"),
        SerCatId: event.ActualType,
        iLoanId: handleParamFromURL(document.location.href, "LoanId"),
        isTitleEscSame: IsSame,
      },
      method: "POST",
    })
      .then((response) => {
        console.log("Company selection", response);
        const finalJson = JSON.parse(response);
        setEditCompany({ ...editCompany, [finalJson[0].ContactType]: false });
        setModalVisible({ isModalVisible, Confirmation: false });
        setCopyAgent({
          ...copyAgent,
          [finalJson[0].ContactType]: IsSame === 1 ? true : false,
        });
        setData({});
        setInput({});
        let ContactType = event.ActualType == 2 ? 4 : 49;
        let Index = event.ActualType == 2 ? 3 : 5;
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ...PrevObj[index],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentFN"]: finalJson[0].AgentFN,
            ["AgentFNN"]: finalJson[0].AgentFNN,
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
            ["VendorId"]: finalJson[0].VendorId,
            ["isCard"]: finalJson[0].isCard,
            ["isEscrowSame"]: finalJson[0].isEscrowSame,
            ["FileNumber"]: finalJson[0].FileNumber,
          };
          if (IsSame === 1) {
            updateObj[Index] = {
              ...PrevObj[Index],
              ["AgentEmail"]: finalJson[0].AgentEmail,
              ["AgentFN"]: finalJson[0].AgentFN,
              ["AgentFNN"]: finalJson[0].AgentFNN,
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
              ["ContactType"]: ContactType,
              ["ContactTypename"]: finalJson[0].ContactTypename,
              ["Loanid"]: finalJson[0].Loanid,
              ["Phone"]: finalJson[0].Phone,
              ["VendorId"]: finalJson[0].VendorId,
              ["isCard"]: finalJson[0].isCard,
              ["isEscrowSame"]: finalJson[0].isEscrowSame,
              ["FileNumber"]: finalJson[0].FileNumber,
            };
          }
          return updateObj;
        });
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ...PrevObj[index],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentFN"]: finalJson[0].AgentFN,
            ["AgentFNN"]: finalJson[0].AgentFNN,
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
            ["VendorId"]: finalJson[0].VendorId,
            ["isCard"]: finalJson[0].isCard,
            ["isEscrowSame"]: finalJson[0].isEscrowSame,
            ["FileNumber"]: finalJson[0].FileNumber,
          };
          if (IsSame === 1) {
            updateObj[Index] = {
              ...PrevObj[Index],
              ["AgentEmail"]: finalJson[0].AgentEmail,
              ["AgentFN"]: finalJson[0].AgentFN,
              ["AgentFNN"]: finalJson[0].AgentFNN,
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
              ["ContactType"]: ContactType,
              ["ContactTypename"]: finalJson[0].ContactTypename,
              ["Loanid"]: finalJson[0].Loanid,
              ["Phone"]: finalJson[0].Phone,
              ["VendorId"]: finalJson[0].VendorId,
              ["isCard"]: finalJson[0].isCard,
              ["isEscrowSame"]: finalJson[0].isEscrowSame,
              ["FileNumber"]: finalJson[0].FileNumber,
            };
          }
          return updateObj;
        });
        setValidation({ ...validation, [finalJson[0].ContactType]: false });
      })
      .catch((e) => console.log("Error in Company selection method => ", e));
  };
  const handleGridChange = (index, name, value) => {
    setSellerTabelProps((prevState) => {
      const modifiedJson = [...prevState.ModifiedJson];
      modifiedJson[index] = {
        ...modifiedJson[index],
        [name]: value,
        IsModified: 1,
        isNew: 0,
      };
      return {
        ...prevState,
        ModifiedJson: modifiedJson,
      };
    });
  };
  const handleChangeCheckBox = (Type) => {
    setCopyAgent({
      ...copyAgent,
      [Type]: copyAgent[Type] === undefined ? true : !copyAgent[Type],
    });
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getAddress = (add) => {
    try {
      add = add.split(", ");
      return `${add[1]}, ${add[2]} ${add[3]}`;
    } catch (error) {
      return add;
    }
  };
  const handleRemoveSellerOrAgent = (Data) => {
    console.log("remove info", Data);
    //return;
    handleAPI({
      name: "RemovefrmLoan",
      params: {
        UserId: Data.AgentID,
        UserType: Data.ContactSourceType,
        strSessionId: handleParamFromURL(document.location.href, "SessionId"),
        ServCatId: Data.ContactType,
        iLoanId: handleParamFromURL(document.location.href, "LoanId"),
      },
      method: "POST",
    })
      .then((response) => {
        if (Data.ContactSourceType === "S") {
          let Result = sellerInfo.RowData.filter((e) => {
            return e.AgentID !== Data.AgentID;
          });
          if (Result.length === 0) {
            setModalVisible({ isModalVisible, Remove: false });
            Result = [
              {
                Loanid: handleParamFromURL(document.location.href, "LoanId"),
                ContactType: 0,
                ContactTypename: "Seller",
                VendorId: 0,
                AgentID: 0,
                isCard: 1,
                ContactSourceType: "S",
                isEditRestricted: 0,
                DisplaySeller: 1,
              },
            ];
          }
          setSellerInfo({ ...sellerInfo, RowData: Result });
        } else {
          setModalVisible({ isModalVisible, Remove: false });
          const index = fnGetIndex(Data.ContactType);
          setResult((PrevObj) => {
            const updateObj = [...PrevObj];
            updateObj[index] = {
              ["ContactType"]: Data.ContactType,
              ["ContactTypename"]: Data.ContactTypename,
              ["Loanid"]: Data.Loanid,
              ["VendorId"]: Data.VendorId,
              ["isCard"]: 1,
            };
            return updateObj;
          });

          setCardInfo((PrevObj) => {
            const updateObj = [...PrevObj];
            updateObj[index] = {
              ["ContactType"]: Data.ContactType,
              ["ContactTypename"]: Data.ContactTypename,
              ["Loanid"]: Data.Loanid,
              ["VendorId"]: Data.VendorId,
              ["isCard"]: 1,
            };
            return updateObj;
          });
          setEditCompany({
            ...editCompany,
            [Data.ContactType]:
              editCompany[Data.ContactType] === undefined
                ? true
                : !editCompany[Data.ContactType],
          });
          setValidation({ ...validation, [Data.ContactType]: true });
        }
      })
      .catch((e) =>
        console.log("Error in handleRemoveSellerOrAgent method => ", e)
      );
  };
  const fnGetIndex = (value) => {
    const valueToIndex = {
      7: 0,
      0: 1,
      2: 2,
      4: 3,
      48: 4,
      49: 5,
      50: 6,
      51: 7,
    };

    return valueToIndex[value] !== undefined ? valueToIndex[value] : -1;
  };
  const handleCompanyChange = (Type) => {
    setEditCompany({
      ...editCompany,
      [Type]: editCompany[Type] === undefined ? true : !editCompany[Type],
    });

    setData({
      [Type]: [
        {
          id: "0",
          ValType: "V",
          Type: Type,
          UserType: "V",
          ActualType: Type,
          label: "Add New",
          AgentCompName: "Add New  ",
        },
      ],
    });
  };
  const handleAddNew = (item) => {
    setEditCard({
      ...editCard,
      [item.ActualType]: true,
    });

    const index = fnGetIndex(item.ActualType);
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ["ContactType"]: item.ActualType,
        ["ContactTypename"]: result[index].ContactTypename,
        ["isCard"]: 1,
        ["Companyname"]: AutoCinput[item.ActualType] || "",
        isNew: 1,
      };
      return updateObj;
    });
  };
  const handleCloseEditCompany = (row) => {
    setEditCompany({
      ...editCompany,
      [row["ContactType"]]:
        editCompany[row["ContactType"]] === undefined ? true : false,
    });
    setData({
      [row["ContactType"]]: [],
    });
    setInput({ ...AutoCinput, [row["ContactType"]]: "" });
    const index = fnGetIndex(row["ContactType"]);
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = result[index];
      return updateObj;
    });
  };
  const handleEditCard = (row) => {
    setEditCard({
      ...editCard,
      [row["ContactType"]]:
        editCard[row["ContactType"]] === undefined
          ? true
          : !editCard[row["ContactType"]],
    });
    const index = fnGetIndex(row["ContactType"]);

    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ...updateObj[index],
        isNew: 0,
      };
      return updateObj;
    });
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
              (index === 1 && row["DisplaySeller"] == 0) ||
              (index === 5 && row["IsEmpty"])
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
                    {!validation[row["ContactType"]] && (
                      <>
                        {!editCard[row["ContactType"]] &&
                          !editCompany[row["ContactType"]] && (
                            <View style={styles["btn"]}>
                              <TouchableOpacity
                                onPress={(e) => {
                                  handleEditCard(row);
                                }}
                                style={[styles.buttonContainer]}
                              >
                                <CustomText style={styles["btn"]}>
                                  {"Edit"}
                                </CustomText>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={(e) => {
                                  setModalVisible({
                                    Remove: true,
                                    Data: row,
                                  });
                                }}
                                style={[
                                  [styles.buttonContainer],
                                  // { backgroundColor: "#ffb752" },
                                  { backgroundColor: "#ec971f" },
                                ]}
                              >
                                <CustomText
                                  style={[styles["btn"], { color: "white" }]}
                                >
                                  {"Remove"}
                                </CustomText>
                              </TouchableOpacity>
                            </View>
                          )}
                      </>
                    )}
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
                    {sellerInfo["RowData"].length === 1 &&
                    sellerInfo["RowData"][0].AgentID == 0 ? null : (
                      <View style={styles["btn"]}>
                        <TouchableOpacity
                          onPress={(e) => {
                            toggleModal("Seller");
                          }}
                          style={[styles.buttonContainer]}
                        >
                          <CustomText style={styles["btn"]}>
                            {"Edit"}
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
                      {
                        minHeight: Platform.OS === "web" ? 250 : null,
                      },
                    ]}
                  >
                    {sellerInfo["RowData"].length > 3 && (
                      <View style={{ alignSelf: "end", marginTop: 5 }}>
                        <TouchableOpacity
                          style={[styles.buttonContainer]}
                          // onPress={(e) => {
                          //   setSellerInfo({
                          //     ...sellerInfo,
                          //     AddSeller: true,
                          //   });
                          // }}

                          onPress={(e) => {
                            toggleModal("Seller");
                          }}
                        >
                          <CustomText style={styles["btn"]}>
                            {"View Additional Sellers"}
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                    )}
                    <View
                      style={[
                        styles["card-body"],
                        { gridTemplateColumns: "repeat(3, 1fr)" },
                      ]}
                    >
                      {sellerInfo["RowData"].map((e, index) => (
                        <>
                          {index < 3 && (
                            <View style={{ gap: 10 }}>
                              {e.AgentID == 0 ? (
                                <View
                                  style={[
                                    styles["card-input"],
                                    // styles["card-item"],
                                    Platform.OS !== "web" && {
                                      flexDirection: "row",
                                    },
                                    { width: 430 },
                                  ]}
                                >
                                  <InputField
                                    value={AutoCinput["0"] || ""}
                                    label="Add Company or Seller Name, Email or Cell Phone"
                                    type="default"
                                    name="EmailorCellPhone"
                                    onChangeText={(text) => {
                                      //handleCompanySearch(text, row["ContactType"]);
                                      // setInput({
                                      //   ...AutoCinput,
                                      //   [row["ContactType"]]: text,
                                      // });
                                    }}
                                    placeholder="Search for Company or Seller Name, Email or Cell Phone"
                                  />

                                  <FlatList
                                    style={styles["search-drop-down"]}
                                    //data={AutoCompdata[row["ContactType"]]}
                                    showsVerticalScrollIndicator={true}
                                    removeClippedSubviews={true}
                                    renderItem={({ item, index: i }) => (
                                      <Pressable
                                        style={({ pressed }) => [
                                          {
                                            // opacity: pressed ? 0.5 : 1,
                                            borderWidth: 1,
                                            borderColor: "silver",
                                            borderTopWidth: 0,
                                            backgroundColor:
                                              i % 2 == 0 ? "#d9ecff" : "#fff",
                                          },
                                        ]}
                                        // onPress={() =>
                                        //   alert(
                                        //     "navigate to page passing in " +
                                        //       JSON.stringify(item)
                                        //   )
                                        // }
                                      >
                                        <View>{GetItemText(item, index)}</View>
                                      </Pressable>
                                    )}
                                    keyExtractor={(item, index) =>
                                      item.place_id + index
                                    }
                                  />
                                </View>
                              ) : (
                                <>
                                  <View>
                                    <View
                                      style={{ maxWidth: 250, marginRight: 5 }}
                                    >
                                      <CustomText
                                        onPress={(e) => {
                                          toggleModal("Seller");
                                        }}
                                        style={styles["card-text-underline"]}
                                        bold={true}
                                      >
                                        {e.AgentFN}
                                      </CustomText>
                                    </View>
                                  </View>
                                  <View>
                                    <CustomText
                                      onPress={() => {
                                        let subject = "",
                                          body = "";
                                        const emailUrl = `mailto:${
                                          e.AgentEmail
                                        }?subject=${encodeURIComponent(
                                          subject
                                        )}&body=${encodeURIComponent(body)}`;
                                        Linking.openURL(emailUrl);
                                      }}
                                      style={styles["card-text-underline"]}
                                    >
                                      {e.AgentEmail}
                                    </CustomText>
                                  </View>
                                  <View>
                                    <CustomText
                                      onPress={() => {
                                        let phoneNumber = e.Phone?.replaceAll(
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
                                      {e.Phone}
                                    </CustomText>
                                  </View>
                                </>
                              )}
                            </View>
                          )}
                        </>
                      ))}
                    </View>
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
                        <>
                          {/* COMPANY */}

                          <View
                            style={{
                              flexDirection: "column",
                              // backgroundColor: "red",
                              gap: 10,
                            }}
                          >
                            <View
                              style={[
                                styles["card-item"],
                                {
                                  flexDirection: !editCompany[
                                    row["ContactType"]
                                  ]
                                    ? "row"
                                    : "column",
                                },
                              ]}
                            >
                              {!editCompany[row["ContactType"]] ? (
                                <View style={{ alignItems: "flex-start" }}>
                                  <View style={{ maxWidth: 160 }}>
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
                                            ),
                                          "http://www.solutioncenter.biz/VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_bootstrap.aspx?SessionId="
                                        )
                                      }
                                    >
                                      {row.Companyname}
                                    </CustomText>
                                  </View>
                                  <View>
                                    <TouchableOpacity
                                      onPress={(e) => {
                                        handleCompanyChange(row["ContactType"]);
                                      }}
                                      style={[
                                        [styles.buttonContainer],
                                        {
                                          alignSelf: "center",
                                          padding: 5,
                                          marginTop: 5,
                                        },
                                      ]}
                                    >
                                      <CustomText
                                        style={[
                                          styles["btn"],
                                          { fontSize: 10 },
                                        ]}
                                      >
                                        {"Change"}
                                      </CustomText>
                                    </TouchableOpacity>
                                  </View>
                                </View>
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
                                      autoFocus={focusInput[row["ContactType"]]}
                                      //ref={searchInputRef}
                                      value={
                                        AutoCinput[row["ContactType"]] || ""
                                      }
                                      label="Search for Company or Agent Name, Email or Cell Phone"
                                      type="default"
                                      name="EmailorCellPhone"
                                      onChangeText={(text) => {
                                        handleCompanySearch(
                                          text,
                                          row["ContactType"]
                                        );
                                      }}
                                      onKeyPress={(e) => {
                                        fnFocusInput(e, row);
                                      }}
                                      placeholder="Search for Company or Agent Name, Email or Cell Phone"
                                    />
                                    <CustomText
                                      style={{
                                        position: "absolute",
                                        right: 0,
                                        top: 35,
                                      }}
                                    >
                                      {otherProps[row["ContactType"]] && (
                                        <View style={{ right: 30 }}>
                                          <ArrowSpinner />
                                        </View>
                                      )}
                                      {!validation[row["ContactType"]] && (
                                        <FontAwesome
                                          name="close"
                                          style={[
                                            styles["modal-close"],
                                            {
                                              color: "red",
                                              cursor: "pointer",
                                              opacity: 0.8,
                                              top: -2,
                                            },
                                          ]}
                                          strokeWidth={30}
                                          size={17}
                                          color={"black"}
                                          onPress={(e) => {
                                            handleCloseEditCompany(row);
                                          }}
                                        />
                                      )}
                                    </CustomText>
                                    {AutoCompdata[row["ContactType"]] && (
                                      <FlatList
                                        style={styles["search-drop-down"]}
                                        data={AutoCompdata[row["ContactType"]]}
                                        showsVerticalScrollIndicator={true}
                                        removeClippedSubviews={true}
                                        ref={flatListRef}
                                        renderItem={({ item, index: i }) => (
                                          <Pressable
                                            ref={btnAddNewRef}
                                            style={({ pressed }) => [
                                              {
                                                opacity: pressed ? 0.5 : 1,
                                                borderWidth: 1,
                                                borderColor: "silver",
                                                borderTopWidth: 0,
                                                backgroundColor:
                                                  i === selectedItemIndex
                                                    ? "yellow"
                                                    : i % 2 == 0
                                                    ? "#d9ecff"
                                                    : "#fff",
                                              },
                                              isHovered &&
                                                styles["HoverBgColor"],
                                            ]}
                                            onPress={(e) => {
                                              handleCompanySelection(
                                                AutoCompdata[
                                                  row["ContactType"]
                                                ][selectedItemIndex],
                                                index,
                                                "Confirmation"
                                              );
                                            }}
                                          >
                                            <View>
                                              {GetItemText(item, index)}
                                            </View>
                                          </Pressable>
                                        )}
                                        keyExtractor={(item) => item.id}
                                      />
                                    )}
                                  </View>
                                  {AutoCompdata[row["ContactType"]] ===
                                    undefined ||
                                    (AutoCompdata[row["ContactType"]].length ==
                                      0 && (
                                      <View style={{ marginTop: 10 }}>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setEditCompany({
                                              ...editCompany,
                                              [row["ContactType"]]:
                                                editCompany[
                                                  row["ContactType"]
                                                ] === undefined
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
                                    ))}
                                </>
                              )}
                            </View>
                            {!editCompany[row["ContactType"]] && (
                              <>
                                <View style={styles["card-item"]}>
                                  <CustomText>
                                    {row.CompanyAddress?.split(",")[0]}
                                  </CustomText>
                                  <CustomText>
                                    {/* {row.CompanyAddress?.split(", ")
                                      .slice(1)
                                      .join(", ")
                                      .trim()
                                      .replace(/ ,/g, ",")}
                                       */}
                                    {getAddress(row.CompanyAddress)}
                                  </CustomText>
                                </View>

                                <View style={styles["card-item"]}>
                                  <CustomText
                                    onPress={() => {
                                      let phoneNumber =
                                        row.CompPhone?.replaceAll("-", "")
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
                                    {row.CompPhone}
                                  </CustomText>
                                </View>
                                {row["ContactType"] !== 7 && (
                                  <View
                                    style={[
                                      styles["card-item"],
                                      {
                                        flexDirection: "row",
                                      },
                                    ]}
                                  >
                                    <CustomText
                                      bold={true}
                                      style={[
                                        styles["card-lablebold"],
                                        { marginRight: 5 },
                                        {
                                          width:
                                            Platform.OS === "web"
                                              ? "fit-content"
                                              : null,
                                          backgroundColor:
                                            row.CompanyLicense || "yellow",
                                        },
                                      ]}
                                    >
                                      {"License "}
                                    </CustomText>
                                    <CustomText>
                                      {row.CompanyLicense}
                                    </CustomText>
                                  </View>
                                )}
                                {[7, 2, 4].includes(row["ContactType"]) && (
                                  <>
                                    {queryString["IsEditRights"] == 1 ||
                                    !editCard[row["ContactType"]] ? (
                                      <View style={styles["card-item"]}>
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            {
                                              width:
                                                Platform.OS === "web"
                                                  ? "fit-content"
                                                  : null,
                                              backgroundColor:
                                                row.FileNumber || "yellow",
                                            },
                                          ]}
                                        >
                                          {row["ContactType"] === 7
                                            ? "Policy Number "
                                            : "File Number "}
                                        </CustomText>
                                        <CustomText>
                                          {row.FileNumber}
                                        </CustomText>
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
                            )}
                          </View>

                          {/* AGENT */}
                          <View
                            style={{
                              flexDirection: "column",
                              // backgroundColor: "green",
                              gap: 10,
                            }}
                          >
                            {!editCompany[row["ContactType"]] && (
                              <>
                                <View style={[styles["card-item"]]}>
                                  <CustomText bold={true}>
                                    {row.AgentFNN}
                                  </CustomText>
                                </View>

                                {row.Phone !== "" && (
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
                                )}
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
                                {row["ContactType"] !== 7 && (
                                  <>
                                    <View
                                      style={[
                                        styles["card-item"],
                                        { flexDirection: "row" },
                                      ]}
                                    >
                                      <CustomText
                                        bold={true}
                                        style={[
                                          styles["card-lablebold"],
                                          { marginRight: 5 },
                                          {
                                            width:
                                              Platform.OS === "web"
                                                ? "fit-content"
                                                : null,
                                            backgroundColor:
                                              row.AgentLicense || "yellow",
                                          },
                                        ]}
                                      >
                                        {"Agent License "}
                                      </CustomText>
                                      <CustomText>
                                        {row.AgentLicense}
                                      </CustomText>
                                    </View>
                                  </>
                                )}
                              </>
                            )}
                          </View>
                        </>
                      </View>
                    </>
                  ) : (
                    //Editing view Starts here
                    <>
                      <View
                        style={[
                          styles["card-body"],
                          {
                            gridTemplateColumns: "repeat(1, 1fr)",
                            paddingTop: 0,
                          },
                        ]}
                      >
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            backgroundColor={
                              cardInfo[index].isNew === 1 ? "yellow" : ""
                            }
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
                      </View>
                      <View style={[styles["card-body"], { paddingTop: 0 }]}>
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="Agent First Name"
                            //autoFocus
                            type="default"
                            name="AgentName"
                            value={cardInfo[index]["FirstName"]}
                            placeholder="Agent First Name"
                            onChangeText={(Text) => {
                              handleCardChange(index, "FirstName", Text);
                            }}
                          />
                        </View>
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="Agent Last Name"
                            //autoFocus
                            type="default"
                            name="AgentName"
                            value={cardInfo[index]["LastName"]}
                            placeholder="Agent Last Name"
                            onChangeText={(Text) => {
                              handleCardChange(index, "LastName", Text);
                            }}
                          />
                        </View>
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
                          <InputField
                            label="Agent Cell Phone"
                            // autoFocus
                            type="default"
                            name=""
                            value={cardInfo[index]["Phone"]}
                            placeholder="Agent Cell Phone"
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
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
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
                        {row["ContactType"] !== 7 ? (
                          <View
                            style={[styles["card-input"], styles["card-item"]]}
                          >
                            <InputField
                              label="Agent License Number"
                              // autoFocus
                              type="default"
                              name=""
                              value={cardInfo[index]["AgentLicense"]}
                              placeholder="Agent License Number"
                              onChangeText={(Text) => {
                                handleCardChange(index, "AgentLicense", Text);
                              }}
                              // style ={styles.InputField}
                            />
                          </View>
                        ) : null}
                      </View>
                      <View
                        style={{
                          padding: 10,
                          paddingTop: 0,
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={[
                            styles["card-input"],
                            styles["card-item"],
                            { width: "67%" },
                          ]}
                        >
                          <InputField
                            label="Company Street Address"
                            //   autoFocus
                            type="default"
                            name="CompanyStreetAddr"
                            value={cardInfo[index]["CompanyStreetAddr"]}
                            placeholder="Company Street Address"
                            onChangeText={(Text) => {
                              handleCardChange(
                                index,
                                "CompanyStreetAddr",
                                Text
                              );
                            }}
                          />
                        </View>

                        <View
                          style={[
                            styles["card-input"],
                            styles["card-item"],
                            { width: "31%", marginLeft: 9 },
                          ]}
                        >
                          <InputField
                            label="Company Zip Code"
                            //   autoFocus
                            type="default"
                            name="CompanyAddress"
                            value={cardInfo[index]["CompanyZip"]}
                            placeholder="Company Zip Code"
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
                      </View>
                      <View style={[styles["card-body"], { paddingTop: 0 }]}>
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
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

                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
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
                      </View>
                      {/* Phone */}
                      <View
                        style={[
                          styles["card-body"],
                          {
                            paddingTop: 0,
                          },
                        ]}
                      >
                        <View
                          style={[styles["card-input"], styles["card-item"]]}
                        >
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

                        {cardInfo[index]["ContactType"] !== 7 ? (
                          <>
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            >
                              <InputField
                                label="Company License Number"
                                // autoFocus
                                type="default"
                                name=""
                                value={cardInfo[index]["CompanyLicense"]}
                                placeholder="Company License Number"
                                onChangeText={(Text) => {
                                  handleCardChange(
                                    index,
                                    "CompanyLicense",
                                    Text
                                  );
                                }}
                              />
                            </View>
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            ></View>
                          </>
                        ) : null}
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
                    </>
                  )}
                </>
              )}
              {[2, 7, 48].includes(row["ContactType"]) ? (
                <View style={styles["card-footer"]}>
                  <TouchableOpacity
                    onPress={(e) => {
                      fnPrintVendor(row["ContactType"]);
                    }}
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
                        value={copyAgent[row["ContactType"]]}
                        color={copyAgent[row["ContactType"]] ? "#5e9cd3" : ""}
                        onValueChange={(e) => {
                          handleChangeCheckBox(row["ContactType"]);
                        }}
                      ></Checkbox>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles["card-footer"]}>
                  <View style={{ padding: 13 }}></View>
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
              flexArr={[2, 2, 1, 1]}
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
        {/* Seller Modal */}
        <Modal
          isVisible={isModalVisible.Seller}
          onBackdropPress={() =>
            setModalVisible({ isModalVisible, Seller: false })
          }
          style={{
            backgroundColor: "#fff",
            maxWidth: Platform.OS === "web" ? "1000px" : null,
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
              strokeWidth={30}
              size={24}
              color={"black"}
              onPress={(e) => {
                toggleModal("Seller");
              }}
            />
          </View>
          <View style={styles["modal-container"]}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "transparent" }}>
              <Row
                data={sellerTabelProps.tableHead}
                //flexArr={[1, 1, 1, 1]}
                widthArr={[200, 200, 200, 200, 73, 73]}
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
                  <Cell
                    width={200}
                    key={"cell1"}
                    data={[
                      sellerTabelProps["EditRow"][index] !== true ? (
                        <CustomText style={{ fontSize: 12 }}>
                          {rowData.FirstName}
                        </CustomText>
                      ) : (
                        <View>
                          <InputField
                            autoFocus
                            type="default"
                            value={
                              sellerTabelProps["ModifiedJson"][index].FirstName
                            }
                            placeholder=""
                            style={[styles["grid-input"], { outline: "none" }]}
                            onChangeText={(Text) => {
                              handleGridChange(index, "FirstName", Text);
                            }}
                          />
                        </View>
                      ),
                    ]}
                  />
                  <Cell
                    width={200}
                    key={"cell1"}
                    data={[
                      sellerTabelProps["EditRow"][index] !== true ? (
                        <CustomText style={{ fontSize: 12 }}>
                          {rowData.LastName}
                        </CustomText>
                      ) : (
                        <View>
                          <InputField
                            //autoFocus
                            type="default"
                            value={
                              sellerTabelProps["ModifiedJson"][index].LastName
                            }
                            placeholder=""
                            style={[styles["grid-input"], { outline: "none" }]}
                            onChangeText={(Text) => {
                              handleGridChange(index, "LastName", Text);
                            }}
                          />
                        </View>
                      ),
                    ]}
                  />

                  <Cell
                    width={200}
                    data={[
                      sellerTabelProps["EditRow"][index] !== true ? (
                        <CustomText style={{ fontSize: 12 }}>
                          {rowData.Phone}
                        </CustomText>
                      ) : (
                        <View>
                          <InputField
                            //autoFocus
                            type="default"
                            value={
                              sellerTabelProps["ModifiedJson"][index].Phone
                            }
                            placeholder=""
                            onChangeText={(Text) => {
                              handleGridChange(index, "Phone", Text);
                            }}
                            style={[styles["grid-input"], { outline: "none" }]}
                          />
                        </View>
                      ),
                    ]}
                  />
                  <Cell
                    width={200}
                    data={[
                      sellerTabelProps["EditRow"][index] !== true ? (
                        <CustomText style={{ fontSize: 12 }}>
                          {rowData.AgentEmail}
                        </CustomText>
                      ) : (
                        <View>
                          <InputField
                            //autoFocus
                            type="default"
                            value={
                              sellerTabelProps["ModifiedJson"][index].AgentEmail
                            }
                            placeholder=""
                            onChangeText={(Text) => {
                              handleGridChange(index, "AgentEmail", Text);
                            }}
                            style={[styles["grid-input"], { outline: "none" }]}
                          />
                        </View>
                      ),
                    ]}
                  />
                  {sellerTabelProps["EditRow"][index] !== true ? (
                    <>
                      <Cell
                        style={{ alignSelf: "center" }}
                        data={[
                          <TouchableOpacity
                            style={[
                              [styles.buttonContainer],
                              { alignSelf: "center", padding: 5 },
                            ]}
                            onPress={(e) => {
                              setSellerTabelProps({
                                ...sellerTabelProps,
                                EditRow: {
                                  ...sellerTabelProps["EditRow"],
                                  [index]: true,
                                },
                              });
                            }}
                          >
                            <CustomText
                              style={[
                                styles["btn"],
                                { fontSize: 10, minWidth: 45, maxWidth: 45 },
                              ]}
                            >
                              {"Edit"}
                            </CustomText>
                          </TouchableOpacity>,
                        ]}
                      />
                      <Cell
                        style={{ alignSelf: "center" }}
                        data={[
                          <TouchableOpacity
                            style={[
                              [styles.buttonContainer],
                              { alignSelf: "center", padding: 5 },
                            ]}
                            onPress={(e) => {
                              handleRemoveSellerOrAgent(rowData);
                            }}
                          >
                            <CustomText
                              style={[styles["btn"], { fontSize: 10 }]}
                            >
                              {"Remove"}
                            </CustomText>
                          </TouchableOpacity>,
                        ]}
                      />
                    </>
                  ) : (
                    <>
                      <Cell
                        style={{ alignSelf: "center" }}
                        data={[
                          <TouchableOpacity
                            style={[
                              [styles.buttonContainer],
                              { alignSelf: "center", padding: 5 },
                            ]}
                            onPress={(e) => {
                              setSellerTabelProps({
                                ...sellerTabelProps,
                                EditRow: {
                                  ...sellerTabelProps["EditRow"],
                                  [index]: false,
                                },
                              });
                              handleVedorSave(index, "Seller");
                            }}
                          >
                            <CustomText
                              style={[
                                styles["btn"],
                                { fontSize: 10, minWidth: 45, maxWidth: 45 },
                              ]}
                            >
                              {"Save"}
                            </CustomText>
                          </TouchableOpacity>,
                        ]}
                      />
                      <Cell
                        style={{ alignSelf: "center" }}
                        data={[
                          <TouchableOpacity
                            style={[
                              [styles.buttonContainer],
                              { alignSelf: "center", padding: 5 },
                            ]}
                            onPress={(e) => {
                              setSellerTabelProps({
                                ...sellerTabelProps,
                                EditRow: {
                                  ...sellerTabelProps["EditRow"],
                                  [index]: false,
                                },
                              });
                            }}
                          >
                            <CustomText
                              style={[
                                styles["btn"],
                                { fontSize: 10, minWidth: 45, maxWidth: 45 },
                              ]}
                            >
                              {"Cancel"}
                            </CustomText>
                          </TouchableOpacity>,
                        ]}
                      />
                    </>
                  )}
                </TableWrapper>
              ))}
              <View
                style={[
                  styles["card-input"],
                  // styles["card-item"],
                  Platform.OS !== "web" && {
                    flexDirection: "row",
                  },
                  { width: 500 },
                ]}
              >
                <InputField
                  value={AutoCinput["0"] || ""}
                  label="Add Company or Seller Name, Email or Cell Phone"
                  type="default"
                  name="EmailorCellPhone"
                  onChangeText={(text) => {
                    //handleCompanySearch(text, row["ContactType"]);
                    // setInput({
                    //   ...AutoCinput,
                    //   [row["ContactType"]]: text,
                    // });
                  }}
                  placeholder="Search for Company or Seller Name, Email or Cell Phone"
                />

                <FlatList
                  style={styles["search-drop-down"]}
                  //data={AutoCompdata[row["ContactType"]]}
                  showsVerticalScrollIndicator={true}
                  removeClippedSubviews={true}
                  renderItem={({ item, index: i }) => (
                    <Pressable
                      style={({ pressed }) => [
                        {
                          // opacity: pressed ? 0.5 : 1,
                          borderWidth: 1,
                          borderColor: "silver",
                          borderTopWidth: 0,
                          backgroundColor: i % 2 == 0 ? "#d9ecff" : "#fff",
                        },
                      ]}
                      // onPress={() =>
                      //   alert(
                      //     "navigate to page passing in " +
                      //       JSON.stringify(item)
                      //   )
                      // }
                    >
                      <View>{GetItemText(item, index)}</View>
                    </Pressable>
                  )}
                  keyExtractor={(item, index) => item.place_id + index}
                />
              </View>
            </Table>
          </View>
        </Modal>
        {/* IsSame Confirmation Modal */}
        <Modal
          isVisible={isModalVisible.Confirmation}
          onBackdropPress={() =>
            setModalVisible({ isModalVisible, Confirmation: false })
          }
          style={{
            backgroundColor: "#fff",
            maxWidth: Platform.OS === "web" ? "1000px" : null,
            flex: null,
            alignSelf: Platform.OS === "web" ? "center" : null,
          }}
        >
          <View>
            <View style={styles["modal-header"]}>
              <CustomText style={styles["modal-header-title"]}>
                {"Confirmation"}
              </CustomText>
              <AntDesign
                name="close"
                style={styles["modal-close"]}
                strokeWidth={30}
                size={24}
                color={"black"}
                onPress={(e) => {
                  toggleModal("Confirmation");
                }}
              />
            </View>
            <View
              style={[
                styles["modal-container"],
                { minWidth: 350, marginLeft: 20 },
              ]}
            >
              <CustomText>
                Would you like to use the same{" "}
                {isModalVisible.AgentType == 2 && `Title and Escrow Agent`}{" "}
                {isModalVisible.AgentType == 48 &&
                  `Title Seller and Escrow Seller Agent`}
                ?
              </CustomText>
            </View>
            <View style={styles["modal-footer"]}>
              <TouchableOpacity
                style={[
                  [styles.buttonContainer],
                  { alignSelf: "center", padding: 5 },
                ]}
                onPress={() => {
                  handleIfSameTitle("", "", 0);
                }}
              >
                <CustomText style={[styles["btn"]]}>{" No "}</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  [styles.buttonContainer],
                  { alignSelf: "center", padding: 5 },
                ]}
                onPress={() => {
                  handleIfSameTitle("", "", 1);
                }}
              >
                <CustomText style={[styles["btn"]]}>{"Yes"}</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Remove Confirmation Modal */}
        <Modal
          isVisible={isModalVisible.Remove}
          onBackdropPress={() =>
            setModalVisible({ isModalVisible, Remove: false })
          }
          style={{
            backgroundColor: "#fff",
            maxWidth: Platform.OS === "web" ? "1000px" : null,
            flex: null,
            alignSelf: Platform.OS === "web" ? "center" : null,
          }}
        >
          <View>
            <View style={styles["modal-header"]}>
              <CustomText style={styles["modal-header-title"]}>
                {"Confirmation"}
              </CustomText>
              <AntDesign
                name="close"
                style={styles["modal-close"]}
                strokeWidth={30}
                size={24}
                color={"black"}
                onPress={(e) => {
                  toggleModal("Remove");
                }}
              />
            </View>
            <View
              style={[
                styles["modal-container"],
                { minWidth: 350, marginLeft: 20 },
              ]}
            >
              <CustomText>
                {isModalVisible.Data && (
                  <>
                    Are you sure want to Remove{" "}
                    <CustomText bold={true}>
                      {isModalVisible.Data.ContactTypename}:{" "}
                      {isModalVisible.Data.Companyname}
                    </CustomText>{" "}
                    from the Loan{" "}
                    <CustomText bold={true}>
                      {"("}
                      {isModalVisible.Data.Loanid}
                      {")"}
                    </CustomText>
                  </>
                )}
              </CustomText>
            </View>
            <View style={styles["modal-footer"]}>
              <TouchableOpacity
                style={[
                  [styles.buttonContainer],
                  { alignSelf: "center", padding: 5 },
                ]}
                onPress={() => {
                  setModalVisible({ isModalVisible, Remove: false });
                }}
              >
                <CustomText style={[styles["btn"]]}>{" No "}</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  [styles.buttonContainer],
                  { alignSelf: "center", padding: 5 },
                ]}
                onPress={() => {
                  handleRemoveSellerOrAgent(isModalVisible.Data);
                }}
              >
                <CustomText style={[styles["btn"]]}>{"Yes"}</CustomText>
              </TouchableOpacity>
            </View>
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
      zIndex: -1,
      height: Platform.OS === "web" ? "min-content" : null,
    },
    ...(Platform.OS === "web"
      ? {
          minWidth: "450px",
          maxWidth: "450px",
          boxShadow: "3px 7px 10px 4px rgb(0 0 0 / 8%)",
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
    zIndex: -1,
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
          //flexWrap: "wrap",
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
  "modal-footer": {
    backgroundColor: "#e4e9ee",
    padding: 14,
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    width: Platform.OS === "web" ? "100%" : null,
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
    fontWeight: "bolder",
    marginRight: 10,
  },
  "search-drop-down": {
    backgroundColor: "#FFFFFF",
    maxHeight: 230,
    overflow: "scroll",
    boxShadow: "0px 0px 10px 0px rgb(0 0 0 / 10%)",
    position: "fixed",
    width: " 430px",
    zIndex: 1111111,
    marginTop: "55px",
    borderColor: "#d9d1d1",
    //borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "blue",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  "grid-input": {
    padding: 0,
    color: "#51575d",
  },
  HoverBgColor: {
    backgroundColor: "red",
  },
});
