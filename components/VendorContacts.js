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
  Button,
  TouchableWithoutFeedback,
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
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
export default function VendorContacts() {
  const windowWidth = useWindowDimensions().width; // Using for small screen
  const [editCard, setEditCard] = useState({}); // To check which card is enabling for editing
  const [editCompany, setEditCompany] = useState({}); // To check which card's chane company button is checked
  const [cardInfo, setCardInfo] = useState([]); // Final JSON for saving
  const [result, setResult] = useState([]); // API result for cards
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
    tableHead: ["Category", "Company", "Company Status", "File #"],
    tableTitle: [],
    tableData: [],
    ModifiedJson: [],
  });
  const [sellerTabelProps, setSellerTabelProps] = useState({
    tableHead: [
      "Agent Name",
      "Entity Name",
      "Agent Cell Phone",
      "Agent Email",
      "",
    ],
    tableData: [],
    EditRow: [],
    ModifiedJson: [],
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [validation, setValidation] = useState({});
  const [saveValidation, setSaveValidation] = useState({});

  let FileNumberJson = []; // To carry the edited file number
  //useRef
  const btnAddNewRef = useRef([]); //modified from singular to array
  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const setListRef = (index, ref) => {
    //Function to set the multiple useref
    btnAddNewRef.current[index] = ref;
  };

  if (Platform.OS === "web") {
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowUp" && selectedItemIndex > 0) {
          setSelectedItemIndex(selectedItemIndex - 1);
          if (selectedItemIndex < otherProps.ComponySearchCount - 2) {
            setTimeout(() => {
              flatListRef.current.scrollToItem({
                animated: true,
                item: AutoCompdata[Object.keys(AutoCompdata)[0]][
                  selectedItemIndex - 1
                ],
                viewPosition: 0.5,
              });
            }, 0);
          }
        } else if (e.key === "ArrowUp" && selectedItemIndex == 0) {
          //When user clicks up arrow from add new button then do the below
          const test = fnGetIndex(Object.keys(AutoCompdata)[0]);
          // document.getElementsByTagName('input')[test].focus()
          try {
            e.srcElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].focus();
            setSelectedItemIndex(-1);
          } catch (e) {}
        } else if (
          e.key === "ArrowDown" &&
          selectedItemIndex < otherProps.ComponySearchCount - 1
        ) {
          setSelectedItemIndex(selectedItemIndex + 1);
          if (selectedItemIndex < otherProps.ComponySearchCount - 2) {
            setTimeout(() => {
              flatListRef.current.scrollToItem({
                animated: true,
                item: AutoCompdata[Object.keys(AutoCompdata)[0]][
                  selectedItemIndex
                ],
                viewPosition: 0,
              });
            }, 0);
          } else {
            e.preventDefault();
          }
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const index = fnGetIndex(Object.keys(AutoCompdata)[0]);
          if (selectedItemIndex === 0) {
            handleAddNew(
              AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex]
            );
          } else {
            if (Object.keys(AutoCompdata)[0] == 0) {
              handleSellerSelection(AutoCompdata["0"][selectedItemIndex]); // Seller selection
            } else {
              handleCompanySelection(
                AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex],
                index,
                0
              ); // Company selection
            }
          }
        } else {
          e.preventDefault();
        }
        e.preventDefault();
      };
      const handleMouseDown = (e) => {
        //  debugger;
      };
      const handleWindowClick = (e) => {
        //if (e.target.placeholder.indexOf("Search for") !== -1)
        // fnShowAddNew(Object.keys(AutoCompdata)[0], "Show");
        //else

        if (e.target.placeholder === undefined)
          fnShowAddNew(Object.keys(AutoCompdata)[0], "Close");
        // if (e.target.placeholder.indexOf("Search for") === -1)
        //   fnShowAddNew(Object.keys(AutoCompdata)[0], "Close");
      };
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("click", handleWindowClick);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("click", handleWindowClick);
      };
    }, [selectedItemIndex, otherProps]);

    useEffect(() => {
      const SearchURL = window.location.search;
      const searchParams = new URLSearchParams(SearchURL);
      setQueryString({
        ...queryString,
        LoanId: searchParams.get("LoanId"), //handleParamFromURL(document.location.href, "LoanId"),
        SessionId: searchParams.get("SessionId"), //handleParamFromURL(document.location.href, "SessionId"),
      });
      if (window.parent != window) {
        var parentElLoader = window.parent.document.getElementById("divLoader");
        parentElLoader.style.display = "none";
      }
      //searchParams.get("SessionId")
      handleAPI({
        name: "GetUsersDetails",
        params: { SessionId: searchParams.get("SessionId") }, //queryString["SessionId"] },
        method: "POST",
      })
        .then((response) => {
          console.log("Session ===>", response);
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

  // API for to load data fot Cards and Grids
  const GetVendoronload = () => {
    let qString = "",
      sParams = "";
    if (Platform.OS === "web") {
      qString = window.location.search;
      sParams = new URLSearchParams(qString);
    }
    {
      Platform.OS === "web" &&
        // To handle business validation
        handleBusinessValidationMessage();
    }

    handleAPI({
      name: "Get_VendorLoanInfo",
      params: {
        LoanId:
          Platform.OS === "web" ? sParams.get("LoanId") : queryString["LoanId"],
        Fullrows: 1,
      },
      method: "POST",
    })
      .then((response) => {
        let Data = JSON.parse(response);
        //let Data = Rows;
        let sellerData = Data.filter((e) => e.ContactType === 0);
        if (sellerData.length == 1 && sellerData[0].AgentID == 0)
          sellerData = [];
        setSellerInfo({ ...sellerInfo, RowData: sellerData });
        setSellerTabelProps({
          ...sellerTabelProps,
          ["ModifiedJson"]: sellerData,
        });

        const CardResult = Data.filter((e) => e.isCard === 1);
        const GridData = Data.filter((e) => e.isCard !== 1);

        if (CardResult.length) {
          let CardData = CardResult;

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
          // let hazardInsurance = GridData.filter((e) => e.ContactType === 17);
          // CardData.push(hazardInsurance[0]);

          let uniqueRows = getUniqueObjectsByKey(CardData, "ContactTypename");
          console.log("Card info", uniqueRows);

          setResult(uniqueRows);
          setCardInfo(uniqueRows);
          setCopyAgent({
            2: uniqueRows[2].isEscrowSame == 0 ? false : true, // Title for borrower
            48: uniqueRows[4].isEscrowSame == 0 ? false : true, // Title for seller
            50: uniqueRows[6].iNoRealtorReprestation == 1 ? true : false, // Realtor for borrower
            51: uniqueRows[7].iNoRealtorReprestation == 1 ? true : false, // Realtor for seller
            43:
              uniqueRows[uniqueRows.length - 1].iNoRealtorReprestation == 1 &&
              uniqueRows[uniqueRows.length - 1].AgentID == 0
                ? true
                : false, // Realtor for seller
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
          const fieldValidation = uniqueRows.filter((e) => e.FileNumber == "");
          setEditCompany(EnableSearch);
          setValidation(EnableSearch);

          // Need to work on for validation
          setSaveValidation((prevState) => {
            var updatedData = { ...prevState };
            fieldValidation.forEach((e) => {
              updatedData[e.ContactType] = {
                FileNumber: true,
              };
            });

            return updatedData;
          });

          // setSaveValidation({
          //   ...saveValidation,
          //   [ContactType]: {
          //     ...saveValidation[ContactType],
          //     [name]: true,
          //   },
          // });
        }
        //Grid data binding
        if (GridData.length) {
          const isExist = GridData.filter((e) => e["ContactType"] === 3);
          console.log("Full grid row === >", GridData);
          const OrderedObject = fnChangeArrOfObjectOrder(GridData);
          setTableProps({
            ...tabelProps,
            tableData: OrderedObject,
            ModifiedJson: OrderedObject,
            IsShowSearch: isExist[0].AgentID == 0 ? true : false,
          });
          console.log("Grid info", GridData);
          //setGridResult(GridData);
        }
      })
      .catch((e) => console.log("Get API => ", e));
    // setCardInfo(rows); // Testing purpose
  };
  const fnFocusInput = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedItemIndex(0);
      setTimeout(() => {
        if (btnAddNewRef.current) {
          btnAddNewRef.current[0].focus(); //This fixes the Scroll happening from bottom to add new
        }
      }, 0);
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
        IsModified: 1,
        Loanid:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : 456760,
        // IsModified: cardInfo[index].IsNew === 1 ? 0 : 1,
        IsNew: cardInfo[index].IsNew !== 1 ? 0 : 1,
      };
      return updateObj;
    });
    handleParentWindow("Enable");

    const { ContactType } = cardInfo[index];

    // let obj = jsonModified?.filter((e) => e.ContactType === ContactType);

    // let modifiedJson = { ...(obj || []), [name]: value };
    // setJsonModified(modifiedJson);
    if (name === "FileNumber") {
      if (value.trim().length === 0) {
        setSaveValidation({
          ...saveValidation,
          [ContactType]: {
            ...saveValidation[ContactType],
            [name]: true,
          },
        });
        // if (window.parent != window) {
        //   let obj = { ContactType: ContactType, [name]: value };
        //   FileNumberJson = FileNumberJson.filter(
        //     (e) => e.ContactType !== ContactType
        //   );
        //   FileNumberJson.push(obj);
        //   // window.parent.AppraisalSavedXml = FileNumberJson;
        // handleParentWindow("Disable");
        //window.parent.VendorSaveJson = FileNumberJson;
        //}
      } else {
        // if (window.parent != window) {
        //   let obj = { ContactType: ContactType, [name]: value };
        //   FileNumberJson = FileNumberJson.filter(
        //     (e) => e.ContactType !== ContactType
        //   );
        //   FileNumberJson.push(obj);
        // window.parent.AppraisalSavedXml = FileNumberJson;
        // handleParentWindow("Enable");
        // window.parent.VendorSaveJson = FileNumberJson;
        // }
      }
    }
    //   setOtherProps({
    //     ...otherProps,
    //     [`textSelection-${index}`]: true,
    //     [`showSavebtn-${index}`]: true,
    //   });
    // } else {
    setOtherProps({ ...otherProps, [`textSelection-${index}`]: true });
    // }
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
    //For validation
    let mandatoryFields = [];
    let finalJson = [];
    let isBlockSave = false;
    if (TypeName !== "Seller") {
      mandatoryFields = [
        "Companyname",
        "FirstName",
        "LastName",
        "AgentEmail",
        "CompPhone",
        "Phone",
        "FileNumber",
      ];

      const {
        ContactType,
        Companyname,
        FirstName,
        LastName,
        AgentEmail,
        CompPhone,
        Phone,
      } = cardInfo[index];
      setSaveValidation((PrevObj) => {
        const updateObj = { ...(PrevObj || {}) };
        updateObj[ContactType] = {};

        mandatoryFields.forEach((key) => {
          if (!cardInfo[index][key]) {
            updateObj[ContactType][key] = true;
            if (key === "Companyname") isBlockSave = true;
          }
        });
        return updateObj;
      });
      finalJson = cardInfo.filter((e, i) => i == index);
    } else {
      finalJson = sellerTabelProps["ModifiedJson"].filter((e, i) => i == index);
    }
    if (isBlockSave) return; // To block when only the company name is empty
    //setOtherProps({ ...otherProps, [`showSavebtn-${index}`]: false });

    if (TypeName !== "Seller") {
      setEditCard({
        ...editCard,
        [finalJson[0]["ContactType"]]: false,
      });
      setEditCompany({
        ...editCompany,
        [finalJson[0]["ContactType"]]: false,
      });

      let Nickname = finalJson[0].Nickname || "";
      let AgentName = `${finalJson[0].FirstName}${Nickname}${finalJson[0].LastName}`;
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
          ["CompanyAddress"]: finalJson[0].CompanyAddress || "",
          ["CompanyCity"]: finalJson[0].CompanyCity || "",
          ["CompanyLicense"]: finalJson[0].CompanyLicense,
          ["CompanyState"]: finalJson[0].CompanyState || "",
          ["CompanyStreetAddr"]: finalJson[0].CompanyStreetAddr,
          ["CompanyZip"]: finalJson[0].CompanyZip || "",
          ["CompanyAddress"]:
            finalJson[0].CompanyStreetAddr !== undefined
              ? `${finalJson[0].CompanyStreetAddr}, ${finalJson[0].CompanyCity}, ${finalJson[0].CompanyState}, ${finalJson[0].CompanyZip}`
              : "",
          ["Companyname"]: finalJson[0].Companyname,
          ["ContactType"]: finalJson[0].ContactType,
          ["ContactTypename"]: finalJson[0].ContactTypename,
          ["Loanid"]: finalJson[0].Loanid,
          ["Phone"]: finalJson[0].Phone,
          ["VendorId"]: finalJson[0].state,
          ["FirstName"]: finalJson[0].FirstName,
          ["Nickname"]: finalJson[0].Nickname,
          ["LastName"]: finalJson[0].LastName,
          ["isCard"]: finalJson[0].isCard,
          ["isEscrowSame"]: finalJson[0].isEscrowSame,
          ["FileNumber"]: finalJson[0].FileNumber,
        };
        if (finalJson[0].isEscrowSame == 1) {
          // updateObj[index + 1] = updateObj[index];
          updateObj[index + 1] = {
            ...PrevObj[index + 1],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentFN"]: finalJson[0].AgentFN,
            ["AgentFNN"]: AgentName,
            ["AgentLicense"]: finalJson[0].AgentLicense,
            ["CompEmail"]: finalJson[0].CompEmail,
            ["CompPhone"]: finalJson[0].CompPhone,
            ["CompanyAddress"]: finalJson[0].CompanyAddress || "",
            ["CompanyCity"]: finalJson[0].CompanyCity || "",
            ["CompanyLicense"]: finalJson[0].CompanyLicense,
            ["CompanyState"]: finalJson[0].CompanyState || "",
            ["CompanyStreetAddr"]: finalJson[0].CompanyStreetAddr,
            ["CompanyZip"]: finalJson[0].CompanyZip || "",
            ["CompanyAddress"]:
              finalJson[0].CompanyStreetAddr !== undefined
                ? `${finalJson[0].CompanyStreetAddr}, ${finalJson[0].CompanyCity}, ${finalJson[0].CompanyState}, ${finalJson[0].CompanyZip}`
                : "",
            ["Companyname"]: finalJson[0].Companyname,
            ["Loanid"]: finalJson[0].Loanid,
            ["Phone"]: finalJson[0].Phone,
            ["VendorId"]: finalJson[0].state,
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
            ["FileNumber"]: finalJson[0].FileNumber,
          };
        }
        return updateObj;
      });
      if (finalJson[0].isEscrowSame == 1) {
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index + 1] = {
            ...PrevObj[index + 1],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentFN"]: finalJson[0].AgentFN,
            ["AgentFNN"]: AgentName,
            ["AgentLicense"]: finalJson[0].AgentLicense,
            ["CompEmail"]: finalJson[0].CompEmail,
            ["CompPhone"]: finalJson[0].CompPhone,
            ["CompanyAddress"]: finalJson[0].CompanyAddress || "",
            ["CompanyCity"]: finalJson[0].CompanyCity || "",
            ["CompanyLicense"]: finalJson[0].CompanyLicense,
            ["CompanyState"]: finalJson[0].CompanyState || "",
            ["CompanyStreetAddr"]: finalJson[0].CompanyStreetAddr,
            ["CompanyZip"]: finalJson[0].CompanyZip || "",
            ["CompanyAddress"]:
              finalJson[0].CompanyStreetAddr !== undefined
                ? `${finalJson[0].CompanyStreetAddr}, ${finalJson[0].CompanyCity}, ${finalJson[0].CompanyState}, ${finalJson[0].CompanyZip}`
                : "",
            ["Companyname"]: finalJson[0].Companyname,
            ["Loanid"]: finalJson[0].Loanid,
            ["Phone"]: finalJson[0].Phone,
            ["VendorId"]: finalJson[0].state,
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
          };
          return updateObj;
        });
      }
    } else {
      let newRowData = [];
      setSellerInfo((prevState) => {
        newRowData = [...prevState.RowData];
        newRowData[index] = finalJson[0];
        newRowData[index].AgentID = -1;
        return { ...prevState, RowData: newRowData };
      });
      setSellerTabelProps((prevState) => {
        newRowData = [...prevState.ModifiedJson];
        newRowData[index] = finalJson[0];
        newRowData[index].AgentID = -1;
        return { ...prevState, ModifiedJson: newRowData };
      });
    }
    console.log("------------------------------------");
    console.log("Individual save initiated");
    let JsonData = JSON.stringify(finalJson).replaceAll("#", "|H|");
    handleAPI({
      name: "Save_VendorLoanInfo",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        SaveJson: JsonData,
      },
      method: "POST",
    })
      .then((response) => {
        if (response === "Completed") {
          // This part is moved to before the API request for peform
          // To handle business validation
          handleBusinessValidationMessage();

          console.log("Individual save Completed");
          console.log("------------------------------------");
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
  const GetTypeaheadAgentInfo = (value, type, signal, sourceType) => {
    if (value.trim().length === 0) {
      setOtherProps({ ...otherProps, [type]: false });
    } else {
      setOtherProps({ ...otherProps, [type]: true });
    }
    handleAPI({
      name: "GetTypeaheadAgentInfo",
      signal: signal,
      params: {
        SearchVal: value,
        Type: type,
        UserType: sourceType,
        ValType: sourceType,
      },
      method: "POST",
    })
      .then((response) => {
        let result = [];
        if (response !== undefined && response != "undefined") {
          try {
            result = JSON.parse(response);
          } catch (error) {
            result = eval(response);
          }
          setOtherProps({
            ...otherProps,
            [type]: false,
            ComponySearchCount: result.length,
          });
          //setSelectedItemIndex(0);
          let NoRow = [];
          if (result.length === 1) {
            NoRow = [
              {
                id: "-1",
                ValType: "",
                Type: type,
                UserType: "",
                ActualType: type,
                label: "No records found",
                AgentCompName: "",
              },
            ];
          }
          setData({ [type]: [...result, ...NoRow] });
          console.log("auto complete result ==>", result);
        } else {
          setData({
            ...AutoCompdata,
            IsshowButton: 1,
            [type]: [
              {
                id: "0",
                ValType: "V",
                Type: type,
                UserType: "V",
                ActualType: type,
                label: "Add New",
                AgentCompName: "Add New  ",
              },
            ],
          });
        }
      })

      .catch((e) => console.log("While auto complete  => ", e));
  };
  const handleTypeaheadOption = (item, index) => {
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
              if (item.ActualType == 0) handleSellerSelection(item);
              else handleCompanySelection(item, index, 0);
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
    );
    return <>{views}</>;
  };
  const handleCompanySearch = (event, type, sourceType) => {
    //if (event.trim().length === 0) return;
    setInput({ [type]: event });
    if (apiController) {
      apiController.abort(); // Abort previous API call
    }
    const newApiController = new AbortController();
    setApiController(newApiController);
    //if (apiController)

    GetTypeaheadAgentInfo(event, type, newApiController.signal, sourceType);
  };
  const handleOnkeyPressFlatlist = (event, index) => {
    //function to differentiate the Enter/Space click from add new / Agent options
    if (selectedItemIndex === 0) {
      handleAddNew(event);
    } else {
      if (event.ActualType == 0) {
        handleSellerSelection(event); // Seller selection
      } else {
        handleCompanySelection(event, index, 0); // Company selection selection
      }
    }
  };

  const handleCompanySelection = (event, index, IsSame) => {
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
        console.log("Company selection API result ==>", response);
        const finalJson = JSON.parse(response);
        setData({});
        setInput({});

        setEditCompany({ ...editCompany, [finalJson[0].ContactType]: false });
        setModalVisible({ isModalVisible, Confirmation: false });
        const { ContactType } = finalJson[0];
        if (ContactType == 43) {
          setCopyAgent({
            ...copyAgent,
            [ContactType]: false,
          });
        } else {
          setCopyAgent({
            ...copyAgent,
            [ContactType]: IsSame === 1 ? true : false,
          });
        }
        setTableProps({
          ...tabelProps,
          IsShowSearch: false,
        });
        // let ContactType = event.ActualType == 2 ? 4 : 49;
        // let Index = event.ActualType == 2 ? 3 : 5;
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ...PrevObj[index],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentID"]: finalJson[0].AgentID,
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
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
            ["isEscrowSame"]: finalJson[0].isEscrowSame,
            ["FileNumber"]: finalJson[0].FileNumber,
          };

          return updateObj;
        });
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ...PrevObj[index],
            ["AgentEmail"]: finalJson[0].AgentEmail,
            ["AgentID"]: finalJson[0].AgentID,
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
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
            ["isEscrowSame"]: finalJson[0].isEscrowSame,
            ["FileNumber"]: finalJson[0].FileNumber,
          };

          return updateObj;
        });
        setValidation({ ...validation, [finalJson[0].ContactType]: false });

        // To handle business validation
        handleBusinessValidationMessage();
      })
      .catch((e) => console.log("Error in Company selection method => ", e));
  };
  const handleSellerSelection = (event) => {
    handleAPI({
      name: "AddNewSigner",
      params: {
        UserId: event.id,
        UserType: event.ValType,
        strSessionId: handleParamFromURL(document.location.href, "SessionId"),
        SerCatId: event.ActualType,
        iLoanId: handleParamFromURL(document.location.href, "LoanId"),
      },
      method: "POST",
    })
      .then((response) => {
        console.log("Seller selection API result ==>", response);
        const Response = JSON.parse(response);
        setSellerInfo({ ...sellerInfo, RowData: Response });
        setSellerTabelProps({
          ...sellerTabelProps,
          ["ModifiedJson"]: Response,
        });
      })
      .catch((e) => console.log("Error in Seller selection method => ", e));
  };
  const handleGridChange = (index, name, value, Type) => {
    if (Type === "Grid") {
      handleParentWindow("Enable"); // To enable the global save
      setTableProps((prevState) => {
        const modifiedJson = [...prevState.tableData];
        modifiedJson[index] = {
          ...modifiedJson[index],
          [name]: value,
          IsModified: 1,
          IsNew: 0,
        };
        return {
          ...prevState,
          tableData: modifiedJson,
        };
      });

      const { ContactType } = tabelProps["tableData"][index];
      // setJsonModified({
      //   ...jsonModified,
      //   [ContactType]: {
      //     ...jsonModified[ContactType],
      //     [name]: value,
      //   },
      // });

      if (name === "FileNumber" && ContactType == 22) {
        if (value.trim().length === 0) {
          setSaveValidation({
            ...saveValidation,
            [ContactType]: {
              ...saveValidation[ContactType],
              [name]: true,
            },
          });
        }
      }
    } else {
      setSellerTabelProps((prevState) => {
        const modifiedJson = [...prevState.ModifiedJson];
        modifiedJson[index] = {
          ...modifiedJson[index],
          [name]: value,
          IsModified: 1,
          IsNew: 0,
        };
        return {
          ...prevState,
          ModifiedJson: modifiedJson,
        };
      });
    }
  };
  const handleChangeCheckBox = (Type, event, index, Agent) => {
    //Checkbox enable/disable

    if (Agent === "Vendor") {
      if (!result[index].AgentID) return; // To prevent the copy agent when the company is not seleted
      setCopyAgent({
        ...copyAgent,
        [Type]: event,
      });
      let ContactType = Type == 2 ? 4 : 49;
      let Index = Type == 2 ? 3 : 5;
      //To show/hide change company view
      setEditCompany({
        ...editCompany,
        [ContactType]: !event,
      });
      setValidation({ ...validation, [ContactType]: !event });
      if (event) {
        //Card view portion
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[Index] = result[index];
          updateObj[Index] = {
            ...updateObj[Index],
            ["ContactType"]: ContactType,
            ["ContactTypename"]: result[Index].ContactTypename,
            ["isCard"]: 1,
            // ["isEscrowSame"]: 1,
          };
          return updateObj;
        });
        //Card Edit portion
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[Index] = result[index];
          updateObj[Index] = {
            ...updateObj[Index],
            ["ContactType"]: ContactType,
            ["ContactTypename"]: result[Index].ContactTypename,
            ["isCard"]: 1,
            // ["isEscrowSame"]: 1,
          };
          return updateObj;
        });
        let params = {
          id: result[index]["AgentID"],
          ValType: "V",
          ActualType: ContactType,
          isTitleEscSame: 1,
        };
        handleCompanySelection(params, Index, 1);
      } else {
        //Card view portion
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[Index] = {
            ["ContactType"]: ContactType,
            ["ContactTypename"]: result[Index].ContactTypename,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            // ["isEscrowSame"]: 0,
          };
          return updateObj;
        });

        //Card Edit portion
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[Index] = {
            ["ContactType"]: ContactType,
            ["ContactTypename"]: result[Index].ContactTypename,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            // ["isEscrowSame"]: 0,
          };
          return updateObj;
        });

        handleRemoveSellerOrAgent(result[Index]);
      }
    } else if (Agent === "Realtor" || Agent === "DoesNotApply") {
      setCopyAgent({
        ...copyAgent,
        [Type]: event,
      });
      if (event) {
        //Card view portion
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ["ContactType"]: Type,
            ["ContactTypename"]: result[index].ContactTypename,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            ["iNoRealtorReprestation"]: 1,
          };
          return updateObj;
        });

        //Card Edit portion
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ["ContactType"]: Type,
            ["ContactTypename"]: result[index].ContactTypename,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            ["iNoRealtorReprestation"]: 1,
          };
          return updateObj;
        });

        handleRemoveSellerOrAgent(result[index]);
      }

      handleAPI({
        name: "UpdateRealtorRepresVal",
        params: {
          LoanId: handleParamFromURL(document.location.href, "LoanId"),
          RealtorRepresVal: event ? "1" : "0",
          ServCategoryId: Type,
        },
        method: "POST",
      })
        .then((response) => {
          console.log("No Realtor Saved..");
        })
        .catch((e) =>
          console.log("Error in UpdateRealtorRepresVal method => ", e)
        );
    } else {
      // setCopyAgent({
      //   ...copyAgent,
      //   [Type]: event,
      // });
    }
  };

  const handleRemoveSellerOrAgent = (Data) => {
    console.log("remove info", Data);
    if (Data.ContactSourceType === "S") {
      let Result = [];
      if (Data.AgentID == 0)
        Result = sellerInfo.RowData.filter((e) => {
          return e.tempAgentID !== Data.tempAgentID;
        });
      else
        Result = sellerInfo.RowData.filter((e) => {
          return e.AgentID !== Data.AgentID;
        });
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
          ["ContactSourceType"]: "V",
          ["isCard"]: 1,
        };
        return updateObj;
      });
      // setCopyAgent({
      //   ...copyAgent,
      //   [Data.ContactType]: false,
      // });
      setCardInfo((PrevObj) => {
        const updateObj = [...PrevObj];
        updateObj[index] = {
          ["ContactType"]: Data.ContactType,
          ["ContactTypename"]: Data.ContactTypename,
          ["Loanid"]: Data.Loanid,
          ["VendorId"]: Data.VendorId,
          ["isCard"]: 1,
          ["isEscrowSame"]: 0,
        };
        return updateObj;
      });
      setEditCompany({
        ...editCompany,
        [Data.ContactType]: true,
      });
      // setData({
      //   [Data.ContactType]: [
      //     {
      //       id: "0",
      //       ValType: "V",
      //       Type: Data.ContactType,
      //       UserType: "V",
      //       ActualType: Data.ContactType,
      //       label: "Add New",
      //       AgentCompName: "Add New  ",
      //     },
      //   ],
      // });
      setValidation({ ...validation, [Data.ContactType]: true });
    }
    // To handle business validation
    handleBusinessValidationMessage();
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
        //This part has moved to before the API request
      })
      .catch((e) =>
        console.log("Error in handleRemoveSellerOrAgent method => ", e)
      );
  };
  const fnGetIndex = (value) => {
    // const valueToIndex = {
    //   7: 0,
    //   0: 1,
    //   2: 2,
    //   4: 3,
    //   48: 4,
    //   49: 5,
    //   50: 6,
    //   51: 7,
    //   17: 8,
    //   43: cardInfo.length - 1,
    // };

    // return valueToIndex[value] !== undefined ? valueToIndex[value] : -1;

    return cardInfo.findIndex((item) => item.ContactType == value);
  };
  const handleCompanyChange = (Type) => {
    setEditCompany({
      ...editCompany,
      [Type]: editCompany[Type] === undefined ? true : !editCompany[Type],
    });
    fnShowAddNew(Type);
  };
  const handleAddNew = (item) => {
    if (item.ValType == "S") {
      setModalVisible({ Seller: true });
      let SellerLength = sellerInfo["RowData"].length;
      // if (
      //   sellerInfo["RowData"].length == 0 ||
      //   (sellerInfo["RowData"][SellerLength - 1].tempAgentID !== undefined &&
      //     sellerTabelProps["ModifiedJson"][SellerLength - 1].FirstName !== "")
      // ) {
      let NewRow = [],
        ArrLength = 0;
      // if (
      //   sellerInfo["RowData"].length == 0 ||
      //   sellerInfo["RowData"][0].AgentID !== 0
      // ) {
      NewRow = [
        {
          AgentID: 0,
          tempAgentID: sellerInfo["RowData"].length,
          ContactSourceType: "S",
          ContactType: 0,
          ContactTypename: "Seller",
          FirstName: "",
          LastName: "",
          Phone: "",
          AgentEmail: "",
          Loanid: handleParamFromURL(document.location.href, "LoanId"),
          VendorId: 0,
          isCard: 1,
        },
      ];
      ArrLength = sellerInfo["RowData"].length;
      // }

      let Data = [...sellerInfo["RowData"], ...NewRow];
      setSellerInfo({ ...sellerInfo, RowData: Data });
      setSellerTabelProps({
        ...sellerTabelProps,
        ModifiedJson: Data,
        EditRow: {
          ...sellerTabelProps.EditRow,
          [ArrLength]: true,
        },
      });
      //}
    } else {
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
          ["Companyname"]: "",
          ["FirstName"]: "",
          ["LastName"]: "",
          ["AgentEmail"]: "",
          ["CompPhone"]: "",
          ["Phone"]: "",
          ["IsNew"]: 1,
          [item.SearchedFor]: AutoCinput[item.ActualType] || "", // To have the searched value by default to which you searched for
        };
        return updateObj;
      });
    }
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
  const handleEditCard = (row, Type) => {
    setEditCard({
      ...editCard,
      [row["ContactType"]]:
        editCard[row["ContactType"]] === undefined
          ? true
          : !editCard[row["ContactType"]],
    });
    const index = fnGetIndex(row["ContactType"]);
    if (Type === "EditCard") {
      setCardInfo((PrevObj) => {
        const updateObj = [...PrevObj];
        updateObj[index] = {
          ...updateObj[index],
          IsNew: 0,
        };
        return updateObj;
      });
    }
  };
  const fnChangeArrOfObjectOrder = (row) => {
    const modifiedArray = [];
    const predefinedValues = [
      //Lenders
      1, 8, 9, 18, 19, 36, 37, 38, 46, 3, 47, 55,
      //Service Provider
      // 17 --  made hazard insurance as card
      23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 39, 40, 41, 22,
    ];
    // Iterate over predefined values and add matching objects to the modified array
    predefinedValues.forEach((value) => {
      const matchingObject = row.find((obj) => obj.ContactType === value);
      if (matchingObject) {
        modifiedArray.push(matchingObject);
      }
    });

    // // Add remaining objects to the modified array that are not in the predefined values list
    // row.forEach((obj) => {
    //   if (!predefinedValues.includes(obj.ContactType)) {
    //     modifiedArray.push(obj);
    //   }
    // });
    return modifiedArray;
  };
  const handleCardCancel = (row, index) => {
    setEditCard({
      ...editCard,
      [row["ContactType"]]: false,
    });
    setSaveValidation({
      [row["ContactType"]]: [],
    });
    // setOtherProps({
    //   ...otherProps,
    //   [`showSavebtn-${index}`]: false,
    // });
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ...updateObj[index],
        ["FileNumber"]: result[index]["FileNumber"],
      };
      return updateObj;
    });
  };
  const handleParentWindow = (Type) => {
    if (window.parent != window) {
      var parentEleBtn = window.parent.document.getElementById("btnSave");
      var parentElLoader = window.parent.document.getElementById("divLoader");
      parentElLoader.style.display = "none";
      if (Type === "Enable") {
        parentEleBtn.classList.remove("btnDisable");
        parentEleBtn.removeAttribute("disabled");
        parentEleBtn.classList.add("btn", "btn-primary");
      } else {
        parentEleBtn.classList.add("btnDisable");
        parentEleBtn.setAttribute("disabled", "disabled");
        parentEleBtn.classList.remove("btn", "btn-primary");
      }
    }
  };
  const handleParentWindowSave = () => {
    handleParentWindow("Disable");
    setEditCard({});
    setResult(cardInfo); // To append the edited value in the view mode
    let ModifiedCard = cardInfo.filter((e) => e.IsModified == 1);
    let ModifiedGrid = tabelProps["tableData"].filter((e) => e.IsModified == 1);
    let finalJson = [...ModifiedCard, ...ModifiedGrid];
    let JsonData = JSON.stringify(finalJson).replaceAll("#", "|H|");
    handleAPI({
      name: "Save_VendorLoanInfo_Bulk",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        SaveJson: JsonData,
      },
      method: "POST",
    })
      .then((response) => {
        if (response === "Completed") {
          // This part is moved to before the API request for peform
          GetVendoronload();
        }
      })
      .catch((e) =>
        console.log("Error While saving vendor details in the parent => ", e)
      );
    //document.querySelectorAll('[role="button"]')[0].click();
    console.log("Save is processing");
  };

  const handleBusinessValidationMessage = () => {
    if (window.parent != window) {
      window.parent.Showvalidationstatus(
        handleParamFromURL(document.location.href, "LoanId"),
        43,
        "Vendors",
        handleParamFromURL(document.location.href, "SessionId"),
        "Vendors"
      );
    }
  };
  const fnShowAddNew = (Type, action, event) => {
    //if (AutoCompdata[Type] === undefined || AutoCompdata[Type].length === 0) {
    if (action === "Show") {
      if (AutoCompdata[Type] === undefined || AutoCompdata[Type].length === 0) {
        setData({
          [Type]: [
            {
              id: "0",
              ValType: Type == 0 ? "S" : "V",
              Type: Type,
              UserType: Type == 0 ? "S" : "V",
              ActualType: Type,
              label: "Add New",
              AgentCompName: "Add New  ",
            },
          ],
        });
      }
    }
    //}
    else if (action == "Close") {
      setData({});
      setInput({});
      setSelectedItemIndex(-1);
    } else if (action == "Close" && AutoCompdata[Type].length > 1) {
      setData({});
      setInput({});
      setSelectedItemIndex(-1);
    }
  };

  /////////////// Function declarations ends here //////////////////////
  return (
    <View>
      {result.length === 0 ? (
        <CustomText style={styles["card-Loading"]}>Loading...</CustomText>
      ) : (
        <>
          {/* Cards Section */}
          {/* <TouchableWithoutFeedback onPress={handlePressOutside}> */}
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
                  copyAgent[row["ContactType"]] &&
                    [43, 50, 51].includes(row["ContactType"]) &&
                    styles["card-disable"], // This is for disabling the card when no realtor is checked
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
                                  {!otherProps["remove-" + index] ? (
                                    <>
                                      <TouchableOpacity
                                        onPress={(e) => {
                                          handleCompanyChange(
                                            row["ContactType"]
                                          );
                                        }}
                                        style={[styles.buttonContainer]}
                                      >
                                        <CustomText style={styles["btn"]}>
                                          {"Change"}
                                        </CustomText>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={(e) => {
                                          handleEditCard(row, "EditCard");
                                        }}
                                        style={[styles.buttonContainer]}
                                      >
                                        <CustomText style={styles["btn"]}>
                                          {"Edit"}
                                        </CustomText>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={(e) => {
                                          // setModalVisible({
                                          //   Remove: true,
                                          //   Data: row,
                                          // });

                                          setOtherProps({
                                            ...otherProps,
                                            ["remove-" + index]: true,
                                          });
                                        }}
                                        style={[
                                          [styles.buttonContainer],
                                          // { backgroundColor: "#ffb752" },
                                          { backgroundColor: "#ec971f" },
                                        ]}
                                      >
                                        <CustomText
                                          style={[
                                            styles["btn"],
                                            { color: "white" },
                                          ]}
                                        >
                                          {"Remove"}
                                        </CustomText>
                                      </TouchableOpacity>
                                    </>
                                  ) : (
                                    <View style={styles["remove-card-header"]}>
                                      <CustomText
                                        style={{
                                          color: "#fff",
                                          marginRight: 10,
                                        }}
                                      >
                                        Are you sure want to remove?
                                      </CustomText>
                                      <View style={styles["btn"]}>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            handleRemoveSellerOrAgent(row);
                                            setOtherProps({
                                              ...otherProps,
                                              ["remove-" + index]: false,
                                            });
                                            setCopyAgent({
                                              ...copyAgent,
                                              [row["ContactType"]]: false,
                                            });
                                          }}
                                          style={[
                                            [styles.buttonContainer],
                                            // { backgroundColor: "#ffb752" },
                                            { backgroundColor: "#5cb85c" },
                                          ]}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { color: "white" },
                                            ]}
                                          >
                                            {"Yes"}
                                          </CustomText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setOtherProps({
                                              ...otherProps,
                                              ["remove-" + index]: false,
                                            });
                                          }}
                                          style={[
                                            [styles.buttonContainer],
                                            // { backgroundColor: "#ffb752" },
                                            { backgroundColor: "#d9534f" },
                                          ]}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { color: "white" },
                                            ]}
                                          >
                                            {"No"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                                </View>
                              )}
                          </>
                        )}
                        <>
                          {editCard[row["ContactType"]] ||
                          otherProps["showSavebtn-" + index] ? (
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
                                  handleCardCancel(row, index);
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
                                setData({});
                                setInput({});
                                setSellerTabelProps({
                                  ...sellerTabelProps,
                                  EditRow: [],
                                });
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
                                  {e.AgentID == 0 &&
                                  sellerInfo["RowData"].length === 1 ? (
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
                                          handleCompanySearch(text, "0", "S");
                                        }}
                                        onKeyPress={(event) => {
                                          setSelectedItemIndex(-1);
                                          fnFocusInput(event);
                                        }}
                                        onBlur={(e) => {
                                          fnShowAddNew(0, "Hide");
                                        }}
                                        onFocus={(e) => {
                                          fnShowAddNew(0, "Show");
                                        }}
                                        placeholder="Search for Company or Seller Name, Email or Cell Phone"
                                      />
                                      <CustomText
                                        style={{
                                          position: "absolute",
                                          right: 0,
                                          top: 35,
                                        }}
                                      >
                                        {otherProps[e["ContactType"]] && (
                                          <View style={{ right: 30 }}>
                                            <ArrowSpinner />
                                          </View>
                                        )}
                                        {/* {!validation[e["ContactType"]] && (
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
                                            onPress={(event) => {
                                              handleCloseEditCompany(e);
                                            }}
                                          />
                                        )} */}
                                      </CustomText>
                                      {AutoCompdata[e["ContactType"]] &&
                                        !isModalVisible.Seller && (
                                          <FlatList
                                            style={styles["search-drop-down"]}
                                            data={
                                              AutoCompdata[e["ContactType"]]
                                            }
                                            showsVerticalScrollIndicator={true}
                                            removeClippedSubviews={true}
                                            ref={flatListRef}
                                            renderItem={({
                                              item,
                                              index: i,
                                            }) => (
                                              <Pressable
                                                // ref={btnAddNewRef}
                                                ref={(ref) =>
                                                  setListRef(i, ref)
                                                }
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
                                                onPress={(event) => {
                                                  handleOnkeyPressFlatlist(
                                                    AutoCompdata[
                                                      e["ContactType"]
                                                    ][selectedItemIndex],
                                                    1
                                                  );
                                                }}
                                              >
                                                <View>
                                                  {handleTypeaheadOption(
                                                    item,
                                                    1
                                                  )}
                                                </View>
                                              </Pressable>
                                            )}
                                            keyExtractor={(item) => item.id}
                                          />
                                        )}
                                    </View>
                                  ) : (
                                    <>
                                      <View>
                                        <View
                                          style={{
                                            maxWidth: 250,
                                            marginRight: 5,
                                          }}
                                        >
                                          <CustomText
                                            onPress={(e) => {
                                              toggleModal("Seller");
                                              setData({});
                                              setInput({});
                                            }}
                                            style={
                                              styles["card-text-underline"]
                                            }
                                            bold={true}
                                          >
                                            {`${e.FirstName} ${e.LastName}`}
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
                                            )}&body=${encodeURIComponent(
                                              body
                                            )}`;
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
                                            let phoneNumber =
                                              e.Phone?.replaceAll("-", "")
                                                .replaceAll("(", "")
                                                .replaceAll(")", "")
                                                .replaceAll(" ", "");

                                            phoneNumber = `tel:${phoneNumber}`;

                                            Linking.canOpenURL(phoneNumber)
                                              .then((supported) => {
                                                return Linking.openURL(
                                                  phoneNumber
                                                );
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

                          {/* To show the search field when there is no sellers exist */}
                          {sellerInfo["RowData"].length == 0 && (
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
                                  handleCompanySearch(text, "0", "S");
                                }}
                                onKeyPress={(event) => {
                                  setSelectedItemIndex(-1);
                                  fnFocusInput(event);
                                }}
                                onBlur={(e) => {
                                  fnShowAddNew(0, "Hide");
                                }}
                                onFocus={(e) => {
                                  fnShowAddNew(0, "Show");
                                }}
                                placeholder="Search for Company or Seller Name, Email or Cell Phone"
                              />
                              <CustomText
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: 35,
                                }}
                              >
                                {otherProps["0"] && (
                                  <View style={{ right: 30 }}>
                                    <ArrowSpinner />
                                  </View>
                                )}
                                {/* {!validation["0"] && (
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
                                    onPress={(event) => {
                                      handleCloseEditCompany(e);
                                    }}
                                  />
                                )} */}
                              </CustomText>
                              {AutoCompdata["0"] && !isModalVisible.Seller && (
                                <FlatList
                                  style={styles["search-drop-down"]}
                                  data={AutoCompdata["0"]}
                                  showsVerticalScrollIndicator={true}
                                  removeClippedSubviews={true}
                                  ref={flatListRef}
                                  renderItem={({ item, index: i }) => (
                                    <Pressable
                                      // ref={btnAddNewRef}
                                      ref={(ref) => setListRef(i, ref)}
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
                                        isHovered && styles["HoverBgColor"],
                                      ]}
                                      onPress={(event) => {
                                        handleOnkeyPressFlatlist(
                                          AutoCompdata["0"][selectedItemIndex],
                                          1
                                        );
                                      }}
                                    >
                                      <View>
                                        {handleTypeaheadOption(item, 1)}
                                      </View>
                                    </Pressable>
                                  )}
                                  keyExtractor={(item) => item.id}
                                />
                              )}
                            </View>
                          )}
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
                                <CustomText
                                  style={{ fontSize: 11, color: "red" }}
                                >
                                  Editing this Vendor is Restricted.
                                </CustomText>
                                <CustomText
                                  style={{ fontSize: 11, color: "red" }}
                                >
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
                                gridTemplateColumns: editCompany[
                                  row["ContactType"]
                                ]
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
                                              width:
                                                Platform.OS !== "web" && "60%",
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
                                        ref={searchInputRef}
                                      >
                                        <InputField
                                          // autoFocus={
                                          //   editCompany[row["ContactType"]]
                                          //     ? true
                                          //     : false
                                          // }
                                          value={
                                            AutoCinput[row["ContactType"]] || ""
                                          }
                                          label="Search for Company or Agent Name, Email or Cell Phone"
                                          type="default"
                                          name="EmailorCellPhone"
                                          onChangeText={(text) => {
                                            handleCompanySearch(
                                              text,
                                              row["ContactType"],
                                              "V"
                                            );
                                          }}
                                          onKeyPress={(e) => {
                                            setSelectedItemIndex(-1);
                                            fnFocusInput(e);
                                          }}
                                          onBlur={(event) => {
                                            fnShowAddNew(
                                              row["ContactType"],
                                              "Hide",
                                              event
                                            );
                                          }}
                                          onFocus={(e) => {
                                            fnShowAddNew(
                                              row["ContactType"],
                                              "Show"
                                            );
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
                                            data={
                                              AutoCompdata[row["ContactType"]]
                                            }
                                            showsVerticalScrollIndicator={true}
                                            removeClippedSubviews={true}
                                            ref={flatListRef}
                                            renderItem={({
                                              item,
                                              index: i,
                                            }) => (
                                              <Pressable
                                                // ref={btnAddNewRef}
                                                ref={(ref) =>
                                                  setListRef(i, ref)
                                                }
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
                                                  handleOnkeyPressFlatlist(
                                                    AutoCompdata[
                                                      row["ContactType"]
                                                    ][selectedItemIndex],
                                                    index
                                                  );
                                                }}
                                              >
                                                <View>
                                                  {handleTypeaheadOption(
                                                    item,
                                                    index
                                                  )}
                                                </View>
                                              </Pressable>
                                            )}
                                            keyExtractor={(item) => item.id}
                                          />
                                        )}
                                      </View>
                                    </>
                                  )}
                                </View>
                                {!editCompany[row["ContactType"]] && (
                                  <>
                                    <View style={styles["card-item"]}>
                                      <CustomText>
                                        {/* {row.CompanyAddress?.split(",")[0]} */}
                                        {row.CompanyStreetAddr}
                                      </CustomText>
                                      <CustomText>
                                        {/* {getAddress(row.CompanyAddress) || ""} */}
                                        {`${row.CompanyCity}, ${row.CompanyState} ${row.CompanyZip}`}
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
                                              return Linking.openURL(
                                                phoneNumber
                                              );
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
                                    {[7, 2, 4, 17].includes(
                                      row["ContactType"]
                                    ) && (
                                      <>
                                        {queryString["IsEditRights"] == 1 ||
                                        !editCard[row["ContactType"]] ? (
                                          // <View style={styles["card-item"]}>
                                          //   <CustomText
                                          //     bold={true}
                                          //     style={[
                                          //       styles["card-lablebold"],
                                          //       {
                                          //         width:
                                          //           Platform.OS === "web"
                                          //             ? "fit-content"
                                          //             : null,
                                          //         backgroundColor:
                                          //           row.FileNumber || "yellow",
                                          //       },
                                          //     ]}
                                          //   >
                                          //     {row["ContactType"] === 7
                                          //       ? "Policy Number "
                                          //       : "File Number "}
                                          //   </CustomText>
                                          //   <CustomText>
                                          //     {row.FileNumber}
                                          //   </CustomText>

                                          // </View>
                                          <View
                                            style={[
                                              styles["card-input"],
                                              styles["card-item"],
                                            ]}
                                          >
                                            <InputField
                                              validate={
                                                saveValidation[
                                                  cardInfo[index]["ContactType"]
                                                ] !== undefined
                                                  ? saveValidation[
                                                      cardInfo[index][
                                                        "ContactType"
                                                      ]
                                                    ]["FileNumber"]
                                                  : false
                                              }
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
                                              placeholder={
                                                row["ContactType"] === 7
                                                  ? "Policy Number"
                                                  : "File Number"
                                              }
                                              onChangeText={(Text) => {
                                                handleCardChange(
                                                  index,
                                                  "FileNumber",
                                                  Text
                                                );
                                              }}
                                            />
                                          </View>
                                        ) : (
                                          <>
                                            {[7, 2, 4, 17].includes(
                                              row["ContactType"]
                                            ) && (
                                              <View
                                                style={[
                                                  styles["card-input"],
                                                  styles["card-item"],
                                                ]}
                                              >
                                                <InputField
                                                  validate={
                                                    saveValidation[
                                                      cardInfo[index][
                                                        "ContactType"
                                                      ]
                                                    ] !== undefined
                                                      ? saveValidation[
                                                          cardInfo[index][
                                                            "ContactType"
                                                          ]
                                                        ]["FileNumber"]
                                                      : false
                                                  }
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
                                                    cardInfo[index][
                                                      "FileNumber"
                                                    ]
                                                  }
                                                  placeholder={
                                                    row["ContactType"] === 7
                                                      ? "Policy Number"
                                                      : "File Number"
                                                  }
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
                              {!editCompany[row["ContactType"]] && (
                                <View
                                  style={{
                                    flexDirection: "column",
                                    // backgroundColor: "green",
                                    gap: 10,
                                  }}
                                >
                                  <View style={[styles["card-item"]]}>
                                    <CustomText bold={true}>
                                      {row.AgentFNN}
                                      {/* {`${row.FirstName}${row.Nickname}${row.LastName}`} */}
                                    </CustomText>
                                  </View>

                                  {row.Phone !== "" && (
                                    <View style={styles["card-item"]}>
                                      <CustomText
                                        onPress={() => {
                                          let phoneNumber =
                                            row.Phone?.replaceAll("-", "")
                                              .replaceAll("(", "")
                                              .replaceAll(")", "")
                                              .replaceAll(" ", "");

                                          phoneNumber = `tel:${phoneNumber}`;

                                          Linking.canOpenURL(phoneNumber)
                                            .then((supported) => {
                                              return Linking.openURL(
                                                phoneNumber
                                              );
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
                                </View>
                              )}
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["Companyname"]
                                    : false
                                }
                                label="Company Name"
                                autoFocus
                                selectable={true}
                                type="default"
                                name="CompanyName"
                                value={cardInfo[index]["Companyname"]}
                                placeholder="Company Name"
                                onChangeText={(Text) => {
                                  handleCardChange(index, "Companyname", Text);
                                }}
                                selection={
                                  otherProps["textSelection-" + index] ===
                                  undefined
                                    ? { start: 0, end: 50 }
                                    : null
                                }
                              />
                            </View>
                          </View>
                          <View
                            style={[styles["card-body"], { paddingTop: 0 }]}
                          >
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["FirstName"]
                                    : false
                                }
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["LastName"]
                                    : false
                                }
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
                          </View>
                          <View
                            style={{
                              padding: 10,
                              paddingTop: 0,
                              paddingBottom: 0,
                              flexDirection: "row",
                            }}
                          >
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                                { width: "40%" },
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["Phone"]
                                    : false
                                }
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                                { width: "58%", marginLeft: 9 },
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["AgentEmail"]
                                    : false
                                }
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
                          </View>
                          <View
                            style={[styles["card-body"], { paddingTop: 0 }]}
                          >
                            {row["ContactType"] !== 7 ? (
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                ]}
                              >
                                <InputField
                                  label="Agent License Number"
                                  // autoFocus
                                  type="default"
                                  name=""
                                  value={cardInfo[index]["AgentLicense"]}
                                  placeholder="Agent License Number"
                                  onChangeText={(Text) => {
                                    handleCardChange(
                                      index,
                                      "AgentLicense",
                                      Text
                                    );
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
                                { width: "64%" },
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
                                { width: "34%", marginLeft: 9 },
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
                          <View
                            style={[styles["card-body"], { paddingTop: 0 }]}
                          >
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            >
                              <InputField
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ] !== undefined
                                    ? saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["CompPhone"]
                                    : false
                                }
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
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                              ]}
                            ></View>

                            {cardInfo[index]["ContactType"] != 7 ? (
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
                            {[7, 2, 4, 17].includes(row["ContactType"]) && (
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                ]}
                              >
                                <InputField
                                  validate={
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ] !== undefined
                                      ? saveValidation[
                                          cardInfo[index]["ContactType"]
                                        ]["FileNumber"]
                                      : false
                                  }
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
                                  placeholder={
                                    row["ContactType"] === 7
                                      ? "Policy Number"
                                      : "File Number"
                                  }
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
                      {row["AgentID"] ? (
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
                      ) : (
                        <View></View>
                      )}
                      {[2, 48].includes(row["ContactType"]) && (
                        <View
                          style={[
                            styles["card-item"],
                            { flexDirection: "row", alignItems: "center" },
                          ]}
                        >
                          <CustomText
                            bold={true}
                            style={[
                              styles["card-lablebold"],
                              { color: "white" },
                            ]}
                          >
                            {`Same for${
                              row["ContactType"] === 2
                                ? ` Escrow`
                                : ` Escrow Seller`
                            }:`}
                          </CustomText>
                          <Checkbox
                            style={styles["card-checkbox"]}
                            value={copyAgent[row["ContactType"]]}
                            color={
                              copyAgent[row["ContactType"]] ? "#5e9cd3" : ""
                            }
                            onValueChange={(e) => {
                              handleChangeCheckBox(
                                row["ContactType"],
                                e,
                                index,
                                "Vendor"
                              );
                            }}
                          ></Checkbox>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles["card-footer"]}>
                      {[43, 50, 51].includes(row["ContactType"]) ? (
                        <>
                          <View></View> {/*Dummy View for spacing alignment*/}
                          <View
                            style={[
                              styles["card-item"],
                              { flexDirection: "row", alignItems: "center" },
                            ]}
                          >
                            <CustomText
                              bold={true}
                              style={[
                                styles["card-lablebold"],
                                { color: "white" },
                              ]}
                            >
                              {row["ContactType"] == 43
                                ? "Does Not Apply"
                                : "No Realtor"}
                            </CustomText>
                            <Checkbox
                              style={styles["card-checkbox"]}
                              value={copyAgent[row["ContactType"]]}
                              color={
                                copyAgent[row["ContactType"]] ? "#5e9cd3" : ""
                              }
                              onValueChange={(e) => {
                                handleChangeCheckBox(
                                  row["ContactType"],
                                  e,
                                  index,
                                  row["ContactType"] == 43
                                    ? "DoesNotApply"
                                    : "Realtor"
                                );
                              }}
                            ></Checkbox>
                          </View>
                        </>
                      ) : (
                        <View style={{ padding: 13 }}></View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ))}
            <View style={{ display: "none" }}>
              <Button onPress={handleParentWindowSave} text="test" />
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
          {/* Grids Section */}
          {handleParamFromURL(document.location.href, "ViewType") == "1" && (
            <View style={styles["table-container"]}>
              <ScrollView>
                <Table
                  borderStyle={{ borderWidth: 1, borderColor: "transparent" }}
                >
                  <Row
                    data={tabelProps.tableHead}
                    widthArr={[120, 130, 90, 110]}
                    style={[styles["table-head"], { color: "#999" }]}
                    textStyle={[styles["table-text"], { color: "#fff" }]}
                    // textStyle={[styles["table-text"], { color: "#fff" }]}
                  />

                  {tabelProps.tableData.map((rowData, index) => (
                    <>
                      {([9, 19].includes(rowData["ContactType"]) &&
                        queryString["IsEditRights"] == 1) ||
                      ![9, 19].includes(rowData["ContactType"]) ? (
                        <TableWrapper
                          key={index - 1}
                          style={[
                            styles["table-row"],
                            {
                              backgroundColor:
                                index % 2 == 0 ? "#d9ecff" : "#fff",
                              zIndex: rowData["ContactType"] === 3 ? null : -1,
                            },
                          ]}
                        >
                          {tabelProps.IsShowSearch &&
                          rowData["ContactType"] === 3 ? (
                            <Cell
                              width={340}
                              key={"cell1"}
                              data={[
                                <View
                                  style={[
                                    Platform.OS !== "web" && {
                                      flexDirection: "row",
                                    },
                                    { width: 320 },
                                  ]}
                                >
                                  <InputField
                                    value={
                                      AutoCinput[rowData["ContactType"]] || ""
                                    }
                                    label=""
                                    type="default"
                                    name="EmailorCellPhone"
                                    onChangeText={(text) => {
                                      handleCompanySearch(
                                        text,
                                        rowData["ContactType"],
                                        "V"
                                      );
                                    }}
                                    onKeyPress={(event) => {
                                      fnFocusInput(event);
                                    }}
                                    placeholder="Search for Appraisal"
                                  />
                                  <CustomText
                                    style={{
                                      position: "absolute",
                                      right: 0,
                                      top: 20,
                                    }}
                                  >
                                    {otherProps[rowData["ContactType"]] && (
                                      <View style={{ right: 30 }}>
                                        <ArrowSpinner />
                                      </View>
                                    )}
                                    {!validation[rowData["ContactType"]] && (
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
                                        onPress={(event) => {
                                          setTableProps({
                                            ...tabelProps,
                                            IsShowSearch: false,
                                          });
                                        }}
                                      />
                                    )}
                                  </CustomText>
                                  {/* {AutoCompdata[e["ContactType"]] && ( */}
                                  <FlatList
                                    style={styles["search-drop-down"]}
                                    data={AutoCompdata[rowData["ContactType"]]}
                                    showsVerticalScrollIndicator={true}
                                    removeClippedSubviews={true}
                                    ref={flatListRef}
                                    renderItem={({ item, index: i }) => (
                                      <Pressable
                                        // ref={btnAddNewRef}
                                        ref={(ref) => setListRef(i, ref)}
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
                                          isHovered && styles["HoverBgColor"],
                                        ]}
                                        onPress={(e) => {
                                          handleOnkeyPressFlatlist(
                                            AutoCompdata[
                                              rowData["ContactType"]
                                            ][selectedItemIndex],
                                            index
                                          );
                                        }}
                                      >
                                        <View>
                                          {handleTypeaheadOption(item, 1)}
                                        </View>
                                      </Pressable>
                                    )}
                                    keyExtractor={(item) => item.id}
                                  />
                                  {/* )} */}
                                </View>,
                              ]}
                            />
                          ) : (
                            <Cell
                              width={120}
                              key={"cell1"}
                              data={[
                                <View>
                                  {rowData["ContactType"] === 3 ? (
                                    <>
                                      <CustomText
                                        bold={true}
                                        style={{
                                          fontSize: 12,
                                          color: "#4b545d",
                                        }}
                                      >
                                        {rowData.ContactTypename}:
                                      </CustomText>
                                      <CustomText
                                        style={[
                                          styles["card-text-underline"],
                                          { fontSize: 12 },
                                        ]}
                                        onPress={(e) =>
                                          handleWebPageOpen(
                                            rowData["VendorId"],
                                            Platform.OS === "web" &&
                                              handleParamFromURL(
                                                document.location.href,
                                                "SessionId"
                                              ),
                                            "http://www.solutioncenter.biz/VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_bootstrap.aspx?SessionId="
                                          )
                                        }
                                      >
                                        {rowData.AgentFN}
                                      </CustomText>
                                      <CustomText
                                        style={{
                                          position: "absolute",
                                          right: -27,
                                          top: 0,
                                        }}
                                      >
                                        {otherProps[rowData["ContactType"]] && (
                                          <View style={{ right: 30 }}>
                                            <ArrowSpinner />
                                          </View>
                                        )}
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
                                          onPress={(event) => {
                                            setTableProps({
                                              ...tabelProps,
                                              IsShowSearch: true,
                                            });
                                          }}
                                        />
                                      </CustomText>
                                    </>
                                  ) : (
                                    <CustomText
                                      style={{ fontSize: 12, color: "#6c757d" }}
                                    >
                                      {rowData.ContactTypename}
                                    </CustomText>
                                  )}
                                </View>,
                              ]}
                            />
                          )}

                          <Cell
                            style={{
                              display:
                                tabelProps.IsShowSearch &&
                                rowData["ContactType"] === 3
                                  ? "none"
                                  : "block",
                            }}
                            width={130}
                            data={[
                              <View>
                                <CustomText
                                  style={{ fontSize: 12, color: "#6c757d" }}
                                >
                                  {rowData.Companyname}
                                </CustomText>
                                <CustomText
                                  style={{ flexDirection: "row", fontSize: 12 }}
                                >
                                  {[1, 17].includes(rowData["ContactType"]) && (
                                    <View style={{ flexDirection: "row" }}>
                                      <CustomText
                                        bold={true}
                                        style={{
                                          fontSize: 12,
                                          color: "#4b545d",
                                        }}
                                      >
                                        {"Expiration: "}
                                      </CustomText>
                                      <CustomText
                                        style={{
                                          fontSize: 12,
                                          color: "#6c757d",
                                        }}
                                      >
                                        {"01/01/2200"}
                                      </CustomText>
                                    </View>
                                  )}
                                  {[17].includes(rowData["ContactType"]) && (
                                    <View>
                                      <CustomText
                                        bold={true}
                                        style={{
                                          fontSize: 12,
                                          color: "#4b545d",
                                        }}
                                      >
                                        {"Agent Expiration: "}
                                      </CustomText>
                                      <CustomText
                                        style={{
                                          fontSize: 12,
                                          color: "#6c757d",
                                        }}
                                      >
                                        {"01/01/2200"}
                                      </CustomText>
                                    </View>
                                  )}
                                </CustomText>
                              </View>,
                            ]}
                            // textStyle={styles["table-text"]}
                          />
                          <Cell
                            style={{
                              display:
                                tabelProps.IsShowSearch &&
                                rowData["ContactType"] === 3
                                  ? "none"
                                  : "block",
                            }}
                            width={90}
                            key={"cell3"}
                            data={
                              rowData["ContactType"] === 1 && (
                                <CustomText
                                  style={{ fontSize: 12, color: "green" }}
                                >
                                  {"Approved"}
                                </CustomText>
                              )
                            }
                            // textStyle={styles["table-text"]}
                          />
                          <Cell
                            width={96}
                            key={"cell5"}
                            data={
                              <>
                                {[17, 27, 22].includes(
                                  rowData["ContactType"]
                                ) ? (
                                  <View>
                                    <InputField
                                      //autoFocus
                                      validate={
                                        rowData.FileNumber.length === 0
                                          ? true
                                          : false
                                      }
                                      type="default"
                                      value={rowData.FileNumber}
                                      placeholder="File #"
                                      style={[
                                        styles["grid-input"],
                                        { outline: "none" },
                                      ]}
                                      onChangeText={(Text) => {
                                        handleGridChange(
                                          index,
                                          "FileNumber",
                                          Text,
                                          "Grid"
                                        );
                                      }}
                                    />
                                  </View>
                                ) : rowData["ContactType"] == 19 ? (
                                  <TouchableOpacity
                                    // onPress={(e) => {
                                    //   handleCompanyChange(
                                    //     row["ContactType"]
                                    //   );
                                    // }}
                                    style={[styles.buttonContainer]}
                                  >
                                    <CustomText
                                      style={[
                                        styles["btn"],
                                        { alignSelf: "center" },
                                      ]}
                                    >
                                      {"Change"}
                                    </CustomText>
                                  </TouchableOpacity>
                                ) : (
                                  <CustomText
                                    style={{ fontSize: 12, color: "#6c757d" }}
                                  >
                                    {rowData.FileNumber}
                                  </CustomText>
                                )}
                              </>
                            }
                          />
                        </TableWrapper>
                      ) : null}
                    </>
                  ))}
                  {/* </Table>
            </View> */}
                </Table>
              </ScrollView>
            </View>
          )}
          {/* Modal Section */}
          <View style={{ alignItems: "center" }}>
            {/* Seller Modal */}
            <Modal
              isVisible={isModalVisible.Seller}
              onBackdropPress={() => {
                setModalVisible({ isModalVisible, Seller: false });
                fnShowAddNew(0);
                setInput({ 0: "" });
              }}
              style={{
                backgroundColor: "#fff",
                maxWidth: Platform.OS === "web" ? "1000px" : null,
                minWidth: Platform.OS === "web" ? "450px" : null,
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
                    fnShowAddNew(0);
                  }}
                />
              </View>
              <View style={styles["modal-container"]}>
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: "transparent",
                    maxWidth: 430,
                  }}
                >
                  <Row
                    data={sellerTabelProps.tableHead}
                    //flexArr={[1, 1, 1, 1]}
                    widthArr={[90, 90, 90, 90, 70]}
                    style={[styles["table-head"], { color: "#999" }]}
                    textStyle={[styles["table-text"], { color: "#fff" }]}
                  />

                  {sellerInfo.RowData?.map((rowData, index) => (
                    <>
                      {/* {sellerTabelProps["EditRow"][index] !== true && ( */}
                      <TableWrapper
                        key={index - 1}
                        style={[
                          styles["table-row"],
                          sellerTabelProps["EditRow"][index] === true && [
                            styles["card-body"],
                            { gap: 2 },
                          ],
                          {
                            backgroundColor:
                              index % 2 == 0 ? "#d9ecff" : "#fff",
                            maxWidth: 430,
                          },
                        ]}
                      >
                        {sellerTabelProps["EditRow"][index] !== true ? (
                          <>
                            <Cell
                              width={90}
                              key={"cell1"}
                              data={[
                                <CustomText
                                  style={{ fontSize: 12, color: "#4b545d" }}
                                >
                                  {`${rowData.FirstName} ${rowData.LastName}`}
                                </CustomText>,
                              ]}
                            />
                            <Cell
                              width={90}
                              key={"cell2"}
                              data={[
                                <CustomText
                                  style={{ fontSize: 12, color: "#4b545d" }}
                                >
                                  {rowData.Companyname}
                                </CustomText>,
                              ]}
                            />

                            <Cell
                              width={90}
                              key={"cell3"}
                              data={[
                                <CustomText
                                  style={{ fontSize: 12, color: "#4b545d" }}
                                >
                                  {rowData.Phone}
                                </CustomText>,
                              ]}
                            />
                            <Cell
                              key={"cell4"}
                              width={90}
                              data={[
                                <CustomText
                                  style={{ fontSize: 12, color: "#4b545d" }}
                                >
                                  {rowData.AgentEmail}
                                </CustomText>,
                              ]}
                            />
                          </>
                        ) : (
                          <>
                            <Cell
                              width={225}
                              key={"cell1"}
                              data={[
                                <View style={styles["card-input"]}>
                                  <InputField
                                    // autoFocus
                                    type="default"
                                    value={
                                      sellerTabelProps["ModifiedJson"][index]
                                        .FirstName
                                    }
                                    label="Agent First Name"
                                    placeholder="Agent First Name"
                                    // style={[
                                    //   styles["grid-input"],
                                    //   { outline: "none" },
                                    // ]}
                                    onChangeText={(Text) => {
                                      handleGridChange(
                                        index,
                                        "FirstName",
                                        Text
                                      );
                                    }}
                                  />
                                </View>,
                              ]}
                            ></Cell>

                            <Cell
                              width={225}
                              key={"cell2"}
                              data={[
                                <View style={styles["card-input"]}>
                                  <InputField
                                    //autoFocus
                                    type="default"
                                    label="Agent Last Name"
                                    value={
                                      sellerTabelProps["ModifiedJson"][index]
                                        .LastName
                                    }
                                    placeholder="Agent Last Name"
                                    // style={[
                                    //   styles["grid-input"],
                                    //   { outline: "none", display: "block" },
                                    // ]}
                                    onChangeText={(Text) => {
                                      handleGridChange(index, "LastName", Text);
                                    }}
                                  />
                                </View>,
                              ]}
                            ></Cell>
                            <Cell
                              width={225}
                              key={"cell3"}
                              data={[
                                <View style={styles["card-input"]}>
                                  <InputField
                                    //autoFocus
                                    type="default"
                                    label="Entity Name"
                                    value={
                                      sellerTabelProps["ModifiedJson"][index]
                                        .Companyname
                                    }
                                    placeholder="Entity Name"
                                    onChangeText={(Text) => {
                                      handleGridChange(
                                        index,
                                        "Companyname",
                                        Text
                                      );
                                    }}
                                    // style={[
                                    //   styles["grid-input"],
                                    //   { outline: "none" },
                                    // ]}
                                  />
                                </View>,
                              ]}
                            ></Cell>
                            <Cell
                              width={225}
                              key={"cell4"}
                              data={[
                                <View style={styles["card-input"]}>
                                  <InputField
                                    //autoFocus
                                    type="default"
                                    label="Agent Cell Phone"
                                    value={
                                      sellerTabelProps["ModifiedJson"][index]
                                        .Phone
                                    }
                                    placeholder="Agent Cell Phone"
                                    onChangeText={(Text) => {
                                      handleGridChange(index, "Phone", Text);
                                    }}
                                    onBlur={(e) => {
                                      let number = FormatPhoneLogin(
                                        sellerTabelProps["ModifiedJson"][index]
                                          .Phone
                                      );
                                      handleGridChange(index, "Phone", number);
                                    }}
                                    // style={[
                                    //   styles["grid-input"],
                                    //   { outline: "none" },
                                    // ]}
                                  />
                                </View>,
                              ]}
                            ></Cell>
                            <Cell
                              width={225}
                              key={"cell5"}
                              data={[
                                <View style={styles["card-input"]}>
                                  <InputField
                                    //autoFocus
                                    type="default"
                                    value={
                                      sellerTabelProps["ModifiedJson"][index]
                                        .AgentEmail
                                    }
                                    label="Agent Email"
                                    placeholder="Agent Email"
                                    onChangeText={(Text) => {
                                      handleGridChange(
                                        index,
                                        "AgentEmail",
                                        Text
                                      );
                                    }}
                                    // style={[
                                    //   styles["grid-input"],
                                    //   { outline: "none" },
                                    // ]}
                                  />
                                </View>,
                              ]}
                            ></Cell>
                          </>
                        )}

                        {/* Buttons */}
                        {sellerTabelProps["EditRow"][index] !== true ? (
                          <>
                            <Cell
                              //width={50}
                              style={{ alignSelf: "center" }}
                              data={[
                                <View>
                                  <TouchableOpacity
                                    style={[
                                      [styles.buttonContainer],
                                      { alignSelf: "center" },
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
                                        {
                                          fontSize: 10,
                                          minWidth: 36,
                                          maxWidth: 36,
                                        },
                                      ]}
                                    >
                                      {"Edit"}
                                    </CustomText>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      [styles.buttonContainer],
                                      { alignSelf: "center" },
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
                                  </TouchableOpacity>
                                </View>,
                              ]}
                            />
                            {/* <Cell
                              //width={50}
                              style={{ alignSelf: "center" }}
                              data={[
                                <TouchableOpacity
                                  style={[
                                    [styles.buttonContainer],
                                    { alignSelf: "center" },
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
                            />*/}
                          </>
                        ) : (
                          <>
                            <Cell
                              style={{ alignSelf: "center" }}
                              data={[
                                <View style={{ flexDirection: "row" }}>
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
                                        {
                                          fontSize: 10,
                                          minWidth: 45,
                                          maxWidth: 45,
                                        },
                                      ]}
                                    >
                                      {"Save"}
                                    </CustomText>
                                  </TouchableOpacity>
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
                                        {
                                          fontSize: 10,
                                          minWidth: 45,
                                          maxWidth: 45,
                                        },
                                      ]}
                                    >
                                      {"Cancel"}
                                    </CustomText>
                                  </TouchableOpacity>
                                  ,
                                </View>,
                              ]}
                            />
                            {/* <Cell
                              style={{ alignSelf: "center" }}
                              data={[
                                
                              ]}
                            /> */}
                          </>
                        )}
                      </TableWrapper>
                      {/* )} */}
                      {/* {sellerTabelProps["EditRow"][index] == true && (
                        <TableWrapper>
                          <Cell width={200} key={"cell1"}>
                            <View style={{ maxWidth: "100%" }}>
                              <InputField
                                // autoFocus
                                type="default"
                                value={
                                  sellerTabelProps["ModifiedJson"][index]
                                    .FirstName
                                }
                                label="Agent First Name"
                                placeholder="Agent First Name"
                                style={[
                                  styles["grid-input"],
                                  { outline: "none" },
                                ]}
                                onChangeText={(Text) => {
                                  handleGridChange(index, "FirstName", Text);
                                }}
                              />
                            </View>
                          </Cell>
                          <Cell width={200} key={"cell1"}>
                            <View style={{ maxWidth: "100%" }}>
                              <InputField
                                // autoFocus
                                type="default"
                                value={
                                  sellerTabelProps["ModifiedJson"][index]
                                    .FirstName
                                }
                                label="Agent First Name"
                                placeholder="Agent First Name"
                                style={[
                                  styles["grid-input"],
                                  { outline: "none" },
                                ]}
                                onChangeText={(Text) => {
                                  handleGridChange(index, "FirstName", Text);
                                }}
                              />
                            </View>
                          </Cell>
                          <Cell width={200} key={"cell1"}>
                            <View style={{ maxWidth: "100%" }}>
                              <InputField
                                // autoFocus
                                type="default"
                                value={
                                  sellerTabelProps["ModifiedJson"][index]
                                    .FirstName
                                }
                                label="Agent First Name"
                                placeholder="Agent First Name"
                                style={[
                                  styles["grid-input"],
                                  { outline: "none" },
                                ]}
                                onChangeText={(Text) => {
                                  handleGridChange(index, "FirstName", Text);
                                }}
                              />
                            </View>
                          </Cell>
                        </TableWrapper>
                      )} */}
                    </>
                  ))}
                  {/* {sellerInfo.RowData.length == 0 &&
                  <TableWrapper
                    key={ - 1}
                    style={[
                      styles["table-row"],
                      {
                        backgroundColor: "#fff",
                      },
                    ]}
                  >
                    <Cell
                      width={500}
                      key={"cell1"}
                      data={[
                        <CustomText style={{ fontSize: 12, color: "#4b545d" }}>
                          {"No records found"}
                        </CustomText>,
                      ]}
                    />
                  </TableWrapper>
} */}
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
                          handleCompanySearch(text, "0", "S");
                        }}
                        onKeyPress={(event) => {
                          setSelectedItemIndex(-1);
                          fnFocusInput(event);
                        }}
                        onBlur={(e) => {
                          fnShowAddNew(0, "Hide");
                        }}
                        onFocus={(e) => {
                          fnShowAddNew(0, "Show");
                        }}
                        placeholder="Search for Company or Seller Name, Email or Cell Phone"
                      />
                      <CustomText
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 35,
                        }}
                      >
                        {otherProps["0"] && (
                          <View style={{ right: 30 }}>
                            <ArrowSpinner />
                          </View>
                        )}
                        {/* {!validation["0"] && (
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
                            onPress={(event) => {
                              handleCloseEditCompany({ ContactType: 0 });
                            }}
                          />
                        )} */}
                      </CustomText>
                      {AutoCompdata["0"] && isModalVisible.Seller && (
                        <FlatList
                          style={styles["search-drop-down"]}
                          data={AutoCompdata["0"]}
                          showsVerticalScrollIndicator={true}
                          removeClippedSubviews={true}
                          ref={flatListRef}
                          renderItem={({ item, index: i }) => (
                            <Pressable
                              // ref={btnAddNewRef}
                              ref={(ref) => setListRef(i, ref)}
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
                                isHovered && styles["HoverBgColor"],
                              ]}
                              onPress={(e) => {
                                handleOnkeyPressFlatlist(
                                  AutoCompdata["0"][selectedItemIndex],
                                  1
                                );
                              }}
                            >
                              <View>{handleTypeaheadOption(item, 1)}</View>
                            </Pressable>
                          )}
                          keyExtractor={(item) => item.id}
                        />
                      )}
                    </View>
                  </View>
                </Table>
              </View>
              <View style={[styles["modal-footer"], { zIndex: -1 }]}>
                <TouchableOpacity
                  style={[
                    [styles.buttonContainer],
                    { alignSelf: "center", padding: 5 },
                  ]}
                  onPress={() => {
                    setModalVisible({ isModalVisible, Seller: false });
                  }}
                >
                  <CustomText style={[styles["btn"]]}>{"Cancel"}</CustomText>
                </TouchableOpacity>
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
                    Would you like to use the same
                    {isModalVisible.AgentType == 2 &&
                      `Title and Escrow Agent`}{" "}
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
                      // handleIfSameTitle("", "", 0);
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
                      //handleIfSameTitle("", "", 1);
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
        </>
      )}
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
    minHeight: 37,
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
    minHeight: 37,
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
    marginTop: 30,
    margin: 10,
    backgroundColor: "#fff",
    width: Platform.OS === "web" ? "450px" : null,
    borderColor: "#9bc2e6",
    borderWidth: 1,
  },
  "table-head": {
    //height: Platform.OS === "web" ? 40 : 50,
    backgroundColor: "#428bca",
    padding: 4,
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
    margin: 30,
    maxWidth: 430,
    display: "block",
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
  "remove-card-header": {
    flexDirection: "row",
    alignItems: "center",
  },
  "card-disable": {
    backgroundColor: "#dad2d2",
    cursor: "not-allowed",
  },
});
