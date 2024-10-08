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
import Dropdown from "./controls/DropDown";
import ScrollContainer from "./controls/ScrollContainer";
import {
  handleAPI,
  FormatPhoneLogin,
  handleWebPageOpen,
  handleParamFromURL,
} from "./controls/CommonFunctions";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
export default function VendorContacts() {
  const windowWidth = useWindowDimensions().width; // Using for small screen
  const [editCard, setEditCard] = useState({}); // To check which card is enabling for editing
  const [editCompany, setEditCompany] = useState({}); // To check which card's chane company button is checked
  const [focusCompany, setfocusCompany] = useState({}); // To focus the company typeahead
  const [cardInfo, setCardInfo] = useState([]); // Final JSON for saving
  const [result, setResult] = useState([]); // API result for cards
  const [sellerInfo, setSellerInfo] = useState({}); // This will have seller info(Add additional seller, see list)
  const [isModalVisible, setModalVisible] = useState({
    Seller: false,
    Confirmation: false,
  });
  const [isModalSecHazardVisible, setModalSecHazardVisible] = useState({
    SecondaryHazard: false,
    Confirm: false,
  }); // State contains modal of the secondary hazard insurance
  const [secondaryhazardInfo, setsecondaryhazardInfo] = useState({}); //State contains secondary hazard insurance info
  const [VendorServiceRights, setVendorServiceRights] = useState(0);
  const [queryString, setQueryString] = useState({
    LoanId: "456760",
    SessionId: "{B43745A9-EE0C-4E02-A517-3B04E5F6029B}",
    IsEditRights: 0,
    Page:
      Platform.OS === "web"
        ? handleParamFromURL(document.location.href, "CurrentPage")
        : "HazardInsurancee",
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
    showWareHouseOption: false,
    NonBorroweRows: [],
  });
  const [sellerTabelProps, setSellerTabelProps] = useState({
    tableHead: [
      "First Name",
      "Last Name",
      "Entity Name",
      "Cell Phone",
      "Email",
      "",
    ],
    tableData: [],
    EditRow: [],
    ModifiedJson: [],
  });
  const [secondaryHazardTabelProps, setSecondaryHazardTabelProps] = useState({
    tableHead: [
      "First Name",
      "Last Name",
      "Entity Name",
      "Cell Phone",
      "Email",
      "",
    ],
    tableData: [],
    EditRow: [],
    ModifiedJson: [],
  });

  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [validation, setValidation] = useState({});
  const [saveValidation, setSaveValidation] = useState({});
  const [warehouse, setWareHouseList] = useState();
  const [cardValidation, setCardValidation] = useState();
  const [IsQoute, setIsQuote] = useState(false);
  const [IsSecondayHazard, setIsSecondaryHazard] = useState(true);

  const [enableGroupEmail, setEnableGroupEmail] = useState({});
  const [enableClosingAgent, setEnableClosingAgent] = useState({
    2: false,
    4: false,
    "2_Add": false,
    "4_Add": false,
  });
  const [closingAgentInfo, setClosingAgentInfo] = useState({});
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
          if (
            selectedItemIndex === 0 &&
            // ![3, 52].includes(Object.keys(AutoCompdata)[0])
            Object.keys(AutoCompdata)[0] != 3 && // Appraiser
            Object.keys(AutoCompdata)[0] != 52 && // Notary
            Object.keys(AutoCompdata)[0] != 56 // Condo PUD
          ) {
            handleAddNew(
              AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex]
            );
          } else {
            if (Object.keys(AutoCompdata)[0] == 0) {
              handleSellerSelection(AutoCompdata["0"][selectedItemIndex]); // Seller selection
            }
            if (Object.keys(AutoCompdata)[0] == 57) {
              handleSecondaryHazardSelection(
                AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex]
              ); // Secondary hazard selection
            } else if (Object.keys(AutoCompdata)[0] == 60) {
              handleClosingAgentSelection(
                "",
                selectedItemIndex,
                AutoCompdata["60"][0]["ContactType"]
              );
            } else {
              handleCompanySelection(
                AutoCompdata[Object.keys(AutoCompdata)[0]][selectedItemIndex],
                index,
                0
              ); // Company selection
            }
          }
        } else {
          if (!e.ctrlKey && e.key !== "f") e.preventDefault();
        }
        if (!e.ctrlKey && e.key !== "r") e.preventDefault();
      };

      const handleWindowClick = (e) => {
        if (e.target.placeholder === undefined)
          fnShowAddNew(Object.keys(AutoCompdata)[0], "Close");
      };
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleWindowClick);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("click", handleWindowClick);
      };
    }, [selectedItemIndex, otherProps]);

    useEffect(() => {
      const SearchURL = window.location.search;
      const searchParams = new URLSearchParams(SearchURL);
      setQueryString({
        ...queryString,
        LoanId: handleParamFromURL(document.location.href, "LoanId"), // searchParams.get("LoanId"), //handleParamFromURL(document.location.href, "LoanId"),
        SessionId: handleParamFromURL(document.location.href, "SessionId"), //searchParams.get("SessionId"), //handleParamFromURL(document.location.href, "SessionId"),
        Page: handleParamFromURL(document.location.href, "CurrentPage"), // searchParams.get("CurrentPage"), //handleParamFromURL(document.location.href, "SessionId"),
      });
      if (window.parent != window) {
        var parentElLoader = window.parent.document.getElementById("divLoader");
        //parentElLoader.style.display = "none";
        // setint(() => {
        //   parentElLoader.style.display = "none";
        // }, 100);
        setInterval(() => {
          if (parentElLoader.style.display === "block")
            parentElLoader.style.display = "none";
        }, 1000);
      }
      //searchParams.get("SessionId")
      handleAPI({
        name: "GetUsersDetails",
        params: { SessionId: searchParams.get("SessionId") }, //queryString["SessionId"] },
        method: "POST",
      })
        .then((response) => {
          console.log("Session ===>", response);
          response = response.split("~");
          let UserId = response[0];
          let IsEditRights = response[3];
          let SignOffLevel = response[4];
          setQueryString({
            ...queryString,
            IsEditRights: IsEditRights,
            EmpNum: UserId,
            SignOffLevel,
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
            GetVendorServiceRights(UserId);
            handlePageLoad();
            GetWareHouseList();
          }
        })
        .catch((e) => console.log("Get Session Info => ", e));
    }, []);
  } else {
    useEffect(() => {
      handlePageLoad();
      GetWareHouseList();
    }, []);
  }

  const handlePageLoad = () => {
    queryString["Page"] === "HazardInsurance"
      ? GetHarardInsuranceload()
      : GetVendoronload();
  };
  // API for to load data fot Cards and Grids
  const GetVendoronload = () => {
    //console.time('GetVendoronload')
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
    console.log(
      "=====================================Coming====================================="
    );

    handleAPI({
      name: "Get_VendorLoanInfo",
      params: {
        LoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        Fullrows: 1,
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd('GetVendoronload')

        let Data = JSON.parse(response);
        //let Data = Rows;
        console.log("Whole Info ==>", Data);
        let Closer =
            Data.find((e) => e["ContactType"] == 60 && e["AgentID"] > 0) || {},
          iCloser = {},
          titleColser = false,
          escrowCloser = false;
        let { FirstName, LastName, Phone, AgentEmail, VendorId, AgentID } =
          Closer;
        iCloser = {
          FirstName,
          LastName,
          Phone,
          VendorId,
          AgentId: AgentID,
          Email: AgentEmail,
        };
        if (
          (Data?.find((e) => e["ContactType"] == 2)?.["VendorId"] || "") ==
          iCloser?.["VendorId"]
        )
          titleColser = true;
        if (
          (Data?.find((e) => e["ContactType"] == 4)?.["VendorId"] || "") ==
          iCloser?.["VendorId"]
        )
          escrowCloser = true;
      
        let UWStatus = "";
        let sellerData = Data.filter((e) => e.ContactType === 0);
        if (sellerData.length == 1 && sellerData[0].AgentID == 0) {
          UWStatus = sellerData[0]["UWStatus"];
          sellerData = [];
        }
        setSellerInfo({ ...sellerInfo, RowData: sellerData });
        setSellerTabelProps({
          ...sellerTabelProps,
          ["ModifiedJson"]: sellerData,
        });
        console.log("Seller Info ==>", sellerData);
        const CardResult = Data.filter((e) => e.isCard === 1);
        const GridData = Data.filter((e) => e.isCard !== 1);

        //Filter the Secondary hazard insurance by contact type 57
        let secondaryhazardData = Data.filter(
          (e) => e.ContactType === 57 && e.AgentID != "" && e.AgentID != 0
        );
        // if (secondaryhazardData.length == 1 )
        // secondaryhazardData = [];
        // if(secondaryhazardData==''){
        //   secondaryhazardData.push({FirstName:"No Secondary Hazard Insurance Selected"})
        // }

        setsecondaryhazardInfo({
          ...secondaryhazardInfo,
          RowData: secondaryhazardData,
        });
        setSecondaryHazardTabelProps({
          ...secondaryHazardTabelProps,
          ["ModifiedJson"]: secondaryhazardData,
        });

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
          console.log("Card info ==>", uniqueRows);
          let cardHighlight = handleCardValidation(uniqueRows);
          if (sellerData.length == 0 && UWStatus != "New File")
            cardHighlight["0"] = true;
          if (secondaryhazardData.length == 0) cardHighlight["57"] = true;
          setCardValidation({ ...cardValidation, ...cardHighlight }); // to show the red border in the card
          
          setCopyAgent({
            2: uniqueRows[2].isEscrowSame == 0 ? false : true, // Title for borrower
            48: uniqueRows[4].isEscrowSame == 0 ? false : true, // Title for seller
            50:
              uniqueRows[6].iNoRealtorReprestation == 1 &&
              uniqueRows[6].AgentID == 0
                ? true
                : false, // Realtor for borrower
            51:
              uniqueRows[7].iNoRealtorReprestation == 1 &&
              uniqueRows[7].AgentID == 0
                ? true
                : false, // Realtor for seller
            43:
              uniqueRows[uniqueRows.length - 1].iNoRealtorReprestation == 1 &&
              uniqueRows[uniqueRows.length - 1].AgentID == 0
                ? true
                : false, // Realtor for seller
          });

          // Closer agent binding section
          if(uniqueRows[2].isEscrowSame !=1)  titleColser=false
          setEnableClosingAgent({
            ...enableClosingAgent,
            "2_Add": titleColser,
            "4_Add": escrowCloser,
          });
          setClosingAgentInfo({
            ...closingAgentInfo,
            2: titleColser ? iCloser : undefined,
            4: escrowCloser ? iCloser : undefined,
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

          //const fieldValidation = uniqueRows.filter((e) => e.FileNumber == "");
          setEditCompany(EnableSearch);
          setValidation(EnableSearch);
          setEditCard({});
          // Need to work on for validation
          let fieldValidation = handleFieldValidation(uniqueRows);

          setSaveValidation(fieldValidation); // To have the field level validation

          setCardInfo(uniqueRows);
          setResult(uniqueRows);
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
          const NotaryRow = GridData.filter((e) => e["ContactType"] === 52);
          const CondoPUDRow = GridData.filter((e) => e["ContactType"] === 56);
          //console.log("Full grid row === >", GridData);
          const AppraiserRows = GridData.filter((e) => e["ContactType"] === 3);
          const NonBorroweRows = GridData.filter(
            (e) => e["ContactType"] === 999
          );
          const OrderedObject = fnChangeArrOfObjectOrder(GridData);

          setTableProps({
            ...tabelProps,
            tableData: OrderedObject,
            ModifiedJson: OrderedObject,
            AppraiserRows: AppraiserRows,
            NonBorroweRows: NonBorroweRows,
            // IsShowAppraiserSearch: AppraiserRows[0]
            //   ? AppraiserRows[0].AgentID == 0
            //     ? true
            //     : false
            //   : true,
            // IsShowNotarySearch: NotaryRow[0]
            //   ? NotaryRow[0].AgentID == 0
            //     ? true
            //     : false
            //   : true,
            // IsShowCondoPUDSearch: CondoPUDRow[0]
            //   ? CondoPUDRow[0].AgentID == 0
            //     ? true
            //     : false
            //   : true,
          });
          console.log("Grid info ==>", OrderedObject);
          //setGridResult(GridData);
        }
      })
      .catch((e) => console.log("Get API => ", e));
    // setCardInfo(rows); // Testing purpose
  };
  const GetHarardInsuranceload = () => {
    handleQuoteLabel();
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
      name: "Get_VendorLoanInfo_Type",
      params: {
        LoanId:
          Platform.OS === "web" ? sParams.get("LoanId") : queryString["LoanId"],
        Type: "7",
        Fullrows: 1,
      },
      method: "POST",
    })
      .then((response) => {
        let Data = JSON.parse(response);
        const CardResult = Data.filter((e) => e.isCard === 1);
        //const GridData = Data.filter((e) => e.isCard !== 1);

        if (CardResult.length) {
          let CardData = CardResult;

          let uniqueRows = getUniqueObjectsByKey(CardData, "ContactTypename");
          console.log("Card info", uniqueRows);
          let cardHighlight = handleCardValidation(uniqueRows);
          //if (sellerData.length == 0) cardHighlight["0"] = true;
          setCardValidation({ ...cardValidation, ...cardHighlight }); // to show the red border in the card
          setCardInfo(uniqueRows);
          setResult(uniqueRows);
          setEditCard({});

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
          //const fieldValidation = uniqueRows.filter((e) => e.FileNumber == "");
          setEditCompany(EnableSearch);
          setValidation(EnableSearch);

          // Need to work on for validation
          let fieldValidation = handleFieldValidation(uniqueRows);

          setSaveValidation(fieldValidation); // To have the field level validation
        }
      })
      .catch((e) => console.log("Get API => ", e));
    // setCardInfo(rows); // Testing purpose
  };
  //Get warehouse list details
  const GetWareHouseList = () => {
    handleAPI({
      name: "GetWarehouseBankList",
      params: {},
      method: "POST",
    })
      .then((response) => {
        let Data = JSON.parse(response);
        setWareHouseList(Data);
      })
      .catch((e) => console.log("GetWarehouseBankList API => ", e));
  };
  //To change the Quote button label
  const handleQuoteLabel = () => {
    handleAPI({
      name: "GetMaticData",
      params: {
        LoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
      },
      method: "POST",
    })
      .then((response) => {
        let Data = JSON.parse(response);
        let IsQuoteAvailable = Data["Table"].some((e) => e.isQuoteavail == 1);
        setIsQuote(IsQuoteAvailable);
        console.log("GetMaticData ==>", Data);
      })
      .catch((e) => console.log("GetMaticData API => ", e));
  };
  // To focus the input when scroll up/down
  const fnFocusInput = (e) => {
    if (e.key === "ArrowDown") {
      if (AutoCompdata[Object.keys(AutoCompdata)[0]].length > 1) {
        setSelectedItemIndex(0);
        setTimeout(() => {
          if (btnAddNewRef.current) {
            btnAddNewRef.current[0].focus(); //This fixes the Scroll happening from bottom to add new
          }
        }, 0);
        flatListRef.current.scrollToItem({
          animated: true,
          item: AutoCompdata[Object.keys(AutoCompdata)[0]][
            selectedItemIndex + 1
          ],
          viewPosition: 0.5,
        });
      }
    }
  };
  //Carries all the fields from the card
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
            : queryString["LoanId"],
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
    //  if (name === "FileNumber") {
    if (value.trim().length === 0) {
      if ([48, 49].includes(ContactType) && name === "FileNumber") {
        return;
      }
      setSaveValidation({
        ...saveValidation,
        [ContactType]: {
          ...saveValidation[ContactType],
          [name]: value.trim().length === 0 ? true : fasle,
        },
      });
    }
    // }
    //   setOtherProps({
    //     ...otherProps,
    //     [`textSelection-${index}`]: true,
    //     [`showSavebtn-${index}`]: true,
    //   });
    // } else {
    setOtherProps({ ...otherProps, [`textSelection-${index}`]: true });
    // }
  };
  //To get auto populate state/city when enters Zip code
  const fnAutoPopulateStateCity = (value, index, Type) => {
    handleAPI({
      name: "GetZipCodeInfo",
      params: {
        zipcode: value,
      },
      method: "POST",
    })
      .then((response) => {
        const result = JSON.parse(response);
        const { city, state } = result[0];
        if (Type === "Seller") {
          setSellerTabelProps((prevState) => {
            const modifiedJson = [...prevState.ModifiedJson];
            modifiedJson[index] = {
              ...modifiedJson[index],
              ["CompanyCity"]: city,
              ["CompanyState"]: state,
              IsModified: 1,
              IsNew: 0,
            };
            return {
              ...prevState,
              ModifiedJson: modifiedJson,
            };
          });
        } else if (Type === "SecondaryHazard") {
          setSecondaryHazardTabelProps((prevState) => {
            const modifiedJson = [...prevState.ModifiedJson];
            modifiedJson[index] = {
              ...modifiedJson[index],
              ["CompanyCity"]: city,
              ["CompanyState"]: state,
              IsModified: 1,
            };
            return {
              ...prevState,
              ModifiedJson: modifiedJson,
            };
          });
        } else {
          setCardInfo((PrevObj) => {
            const updateObj = [...PrevObj];
            updateObj[index] = {
              ...PrevObj[index],
              ["CompanyCity"]: city,
              ["CompanyState"]: state,
              IsModified: 1,
            };
            return updateObj;
          });
        }
        console.log("auto populate result ==>", response);
      })
      .catch((e) => console.log("While auto populate  => ", e));
  };
  //Inditual card save
  const handleVendorSave = (index, TypeName) => {
    //console.time("handleVendorSave");
    console.log("vendor card info ==>", cardInfo[index]);
    //For validation
    let mandatoryFields = [];
    let finalJson = [];
    let isBlockSave = false;
    if (TypeName !== "Seller" && TypeName !== "SecondaryHazard") {
      mandatoryFields = [
        "Companyname",
        "FirstName",
        "LastName",
        //"AgentEmail",
        //"CompPhone",
        // "Phone",
        //"FileNumber",
      ];

      const { ContactType } = cardInfo[index];
      // setSaveValidation((PrevObj) => {
      //   const updateObj = { ...(PrevObj || {}) };
      //   updateObj[ContactType] = {};

      mandatoryFields.forEach((key) => {
        if (!cardInfo[index][key]) {
          isBlockSave = true;
        }
      });
      //   return updateObj;
      // });
      finalJson = cardInfo.filter((e, i) => i == index);
      let fieldValidation = handleFieldValidation(finalJson);
      setSaveValidation({ ...saveValidation, ...fieldValidation });
      let cardHighlight = handleCardValidation(finalJson);
      setCardValidation({ ...cardValidation, ...cardHighlight });
    } else if (TypeName === "SecondaryHazard") {
      finalJson = secondaryHazardTabelProps["ModifiedJson"].filter(
        (e, i) => i == index
      );
      mandatoryFields = [
        "Companyname",
        "FirstName",
        "LastName",
        // "AgentEmail",
        // "CompanyStreetAddr",
        // "CompanyZip",
        // "CompanyCity",
        // "CompanyState",
        // "CompPhone",
        //  "Phone",
        // "FileNumber",
      ];
      mandatoryFields.forEach((key) => {
        if (secondaryHazardTabelProps["ModifiedJson"][index][key] === "") {
          isBlockSave = true;
        }
      });
    } else {
      finalJson = sellerTabelProps["ModifiedJson"].filter((e, i) => i == index);
    }
    if (isBlockSave) return; // To block when only the company name is empty
    //setOtherProps({ ...otherProps, [`showSavebtn-${index}`]: false });

    if (TypeName !== "Seller" && TypeName !== "SecondaryHazard") {
      setEditCard({
        ...editCard,
        [finalJson[0]["ContactType"]]: false,
      });
      setEditCompany({
        ...editCompany,
        [finalJson[0]["ContactType"]]: false,
      });

      let Nickname = finalJson[0].Nickname
        ? finalJson[0].Nickname.length > 1
          ? finalJson[0].Nickname
          : ""
        : "";
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
          ["VendorId"]: finalJson[0].VendorId,
          ["FirstName"]: finalJson[0].FirstName,
          ["Nickname"]: finalJson[0].Nickname,
          ["LastName"]: finalJson[0].LastName,
          ["isCard"]: finalJson[0].isCard,
          ["isEscrowSame"]: finalJson[0].isEscrowSame,
          ["FileNumber"]: finalJson[0].FileNumber,
          ["GroupEmail"]: finalJson[0].GroupEmail,
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
            ["VendorId"]: finalJson[0].VendorId,
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
            ["FileNumber"]: finalJson[0].FileNumber,
            ["GroupEmail"]: finalJson[0].GroupEmail,
          };
        }
        return updateObj;
      });
      //setCardValidation(...cardValidation,...handleCardValidation(modified))
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
            ["VendorId"]: finalJson[0].VendorId,
            ["FirstName"]: finalJson[0].FirstName,
            ["Nickname"]: finalJson[0].Nickname,
            ["LastName"]: finalJson[0].LastName,
            ["isCard"]: finalJson[0].isCard,
            ["GroupEmail"]: finalJson[0].GroupEmail,
          };
          return updateObj;
        });
      }
    } else if (TypeName === "SecondaryHazard") {
      let newSecHazardRowData = [];
      setsecondaryhazardInfo((prevState) => {
        newSecHazardRowData = [...prevState.RowData];
        newSecHazardRowData[index] = finalJson[0];
        newSecHazardRowData[index].AgentID = -1;
        return { ...prevState, RowData: newSecHazardRowData };
      });
      setSecondaryHazardTabelProps((prevState) => {
        newSecHazardRowData = [...prevState.ModifiedJson];
        newSecHazardRowData[index] = finalJson[0];
        newSecHazardRowData[index].AgentID = -1;
        return { ...prevState, ModifiedJson: newSecHazardRowData };
      });
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
    console.log("Individual save initiated" + finalJson);
    let JsonData = JSON.stringify(finalJson)
      .replaceAll("#", "|H|")
      .replaceAll("&", "|A|");
    handleAPI({
      name: "Save_VendorLoanInfo_API", //"Save_VendorLoanInfo",
      params: {
        SessionID:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "SessionId")
            : queryString["SessionId"],
        SaveJson: JsonData,
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd("handleVendorSave");

        const { SaveStatus, AgentId, VendorId } = JSON.parse(response)[0];
        console.log("Add new ==>", response);
        if (SaveStatus == "Completed") {
          // This part is moved to before the API request for peform
          // To handle business validation
          // console.log('SaveStatus ==> ', SaveStatus)
          if (finalJson[0]["IsNew"] === 1) {
            if (TypeName === "SecondaryHazard") {
              let newSecHazardRowData = [];
              setsecondaryhazardInfo((prevState) => {
                newSecHazardRowData = [...prevState.RowData];
                newSecHazardRowData[index] = finalJson[0];
                newSecHazardRowData[index].AgentID = AgentId;
                newSecHazardRowData[index].VendorId = VendorId;
                return { ...prevState, RowData: newSecHazardRowData };
              });
              setSecondaryHazardTabelProps((prevState) => {
                newSecHazardRowData = [...prevState.ModifiedJson];
                newSecHazardRowData[index] = finalJson[0];
                newSecHazardRowData[index].AgentID = AgentId;
                newSecHazardRowData[index].VendorId = VendorId;
                return { ...prevState, ModifiedJson: newSecHazardRowData };
              });
              // setsecondaryhazardInfo((PrevObj) => {
              //   const updateObj = [...PrevObj.RowData];
              //   updateObj[index] = {
              //     ...PrevObj.RowData[index],
              //     ["VendorId"]: VendorId,
              //     ["AgentID"]: AgentId,
              //   };
              //   return updateObj;
              // });
              // setSecondaryHazardTabelProps((PrevObj) => {
              //   const updateObj = [...PrevObj.ModifiedJson];
              //   updateObj[index] = {
              //     ...PrevObj.ModifiedJson[index],
              //     ["VendorId"]: VendorId,
              //     ["AgentID"]: AgentId,
              //   };
              //   return updateObj;
              // });
            } else {
              setResult((PrevObj) => {
                const updateObj = [...PrevObj];
                updateObj[index] = {
                  ...PrevObj[index],
                  ["VendorId"]: VendorId,
                  ["AgentID"]: AgentId,
                };
                return updateObj;
              });
              setCardInfo((PrevObj) => {
                const updateObj = [...PrevObj];
                updateObj[index] = {
                  ...PrevObj[index],
                  ["VendorId"]: VendorId,
                  ["AgentID"]: AgentId,
                };
                return updateObj;
              });
            }

            // setTimeout(() => {
            //   handleGetVendorByType(finalJson[0]["ContactType"]);
            // }, 1500);
          }
        }
        // handleGetVendorByType(finalJson[0]["ContactType"]);
        handleBusinessValidationMessage();

        console.log("Individual save Completed");
        console.log("------------------------------------");
        //}
      })
      .catch((e) => console.log("Error While saving vendor details => ", e));
  };
  //Modal open/close
  const toggleModal = (Type) => {
    setModalVisible({ isModalVisible, [Type]: !isModalVisible[Type] });
    setData({});
    setInput({});
  };
  //Modal open/close- Secondary hazard
  const toggleSecondaryHazardModal = (Type) => {
    setModalSecHazardVisible({
      isModalSecHazardVisible,
      [Type]: !isModalSecHazardVisible[Type],
    });
    setData({});
    setInput({});
  };
  //To filter/order the objects for the grids
  const getUniqueObjectsByKey = (objects, key) => {
    try {
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
    } catch (error) {
      console.log("Error while filtering in  onload...");
    }
  };
  //Print function for hazard insurance/title for (selle and borrower)
  const fnPrintVendor = (Type) => {
    if (Platform.OS === "web") {
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
    }
  };
  //Get searching values
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
        // if(type==57)
        // {

        // }
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
          if (
            ([3, 52, 56].includes(type) && result.length === 0) ||
            result.length === 1
          ) {
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
  const handleGetClosingAgentInfo = (
    value,
    type,
    signal,
    sourceType,
    ContactType
  ) => {
    setOtherProps({
      ...otherProps,
      [type]: value.trim().length === 0 ? false : true,
    });
    handleAPI({
      name: "GetTypeaheadClosingAgentInfo",
      signal: signal,
      params: {
        matchingKey: value,
        vendorId: sourceType,
      },
      method: "POST",
    })
      .then((response) => {
        let result = [],
          formattedResult = [];
        result = JSON.parse(response);
        if (result.length) {
          setOtherProps({
            ...otherProps,
            [type]: false,
            ComponySearchCount: result.length,
          });
          //setSelectedItemIndex(0);
          let NoRow = [];
          if (result.length === 0) {
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
          for (let index = 0; index < result.length; index++) {
            const element = result[index];

            let { AgentId, Email, FirstName, LastName, Phone, VendorId } =
              element;
            if (index == 0)
              formattedResult.push({
                id: "0",
                ValType: "V",
                Type: type,
                UserType: "V",
                ActualType: type,
                ContactType: ContactType,
                label: "Add New",
                AgentCompName: "Add New  ",
              });
            formattedResult.push({
              id: AgentId,
              ValType: "V",
              Type: type,
              UserType: "V",
              ActualType: type,
              ContactType: ContactType,
              label: `${FirstName || ""} | ${LastName || ""} | ${
                Email || ""
              } | ${Phone || ""}`,
              AgentCompName: "Agentname",
            });
          }

          setData({ [type]: [...formattedResult, ...NoRow] });
          setClosingAgentInfo({ ...closingAgentInfo, RawRow: result });
          console.log("auto complete result ==>", result);
        } else {
          setOtherProps({ ...otherProps, [type]: false });

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
                ContactType: ContactType,
                label: "Add New",
                AgentCompName: "Add New  ",
              },
            ],
          });
        }
      })

      .catch((e) => console.log("While auto complete  => ", e));
  };
  //To abort the signal when key pressed before the response comes
  const handleCompanySearch = (event, type, sourceType, ContactType) => {
    //if (event.trim().length === 0) return;
    setInput({ [type]: event });
    if (apiController) {
      apiController.abort(); // Abort previous API call
    }
    const newApiController = new AbortController();
    setApiController(newApiController);
    //if (apiController)
    if (type == 60)
      handleGetClosingAgentInfo(
        event,
        type,
        newApiController.signal,
        sourceType,
        ContactType
      );
    else
      GetTypeaheadAgentInfo(event, type, newApiController.signal, sourceType);
  };
  //Searched option click
  const handleOnkeyPressFlatlist = (event, index) => {
    //function to differentiate the Enter/Space click from add new / Agent options
    if (selectedItemIndex === 0 && event.ActualType != 3) {
      handleAddNew(event);
    } else {
      if (event.ActualType == 0) {
        handleSellerSelection(event); // Seller selection
      }
      if (event.ActualType == 57) {
        handleSecondaryHazardSelection(event); // Secondary Hazard selection
      } else if (event.ActualType == 60) {
        setEnableClosingAgent((prevInfo) => {
          return {
            ...prevInfo,
            [`${index}_Add`]: false,
          };
        });
      } else {
        handleCompanySelection(event, index, 0); // Company selection selection
      }
    }
  };
  //Company selection
  const handleCompanySelection = (event, index, IsSame) => {
    //console.time('handleCompanySelection')
    handleAPI({
      name: "AddNewVendorSigner",
      params: {
        UserId: event.id,
        UserType: event.ValType,
        strSessionId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "SessionId")
            : queryString["SessionId"],
        SerCatId: event.ActualType,
        iLoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        isTitleEscSame: 0, //IsSame,
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd('handleCompanySelection')

        console.log("Company selection API result ==>", response);
        const finalJson = JSON.parse(response);
        setData({});
        setInput({});

        setEditCompany({ ...editCompany, [finalJson[0].ContactType]: false });
        setModalVisible({ isModalVisible, Confirmation: false });
        const { ContactType } = finalJson[0];

        //Closing agent removing section while company is being changed
        if (ContactType == 4) {
          setEnableClosingAgent({
            ...enableClosingAgent,
            [ContactType]: false,
            [`${ContactType}_Add`]: false,
          });
          setClosingAgentInfo({
            ...closingAgentInfo,
            [ContactType]: undefined,
          });
          handleClosingAgentSave({
            ...closingAgentInfo[ContactType], // Dummy purpose
            IsCloserNeeded: 0,
            ContactTypeId: ContactType,
          });
        }

        let Type = 0;
        if (ContactType == 4) Type = 2;
        else if (ContactType == 49) Type = 48;
        if ([43, 4, 49].includes(ContactType)) {
          setCopyAgent({
            ...copyAgent,
            [Type ? Type : ContactType]: IsSame === 1 ? true : false,
          });
        } else {
          setCopyAgent({
            ...copyAgent,
            [ContactType]: IsSame === 1 ? true : false,
          });
        }
        setTableProps({
          ...tabelProps,
          IsShowAppraiserSearch: false,
        });
        // let ContactType = event.ActualType == 2 ? 4 : 49;
        // let Index = event.ActualType == 2 ? 3 : 5;
        if ([3, 52, 56].includes(ContactType)) {
          const Index_ = fnGetIndex(ContactType, "Grid");
          if (ContactType == 3) {
            setTableProps((PrevObj) => {
              return {
                ...PrevObj,
                AppraiserRows: finalJson,
              };
            });
          } else {
            setTableProps((prevState) => {
              const modifiedJson = [...prevState.tableData];
              modifiedJson[Index_] = finalJson[0];
              return {
                ...prevState,
                tableData: modifiedJson,
                IsShowNotarySearch: false,
                IsShowCondoPUDSearch: false,
              };
            });
          }
        } else {
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
              ["GroupEmail"]: finalJson[0].GroupEmail,
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
              ["GroupEmail"]: finalJson[0].GroupEmail,
            };

            return updateObj;
          });
        }
        let cardHighlight = handleCardValidation(finalJson);
        setCardValidation({ ...cardValidation, ...cardHighlight });
        setValidation({ ...validation, [finalJson[0].ContactType]: false });
        let fieldValidation = handleFieldValidation(finalJson);
        console.log("Field validation ===>", fieldValidation);
        setSaveValidation({ ...saveValidation, ...fieldValidation }); // To have the field level validation
        // To handle business validation
        handleBusinessValidationMessage();
      })
      .catch((e) => {
        handleBusinessValidationMessage();
        console.log("Error in Company selection method => ", e);
      });
  };
  //Seller selection
  const handleSellerSelection = (event) => {
    //console.time('handleSellerSelection')
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
        //console.timeEnd('handleSellerSelection')
        console.log("Seller selection API result ==>", response);
        const Response = JSON.parse(response);
        setSellerInfo({ ...sellerInfo, RowData: Response });
        setSellerTabelProps({
          ...sellerTabelProps,
          ["ModifiedJson"]: Response,
          EditRow: {},
        });

        setCardValidation({ ...cardValidation, 0: false });
        setData({});
        setInput({});
        // To handle business validation
        let fieldValidation = handleFieldValidation(finalJson);
        console.log("Field validation ===>", fieldValidation);
        setSaveValidation({ ...saveValidation, ...fieldValidation });
        handleBusinessValidationMessage();
      })
      .catch((e) => {
        // To handle business validation
        handleBusinessValidationMessage();
        console.log("Error in Seller selection method => ", e);
      });
  };
  //Handle Secondary Hazard Selection
  const handleSecondaryHazardSelection = (event) => {
    //console.time('handleSellerSelection')
    handleAPI({
      name: "AddNewVendorSigner",
      params: {
        UserId: event.id,
        UserType: event.ValType,
        strSessionId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "SessionId")
            : queryString["SessionId"],
        SerCatId: event.ActualType,
        iLoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        isTitleEscSame: 0, //IsSame,
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd('handleSellerSelection')
        console.log("Secondary Hazard selection API result ==>", response);
        const Response = JSON.parse(response);
        setsecondaryhazardInfo({ ...secondaryhazardInfo, RowData: Response });
        setSecondaryHazardTabelProps({
          ...secondaryHazardTabelProps,
          ["ModifiedJson"]: Response,
          EditRow: {},
        });

        //   const Response1 = JSON.parse(response);
        //   let uniqueRows = getUniqueObjectsByKey(Response1, "label");
        //  const Response=uniqueRows;
        //   setsecondaryhazardInfo({ ...secondaryhazardInfo, RowData: [...secondaryhazardInfo["RowData"],...Response] });
        //   setSecondaryHazardTabelProps({
        //     ...secondaryHazardTabelProps,
        //     ["ModifiedJson"]: [...secondaryHazardTabelProps["ModifiedJson"],...Response] ,
        //     EditRow: {},
        //   });

        setCardValidation({ ...cardValidation, 57: false });
        setData({});
        setInput({});
        // To handle business validation
        handleBusinessValidationMessage();
      })
      .catch((e) => {
        // To handle business validation
        handleBusinessValidationMessage();
        console.log("Error in Secondary Hazard selection method => ", e);
      });
  };
  const handleClosingAgentSelection = (event, index, ContactType) => {
    let selectedRow = closingAgentInfo["RawRow"][index - 1] || {};

    let copyClosingAgent = {},
      enableClosingAgentCopy = {};
    if (copyAgent["2"]) {
      if (ContactType == 2) {
        copyClosingAgent = {
          4: selectedRow,
        };
        enableClosingAgentCopy = { [`4_Add`]: true };
      } else {
        if (ContactType == 4) {
          copyClosingAgent = {
            2: selectedRow,
          };
          enableClosingAgentCopy = { [`2_Add`]: true };
        }
      }
    }
    setEnableClosingAgent({
      ...enableClosingAgent,
      ...enableClosingAgentCopy,
      [`${ContactType}_Add`]: true,
    });
    setClosingAgentInfo({
      ...closingAgentInfo,
      ...copyClosingAgent,
      [ContactType]: selectedRow,
    });

    let obj = {
      ...selectedRow,
      ContactTypeId: ContactType,
      IsCloserNeeded: 1,
    };
    handleClosingAgentSave(obj);
  };
  const handleClosingAgentSave = (obj) => {
    console.log("SaveClosingAgent ==>", obj);
    handleAPI({
      name: "SaveClosingAgent",
      params: {
        InputJSON: JSON.stringify(obj),
        LoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        SessionId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "SessionId")
            : queryString["SessionId"],
      },
      method: "POST",
    }).then((response) => {
      console.log("SaveClosingAgent ==>", response);
    });
  };
  const handleClosingAgentOnchange = (ContactType, key, value) => {
    setClosingAgentInfo((prevState) => ({
      ...prevState,
      [ContactType]: {
        ...prevState[ContactType],
        [key]: value,
      },
    }));
    setEnableClosingAgent({
      ...enableClosingAgent,
      [`${ContactType}_Change`]: true,
    });
  };
  //Handles the changed values from the grid for seller/grid
  const handleGridChange = (index, name, value, Category, Type) => {
    if (Category === "Grid") {
      handleParentWindow("Enable"); // To enable the global save
      if (Type == "N") {
        let NewRow =
          tabelProps["NonBorroweRows"].length == 1 &&
          tabelProps["NonBorroweRows"][0].AgentID == -1
            ? true
            : false;
        setTableProps((prevState) => {
          const modifiedJson = [...prevState.NonBorroweRows];
          modifiedJson[index] = {
            ...modifiedJson[index],
            [name]: value,
            IsModified: 1,
            IsNew: modifiedJson[index]["IsNew"] === 1 || NewRow ? 1 : 0,
          };
          return {
            ...prevState,
            NonBorroweRows: modifiedJson,
          };
        });
      } else {
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

  //Handles the changed values from the grid for Secondary Hazard/grid
  const handleSecondaryHazardGridChange = (
    index,
    name,
    value,
    Category,
    Type
  ) => {
    if (Category === "Grid") {
      handleParentWindow("Enable"); // To enable the global save

      if (Type == "N") {
        let NewRow =
          tabelProps["NonBorroweRows"].length == 1 &&
          tabelProps["NonBorroweRows"][0].AgentID == -1
            ? true
            : false;
        setSecondaryHazardTabelProps((prevState) => {
          const modifiedJson = [...prevState.NonBorroweRows];
          modifiedJson[index] = {
            ...modifiedJson[index],
            [name]: value,
            IsModified: 1,
            IsNew: modifiedJson[index]["IsNew"] === 1 || NewRow ? 1 : 0,
          };
          return {
            ...prevState,
            NonBorroweRows: modifiedJson,
          };
        });
      } else {
        setSecondaryHazardTabelProps((prevState) => {
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
      }
    } else {
      setSecondaryHazardTabelProps((prevState) => {
        const modifiedJson = [...prevState.ModifiedJson];
        modifiedJson[index] = {
          ...modifiedJson[index],
          [name]: value,
          IsModified: 1,
          IsNew: modifiedJson[index]["IsNew"] === 1 ? 1 : 0,
        };
        return {
          ...prevState,
          ModifiedJson: modifiedJson,
        };
      });
    }
  };
  //Checkbox functions for all the checkbox same for escrow/does not apply
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

      //Closing agent Copy
      if (Type == 2) {
        setEnableClosingAgent({
          ...enableClosingAgent,
          [`${ContactType}_Add`]: true,
        });
        setClosingAgentInfo({
          ...closingAgentInfo,
          [ContactType]: undefined,
        });
      }

      //To show/hide change company view
      setEditCompany({
        ...editCompany,
        [ContactType]: !event,
      });

      setValidation({ ...validation, [ContactType]: !event }); // for searching field 'X' mark
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
            ["isEscrowSame"]: 1,
            ["FileNumber"]: "",
          };
          updateObj[index] = {
            ...updateObj[index],
            ["isEscrowSame"]: 1,
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
            ["isEscrowSame"]: 1,
            ["FileNumber"]: "",
          };
          updateObj[index] = {
            ...updateObj[index],
            ["isEscrowSame"]: 1,
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
        setCardValidation({ ...cardValidation, [ContactType]: false });
      } else {
        //Card view portion
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[Index] = {
            ["ContactType"]: ContactType,
            ["ContactTypename"]: result[Index].ContactTypename,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            ["isEscrowSame"]: 0,
          };
          updateObj[index] = {
            ...updateObj[index],
            ["isEscrowSame"]: 0,
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
            ["isEscrowSame"]: 0,
          };
          updateObj[index] = {
            ...updateObj[index],
            ["isEscrowSame"]: 0,
          };
          return updateObj;
        });

        handleRemoveSellerOrAgent(result[Index]);
      }
    } else if (Agent === "Realtor" || Agent === "DoesNotApply") {
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
      } else {
        setCopyAgent({
          ...copyAgent,
          [Type]: event,
        });
        // To handle business validation
        handleBusinessValidationMessage();
      }

      handleAPI({
        name: "UpdateRealtorRepresVal",
        params: {
          LoanId:
            Platform.OS === "web"
              ? handleParamFromURL(document.location.href, "LoanId")
              : queryString["LoanId"],
          RealtorRepresVal: event ? "1" : "0",
          ServCategoryId: Type,
        },
        method: "POST",
      })
        .then((response) => {
          // To handle business validation
          handleBusinessValidationMessage();
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
    setEditCard({
      ...editCard,
      [Type]: false,
    });
  };
  //TO remove company or seller
  const handleRemoveSellerOrAgent = (Data, value) => {
    console.log("remove info", Data);

    //console.time('handleRemoveSellerOrAgent')
    if (Data.ContactSourceType === "S") {
      let Result = [];
      // if (Data.AgentID == 0)
      //   Result = sellerInfo.RowData.filter((e) => {
      //     return e.tempAgentID !== Data.tempAgentID;
      //   });
      // else
      //   Result = sellerInfo.RowData.filter((e) => {
      //     return e.AgentID !== Data.AgentID;
      //   });
      Result = sellerInfo.RowData.filter((e, i) => {
        return i != value;
      });
      setSellerInfo({ ...sellerInfo, RowData: Result });
      setSellerTabelProps({ ...sellerTabelProps, ModifiedJson: Result });
      if (Result.length === 0)
        setCardValidation({ ...cardValidation, ["0"]: true });
    }
    if (Data.ContactType === 57) {
      Data["ContactSourceType"] = "V";
      let Result = [];
      // if (Data.AgentID == 0)
      //   Result = sellerInfo.RowData.filter((e) => {
      //     return e.tempAgentID !== Data.tempAgentID;
      //   });
      // else
      //   Result = sellerInfo.RowData.filter((e) => {
      //     return e.AgentID !== Data.AgentID;
      //   });
      Result = secondaryhazardInfo.RowData.filter((e, i) => {
        return i != value;
      });
      const SecResult = Result.map((item) => {
        return {
          ...item,
          ContactSourceType: "V",
        };
      });
      setsecondaryhazardInfo({ ...secondaryhazardInfo, RowData: SecResult });

      setSecondaryHazardTabelProps({
        ...secondaryHazardTabelProps,
        ModifiedJson: SecResult,
      });
      if (Result.length === 0)
        setCardValidation({ ...cardValidation, [57]: true });
    } else {
      let Index = fnGetIndex(Data.ContactType, "Grid");
      if (Data.ContactType == 3) {
        let Result = tabelProps["AppraiserRows"].filter(
          (e) => e["AgentID"] !== Data["AgentID"]
        );
        let showSearch = false;
        if (Result.length == 0) {
          Result = [
            {
              AgentID: -1,
              ContactType: 3,
              ContactTypename: "Appraiser",
              IsButton: true,
            },
          ];
          //showSearch = true;
        }
        setTableProps({
          ...tabelProps,
          AppraiserRows: Result,
          IsShowAppraiserSearch: showSearch,
        });
      } else if (Data.ContactType == 52 || Data.ContactType == 56) {
        setTableProps((prevState) => {
          const modifiedJson = [...prevState.tableData];
          modifiedJson[Index] = {
            // ...modifiedJson[Index],
            ["AgentID"]: 0,
            ["ContactType"]: Data.ContactType,
            ["ContactTypename"]: Data.ContactTypename,
            ["DisplaySeller"]: Data.DisplaySeller,
          };
          return {
            ...prevState,
            tableData: modifiedJson,
          };
        });

        // setTableProps({
        //   ...tabelProps,
        //   IsShowNotarySearch: true,
        // });
        // } else if (Data.ContactType == 56) {
        //   setTableProps((prevState) => {
        //     const modifiedJson = [...prevState.tableData];
        //     modifiedJson[Index] = {
        //      // ...modifiedJson[Index],
        //       ['AgentID']: 0,
        //       ['ContactType']:Data.ContactType,
        //       ['ContactTypename']:Data.ContactTypename
        //     };
        //     return {
        //       ...prevState,
        //       tableData: modifiedJson,
        //     };
        //   });
      } else {
        setModalVisible({ isModalVisible, Remove: false });
        const index = fnGetIndex(Data.ContactType);
        if ([2, 4].includes(Data.ContactType)) {
          if (Data.ContactType == 4) {
            setEnableClosingAgent({
              ...enableClosingAgent,
              [`2_Add`]: false,
              [`4_Add`]: false,
            });
            setClosingAgentInfo({
              ...closingAgentInfo,
              2: undefined,
              4: undefined,
            });
          } else {
            setEnableClosingAgent({
              ...enableClosingAgent,
              [`2_Add`]: false,
            });
            setClosingAgentInfo({
              ...closingAgentInfo,
              2: undefined,
            });
          }
        }
        let ContactType =
          Data.ContactType == 4
            ? 2
            : Data.ContactType == 49
            ? 48
            : Data.ContactType;
        let Index_ =
          Data.ContactType == 4 ? 2 : Data.ContactType == 49 ? 4 : index;
        setCopyAgent({
          ...copyAgent,
          [ContactType]: [43, 50, 51].includes(ContactType) ? true : false,
        });
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = {
            ["ContactType"]: Data.ContactType,
            ["ContactTypename"]: Data.ContactTypename,
            ["Loanid"]: Data.Loanid,
            ["VendorId"]: Data.VendorId,
            ["ContactSourceType"]: "V",
            ["isCard"]: 1,
            ["isEscrowSame"]: 0,
          };
          if (ContactType == 4 || ContactType == 49) {
            updateObj[Index_] = {
              ...[PrevObj][index],
              ["isEscrowSame"]: 0,
            };
          }
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
            ["isEscrowSame"]: 0,
          };
          if (ContactType == 4 || ContactType == 49) {
            updateObj[Index_] = {
              ...[PrevObj][index],
              ["isEscrowSame"]: 0,
            };
          }
          return updateObj;
        });
        setEditCompany({
          ...editCompany,
          [Data.ContactType]: true,
        });

        //let cardHighlight = handleCardValidation(finalJson);
        let enableRedBorder = true,
          UWStatus = "";
        if (Data["UWStatus"] == undefined) UWStatus = cardInfo?.[0].UWStatus;
        else UWStatus = Data["UWStatus"];

        if (UWStatus == "New File") {
          if (Data.ContactType == 2) enableRedBorder = true;
          else enableRedBorder = false;
        } else enableRedBorder = true;

        setCardValidation({
          ...cardValidation,
          [Data.ContactType]: enableRedBorder,
        });
        //setValidation({ ...validation, [Data.ContactType]: true }); // Need to check
      }
    }

    handleAPI({
      name: "RemovefrmLoan",
      params: {
        UserId: Data.AgentID,
        UserType: Data.ContactSourceType,
        strSessionId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "SessionId")
            : queryString["SessionId"],
        ServCatId: Data.ContactType,
        iLoanId:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd('handleRemoveSellerOrAgent')

        //This part has moved to before the API request
        // To handle business validation
        handleBusinessValidationMessage();
      })
      .catch((e) =>
        console.log("Error in handleRemoveSellerOrAgent method => ", e)
      );
  };
  // To ge the index based on the given ContactType
  const fnGetIndex = (value, Type) => {
    if (Type === "Grid")
      return tabelProps["tableData"].findIndex(
        (item) => item.ContactType == value
      );
    else return cardInfo.findIndex((item) => item.ContactType == value);
  };
  //The change company functionality (to show the searching field)
  const handleCompanyChange = (Type) => {
    setEditCompany({
      ...editCompany,
      [Type]: editCompany[Type] === undefined ? true : !editCompany[Type],
    });
    setfocusCompany({
      ...focusCompany,
      [Type]: true,
    });
    fnShowAddNew(Type);
  };
  //To handle the add new option from the typeahead option
  const handleAddNew = (item) => {
    if (item.ActualType == 3 || item.ActualType == 52) return;
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
          CompanyZip: "",
          CompanyState: "",
          CompanyCity: "",
          CompanyStreetAddr: "",
          Loanid:
            Platform.OS === "web"
              ? handleParamFromURL(document.location.href, "LoanId")
              : queryString["LoanId"],
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
      setData({});
      setInput({});
      //}
    }
    if (item.ActualType == 57) {
      setModalSecHazardVisible({ SecondaryHazard: true });
      // if (
      //   sellerInfo["RowData"].length == 0 ||
      //   (sellerInfo["RowData"][SellerLength - 1].tempAgentID !== undefined &&
      //     sellerTabelProps["ModifiedJson"][SellerLength - 1].FirstName !== "")
      // ) {
      let NewRowSecondaryHazard = [],
        SecHazArrLength = 0;
      // if (
      //   sellerInfo["RowData"].length == 0 ||
      //   sellerInfo["RowData"][0].AgentID !== 0
      // ) {
      NewRowSecondaryHazard = [
        {
          AgentEmail: "",
          AgentFN: "",
          AgentFNN: "",
          AgentID: "",
          AgentLicense: "",
          CompEmail: "",
          CompPhone: "",
          CompanyAddress: "",
          CompanyCity: "",
          CompanyLicense: "",
          CompanyState: "",
          ValType: "V",
          Type: "57",
          UserType: "V",
          ActualType: "57",
          // AgentID: 0,
          // tempAgentID: secondaryhazardInfo["RowData"].length,
          // ContactSourceType: "S",
          // ContactType: 0,
          // ContactTypename: "Seller",
          CompanyStatus: "",
          CompanyStreetAddr: "",
          CompanyZip: "",
          Companyname: "",
          ContactSourceType: "",
          ContactType: 57,
          ContactTypename: "Secondary Hazard Insurance",
          FirstName: "",
          LastName: "",
          MiddleName: "",
          Nickname: "",
          Phone: "",
          DisplaySeller: 0,
          // AgentEmail: "",
          // CompanyZip: "",
          // CompanyState: "",
          // CompanyCity: "",
          // CompanyStreetAddr: "",
          IsNew: 1,
          FileNumber: "",
          Loanid:
            Platform.OS === "web"
              ? handleParamFromURL(document.location.href, "LoanId")
              : queryString["LoanId"],
          //   VendorId: 0,
          isCard: 1,
          iNoRealtorReprestation: 0,
          isEditRestricted: 0,
          isEscrowSame: -1,
        },
      ];
      SecHazArrLength = secondaryhazardInfo["RowData"].length;
      // }

      let SecData = [
        ...secondaryhazardInfo["RowData"],
        ...NewRowSecondaryHazard,
      ];
      setsecondaryhazardInfo({ ...secondaryhazardInfo, RowData: SecData });
      setSecondaryHazardTabelProps({
        ...secondaryHazardTabelProps,
        ModifiedJson: [
          ...secondaryHazardTabelProps["ModifiedJson"],
          ...NewRowSecondaryHazard,
        ], //,SecData ,//Data,//
        EditRow: {
          ...secondaryHazardTabelProps.EditRow,
          [SecHazArrLength]: true,
        },
      });
      // setData({});
      // setInput({});
      //}
    } else if (item.ActualType == 60) {
      setEnableClosingAgent((prevInfo) => {
        return {
          ...prevInfo,
          [`${item["whichCard"]}_Add`]: true,
        };
      });
    } else {
      setEditCard({
        ...editCard,
        [item.ActualType]: true,
      });
      setCopyAgent({
        ...copyAgent,
        [item.ActualType]: false,
      });
      const index = fnGetIndex(item.ActualType);
      const EmptyValue = [
        {
          ["ContactType"]: item.ActualType,
          ["ContactTypename"]: result[index].ContactTypename,
          ["Loanid"]:
            Platform.OS == "web"
              ? handleParamFromURL(document.location.href, "LoanId")
              : queryString["LoanId"],
          ["isCard"]: 1,
          ["Companyname"]: "",
          ["FirstName"]: "",
          ["LastName"]: "",
          ["AgentEmail"]: "",
          ["CompPhone"]: "",
          ["Phone"]: "",
          ["IsNew"]: 1,
          ["IsModified"]: 1,
          ["CompanyLicense"]: "",
          ["CompanyZip"]: "",
          ["CompanyStreetAddr"]: "",
          ["AgentLicense"]: "",
          ["iNoRealtorReprestation"]: 0,
          [item.SearchedFor || "Companyname"]:
            AutoCinput[item.ActualType] || "", // To have the searched value by default to which you searched for
        },
      ];
      setCardInfo((PrevObj) => {
        const updateObj = [...PrevObj];
        updateObj[index] = EmptyValue[0];
        return updateObj;
      });
      let fieldValidation = handleFieldValidation(EmptyValue);
      setSaveValidation({ ...saveValidation, ...fieldValidation });
    }
  };
  //To show edit/view mode
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
      //999 Non-Borrower
      1, 8, 9, 18, 19, 36, 37, 38, 46, 3, 999, 52, 56, 47, 55,
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
    return modifiedArray.sort((a, b) => {
      const nameA = a.ContactTypename.toUpperCase();
      const nameB = b.ContactTypename.toUpperCase();

      if (nameA < nameB) return -1; // nameA comes after nameB ascending order)
      if (nameA > nameB) return 1; // nameA comes before nameB ascending order)
      return 0; // names are equal
    });
  };
  const handleCardCancel = (row, index) => {
    setEditCard({
      ...editCard,
      [row["ContactType"]]: false,
    });
    // setSaveValidation({
    //   [row["ContactType"]]: [],
    // });

    // setOtherProps({
    //   ...otherProps,
    //   [`showSavebtn-${index}`]: false,
    // });
    setCardInfo((PrevObj) => {
      const updateObj = [...PrevObj];
      updateObj[index] = {
        ...updateObj[index],
        ["FileNumber"]: result[index]["FileNumber"],
        ["IsModified"]: 0,
      };
      return updateObj;
    });
  };
  const handleParentWindow = (Type) => {
    if (window.parent != window && Platform.OS === "web") {
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
    //console.time('handleParentWindowSave')
    handleParentWindow("Disable");

    setResult(cardInfo); // To append the edited value in the view mode
    console.log("bulk save ==>", cardInfo);
    let ModifiedCard = cardInfo.filter((e) => e.IsModified == 1);
    let ModifiedGrid = tabelProps["tableData"].filter((e) => e.IsModified == 1);
    let ModifiedNonBorr = tabelProps["NonBorroweRows"].filter(
      (e) => e.IsModified == 1
    );
    let finalJson = [...ModifiedCard, ...ModifiedGrid, ...ModifiedNonBorr];
    let mandatoryFields = ["Companyname", "FirstName", "LastName"],
      isBlockSave = 0;
    isBlockSave = finalJson.filter((obj) =>
      mandatoryFields.some((key) => !obj[key])
    );
    let JsonData = JSON.stringify(finalJson)
      .replaceAll("#", "|H|")
      .replaceAll("&", "|A|");
    if (isBlockSave.length > 0 && ModifiedGrid.length == 0) return;
    try {
      const parentElLoader = window.parent.document.getElementById("divLoader");
      parentElLoader.style.display = "block";
    } catch (error) {}
    handleAPI({
      name: "Save_VendorLoanInfo_Bulk",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        SaveJson: JsonData,
      },
      method: "POST",
    })
      .then((response) => {
        //console.timeEnd('handleParentWindowSave')

        if (response !== "Errored") {
          // This part is moved to before the API request for perform
          handlePageLoad();
          parentElLoader.style.display = "none";
        }
      })
      .catch((e) => {
        console.log("Error While saving vendor details in the parent => ", e);
        parentElLoader.style.display = "none";
      });
    //document.querySelectorAll('[role="button"]')[0].click();
    //console.log("Save is processing");
  };
  const handleBusinessValidationMessage = () => {
    if (window.parent != window && Platform.OS === "web") {
      let PageId = queryString["Page"] === "HazardInsurance" ? 36 : 43;
      let PageName =
        queryString["Page"] === "HazardInsurance"
          ? "Hazard Insurance"
          : "Vendors";
      let FormName =
        queryString["Page"] === "HazardInsurance"
          ? "HazardInsurance"
          : "Vendors";
      window.parent.Showvalidationstatus(
        handleParamFromURL(document.location.href, "LoanId"),
        PageId,
        PageName,
        handleParamFromURL(document.location.href, "SessionId"),
        FormName
      );
      console.log("Triggered Business validation");
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
              whichCard: event,
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
  const handleWareHouseChange = (item) => {
    setTableProps((PrevObj) => {
      const updateObj = [...PrevObj.tableData];
      updateObj[4] = {
        ...updateObj[4],
        ["Companyname"]: item.label,
      };

      return {
        ...PrevObj,
        ["selectWareHouse"]: item.value,
        ["showWareHouseOption"]: false,
        tableData: updateObj,
      };
    });
    handleAPI({
      name: "OnChangeWarehouseBankList",
      params: {
        LoanId:
          Platform.OS == "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        VendorId: item.value,
        Empnum: queryString["EmpNum"],
      },
      method: "POST",
    })
      .then((response) => {
        if (response === "Completed") {
          // This part is moved to before the API request for peform
        }
      })
      .catch((e) =>
        console.log("Error While saving vendor details in the parent => ", e)
      );
  };

  const handleRemoveAppraiser = (rowData, index) => {
    const { ContactType, AgentID, ContactTypename, DisplaySeller } = rowData;
    let params = {
      ContactType,
      ContactSourceType: "V",
      AgentID,
      ContactTypename,
      DisplaySeller,
    };
    handleRemoveSellerOrAgent(params);
  };
  const handleGridButton = (rowData, action, index) => {
    const { ContactType, AgentID } = rowData;
    let NewRow = [
      {
        ContactType: 999,
        ContactSourceType: "N",
        ContactTypename: "Non-Borrowing Signers",
        AgentID: `-9999${tabelProps["NonBorroweRows"].length}`,
        Loanid:
          Platform.OS === "web"
            ? handleParamFromURL(document.location.href, "LoanId")
            : queryString["LoanId"],
        IsNew: 1,
      },
    ];
    if ([3, 52, 56].includes(ContactType)) {
      let obj = {};
      setfocusCompany({ ...focusCompany, [ContactType]: true });
      if (ContactType === 3) obj = { IsShowAppraiserSearch: true };
      else if (ContactType === 52) obj = { IsShowNotarySearch: true };
      else obj = { IsShowCondoPUDSearch: true };

      setTableProps({
        ...tabelProps,
        ...obj,
      });
    } else if (ContactType === 999) {
      if (action === "Remove") {
        let Result = tabelProps["NonBorroweRows"].filter(
          (e, i) => i !== index //e.AgentID !== tabelProps["NonBorroweRows"][index].AgentID &&
        );
        if (Result.length === 0) Result = NewRow;
        console.log("result", Result);
        setTableProps({
          ...tabelProps,
          NonBorroweRows: Result,
        });
        if (tabelProps["NonBorroweRows"][index].IsNew !== 1) {
          handleAPI({
            name: "RemoveNonBorrower",
            params: {
              LoanId:
                Platform.OS === "web"
                  ? handleParamFromURL(document.location.href, "LoanId")
                  : queryString["LoanId"],
              Type: 1,
              SignerId: tabelProps["NonBorroweRows"][index].AgentID,
            },
            method: "POST",
          })
            .then((response) => {
              if (response === "Completed") {
                // This part is moved to before the API request for peform
              }
            })
            .catch((e) => console.log("Error While RemoveNonBorrower => ", e));
        }
      } else {
        setTableProps({
          ...tabelProps,
          NonBorroweRows: [...tabelProps["NonBorroweRows"], ...NewRow],
        });
      }
    }
  };
  const handleCardValidation = (data) => {
    try {
      let obj = {};
      data.forEach((item) => {
        let isEmpty = false;
        if (item["ContactType"] != 0) {
          let Keys = [
            "FirstName",
            //  "CompEmail",
            "CompPhone",
            "Phone",
            "CompanyCity",
            "CompanyZip",
            "CompanyState",
            "CompanyStreetAddr",
            "Companyname",
            "AgentEmail",
            //"AgentLicense",
            //"CompanyLicense",
          ];
          if (
            [7, 2, 4, 17].includes(item["ContactType"]) &&
            queryString["Page"] !== "HazardInsurance"
          ) {
            // 48,49 removed since these two not mandatory
            Keys.push("FileNumber");
          }
          if (item["ContactType"] !== 7) {
            Keys.push("AgentLicense");
            Keys.push("CompanyLicense");
          }
          let flag = true;

          Keys.forEach((key) => {
            if (
              item[key] === null ||
              item[key] === undefined ||
              item[key] === ""
            ) {
              isEmpty = true;
              return; // Break out of the forEach loop early if any key has an empty value
            }
          });
          let UWStatus = "";
          if (item["UWStatus"] == undefined) UWStatus = cardInfo?.[0].UWStatus;
          else UWStatus = item["UWStatus"];

          if (UWStatus == "New File") {
            if (item["ContactType"] !== 2) isEmpty = false;
          }
          if (isEmpty) {
            obj[item["ContactType"]] = true;
          } else {
            obj[item["ContactType"]] = false;
          }
          // if (item["isEscrowSame"] == 1) {
          //   let ContactType = item["ContactType"] == 2 ? 4 : 49;
          //   obj[ContactType] = obj[item["ContactType"]];
          // }
        }
      });
      return obj;
    } catch (error) {
      console.log("Error in handleCardValidation");
    }
  };
  const handleFieldValidation = (data) => {
    let obj = {};
    let updatedData = {};
    data.forEach((item) => {
      if (item["ContactType"] != 0) {
        let Keys = [
          "FirstName",
          "LastName",
          "CompPhone",
          "Phone",
          "CompanyCity",
          "CompanyZip",
          "CompanyState",
          "CompanyStreetAddr",
          "Companyname",
          "AgentEmail",
          //"AgentLicense",
          //"CompanyLicense",
        ];
        if ([7, 2, 4, 17].includes(item["ContactType"])) {
          // 48, 49
          Keys.push("FileNumber");
        }
        if (item["ContactType"] !== 7) {
          Keys.push("AgentLicense");
          Keys.push("CompanyLicense");
        }
        if (!updatedData[item["ContactType"]]) {
          updatedData[item["ContactType"]] = {};
        }
        Keys.forEach((key) => {
          if (
            item[key] === null ||
            item[key] === undefined ||
            item[key] === ""
          ) {
            updatedData[item["ContactType"]][key] = true;
          } else updatedData[item["ContactType"]][key] = false;
        });
      }
    });
    // console.log("Field validaiton ====>", updatedData);
    return updatedData;
  };
  const fnOpenVendorPage = (row) => {
    let JsonObj = {};
    JsonObj.Width = window.innerWidth;
    JsonObj.Height = window.innerHeight;
    JsonObj.Left = window.screenX;
    JsonObj.Top = window.screenY;
    handleAPI({
      name: "SaveWindowSizePosition",
      params: {
        SessionID: handleParamFromURL(document.location.href, "SessionId"),
        ViewJSON: JSON.stringify(JsonObj),
        Updateflag: 0,
        FormID: 0,
        FormName:
          "/VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_Bootstrap.aspx",
      },
      method: "POST",
    })
      .then((response) => {
        handleWebPageOpen(
          row,
          Platform.OS === "web" &&
            handleParamFromURL(document.location.href, "SessionId"),
          "../../../VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_bootstrap.aspx?SessionId=",
          response
        );
        //console.log("fnOpenVendorPage response ==>", response);
      })
      .catch((e) =>
        console.log("Error in fnSaveWindowSizePosition method => ", e)
      );
  };
  const fnGridValueFormat = (value, name) => {
    //let value = " | Approved: Expires 01/01/2200";
    if (name === "Company" || name === "Status") {
      value = value.split(":")[name === "Company" ? 1 : 0];
      value = value.split(" ");
      return value[value.length - 1];
    }
  };
  const handleGetVendorByType = (ContactType) => {
    handleAPI({
      name: "Get_VendorLoanInfo_Type",
      params: {
        LoanId: handleParamFromURL(document.location.href, "LoanId"),
        Type: ContactType,
        Fullrows: 1,
      },
      method: "POST",
    })
      .then((response) => {
        const index = fnGetIndex(ContactType);
        const Result = JSON.parse(response);
        console.log("Success Get_VendorLoanInfo_Type ==>", Result);
        setResult((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = Result[0];
          return updateObj;
        });
        setCardInfo((PrevObj) => {
          const updateObj = [...PrevObj];
          updateObj[index] = Result[0];
          return updateObj;
        });
        // setOtherProps({
        //   ...otherProps,
        //   ["remove-" + index]: false,
        // })
      })
      .catch((e) =>
        console.log("Error in handleGetVendorByType method => ", e)
      );
  };
  //To get the vendor service rights api call
  const GetVendorServiceRights = (UserId) => {
    handleAPI({
      name: "IsVendorServicer",
      params: {
        EmpNum: UserId,
      },
      method: "POST",
    })
      .then((response) => {
        setVendorServiceRights(response);
        console.log("retval Vendor Service Rights" + UserId + response);
      })
      .catch((e) =>
        console.log("Error in GetVendorServiceRights method => ", e)
      );
  };
  /////////////// Function declarations ends here //////////////////////

  //To construct the typeahead options
  const handleTypeaheadOption = (item, index, ContanctType) => {
    const views = [];
    const vstyle = {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      color: "gray",
      zIndex: 3,
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
              if (item.ActualType == 57) handleSecondaryHazardSelection(item);
              else if (item.ActualType == 60)
                handleClosingAgentSelection(item, index, ContanctType);
              else handleCompanySelection(item, index, 0);
            }}
            key={item.id}
            style={[[vstyle]]}
          >
            {item.label}
          </CustomText>
        ) : (
          item.ActualType != 3 &&
          item.ActualType != 52 &&
          item.ActualType != 56 && (
            <TouchableOpacity
              autoFocus
              onPress={(e) => {
                item.ActualType == 60
                  ? handleClosingAgentSelection("", 0, item.ActualType)
                  : handleAddNew(item);
              }}
              style={[
                [styles.buttonContainer],
                {
                  width: Platform.OS === "web" ? "fit-content" : 90,
                  margin: 10,
                },
              ]}
            >
              <CustomText style={[[styles["btn"]], { alignSelf: "center" }]}>
                {"Add New"}
              </CustomText>
            </TouchableOpacity>
          )
        )
      ) : null
    );
    return <>{views}</>;
  };

  //Grid rows construction
  //if index -1 the button will show
  const CustomTableRow = (rowData, index) => {
    return (
      <TableWrapper
        key={index - 1}
        style={[
          styles["table-row"],
          {
            backgroundColor: index % 2 == 0 ? "#d9ecff" : "#fff",
            zIndex:
              [3, 52, 56].includes(rowData["ContactType"]) && index === -1
                ? null
                : -11,
            padding: rowData["ContactType"] === 999 ? 0 : 10,
          },
          Platform.select({
            android: {
              width: "100%",
            },
            ios: {
              width: "100%",
            },
          }),
        ]}
      >
        {(tabelProps.IsShowAppraiserSearch &&
          rowData["ContactType"] == 3 &&
          index === -1) ||
        (tabelProps.IsShowNotarySearch &&
          rowData["ContactType"] == 52 &&
          index === -1) ||
        (tabelProps.IsShowCondoPUDSearch &&
          rowData["ContactType"] == 56 &&
          index === -1) ? (
          <Cell
            width={340}
            key={"cell1"}
            data={[
              <View
                style={[
                  // Platform.OS !== "web" &&
                  //   {
                  //     // flexDirection: "row",
                  //   },
                  { width: 320 },
                  Platform.select({
                    web: {
                      width: 320,
                    },
                    android: {
                      paddingTop: 5,
                      paddingBottom: 5,
                    },
                    ios: {
                      paddingTop: 5,
                      paddingBottom: 5,
                    },
                  }),
                ]}
              >
                <InputField
                  autoFocus={
                    focusCompany[rowData["ContactType"]] ? true : false
                  }
                  value={AutoCinput[rowData["ContactType"]] || ""}
                  label=""
                  type="default"
                  name="EmailorCellPhone"
                  onChangeText={(text) => {
                    handleCompanySearch(text, rowData["ContactType"], "V");
                  }}
                  onKeyPress={(event) => {
                    setSelectedItemIndex(-1);
                    fnFocusInput(event);
                  }}
                  onBlur={(e) => {
                    fnShowAddNew(rowData["ContactType"], "Hide");
                  }}
                  onFocus={(e) => {
                    fnShowAddNew(rowData["ContactType"], "Show");
                  }}
                  placeholder={`Search for ${rowData["ContactTypename"]}`}
                />
                <CustomText
                  style={{
                    position: "absolute",
                    right: 10,
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
                          // cursor: "pointer",
                          opacity: 0.8,
                          top: -2,
                        },
                      ]}
                      strokeWidth={30}
                      size={17}
                      color={"black"}
                      onPress={(event) => {
                        if (rowData["ContactType"] == 3)
                          setTableProps({
                            ...tabelProps,
                            IsShowAppraiserSearch: false,
                          });
                        else if (rowData["ContactType"] == 52)
                          setTableProps({
                            ...tabelProps,
                            IsShowNotarySearch: false,
                          });
                        else if (rowData["ContactType"] == 56)
                          setTableProps({
                            ...tabelProps,
                            IsShowCondoPUDSearch: false,
                          });
                        setData({});
                        setInput({});
                      }}
                    />
                  )}
                </CustomText>
                {AutoCompdata[rowData["ContactType"]] && (
                  <FlatList
                    style={[styles["search-drop-down"], {}]}
                    data={AutoCompdata[rowData["ContactType"]]}
                    // showsVerticalScrollIndicator={true}
                    // removeClippedSubviews={true}
                    nestedScrollEnabled={true}
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
                                ? "#ffff00"
                                : i % 2 == 0
                                ? "#d9ecff"
                                : "#fff",
                          },
                          isHovered && styles["HoverBgColor"],
                        ]}
                        onPress={(e) => {
                          handleOnkeyPressFlatlist(
                            AutoCompdata[rowData["ContactType"]][
                              selectedItemIndex
                            ],
                            index
                          );
                        }}
                      >
                        <View>{handleTypeaheadOption(item, 1)}</View>
                      </Pressable>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </View>,
            ]}
          />
        ) : rowData["ContactType"] === 999 ? (
          <Cell
            width={447}
            key={"cell1"}
            data={[
              <View style={[{ padding: 10 }]}>
                {index === -1 ? (
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      bold={true}
                      style={{
                        fontSize: 12,
                        color: "#4b545d",
                        marginRight: 5,
                      }}
                    >
                      {rowData.ContactTypename}
                    </CustomText>
                    <TouchableOpacity
                      style={[[styles.buttonContainer], { height: 25 }]}
                      onPress={(event) => {
                        handleGridButton(rowData);
                      }}
                      //activeOpacity={1}
                    >
                      <CustomText
                        style={[
                          styles["btn"],
                          { alignSelf: "center", fontSize: 10 },
                        ]}
                      >
                        {"Add"}
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  NonBorrowerEditView(rowData, index)
                )}
              </View>,
            ]}
          />
        ) : (
          <Cell
            width={120}
            key={"cell1"}
            style={Platform.select({
              web: {
                display: rowData["ContactType"] == 999 ? "none" : "block",
              },
            })}
            data={[
              <View>
                {[3, 52, 56].includes(rowData["ContactType"]) ? (
                  index === -1 ? (
                    <View style={{ flexDirection: "row" }}>
                      <CustomText
                        bold={true}
                        style={{
                          fontSize: 12,
                          color: "#4b545d",
                          marginRight: 5,
                        }}
                      >
                        {rowData.ContactTypename}
                      </CustomText>
                      <TouchableOpacity
                        style={[[styles.buttonContainer], { height: 25 }]}
                        onPress={(event) => {
                          handleGridButton(rowData);
                        }}
                      >
                        <CustomText
                          style={[
                            styles["btn"],
                            { alignSelf: "center", fontSize: 10 },
                          ]}
                        >
                          {"Add"}
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{}}>
                      <View>
                        <CustomText
                          bold={true}
                          style={{
                            fontSize: 12,
                            color: "#4b545d",
                          }}
                        >
                          {rowData.ContactTypename}:
                        </CustomText>
                      </View>
                      <CustomText
                        style={[
                          styles["card-text-underline"],
                          { fontSize: 12 },
                        ]}
                        onPress={(e) => fnOpenVendorPage(rowData)}
                      >
                        {rowData.AgentFN}
                      </CustomText>
                    </View>
                  )
                ) : (
                  rowData["ContactType"] !== 999 && (
                    <CustomText
                      style={{ maxWidth: 120, fontSize: 11, color: "#6c757d" }}
                    >
                      {rowData.ContactTypename}
                    </CustomText>
                  )
                )}
              </View>,
            ]}
          />
        )}

        <Cell
          style={Platform.select({
            web: {
              display:
                (rowData["IsButton"] && index === -1) ||
                //index === -1 ||
                (tabelProps["showWareHouseOption"] &&
                  rowData["ContactType"] === 19) ||
                (rowData["ContactType"] === 52 &&
                  tabelProps["IsShowNotarySearch"]) ||
                (rowData["ContactType"] === 56 &&
                  tabelProps["IsShowCondoPUDSearch"])
                  ? "none"
                  : "block",
            },
          })}
          width={130}
          data={[
            <View>
              <CustomText style={{ fontSize: 12, color: "#6c757d" }}>
                {rowData.Companyname}
              </CustomText>
              <CustomText style={{ flexDirection: "row", fontSize: 12 }}>
                {rowData["CompanyStatus"] && (
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
                      {fnGridValueFormat(rowData["CompanyStatus"], "Company")}
                    </CustomText>
                  </View>
                )}
              </CustomText>
            </View>,
          ]}
          // textStyle={styles["table-text"]}
        />
        <Cell
          style={Platform.select({
            web: {
              display:
                tabelProps.IsShowAppraiserSearch && rowData["ContactType"] === 3
                  ? "none"
                  : "block",
            },
          })}
          width={
            tabelProps["showWareHouseOption"] && rowData["ContactType"] === 19
              ? 180
              : 90
          }
          key={"cell3"}
          data={
            // rowData["ContactType"] === 1 ? (
            //   <CustomText style={{ fontSize: 12, color: "green" }}>
            //     {"Approved"}
            //   </CustomText>
            // ) :
            tabelProps["showWareHouseOption"] &&
            rowData["ContactType"] === 19 ? (
              <View>
                <Dropdown
                  isValid={false}
                  label={""}
                  options={warehouse}
                  value={tabelProps["selectWareHouse"] || ""}
                  onSelect={(item) => {
                    setTableProps({
                      ...tabelProps,
                      selectWareHouse: item.value,
                    });
                    handleWareHouseChange(item);
                  }}
                  placeholder={"placeholder"}
                  isMap={true}
                />
              </View>
            ) : rowData["CompanyStatus"] && index !== -1 ? (
              <CustomText
                style={{
                  fontSize: 12,
                  color:
                    rowData["CompanyStatus"].indexOf("Approved") !== -1
                      ? "green"
                      : "red",
                }}
              >
                {fnGridValueFormat(rowData["CompanyStatus"], "Status")}
              </CustomText>
            ) : null
          }
          // textStyle={styles["table-text"]}
        />
        <Cell
          width={96}
          key={"cell5"}
          data={
            <>
              {[17, 27, 22, 56, 3, 52].includes(rowData["ContactType"]) &&
              index !== -1 ? (
                <View>
                  {[17, 27, 22, 56].includes(rowData["ContactType"]) && (
                    <View>
                      <InputField
                        //autoFocus
                        validate={
                          rowData.FileNumber.length === 0 ? true : false
                        }
                        type="default"
                        value={rowData.FileNumber}
                        placeholder="File #"
                        style={[styles["grid-input"], { outline: "none" }]}
                        onChangeText={(Text) => {
                          handleGridChange(index, "FileNumber", Text, "Grid");
                        }}
                      />
                    </View>
                  )}
                  {index !== -1 &&
                    [3, 52, 56].includes(rowData["ContactType"]) && (
                      <TouchableOpacity
                        style={[
                          [styles.buttonContainer],
                          { marginTop: 5, width: 60 },
                        ]}
                        onPress={(event) => {
                          handleRemoveAppraiser(rowData, index);
                        }}
                      >
                        <CustomText
                          style={[
                            styles["btn"],
                            { alignSelf: "center", fontSize: 10 },
                          ]}
                        >
                          {"Remove"}
                        </CustomText>
                      </TouchableOpacity>
                    )}
                </View>
              ) : rowData["ContactType"] == 19 ? (
                <View
                  style={{
                    width: "fit-content",
                    marginLeft: 10,
                  }}
                >
                  {/* {tabelProps["showWareHouseOption"] ? ( */}
                  <TouchableOpacity style={[styles.buttonContainer]}>
                    <CustomText
                      style={[styles["btn"], { alignSelf: "center" }]}
                      onPress={(e) => {
                        setTableProps({
                          ...tabelProps,
                          showWareHouseOption:
                            !tabelProps["showWareHouseOption"],
                        });
                      }}
                    >
                      {tabelProps["showWareHouseOption"] ? "Cancel" : "Change"}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              ) : (
                <CustomText style={{ fontSize: 12, color: "#6c757d" }}>
                  {rowData.FileNumber}
                </CustomText>
              )}
            </>
          }
        />
      </TableWrapper>
    );
  };

  const NonBorrowerEditView = (rowData, index) => {
    return (
      <>
        <View style={[styles["card-input"], { width: "100%", paddingTop: 20 }]}>
          <InputField
            //autoFocus
            type="default"
            label="Full Legal Name of Signer Not On Loan"
            value={tabelProps["NonBorroweRows"][index].AgentFN}
            placeholder="Full Legal Name of Signer Not On Loan"
            onChangeText={(Text) => {
              handleGridChange(index, "AgentFN", Text, "Grid", "N");
            }}
          />
        </View>
        <View
          style={{
            padding: 0,
            flexDirection: "row",
          }}
        >
          <View style={[styles["card-input"], { width: "85%", paddingTop: 5 }]}>
            <View
              style={{
                padding: 0,
                // paddingTop: 5,
                // paddingBottom: 5,
                flexDirection: "row",
              }}
            >
              <View
                style={[
                  styles["card-input"],
                  { width: "35%", marginRight: 10 },
                ]}
              >
                <InputField
                  //autoFocus
                  type="default"
                  label="Cell Phone"
                  value={tabelProps["NonBorroweRows"][index].Phone}
                  placeholder="Cell Phone"
                  onChangeText={(Text) => {
                    handleGridChange(index, "Phone", Text, "Grid", "N");
                  }}
                  onBlur={(e) => {
                    let number = FormatPhoneLogin(
                      tabelProps["NonBorroweRows"][index].Phone
                    );
                    handleGridChange(index, "Phone", number, "Grid", "N");
                  }}
                />
              </View>
              <View style={[styles["card-input"], { width: "62%" }]}>
                <InputField
                  //autoFocus
                  type="default"
                  value={tabelProps["NonBorroweRows"][index].AgentEmail}
                  label="Email"
                  placeholder="Email"
                  onChangeText={(Text) => {
                    handleGridChange(index, "AgentEmail", Text, "Grid", "N");
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles["card-input"],
              {
                width: "19%",
                justifyContent: "center",
              },
            ]}
          >
            {/* {tabelProps["EditRow"][index] === true && ( */}
            <View>
              <TouchableOpacity
                style={[
                  [styles.buttonContainer],
                  { alignSelf: "center", padding: 5 },
                ]}
                onPress={(e) => {
                  handleGridButton(rowData, "Remove", index);
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
                  {"Remove"}
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* )} */}
          </View>
        </View>
      </>
    );
  };

  const Vendors = () => {
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
                    // (index === 1 && row["DisplaySeller"] == 0) ||
                    // (index === 5 && row["IsEmpty"])
                    row["DisplaySeller"] == 0
                      ? index === 1
                        ? styles["card-hide"]
                        : { display: "none" }
                      : "",
                    (index === 1 && row["IsEmpty"] && windowWidth < 1000) ||
                    (index === 5 && row["IsEmpty"] && windowWidth < 1000)
                      ? { display: "none" }
                      : "",
                    copyAgent[row["ContactType"]] &&
                      [43, 50, 51].includes(row["ContactType"]) &&
                      styles["card-disable"], // This is for disabling the card when no realtor is checked
                    cardValidation[row["ContactType"]] &&
                      (!copyAgent[row["ContactType"]] ||
                        [2, 48].includes(row["ContactType"])) &&
                      styles["card-validation"],
                    {
                      zIndex: [2, 4].includes(row["ContactType"])
                        ? -111
                        : -1111,
                    },
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
                                  <View style={[styles["btn"]]}>
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
                                              { color: "#ffffff" },
                                            ]}
                                          >
                                            {"Remove"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </>
                                    ) : (
                                      <View
                                        style={styles["remove-card-header"]}
                                      >
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
                                              // setCopyAgent({
                                              //   ...copyAgent,
                                              //   [row["ContactType"]]: false,
                                              // });
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
                                                { color: "#ffffff" },
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
                                                { color: "#ffffff" },
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
                                    handleVendorSave(index);
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

                                  setSellerTabelProps({
                                    ...sellerTabelProps,
                                    EditRow: [],
                                  });
                                }}
                                style={[styles.buttonContainer]}
                              >
                                <CustomText style={styles["btn"]}>
                                  {"Add"}
                                </CustomText>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={(e) => {
                                  toggleModal("Seller");
                                  // setData({});
                                  // setInput({});
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
                              minHeight: Platform.OS === "web" ? 294 : null,
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
                              Platform.select({
                                android: {
                                  width: "100%",
                                },
                                ios: {
                                  width: "100%",
                                },
                              }),
                            ]}
                          >
                            {sellerInfo["RowData"]?.map((e, index) => (
                              <>
                                {index < 3 && (
                                  <View
                                    key={index}
                                    style={[
                                      { gap: 4 },
                                      Platform.select({
                                        android: {
                                          width: "29%",
                                          marginLeft: 5,
                                          marginRight: 5,
                                          gap: 5,
                                        },
                                        ios: {
                                          width: "29%",
                                          marginLeft: 5,
                                          marginRight: 5,
                                          gap: 5,
                                        },
                                      }),
                                    ]}
                                  >
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
                                        </CustomText>
                                        {AutoCompdata[e["ContactType"]] &&
                                          !isModalVisible.Seller && (
                                            <FlatList
                                              style={styles["search-drop-down"]}
                                              data={
                                                AutoCompdata[e["ContactType"]]
                                              }
                                              showsVerticalScrollIndicator={
                                                true
                                              }
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
                                                      opacity: pressed
                                                        ? 0.5
                                                        : 1,
                                                      borderWidth: 1,
                                                      borderColor: "silver",
                                                      borderTopWidth: 0,
                                                      backgroundColor:
                                                        i === selectedItemIndex
                                                          ? "#ffff00"
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
                                        {(e.FirstName || e.LastName) && (
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
                                                  // setData({});
                                                  // setInput({});
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
                                        )}
                                        <View>
                                          <CustomText
                                            onPress={(e) => {
                                              !e.FirstName && !e.LastName
                                                ? toggleModal("Seller")
                                                : // setData({});
                                                  // setInput({});
                                                  null;
                                            }}
                                            style={
                                              !e.FirstName &&
                                              !e.LastName &&
                                              styles["card-text-underline"]
                                            }
                                          >
                                            {e.Companyname}
                                          </CustomText>
                                        </View>
                                        <View>
                                          <CustomText>
                                            {e.AgentEmail}
                                          </CustomText>
                                        </View>
                                        <View>
                                          <CustomText>{e.Phone}</CustomText>
                                        </View>
                                        <View>
                                          <View>
                                            <CustomText>
                                              {e.CompanyStreetAddr}
                                            </CustomText>
                                          </View>
                                          <View>
                                            <CustomText>
                                              {`${e.CompanyCity}${
                                                e.CompanyCity && ","
                                              } ${e.CompanyState} ${
                                                e.CompanyZip
                                              }`}
                                            </CustomText>
                                          </View>
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
                                {AutoCompdata["0"] &&
                                  !isModalVisible.Seller && (
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
                                                  ? "#ffff00"
                                                  : i % 2 == 0
                                                  ? "#d9ecff"
                                                  : "#fff",
                                            },
                                            isHovered && styles["HoverBgColor"],
                                          ]}
                                          onPress={(event) => {
                                            handleOnkeyPressFlatlist(
                                              AutoCompdata["0"][
                                                selectedItemIndex
                                              ],
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
                                <View
                                  style={{ paddingLeft: 10, paddingTop: 10 }}
                                >
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
                                        // styles["card-text-underline"],
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
                                  minHeight: Platform.OS === "web" ? 294 : null,
                                  gridTemplateColumns: editCompany[
                                    row["ContactType"]
                                  ]
                                    ? "repeat(1,1fr)"
                                    : "repeat(2,1fr)",
                                  // width:
                                  //   Platform.OS !== "web"
                                  //     ? editCompany[row["ContactType"]]
                                  //       ? "98%"
                                  //       : "50%"
                                  //     : null,
                                },
                                Platform.select({
                                  // web: {
                                  //   width: editCompany[row["ContactType"]]
                                  //     ? "98%"
                                  //     : "50%",
                                  // },
                                  android: {
                                    width: editCompany[row["ContactType"]]
                                      ? "98%"
                                      : "47%",
                                  },
                                  ios: {
                                    width: editCompany[row["ContactType"]]
                                      ? "98%"
                                      : "47%",
                                  },
                                }),
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
                                      <View
                                        style={{ alignItems: "flex-start" }}
                                      >
                                        <View style={{ maxWidth: 160 }}>
                                          <CustomText
                                            bold={true}
                                            style={[
                                              //      Platform.OS === "web" &&
                                              styles["card-text-underline"],
                                              {
                                                marginRight: 5,
                                                flexWrap: "wrap",
                                                // width:
                                                //   Platform.OS !== "web" &&
                                                //   "60%",
                                              },
                                            ]}
                                            onPress={(e) =>
                                              fnOpenVendorPage(row)
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
                                            // Platform.OS !== "web" && {
                                            //   flexDirection: "row",
                                            // },
                                          ]}
                                          ref={searchInputRef}
                                        >
                                          <InputField
                                            autoFocus={
                                              focusCompany[row["ContactType"]]
                                                ? true
                                                : false
                                            }
                                            value={
                                              AutoCinput[row["ContactType"]] ||
                                              ""
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
                                              right: 7,
                                              top:
                                                Platform.OS === "web" ? 35 : 30,
                                            }}
                                          >
                                            {otherProps[row["ContactType"]] && (
                                              <View
                                                style={{
                                                  right:
                                                    Platform.OS === "web"
                                                      ? 35
                                                      : 45,
                                                }}
                                              >
                                                <ArrowSpinner />
                                              </View>
                                            )}
                                            {!validation[row["ContactType"]] &&
                                              row["AgentID"] && (
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
                                              nestedScrollEnabled={true}
                                              // showsVerticalScrollIndicator={
                                              //   true
                                              // }
                                              // removeClippedSubviews={true}
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
                                                      opacity: pressed
                                                        ? 0.5
                                                        : 1,
                                                      borderWidth: 1,
                                                      borderColor: "silver",
                                                      borderTopWidth: 0,
                                                      backgroundColor:
                                                        i === selectedItemIndex
                                                          ? "#ffff00"
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
                                                  row.CompanyLicense ||
                                                  "#ffff00",
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
                                      <View style={styles["card-item"]}>
                                        {row.CompanyStreetAddr ? (
                                          <CustomText>
                                            {row.CompanyStreetAddr}
                                          </CustomText>
                                        ) : (
                                          <CustomText
                                            bold={true}
                                            style={[
                                              styles["card-lablebold"],
                                              styles["labelBackground"],
                                            ]}
                                          >
                                            {"Company Address"}
                                          </CustomText>
                                        )}
                                        <CustomText>
                                          {/* {getAddress(row.CompanyAddress) || ""} */}
                                          {`${row.CompanyCity}${
                                            row.CompanyCity && ","
                                          } ${row.CompanyState} ${
                                            row.CompanyZip
                                          }`}
                                        </CustomText>
                                        {!row.CompanyZip && (
                                          <CustomText
                                            bold={true}
                                            style={[
                                              styles["card-lablebold"],
                                              styles["labelBackground"],
                                            ]}
                                          >
                                            {"Company Zip"}
                                          </CustomText>
                                        )}
                                        {!row.CompanyCity && (
                                          <CustomText
                                            bold={true}
                                            style={[
                                              styles["card-lablebold"],
                                              styles["labelBackground"],
                                            ]}
                                          >
                                            {"Company City"}
                                          </CustomText>
                                        )}
                                        {!row.CompanyState && (
                                          <CustomText
                                            bold={true}
                                            style={[
                                              styles["card-lablebold"],
                                              styles["labelBackground"],
                                            ]}
                                          >
                                            {"Company State"}
                                          </CustomText>
                                        )}
                                      </View>

                                      <View style={styles["card-item"]}>
                                        {row.CompPhone ? (
                                          <CustomText>
                                            {row.CompPhone}
                                          </CustomText>
                                        ) : (
                                          <CustomText
                                            bold={true}
                                            style={[
                                              styles["card-lablebold"],
                                              styles["labelBackground"],
                                            ]}
                                          >
                                            {"Cell Phone"}
                                          </CustomText>
                                        )}
                                      </View>

                                      {[7, 2, 4, 17, 48, 49].includes(
                                        row["ContactType"]
                                      ) && (
                                        <>
                                          {queryString["IsEditRights"] == 1 ||
                                          !editCard[row["ContactType"]] ? (
                                            <View
                                              style={[
                                                styles["card-input"],
                                                styles["card-item"],
                                                { width: 130 },
                                              ]}
                                            >
                                              <InputField
                                                validate={
                                                  // saveValidation[
                                                  //   cardInfo[index][
                                                  //     "ContactType"
                                                  //   ]
                                                  // ] !== undefined
                                                  //   ? saveValidation[
                                                  //       cardInfo[index][
                                                  //         "ContactType"
                                                  //       ]
                                                  //     ]["FileNumber"]
                                                  //   : false
                                                  saveValidation[
                                                    cardInfo[index][
                                                      "ContactType"
                                                    ]
                                                  ]["FileNumber"]
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
                                              {[7, 2, 4, 17, 48, 49].includes(
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
                                                      // saveValidation[
                                                      //   cardInfo[index][
                                                      //     "ContactType"
                                                      //   ]
                                                      // ] !== undefined
                                                      //   ? saveValidation[
                                                      //       cardInfo[index][
                                                      //         "ContactType"
                                                      //       ]
                                                      //     ]["FileNumber"]
                                                      //   : false
                                                      saveValidation[
                                                        cardInfo[index][
                                                          "ContactType"
                                                        ]
                                                      ]["FileNumber"]
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
                                      {/* <CustomText bold={true}>
                                      {row.AgentFNN}
                                    </CustomText> */}

                                      {row.AgentFNN && (
                                        <CustomText bold={true}>
                                          {row.AgentFNN}
                                        </CustomText>
                                      )}
                                      {!row.FirstName && (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"FirstName"}
                                        </CustomText>
                                      )}
                                      {!row.LastName && (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"LastName"}
                                        </CustomText>
                                      )}
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
                                                  row.AgentLicense || "#ffff00",
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
                                    {/* {row.Phone !== "" && ( */}
                                    <View style={styles["card-item"]}>
                                      {/* <CustomText

                                      >
                                        {row.Phone}
                                      </CustomText> */}
                                      {row.Phone ? (
                                        <CustomText>{row.Phone}</CustomText>
                                      ) : (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Agent Cell Phone"}
                                        </CustomText>
                                      )}
                                    </View>
                                    {/* )} */}
                                    <View style={styles["card-item"]}>
                                      {/* <CustomText

                                    >
                                      {row.AgentEmail}
                                    </CustomText> */}
                                      {row.AgentEmail ? (
                                        <CustomText
                                          style={styles["card-text-underline"]}
                                          onPress={() => {
                                            let subject = "",
                                              body = "";
                                            const emailUrl = `mailto:${row.AgentEmail}`;
                                            //  Linking.openURL(emailUrl);
                                            window.open(emailUrl, "_self");
                                          }}
                                        >
                                          {row.AgentEmail}
                                        </CustomText>
                                      ) : (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Agent Email"}
                                        </CustomText>
                                      )}
                                    </View>
                                    <View
                                      style={[
                                        styles["card-item"],
                                        {
                                          display: "block",
                                        },
                                      ]}
                                    >
                                      {row.GroupEmail && (
                                        <>
                                          <CustomText
                                            style={[
                                              styles["card-text-underline"],
                                              { width: "fit-content" },
                                            ]}
                                            onPress={() => {
                                              let subject = "",
                                                body = "";
                                              const emailUrl = `mailto:${row.GroupEmail}`;
                                              //  Linking.openURL(emailUrl);
                                              window.open(emailUrl, "_self");
                                            }}
                                          >{`${row.GroupEmail}`}</CustomText>
                                          <CustomText
                                            style={{
                                              fontSize: 12,
                                              width: "fit-content",
                                            }}
                                          >
                                            {" (Group)"}
                                          </CustomText>
                                        </>
                                      )}
                                    </View>

                                    {closingAgentInfo?.[
                                      row[["ContactType"]]
                                    ] && (
                                      <>
                                        <CustomText
                                          style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: "#428bca",
                                            marginTop: 15,
                                            // marginBottom: 5,
                                          }}
                                        >
                                          Closing Agent
                                        </CustomText>
                                        <CustomText bold={true}>{`${
                                          closingAgentInfo?.[
                                            row[["ContactType"]]
                                          ]?.["FirstName"] || ""
                                        } ${
                                          closingAgentInfo?.[
                                            row[["ContactType"]]
                                          ]?.["LastName"] || ""
                                        }`}</CustomText>

                                        <CustomText>
                                          {FormatPhoneLogin(
                                            closingAgentInfo?.[
                                              row[["ContactType"]]
                                            ]?.["Phone"]
                                          ) || ""}
                                        </CustomText>
                                        <CustomText
                                          style={[
                                            styles["card-text-underline"],
                                            { width: "fit-content" },
                                          ]}
                                          onPress={() => {
                                            let subject = "",
                                              body = "";
                                            const emailUrl = `mailto:${
                                              closingAgentInfo?.[
                                                row[["ContactType"]]
                                              ]?.["Email"] || ""
                                            }`;
                                            //  Linking.openURL(emailUrl);
                                            window.open(emailUrl, "_self");
                                          }}
                                        >
                                          {closingAgentInfo?.[
                                            row[["ContactType"]]
                                          ]?.["Email"] || ""}
                                        </CustomText>
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
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                  {
                                    flexBasis:
                                      Platform.OS !== "web"
                                        ? width * 2 + 40
                                        : null,
                                  },
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
                                    handleCardChange(
                                      index,
                                      "Companyname",
                                      Text
                                    );
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
                              style={[
                                styles["card-body"],
                                { paddingTop: 0 },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                  {
                                    flexBasis:
                                      Platform.OS !== "web" ? width + 20 : null,
                                  },
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
                                    ]["LastName"]
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
                              style={[
                                {
                                  padding: 10,
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  flexDirection: "row",
                                },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              <View
                                style={[
                                  styles["card-input"],
                                  // styles["card-item"],
                                  { width: "31%" },
                                ]}
                              >
                                <InputField
                                  validate={
                                    // saveValidation[
                                    //   cardInfo[index]["ContactType"]
                                    // ] !== undefined
                                    //   ? saveValidation[
                                    //       cardInfo[index]["ContactType"]
                                    //     ]["Phone"]
                                    //   : false
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["Phone"]
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
                                  //styles["card-item"],
                                  { width: "67%", marginLeft: 9 },
                                ]}
                              >
                                <InputField
                                  validate={
                                    // saveValidation[
                                    //   cardInfo[index]["ContactType"]
                                    // ] !== undefined
                                    //   ? saveValidation[
                                    //       cardInfo[index]["ContactType"]
                                    //     ]["AgentEmail"]
                                    //   : false
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["AgentEmail"]
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
                              style={[
                                {
                                  padding: 10,
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  flexDirection: "row",
                                },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              {row["ContactType"] !== 7 ? (
                                <View
                                  style={[
                                    styles["card-input"],
                                    // styles["card-item"],
                                    { width: "31%" },
                                  ]}
                                >
                                  <InputField
                                    validate={
                                      saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ] !== undefined
                                        ? saveValidation[
                                            cardInfo[index]["ContactType"]
                                          ]["AgentLicense"]
                                        : false
                                      // saveValidation[
                                      //   cardInfo[index]["ContactType"]
                                      // ]["AgentLicense"]
                                    }
                                    label="License Number"
                                    // autoFocus
                                    type="default"
                                    name=""
                                    value={cardInfo[index]["AgentLicense"]}
                                    placeholder="License Number"
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
                              ) : (
                                <View
                                  style={[
                                    styles["card-input"],
                                    // styles["card-item"],
                                    { width: "31%" },
                                  ]}
                                ></View>
                              )}
                              <View
                                style={[
                                  styles["card-input"],
                                  //styles["card-item"],
                                  { width: "67%", marginLeft: 9 },
                                ]}
                              >
                                {enableGroupEmail[
                                  cardInfo[index]["ContactType"]
                                ] || cardInfo[index]["GroupEmail"] ? (
                                  <InputField
                                    validate={
                                      saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ] !== undefined
                                        ? saveValidation[
                                            cardInfo[index]["ContactType"]
                                          ]["GroupEmail"]
                                        : false
                                      // saveValidation[
                                      //   cardInfo[index]["ContactType"]
                                      // ]["AgentLicense"]
                                    }
                                    label="Group Email"
                                    // autoFocus
                                    type="default"
                                    name=""
                                    value={cardInfo[index]["GroupEmail"]}
                                    placeholder="Group Email"
                                    onChangeText={(Text) => {
                                      handleCardChange(
                                        index,
                                        "GroupEmail",
                                        Text
                                      );
                                    }}
                                  />
                                ) : (
                                  <CustomText
                                    style={{
                                      alignSelf: "end",
                                      alignContent: "center",
                                      flex: 1,
                                      fontSize: 12,
                                      color: "#215f9a",
                                      float: "left",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setEnableGroupEmail((preInfo) => {
                                        return {
                                          ...preInfo,
                                          [cardInfo[index]["ContactType"]]:
                                            !enableGroupEmail[
                                              cardInfo[index]["ContactType"]
                                            ],
                                        };
                                      });
                                    }}
                                  >
                                    + Add Group Email
                                  </CustomText>
                                )}
                              </View>
                            </View>
                            <View
                              style={[
                                {
                                  padding: 10,
                                  paddingTop: 0,
                                  paddingBottom: 0,
                                  flexDirection: "row",
                                },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              <View
                                style={[
                                  styles["card-input"],
                                  //styles["card-item"],
                                  { width: "63%" },
                                ]}
                              >
                                <InputField
                                  validate={
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["CompanyStreetAddr"]
                                  }
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
                                  //styles["card-item"],
                                  { width: "35%", marginLeft: 9 },
                                ]}
                              >
                                <InputField
                                  validate={
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["CompanyZip"]
                                  }
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
                                      index,
                                      "Vendor"
                                    );
                                  }}
                                />
                              </View>
                            </View>
                            <View
                              style={[
                                styles["card-body"],
                                Platform.select({
                                  web: {
                                    paddingTop: 10,
                                  },
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                  {
                                    flexBasis:
                                      Platform.OS !== "web" ? width + 20 : null,
                                  },
                                ]}
                              >
                                <InputField
                                  validate={
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["CompanyCity"]
                                  }
                                  label="Company City"
                                  //   autoFocus
                                  type="default"
                                  name="CompanyAddress"
                                  value={cardInfo[index]["CompanyCity"] || ""}
                                  placeholder="Company City"
                                  onChangeText={(Text) => {
                                    handleCardChange(
                                      index,
                                      "CompanyCity",
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
                              >
                                <InputField
                                  validate={
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["CompanyState"]
                                  }
                                  label="Company State"
                                  //   autoFocus
                                  type="default"
                                  name="CompanyState"
                                  value={cardInfo[index]["CompanyState"] || ""}
                                  placeholder="Company State"
                                  onChangeText={(Text) => {
                                    handleCardChange(
                                      index,
                                      "CompanyState",
                                      Text
                                    );
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
                                  {
                                    flexBasis:
                                      Platform.OS !== "web" ? width + 20 : null,
                                  },
                                ]}
                              >
                                <InputField
                                  validate={
                                    // saveValidation[
                                    //   cardInfo[index]["ContactType"]
                                    // ] !== undefined
                                    //   ? saveValidation[
                                    //       cardInfo[index]["ContactType"]
                                    //     ]["CompPhone"]
                                    //   : false
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["CompPhone"]
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
                                    handleCardChange(
                                      index,
                                      "CompPhone",
                                      number
                                    );
                                  }}
                                />
                              </View>
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                  {
                                    flexBasis:
                                      Platform.OS !== "web" ? width + 20 : null,
                                  },
                                ]}
                              ></View>
                            </View>
                            <View
                              style={[
                                styles["card-body"],
                                {
                                  paddingTop: 0,
                                },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              {cardInfo[index]["ContactType"] != 7 ? (
                                <>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    <InputField
                                      validate={
                                        // saveValidation[
                                        //   cardInfo[index]["ContactType"]
                                        // ] !== undefined
                                        //   ? saveValidation[
                                        //       cardInfo[index]["ContactType"]
                                        //     ]["AgentEmail"]
                                        //   : false
                                        saveValidation[
                                          cardInfo[index]["ContactType"]
                                        ]["CompanyLicense"]
                                      }
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
                            </View>
                            <View
                              style={[
                                styles["card-body"],
                                {
                                  paddingTop: 0,
                                },
                                Platform.select({
                                  android: {
                                    paddingTop: 5,
                                  },
                                  ios: {
                                    paddingTop: 5,
                                  },
                                }),
                              ]}
                            >
                              {[7, 2, 4, 17, 48, 49].includes(
                                row["ContactType"]
                              ) ? (
                                <>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    <InputField
                                      validate={
                                        // saveValidation[
                                        //   cardInfo[index]["ContactType"]
                                        // ] !== undefined
                                        //   ? saveValidation[
                                        //       cardInfo[index]["ContactType"]
                                        //     ]["FileNumber"]
                                        //   : false

                                        saveValidation[
                                          cardInfo[index]["ContactType"]
                                        ]["FileNumber"]
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
                                        handleCardChange(
                                          index,
                                          "FileNumber",
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
                            </View>
                            {!enableClosingAgent[
                              `${row["ContactType"]}_Add`
                            ] ? (
                              <View
                                style={[
                                  styles["card-body"],
                                  {
                                    paddingTop: 0,
                                    "grid-template-columns": "repeat(1, 1fr)",
                                  },
                                  Platform.select({
                                    android: {
                                      paddingTop: 5,
                                    },
                                    ios: {
                                      paddingTop: 5,
                                    },
                                  }),
                                ]}
                              >
                                {[4].includes(Number(row["ContactType"])) ? (
                                  <>
                                    {!enableClosingAgent[row["ContactType"]] ? (
                                      <CustomText
                                        style={{
                                          marginVertical: 10,
                                          alignSelf: "end",
                                          alignContent: "center",
                                          flex: 1,
                                          fontSize: 12,
                                          color: "#215f9a",
                                          float: "left",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setEnableClosingAgent((preInfo) => {
                                            return {
                                              ...preInfo,
                                              [row["ContactType"]]:
                                                !enableClosingAgent[
                                                  row["ContactType"]
                                                ],
                                            };
                                          });
                                        }}
                                      >
                                        + Add Closing Agent
                                      </CustomText>
                                    ) : (
                                      <View
                                        style={[styles["card-input"]]}
                                        ref={searchInputRef}
                                      >
                                        <InputField
                                          autoFocus={
                                            focusCompany[60] ? true : false
                                          }
                                          value={AutoCinput[60]}
                                          label="Search for Closing Agent"
                                          type="default"
                                          name="EmailorCellPhone"
                                          Key={row["ContactType"]}
                                          onChangeText={(text) => {
                                            handleCompanySearch(
                                              text,
                                              60,
                                              row["VendorId"],
                                              row["ContactType"]
                                            );
                                          }}
                                          onKeyPress={(e) => {
                                            setSelectedItemIndex(-1);
                                            fnFocusInput(e);
                                          }}
                                          onBlur={(event) => {
                                            fnShowAddNew(60, "Hide", event);
                                          }}
                                          onFocus={(e) => {
                                            fnShowAddNew(
                                              60,
                                              "Show",
                                              row["ContactType"]
                                            );
                                          }}
                                          placeholder="Search for Closing Agent"
                                        />
                                        <CustomText
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 35,
                                          }}
                                        >
                                          {otherProps["60"] && (
                                            <View
                                              style={{
                                                right:
                                                  Platform.OS === "web"
                                                    ? 30
                                                    : 0,
                                              }}
                                            >
                                              <ArrowSpinner />
                                            </View>
                                          )}
                                          {!validation[60] && (
                                            <FontAwesome
                                              name="close"
                                              style={[
                                                styles["modal-close"],
                                                {
                                                  color: "red",
                                                  // cursor: "pointer",
                                                  opacity: 0.8,
                                                  top: -2,
                                                },
                                              ]}
                                              strokeWidth={30}
                                              size={17}
                                              color={"black"}
                                              onPress={(event) => {
                                                setEnableClosingAgent(
                                                  (prevInfo) => {
                                                    return {
                                                      ...prevInfo,
                                                      [row[
                                                        "ContactType"
                                                      ]]: false,
                                                    };
                                                  }
                                                );
                                                setData({});
                                                setInput({});
                                              }}
                                            />
                                          )}
                                        </CustomText>
                                        {AutoCompdata[60] && (
                                          <FlatList
                                            style={styles["search-drop-down"]}
                                            data={AutoCompdata[60]}
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
                                                        ? "#ffff00"
                                                        : i % 2 == 0
                                                        ? "#d9ecff"
                                                        : "#fff",
                                                  },
                                                  isHovered &&
                                                    styles["HoverBgColor"],
                                                ]}
                                                onPress={(e) => {
                                                  handleOnkeyPressFlatlist(
                                                    closingAgentInfo[
                                                      selectedItemIndex
                                                    ],
                                                    row["ContactType"]
                                                  );
                                                }}
                                              >
                                                <View>
                                                  {handleTypeaheadOption(
                                                    item,
                                                    i,
                                                    row["ContactType"]
                                                  )}
                                                </View>
                                              </Pressable>
                                            )}
                                            keyExtractor={(item) => item.id}
                                          />
                                        )}
                                      </View>
                                    )}{" "}
                                  </>
                                ) : null}
                              </View>
                            ) : (
                              <View
                                style={[
                                  styles["card-body"],
                                  {
                                    paddingTop: 0,
                                  },
                                  Platform.select({
                                    android: {
                                      paddingTop: 5,
                                    },
                                    ios: {
                                      paddingTop: 5,
                                    },
                                  }),
                                ]}
                              >
                                <>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    <CustomText
                                      style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#428bca",
                                      }}
                                    >
                                      Closing Agent{" "}
                                    </CustomText>
                                  </View>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    {enableClosingAgent[
                                      `${row["ContactType"]}_Change`
                                    ] ? (
                                      <View style={styles["btn"]}>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setEnableClosingAgent({
                                              ...enableClosingAgent,
                                              [`${row["ContactType"]}_Change`]: false,
                                            });
                                            handleClosingAgentSave({
                                              ...closingAgentInfo[
                                                row["ContactType"]
                                              ],
                                              IsCloserNeeded: 1,
                                              ContactTypeId: row["ContactType"],
                                            });
                                          }}
                                          style={[
                                            [styles.buttonContainer],
                                            // { backgroundColor: "#ffb752" },
                                            { backgroundColor: "#5e9cd3" },
                                          ]}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { color: "#ffffff" },
                                            ]}
                                          >
                                            {"Save"}
                                          </CustomText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setEnableClosingAgent({
                                              ...enableClosingAgent,
                                              [`${row["ContactType"]}_Change`]: false,
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
                                              { color: "#ffffff" },
                                            ]}
                                          >
                                            {"Cancel"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </View>
                                    ) : (
                                      <View style={styles["btn"]}>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setEnableClosingAgent({
                                              ...enableClosingAgent,
                                              [row["ContactType"]]: true,
                                              [`${row["ContactType"]}_Add`]: false,
                                            });
                                          }}
                                          style={[
                                            [styles.buttonContainer],
                                            // { backgroundColor: "#ffb752" },
                                            { backgroundColor: "#5e9cd3" },
                                          ]}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { color: "#ffffff" },
                                            ]}
                                          >
                                            {"Change"}
                                          </CustomText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={(e) => {
                                            setEnableClosingAgent({
                                              ...enableClosingAgent,
                                              [row["ContactType"]]: false,
                                              [`${row["ContactType"]}_Add`]: false,
                                            });
                                            setClosingAgentInfo({
                                              ...closingAgentInfo,
                                              [row["ContactType"]]: undefined,
                                            });
                                            handleClosingAgentSave({
                                              ...closingAgentInfo[
                                                row["ContactType"]
                                              ], // Dummy purpose
                                              IsCloserNeeded: 0,
                                              ContactTypeId: row["ContactType"],
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
                                              { color: "#ffffff" },
                                            ]}
                                          >
                                            {"Remove"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                  </View>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    <InputField
                                      // validate={
                                      //   saveValidation[
                                      //     cardInfo[index]["ContactType"]
                                      //   ]["FileNumber"]
                                      // }
                                      label={"First Name"}
                                      //autoFocus
                                      type="default"
                                      name={"First Name"}
                                      value={
                                        closingAgentInfo?.[
                                          row[["ContactType"]]
                                        ]?.["FirstName"] || ""
                                      }
                                      placeholder={"First Name"}
                                      onChangeText={(Text) => {
                                        handleClosingAgentOnchange(
                                          row["ContactType"],
                                          "FirstName",
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
                                  >
                                    <InputField
                                      // validate={
                                      //   saveValidation[
                                      //     cardInfo[index]["ContactType"]
                                      //   ]["FileNumber"]
                                      // }
                                      label={"Last Name"}
                                      //autoFocus
                                      type="default"
                                      name={"Last Name"}
                                      value={
                                        closingAgentInfo?.[
                                          row[["ContactType"]]
                                        ]?.["LastName"] || ""
                                      }
                                      placeholder={"Last Name"}
                                      onChangeText={(Text) => {
                                        handleClosingAgentOnchange(
                                          row["ContactType"],
                                          "LastName",
                                          Text
                                        );
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      {
                                        flexBasis:
                                          Platform.OS !== "web"
                                            ? width + 20
                                            : null,
                                      },
                                    ]}
                                  >
                                    <InputField
                                      label={"Cell Phone"}
                                      //autoFocus
                                      type="default"
                                      name={"Cell Phone"}
                                      value={
                                        closingAgentInfo?.[
                                          row[["ContactType"]]
                                        ]?.["Phone"] || ""
                                      }
                                      placeholder={"Cell Phone"}
                                      onChangeText={(Text) => {
                                        handleClosingAgentOnchange(
                                          row["ContactType"],
                                          "Phone",
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
                                  >
                                    <InputField
                                      // validate={
                                      //   saveValidation[
                                      //     cardInfo[index]["ContactType"]
                                      //   ]["FileNumber"]
                                      // }
                                      label={"Email"}
                                      //autoFocus
                                      type="default"
                                      name={"Email"}
                                      value={
                                        closingAgentInfo?.[
                                          row[["ContactType"]]
                                        ]?.["Email"] || ""
                                      }
                                      placeholder={"Email"}
                                      onChangeText={(Text) => {
                                        handleClosingAgentOnchange(
                                          row["ContactType"],
                                          "Email",
                                          Text
                                        );
                                      }}
                                    />
                                  </View>
                                </>
                              </View>
                            )}
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
                              Platform.select({
                                android: {
                                  maxWidth: "50%",
                                },
                                ios: {
                                  maxWidth: "50%",
                                },
                              }),
                            ]}
                          >
                            <CustomText style={[styles["btn"]]}>
                              {`Print ${row.ContactTypename} Request`}
                            </CustomText>
                          </TouchableOpacity>
                        ) : (
                          <View></View>
                        )}
                        {[7].includes(row["ContactType"]) ? (
                          <View>
                            {VendorServiceRights == 1 ||
                            VendorServiceRights == "1" ? (
                              <TouchableOpacity
                                onPress={(e) => {
                                  // fnPrintVendor(row["ContactType"]);
                                  toggleSecondaryHazardModal("SecondaryHazard");
                                }}
                                style={[
                                  [styles.buttonContainer],
                                  { alignSelf: "center", padding: 5 },
                                  Platform.select({
                                    android: {
                                      maxWidth: "50%",
                                    },
                                    ios: {
                                      maxWidth: "50%",
                                    },
                                  }),
                                ]}
                              >
                                <CustomText style={[styles["btn"]]}>
                                  {`Secondary Hazard Insurance`}
                                </CustomText>
                              </TouchableOpacity>
                            ) : (
                              <View></View>
                            )}
                          </View>
                        ) : (
                          <View></View>
                        )}
                        {[2, 48].includes(row["ContactType"]) && (
                          <View
                            style={[
                              // styles["card-item"],
                              { flexDirection: "row", alignItems: "center" },
                            ]}
                          >
                            <CustomText
                              bold={true}
                              style={[
                                styles["card-lablebold"],
                                { color: "#ffffff" },
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
                            <View></View>
                            {/*Dummy View for spacing alignment*/}
                            <View
                              style={[
                                // styles["card-item"],
                                { flexDirection: "row", alignItems: "center" },
                              ]}
                            >
                              <CustomText
                                bold={true}
                                style={[
                                  styles["card-lablebold"],
                                  { color: "#ffffff" },
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
              <View
                style={{ display: Platform.OS === "web" ? "none" : "none" }}
              >
                <Button
                  onPress={handleParentWindowSave}
                  title={"Parent Save"}
                />
              </View>
            </View>
            {/* </TouchableWithoutFeedback> */}
            {/* Grids Section */}
            {Platform.OS === "web" &&
              handleParamFromURL(document.location.href, "ViewType") == "1" && (
                <View style={styles["table-container"]}>
                  {/* <ScrollView> */}
                  <Table
                    borderStyle={{
                      borderWidth: 1,
                      borderColor: "transparent",
                    }}
                    style={styles["table-scroll"]}
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
                        ![9, 19].includes(rowData["ContactType"])
                          ? rowData["ContactType"] == 3 // Appraiser
                            ? tabelProps.AppraiserRows.map((rowData, i) => {
                                let Rows = [];
                                if (
                                  i === 0 &&
                                  queryString["SignOffLevel"] > 4
                                ) {
                                  rowData["IsButton"] = true;
                                  Rows.push(CustomTableRow(rowData, -1));
                                }
                                if (
                                  tabelProps.AppraiserRows[0]["AgentID"] !=
                                    -1 &&
                                  tabelProps.AppraiserRows[0]["AgentID"] != 0
                                )
                                  Rows.push(CustomTableRow(rowData, i));

                                return (
                                  <View
                                    style={{
                                      zIndex: i > 0 ? -11 : -1,
                                      borderColor: "#000", // Black
                                      borderWidth: 2,
                                      borderTopWidth: i !== 0 ? 0 : 2,
                                      borderBottomWidth:
                                        i ===
                                        tabelProps.AppraiserRows.length - 1
                                          ? 2
                                          : 0,
                                    }}
                                  >
                                    {Rows}
                                  </View>
                                );
                                //return Rows;
                              })
                            : rowData["ContactType"] == 999 // Non-Borrower
                            ? tabelProps.NonBorroweRows.map((rowData, i) => {
                                let Rows = [],
                                  Agent =
                                    tabelProps.NonBorroweRows[0]["AgentID"];
                                if (i === 0) {
                                  rowData["IsButton"] = true;
                                  Rows.push(CustomTableRow(rowData, -1));
                                }
                                if (
                                  i != 0 &&
                                  Agent !== 0 &&
                                  tabelProps.NonBorroweRows.length != 1
                                )
                                  Rows.push(CustomTableRow(rowData, i));
                                return (
                                  <View
                                    style={{
                                      zIndex: -1,
                                      borderColor: "black",
                                      borderWidth: 2,
                                      marginTop: 2,

                                      borderTopWidth: i !== 0 ? 0 : 2,
                                      borderBottomWidth:
                                        i ===
                                        tabelProps.NonBorroweRows.length - 1
                                          ? 2
                                          : 0,
                                    }}
                                  >
                                    {Rows}
                                  </View>
                                );
                              })
                            : rowData["ContactType"] == 52 // Notary
                            ? CustomTableRow(
                                rowData,
                                !rowData["AgentID"] ? -1 : index
                              )
                            : rowData["ContactType"] == 56 && // Condo PUD
                              rowData["DisplaySeller"] == 1
                            ? CustomTableRow(
                                rowData,
                                !rowData["AgentID"] ? -1 : index
                              )
                            : rowData["ContactType"] !== 56 && // Other categories
                              CustomTableRow(rowData, index)
                          : null}
                      </>
                    ))}
                  </Table>
                  {/* </ScrollView> */}
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
                  //maxWidth: Platform.OS === "web" ? "1000px" : null,
                  //minWidth: Platform.OS === "web" ? "500px" : null,
                  margin: 45,
                  flex: null,
                  ...Platform.select({
                    web: {
                      alignSelf: "center",
                    },
                    android: {
                      width: "96%",
                      alignSelf: "center",
                    },
                    ios: {
                      width: "96%",
                      alignSelf: "center",
                    },
                  }),
                }}
              >
                <View>
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
                    <View
                      style={[
                        // Platform.OS !== "web" && {
                        //    width: 430
                        // },
                        Platform.select({
                          android: {
                            width: "95%",
                          },
                          ios: {
                            width: "95%",
                          },
                        }),
                        // { width: 430 },
                      ]}
                    >
                      <View
                        style={[
                          styles["card-input"],
                          // styles["card-item"],
                          Platform.OS === "web" && {
                            width: 420,
                          },
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
                            <View
                              style={{ right: Platform.OS === "web" ? 30 : 0 }}
                            >
                              <ArrowSpinner />
                            </View>
                          )}
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
                                        ? "#ffff00"
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
                    <Table
                      // borderStyle={{
                      //   borderWidth: 1,
                      //   borderColor: "transparent",
                      //   maxWidth: 430,
                      // }}
                      style={{ paddingTop: 10, zIndex: -1 }}
                    >
                      {/* Header */}
                      <View
                        style={[
                          styles["table-head"],
                          { color: "#fff", flexDirection: "row" },
                        ]}
                      >
                        <Cell
                          // style={[styles['Grid-Cell-Border']]}
                          data={[
                            <View
                              style={{
                                marginBottom: 5,
                              }}
                            >
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"First Name"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Last Name"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                          style={[styles["Grid-Cell-Border"], { width: 76 }]}
                        ></Cell>
                        <Cell
                          style={[
                            styles["Grid-Cell-Border"],
                            { width: Platform.OS === "web" ? 205 : 150 },
                          ]}
                          data={[
                            <View>
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Entity Name"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Address"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                        ></Cell>
                        <Cell
                          data={[
                            <View>
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Cell Phone"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Email"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                          style={[{ width: 100 }]}
                        ></Cell>
                        {/* <Cell data={[]} style={{ width: 70 }}></Cell> */}
                        {/* <Cell data={"T1"}></Cell>
                      <Cell data={"T1"}></Cell>
                      <Cell data={"T1"}></Cell> */}
                      </View>

                      {sellerInfo.RowData?.map((rowData, index) => (
                        <>
                          {/* {sellerTabelProps["EditRow"][index] !== true && ( */}
                          <TableWrapper
                            key={index - 1}
                            style={[
                              styles["table-row"],
                              {
                                backgroundColor:
                                  index % 2 == 0 ? "#deebf7" : "#fff",
                                maxWidth: 430,
                              },
                              sellerInfo.RowData.length - 1 === index &&
                                styles["table-row-bottom-border"],
                              styles["table-row-LeftRight-border"],
                            ]}
                          >
                            {sellerTabelProps["EditRow"][index] !== true ? (
                              <>
                                <Cell
                                  width={76}
                                  key={"cell1"}
                                  style={[
                                    Platform.select({
                                      web: { display: "block" },
                                    }),
                                    styles["Grid-Cell-Border"],
                                  ]}
                                  data={[
                                    <View>
                                      <View>
                                        <CustomText
                                          style={[
                                            { fontSize: 11, color: "#4b545d" },
                                          ]}
                                        >
                                          {rowData.FirstName}
                                        </CustomText>
                                      </View>
                                      <View>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                            marginTop: 5,
                                          }}
                                        >
                                          {rowData.LastName}
                                        </CustomText>
                                      </View>
                                    </View>,
                                  ]}
                                />
                                {/* <Cell
                                width={74}
                                key={"cell1"}
                                data={[
                                  <CustomText
                                    style={{ fontSize: 11, color: "#4b545d" }}
                                  >
                                    {rowData.LastName}
                                  </CustomText>,
                                ]}
                              /> */}
                                <Cell
                                  width={Platform.OS === "web" ? 205 : 150}
                                  key={"cell2"}
                                  style={[
                                    Platform.select({
                                      web: { display: "block" },
                                    }),
                                    styles["Grid-Cell-Border"],
                                  ]}
                                  data={[
                                    <View>
                                      <View>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                          }}
                                        >
                                          {rowData.Companyname}
                                        </CustomText>
                                      </View>
                                      <View style={{ marginTop: 5 }}>
                                        <View>
                                          <CustomText
                                            style={{
                                              fontSize: 11,
                                              color: "#4b545d",
                                            }}
                                          >
                                            {`${rowData.CompanyStreetAddr}`}
                                          </CustomText>
                                        </View>
                                        <View>
                                          <CustomText
                                            style={{
                                              fontSize: 11,
                                              color: "#4b545d",
                                            }}
                                          >
                                            {`${rowData.CompanyCity}${
                                              rowData.CompanyCity && ","
                                            } ${rowData.CompanyState} ${
                                              rowData.CompanyZip
                                            }`}
                                          </CustomText>
                                        </View>
                                      </View>
                                    </View>,
                                  ]}
                                />

                                <Cell
                                  width={125}
                                  key={"cell3"}
                                  //style={[styles['Grid-Cell-Border']]}
                                  data={[
                                    <View>
                                      <View style={{ width: 100 }}>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                          }}
                                        >
                                          {rowData.Phone}
                                        </CustomText>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                            marginTop: 5,
                                          }}
                                        >
                                          {rowData.AgentEmail}
                                        </CustomText>
                                      </View>
                                      <View
                                        style={{
                                          paddingTop: 5,
                                          paddingBottom: 5,
                                          flexDirection: "row",
                                        }}
                                      >
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
                                                minWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 25,
                                                maxWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 25,
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
                                            handleRemoveSellerOrAgent(
                                              rowData,
                                              index
                                            );
                                          }}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { fontSize: 10 },
                                            ]}
                                          >
                                            {"Remove"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </View>
                                    </View>,
                                  ]}
                                />
                                {/* <Cell
                                key={"cell4"}
                                width={70}
                                data={[

                                ]}
                              /> */}
                              </>
                            ) : (
                              <>
                                <View
                                  style={{
                                    width:
                                      Platform.OS === "web" ? "100%" : "98%",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles["card-body"],
                                      { padding: 0 },
                                      Platform.select({
                                        android: {
                                          width: "49%",
                                        },
                                        ios: {
                                          width: "49%",
                                        },
                                      }),
                                    ]}
                                  >
                                    <View style={styles["card-input"]}>
                                      <InputField
                                        autoFocus
                                        type="default"
                                        value={
                                          sellerTabelProps["ModifiedJson"][
                                            index
                                          ].FirstName
                                        }
                                        label="First Name"
                                        placeholder="First Name"
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
                                    </View>
                                    <View style={styles["card-input"]}>
                                      <InputField
                                        //autoFocus
                                        type="default"
                                        label="Last Name"
                                        value={
                                          sellerTabelProps["ModifiedJson"][
                                            index
                                          ].LastName
                                        }
                                        placeholder="Last Name"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none", display: "block" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleGridChange(
                                            index,
                                            "LastName",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>

                                  <View
                                    style={[
                                      styles["card-input"],
                                      { paddingTop: 20 },
                                    ]}
                                  >
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
                                    />
                                  </View>
                                  {/* <View
                                    style={{
                                      padding: 0,
                                      flexDirection: "row",
                                    }}
                                  >
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { paddingTop: 5 },
                                      ]}
                                    > */}
                                  <View
                                    style={{
                                      padding: 0,
                                      paddingTop: 5,
                                      flexDirection: "row",
                                    }}
                                  >
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "35%", marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        //autoFocus
                                        type="default"
                                        label="Cell Phone"
                                        value={
                                          sellerTabelProps["ModifiedJson"][
                                            index
                                          ].Phone
                                        }
                                        placeholder="Cell Phone"
                                        onChangeText={(Text) => {
                                          handleGridChange(
                                            index,
                                            "Phone",
                                            Text
                                          );
                                        }}
                                        onBlur={(e) => {
                                          let number = FormatPhoneLogin(
                                            sellerTabelProps["ModifiedJson"][
                                              index
                                            ].Phone
                                          );
                                          handleGridChange(
                                            index,
                                            "Phone",
                                            number
                                          );
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "62%" },
                                      ]}
                                    >
                                      <InputField
                                        //autoFocus
                                        type="default"
                                        value={
                                          sellerTabelProps["ModifiedJson"][
                                            index
                                          ].AgentEmail
                                        }
                                        label="Email"
                                        placeholder="Email"
                                        onChangeText={(Text) => {
                                          handleGridChange(
                                            index,
                                            "AgentEmail",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                  {/* </View> */}
                                  {/* <View
                                      style={[
                                        styles["card-input"],
                                        {
                                          width: "19%",
                                          justifyContent: "center",
                                        },
                                      ]}
                                    >
                                      {sellerTabelProps["EditRow"][index] ===
                                        true && (
                                        <View>
                                          <TouchableOpacity
                                            style={[
                                              [styles.buttonContainer],
                                              {
                                                alignSelf: "center",
                                                padding: 5,
                                              },
                                            ]}
                                            onPress={(e) => {
                                              setSellerTabelProps({
                                                ...sellerTabelProps,
                                                EditRow: {
                                                  ...sellerTabelProps[
                                                    "EditRow"
                                                  ],
                                                  [index]: false,
                                                },
                                              });
                                              handleVendorSave(index, "Seller");
                                            }}
                                          >
                                            <CustomText
                                              style={[
                                                styles["btn"],
                                                {
                                                  fontSize: 10,
                                                  minWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                  maxWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                },
                                              ]}
                                            >
                                              {"Save"}
                                            </CustomText>
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            style={[
                                              [styles.buttonContainer],
                                              {
                                                alignSelf: "center",
                                                padding: 5,
                                              },
                                            ]}
                                            onPress={(e) => {
                                              setSellerTabelProps({
                                                ...sellerTabelProps,
                                                EditRow: {
                                                  ...sellerTabelProps[
                                                    "EditRow"
                                                  ],
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
                                                  minWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                  maxWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                },
                                              ]}
                                            >
                                              {"Cancel"}
                                            </CustomText>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    </View> */}
                                  {/* </View> */}
                                  <View
                                    style={[
                                      styles["card-input"],
                                      { paddingTop: 20 },
                                    ]}
                                  >
                                    <InputField
                                      //autoFocus
                                      type="default"
                                      label="Seller Street Address"
                                      value={
                                        sellerTabelProps["ModifiedJson"][index]
                                          .CompanyStreetAddr
                                      }
                                      placeholder="Seller Street Address"
                                      onChangeText={(Text) => {
                                        handleGridChange(
                                          index,
                                          "CompanyStreetAddr",
                                          Text
                                        );
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      padding: 0,
                                      flexDirection: "row",
                                      paddingTop: 5,
                                      paddingBottom: 5,
                                    }}
                                  >
                                    {/* <View
                                      style={[
                                        styles["card-input"],
                                        { paddingTop: 5 },
                                      ]}
                                    > */}
                                    <View
                                      style={[
                                        styles["card-body"],
                                        { padding: 0 },
                                        Platform.select({
                                          android: {
                                            width: "27%",
                                          },
                                          ios: {
                                            width: "27%",
                                          },
                                          web: {
                                            gridTemplateColumns:
                                              "repeat(3,1fr)",
                                            width: "85%",
                                          },
                                        }),
                                      ]}
                                    >
                                      <View style={styles["card-input"]}>
                                        <InputField
                                          //autoFocus
                                          type="default"
                                          value={
                                            sellerTabelProps["ModifiedJson"][
                                              index
                                            ].CompanyZip
                                          }
                                          label="Zip Code"
                                          placeholder="Zip Code"
                                          // style={[
                                          //   styles["grid-input"],
                                          //   { outline: "none" },
                                          // ]}
                                          onChangeText={(Text) => {
                                            handleGridChange(
                                              index,
                                              "CompanyZip",
                                              Text
                                            );
                                          }}
                                          onBlur={(e) => {
                                            fnAutoPopulateStateCity(
                                              sellerTabelProps["ModifiedJson"][
                                                index
                                              ].CompanyZip,
                                              index,
                                              "Seller"
                                            );
                                          }}
                                        />
                                      </View>
                                      <View style={styles["card-input"]}>
                                        <InputField
                                          //autoFocus
                                          type="default"
                                          label="City"
                                          value={
                                            sellerTabelProps["ModifiedJson"][
                                              index
                                            ].CompanyCity
                                          }
                                          placeholder="City"
                                          // style={[
                                          //   styles["grid-input"],
                                          //   { outline: "none", display: "block" },
                                          // ]}
                                          onChangeText={(Text) => {
                                            handleGridChange(
                                              index,
                                              "CompanyCity",
                                              Text
                                            );
                                          }}
                                        />
                                      </View>
                                      <View style={styles["card-input"]}>
                                        <InputField
                                          //autoFocus
                                          type="default"
                                          label="State"
                                          value={
                                            sellerTabelProps["ModifiedJson"][
                                              index
                                            ].CompanyState
                                          }
                                          placeholder="State"
                                          // style={[
                                          //   styles["grid-input"],
                                          //   { outline: "none", display: "block" },
                                          // ]}
                                          onChangeText={(Text) => {
                                            handleGridChange(
                                              index,
                                              "CompanyState",
                                              Text
                                            );
                                          }}
                                        />
                                      </View>
                                    </View>
                                    <View
                                      style={[
                                        styles["card-input"],

                                        Platform.select({
                                          ios: {
                                            width: "20%",
                                            //  justifyContent: "end",
                                          },
                                          web: {
                                            width: "19%",
                                            justifyContent: "center",
                                          },
                                        }),
                                      ]}
                                    >
                                      {sellerTabelProps["EditRow"][index] ===
                                        true && (
                                        <>
                                          <TouchableOpacity
                                            style={[
                                              [styles.buttonContainer],
                                              {
                                                alignSelf: "center",
                                                padding: 5,
                                              },
                                            ]}
                                            onPress={(e) => {
                                              setSellerTabelProps({
                                                ...sellerTabelProps,
                                                EditRow: {
                                                  ...sellerTabelProps[
                                                    "EditRow"
                                                  ],
                                                  [index]: false,
                                                },
                                              });
                                              handleVendorSave(index, "Seller");
                                            }}
                                          >
                                            <CustomText
                                              style={[
                                                styles["btn"],
                                                {
                                                  fontSize: 10,
                                                  minWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                  maxWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                },
                                              ]}
                                            >
                                              {"Save"}
                                            </CustomText>
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            style={[
                                              [styles.buttonContainer],
                                              {
                                                alignSelf: "center",
                                                padding: 5,
                                              },
                                            ]}
                                            onPress={(e) => {
                                              setSellerTabelProps({
                                                ...sellerTabelProps,
                                                EditRow: {
                                                  ...sellerTabelProps[
                                                    "EditRow"
                                                  ],
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
                                                  minWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                  maxWidth:
                                                    Platform.OS === "web"
                                                      ? 36
                                                      : 28,
                                                },
                                              ]}
                                            >
                                              {"Cancel"}
                                            </CustomText>
                                          </TouchableOpacity>
                                        </>
                                      )}
                                    </View>
                                  </View>
                                  {/* </View> */}
                                </View>
                              </>
                            )}
                          </TableWrapper>
                        </>
                      ))}
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
                      <CustomText style={[styles["btn"]]}>{"Close"}</CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/* IsSame Confirmation Modal */}
              {/* <Modal
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
              </Modal> */}
              {/* Remove Confirmation Modal */}
              {/* <Modal
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
              </Modal> */}
            </View>
            {/* Modal Secondary Hazard Section */}
            <View style={{ alignItems: "center" }}>
              {/* Secondary Hazard Insurance Modal */}
              <Modal
                isVisible={isModalSecHazardVisible.SecondaryHazard}
                onBackdropPress={() => {
                  setModalSecHazardVisible({
                    isModalSecHazardVisible,
                    SecondaryHazard: false,
                  });
                  fnShowAddNew(0);
                  setInput({ 0: "" });
                }}
                style={{
                  backgroundColor: "#fff",
                  //maxWidth: Platform.OS === "web" ? "1000px" : null,
                  //minWidth: Platform.OS === "web" ? "500px" : null,
                  margin: 45,
                  flex: null,
                  ...Platform.select({
                    web: {
                      alignSelf: "center",
                    },
                    android: {
                      width: "96%",
                      alignSelf: "center",
                    },
                    ios: {
                      width: "96%",
                      alignSelf: "center",
                    },
                  }),
                }}
              >
                <View>
                  <View style={styles["modal-header"]}>
                    <CustomText style={styles["modal-header-title"]}>
                      {"Secondary Hazard Insurance"}
                    </CustomText>
                    <AntDesign
                      name="close"
                      style={styles["modal-close"]}
                      strokeWidth={30}
                      size={24}
                      color={"black"}
                      onPress={(e) => {
                        toggleSecondaryHazardModal("SecondaryHazard");
                        fnShowAddNew(0);
                      }}
                    />
                  </View>
                  <View style={styles["modal-container"]}>
                    <View
                      style={[
                        // Platform.OS !== "web" && {
                        //    width: 430
                        // },
                        Platform.select({
                          android: {
                            width: "95%",
                          },
                          ios: {
                            width: "95%",
                          },
                        }),
                        // { width: 430 },
                      ]}
                    >
                      <View
                        style={[
                          styles["card-input"],
                          // styles["card-item"],
                          // Platform.OS !== "web" && {
                          //   flexDirection: "row",
                          //   width:'90%',
                          //   borderColor:'red',
                          //   borderWidth:1,
                          // },
                        ]}
                        ref={searchInputRef}
                      >
                        <InputField
                          autoFocus={focusCompany[57] ? true : false}
                          value={AutoCinput[57]}
                          label="Search for Company or Agent Name, Email or Cell Phone"
                          type="default"
                          name="EmailorCellPhone"
                          onChangeText={(text) => {
                            handleCompanySearch(text, 57, "V");
                          }}
                          onKeyPress={(e) => {
                            setSelectedItemIndex(-1);
                            fnFocusInput(e);
                          }}
                          onBlur={(event) => {
                            fnShowAddNew(57, "Hide", event);
                          }}
                          onFocus={(e) => {
                            fnShowAddNew(57, "Show");
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
                          {otherProps["0"] && (
                            <View
                              style={{ right: Platform.OS === "web" ? 30 : 0 }}
                            >
                              <ArrowSpinner />
                            </View>
                          )}
                        </CustomText>
                        {AutoCompdata[57] &&
                          isModalSecHazardVisible.SecondaryHazard && (
                            <FlatList
                              style={styles["search-drop-down"]}
                              data={AutoCompdata[57]}
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
                                          ? "#ffff00"
                                          : i % 2 == 0
                                          ? "#d9ecff"
                                          : "#fff",
                                    },
                                    isHovered && styles["HoverBgColor"],
                                  ]}
                                  onPress={(e) => {
                                    handleOnkeyPressFlatlist(
                                      AutoCompdata[57][selectedItemIndex],
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
                    <View style={{ paddingTop: 10, zIndex: -1 }}>
                      <CustomText
                        style={{
                          color: "#808080",
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        {"Below are the selected Hazard vendors."}
                      </CustomText>
                    </View>
                    <Table
                      // borderStyle={{
                      //   borderWidth: 1,
                      //   borderColor: "transparent",
                      //   maxWidth: 430,
                      //color:"#428bca",
                      // }}
                      style={{ paddingTop: 10, zIndex: -1 }}
                    >
                      {/* Header */}
                      <View
                        style={[
                          styles["table-head"],
                          { color: "#fff", flexDirection: "row" },
                        ]}
                      >
                        <Cell
                          // style={[styles['Grid-Cell-Border']]}
                          data={[
                            <View
                              style={{
                                marginBottom: 5,
                              }}
                            >
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"First Name"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Last Name"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                          style={[styles["Grid-Cell-Border"], { width: 76 }]}
                        ></Cell>
                        <Cell
                          style={[
                            styles["Grid-Cell-Border"],
                            { width: Platform.OS === "web" ? 205 : 150 },
                          ]}
                          data={[
                            <View>
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Entity Name"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Address"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                        ></Cell>
                        <Cell
                          data={[
                            <View>
                              <View>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Cell Phone"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Email"}
                                </CustomText>
                              </View>
                              <View style={{ marginTop: 5 }}>
                                <CustomText
                                  style={{ fontSize: 11, color: "#fff" }}
                                >
                                  {"Policy Number"}
                                </CustomText>
                              </View>
                            </View>,
                          ]}
                          style={[{ width: 100 }]}
                        ></Cell>
                        {/* <Cell data={[]} style={{ width: 70 }}></Cell> */}
                        {/* <Cell data={"T1"}></Cell>
                      <Cell data={"T1"}></Cell>
                      <Cell data={"T1"}></Cell> */}
                      </View>
                      <>
                        {secondaryhazardInfo.RowData.length === 0 ? (
                          <View>
                            <CustomText
                              style={{
                                fontSize: 11,
                                paddingLeft: 65,
                                borderBottomColor: "black",
                                borderWidth: "thin",
                              }}
                            >
                              {"No Secondary Hazard Insurance Selected"}
                            </CustomText>
                          </View>
                        ) : null}
                      </>
                      {secondaryhazardInfo.RowData?.map((rowData, index) => (
                        <>
                          {/* {sellerTabelProps["EditRow"][index] !== true && ( */}
                          <TableWrapper
                            key={index - 1}
                            style={[
                              styles["table-row"],
                              {
                                backgroundColor:
                                  index % 2 == 0 ? "#deebf7" : "#fff",
                                maxWidth: 430,
                              },
                              secondaryhazardInfo.RowData.length - 1 ===
                                index && styles["table-row-bottom-border"],
                              styles["table-row-LeftRight-border"],
                            ]}
                          >
                            {secondaryHazardTabelProps["EditRow"][index] !==
                            true ? (
                              <>
                                <Cell
                                  width={76}
                                  key={"cell1"}
                                  style={[
                                    Platform.select({
                                      web: { display: "block" },
                                    }),
                                    styles["Grid-Cell-Border"],
                                  ]}
                                  data={[
                                    <View>
                                      <View>
                                        <CustomText
                                          style={[
                                            { fontSize: 11, color: "#4b545d" },
                                          ]}
                                        >
                                          {rowData.FirstName}
                                        </CustomText>
                                      </View>
                                      <View>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                            marginTop: 5,
                                          }}
                                        >
                                          {rowData.LastName}
                                        </CustomText>
                                      </View>
                                    </View>,
                                  ]}
                                />
                                {/* <Cell
                                width={74}
                                key={"cell1"}
                                data={[
                                  <CustomText
                                    style={{ fontSize: 11, color: "#4b545d" }}
                                  >
                                    {rowData.LastName}
                                  </CustomText>,
                                ]}
                              /> */}
                                <Cell
                                  width={Platform.OS === "web" ? 205 : 150}
                                  key={"cell2"}
                                  style={[
                                    Platform.select({
                                      web: { display: "block" },
                                    }),
                                    styles["Grid-Cell-Border"],
                                  ]}
                                  data={[
                                    <View>
                                      {/* <View>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                          }}
                                        >
                                          {rowData.Companyname}
                                        </CustomText>
                                      </View> */}
                                      <View
                                        style={{ alignItems: "flex-start" }}
                                      >
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
                                                  Platform.OS !== "web" &&
                                                  "60%",
                                              },
                                            ]}
                                            onPress={
                                              (e) => fnOpenVendorPage(rowData)
                                              // handleWebPageOpen(
                                              //   row,
                                              //   Platform.OS === "web" &&
                                              //     handleParamFromURL(
                                              //       document.location.href,
                                              //       "SessionId"
                                              //     ),
                                              //   "http://www.solutioncenter.biz/VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_bootstrap.aspx?SessionId="
                                              // )
                                            }
                                          >
                                            {rowData.Companyname}
                                          </CustomText>
                                        </View>
                                      </View>
                                      <View style={{ marginTop: 5 }}>
                                        <View>
                                          <CustomText
                                            style={{
                                              fontSize: 11,
                                              color: "#4b545d",
                                            }}
                                          >
                                            {`${rowData.CompanyStreetAddr}`}
                                          </CustomText>
                                        </View>
                                        <View>
                                          <CustomText
                                            style={{
                                              fontSize: 11,
                                              color: "#4b545d",
                                            }}
                                          >
                                            {`${rowData.CompanyCity}${
                                              rowData.CompanyCity && ","
                                            } ${rowData.CompanyState} ${
                                              rowData.CompanyZip
                                            }`}
                                          </CustomText>
                                        </View>
                                      </View>
                                    </View>,
                                  ]}
                                />

                                <Cell
                                  width={125}
                                  key={"cell3"}
                                  //style={[styles['Grid-Cell-Border']]}
                                  data={[
                                    <View>
                                      <View style={{ width: 100 }}>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                          }}
                                        >
                                          {rowData.Phone}
                                        </CustomText>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                            marginTop: 5,
                                          }}
                                        >
                                          {rowData.AgentEmail}
                                        </CustomText>
                                        <CustomText
                                          style={{
                                            fontSize: 11,
                                            color: "#4b545d",
                                            marginTop: 5,
                                          }}
                                        >
                                          {rowData.FileNumber}
                                        </CustomText>
                                      </View>
                                      <View
                                        style={{
                                          paddingTop: 5,
                                          paddingBottom: 5,
                                          flexDirection: "row",
                                        }}
                                      >
                                        <TouchableOpacity
                                          style={[
                                            [styles.buttonContainer],
                                            { alignSelf: "center" },
                                          ]}
                                          onPress={(e) => {
                                            setSecondaryHazardTabelProps({
                                              ...secondaryHazardTabelProps,
                                              EditRow: {
                                                ...secondaryHazardTabelProps[
                                                  "EditRow"
                                                ],
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
                                                minWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 25,
                                                maxWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 25,
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
                                            handleRemoveSellerOrAgent(
                                              rowData,
                                              index
                                            );
                                          }}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              { fontSize: 10 },
                                            ]}
                                          >
                                            {"Remove"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </View>
                                    </View>,
                                  ]}
                                />
                                {/* <Cell
                                key={"cell4"}
                                width={70}
                                data={[

                                ]}
                              /> */}
                              </>
                            ) : (
                              <>
                                <View
                                  style={{
                                    width:
                                      Platform.OS === "web" ? "100%" : "98%",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles["card-input"],
                                      styles["card-item"],
                                      { paddingTop: 20, borderColor: "red" },
                                    ]}
                                  >
                                    <InputField
                                      //autoFocus
                                      validate={
                                        secondaryHazardTabelProps[
                                          "ModifiedJson"
                                        ][index].Companyname === ""
                                          ? true
                                          : false
                                      }
                                      type="default"
                                      label="Company Name"
                                      value={
                                        secondaryHazardTabelProps[
                                          "ModifiedJson"
                                        ][index].Companyname
                                      }
                                      placeholder="Company Name"
                                      onChangeText={(Text) => {
                                        handleSecondaryHazardGridChange(
                                          index,
                                          "Companyname",
                                          Text
                                        );
                                      }}
                                    />
                                  </View>
                                  <View
                                    style={[
                                      styles["card-body"],
                                      { padding: 0 },
                                      Platform.select({
                                        android: {
                                          width: "49%",
                                        },
                                        ios: {
                                          width: "49%",
                                        },
                                      }),
                                    ]}
                                  >
                                    <View style={styles["card-input"]}>
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].FirstName === ""
                                            ? true
                                            : false
                                        }
                                        autoFocus
                                        type="default"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].FirstName
                                        }
                                        label="Agent First Name"
                                        placeholder="Agent First Name"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "FirstName",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                    <View style={styles["card-input"]}>
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].LastName === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Agent Last Name"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].LastName
                                        }
                                        placeholder="Agent Last Name"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none", display: "block" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "LastName",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>

                                  {/* <View
                                    style={{
                                      padding: 0,
                                      flexDirection: "row",
                                    }}
                                  >
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { paddingTop: 5 },
                                      ]}
                                    > */}
                                  <View
                                    style={{
                                      padding: 0,
                                      paddingTop: 5,
                                      flexDirection: "row",
                                    }}
                                  >
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "35%", marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].Phone === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Agent Cell Phone"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].Phone
                                        }
                                        placeholder="Agent Cell Phone"
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "Phone",
                                            Text
                                          );
                                        }}
                                        onBlur={(e) => {
                                          let number = FormatPhoneLogin(
                                            secondaryHazardTabelProps[
                                              "ModifiedJson"
                                            ][index].Phone
                                          );
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "Phone",
                                            number
                                          );
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "62%" },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].AgentEmail === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].AgentEmail
                                        }
                                        label="Agent Email"
                                        placeholder="Agent Email"
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "AgentEmail",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      padding: 0,
                                      flexDirection: "row",
                                      paddingTop: 5,
                                      paddingBottom: 5,
                                    }}
                                  >
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "55%", marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyStreetAddr === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Company Street Address"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyStreetAddr
                                        }
                                        placeholder="Company Street Address"
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
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
                                        { width: "42%" },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyZip === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyZip
                                        }
                                        label="Company Zip Code"
                                        placeholder="Company Zip Code"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "CompanyZip",
                                            Text
                                          );
                                        }}
                                        onBlur={(e) => {
                                          fnAutoPopulateStateCity(
                                            secondaryHazardTabelProps[
                                              "ModifiedJson"
                                            ][index].CompanyZip,
                                            index,
                                            "SecondaryHazard"
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      padding: 0,
                                      flexDirection: "row",
                                      paddingTop: 5,
                                      paddingBottom: 5,
                                    }}
                                  >
                                    {/* <View
                                      style={[
                                        styles["card-input"],
                                        { paddingTop: 5 },
                                      ]}
                                    > */}

                                    <View
                                      style={[
                                        styles["card-input"],
                                        //  styles["card-item"],
                                        { width: "50%", marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyCity === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Company City"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyCity
                                        }
                                        placeholder="Company City"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none", display: "block" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "CompanyCity",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={[
                                        styles["card-input"],
                                        //styles["card-item"],
                                        //{ width: "53%" , marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyState === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Company State"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompanyState
                                        }
                                        placeholder="Company State"
                                        // style={[
                                        //   styles["grid-input"],
                                        //   { outline: "none", display: "block" },
                                        // ]}
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "CompanyState",
                                            Text
                                          );
                                        }}
                                      />
                                    </View>
                                  </View>
                                  <View>
                                    <View
                                      style={[
                                        styles["card-input"],
                                        { width: "55%", marginRight: 10 },
                                      ]}
                                    >
                                      <InputField
                                        validate={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompPhone === ""
                                            ? true
                                            : false
                                        }
                                        //autoFocus
                                        type="default"
                                        label="Company Phone"
                                        value={
                                          secondaryHazardTabelProps[
                                            "ModifiedJson"
                                          ][index].CompPhone
                                        }
                                        placeholder="Company Phone"
                                        onChangeText={(Text) => {
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "CompPhone",
                                            Text
                                          );
                                        }}
                                        onBlur={(e) => {
                                          let number = FormatPhoneLogin(
                                            secondaryHazardTabelProps[
                                              "ModifiedJson"
                                            ][index].CompPhone
                                          );
                                          handleSecondaryHazardGridChange(
                                            index,
                                            "CompPhone",
                                            number
                                          );
                                        }}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        padding: 0,
                                        paddingTop: 5,
                                        flexDirection: "row",
                                      }}
                                    >
                                      <View
                                        style={[
                                          styles["card-input"],
                                          { width: "55%", marginRight: 10 },
                                        ]}
                                      >
                                        <InputField
                                          validate={
                                            secondaryHazardTabelProps[
                                              "ModifiedJson"
                                            ][index].FileNumber === ""
                                              ? true
                                              : false
                                          }
                                          //autoFocus
                                          type="default"
                                          label="Policy Number"
                                          value={
                                            secondaryHazardTabelProps[
                                              "ModifiedJson"
                                            ][index].FileNumber
                                          }
                                          placeholder="Policy Number"
                                          onChangeText={(Text) => {
                                            handleSecondaryHazardGridChange(
                                              index,
                                              "FileNumber",
                                              Text
                                            );
                                          }}
                                          onBlur={(e) => {
                                            let number = FormatPhoneLogin(
                                              secondaryHazardTabelProps[
                                                "ModifiedJson"
                                              ][index].FileNumber
                                            );
                                            handleSecondaryHazardGridChange(
                                              index,
                                              "FileNumber",
                                              number
                                            );
                                          }}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                  <View
                                    style={{
                                      paddingTop: 5,
                                      paddingBottom: 5,
                                      flexDirection: "row",
                                    }}
                                  >
                                    {secondaryHazardTabelProps["EditRow"][
                                      index
                                    ] === true && (
                                      <>
                                        <TouchableOpacity
                                          style={[
                                            [styles.buttonContainer],
                                            {
                                              alignSelf: "center",
                                              padding: 5,
                                            },
                                          ]}
                                          onPress={(e) => {
                                            setSecondaryHazardTabelProps({
                                              ...secondaryHazardTabelProps,
                                              EditRow: {
                                                ...secondaryHazardTabelProps[
                                                  "EditRow"
                                                ],
                                                [index]: false,
                                              },
                                            });
                                            handleVendorSave(
                                              index,
                                              "SecondaryHazard"
                                            );
                                          }}
                                        >
                                          <CustomText
                                            style={[
                                              styles["btn"],
                                              {
                                                fontSize: 10,
                                                minWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 28,
                                                maxWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 28,
                                              },
                                            ]}
                                          >
                                            {"Save"}
                                          </CustomText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={[
                                            [styles.buttonContainer],
                                            {
                                              alignSelf: "center",
                                              padding: 5,
                                            },
                                          ]}
                                          onPress={(e) => {
                                            setSecondaryHazardTabelProps({
                                              ...secondaryHazardTabelProps,
                                              EditRow: {
                                                ...secondaryHazardTabelProps[
                                                  "EditRow"
                                                ],
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
                                                minWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 28,
                                                maxWidth:
                                                  Platform.OS === "web"
                                                    ? 36
                                                    : 28,
                                              },
                                            ]}
                                          >
                                            {"Cancel"}
                                          </CustomText>
                                        </TouchableOpacity>
                                      </>
                                    )}
                                  </View>
                                  {/* </View> */}
                                </View>
                              </>
                            )}
                          </TableWrapper>
                        </>
                      ))}
                    </Table>
                  </View>
                  <View style={[styles["modal-footer"], { zIndex: -1 }]}>
                    <TouchableOpacity
                      style={[
                        [styles.buttonContainer],
                        { alignSelf: "center", padding: 5 },
                      ]}
                      onPress={() => {
                        setModalSecHazardVisible({
                          isModalSecHazardVisible,
                          SecondaryHazard: false,
                        });
                      }}
                    >
                      <CustomText style={[styles["btn"]]}>{"Close"}</CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        )}
      </View>
    );
  };
  const HazardInsurance = () => {
    return (
      <View>
        {result.length === 0 ? (
          <CustomText style={styles["card-Loading"]}>Loading...</CustomText>
        ) : (
          <>
            {/* Header Section */}
            <View style={{ marginLeft: 10, marginBottom: 25 }}>
              <View style={{ gap: 5 }}>
                <CustomText bold={true}>Hazard Insurance.</CustomText>
                <CustomText>
                  Proof of hazard insurance is needed in order to close the
                  loan. Click 'Get Quote' to get a quote from top carriers in
                  your area.
                </CustomText>
              </View>

              <View
                style={[
                  styles["btn"],
                  {
                    alignSelf: "baseline",
                    marginTop: 25,
                    marginBottom: 30,
                    marginLeft: 10,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={(e) => {
                    parent.fnGetquote(IsQoute);
                  }}
                  style={[styles.buttonContainer]}
                >
                  <CustomText style={[styles["btn"]]}>{`${
                    IsQoute ? `View` : `Get`
                  } Quote`}</CustomText>
                </TouchableOpacity>
              </View>
              <View style={{ gap: 5 }}>
                <CustomText bold={true}>
                  Hazard Insurance Information.
                </CustomText>
                <CustomText>
                  Please confirm or update your insurance agent information
                  below. To change an agent that is already identified, simply
                  click the Change or Remove button. Then Search or add a
                  different insurance agent using the search area below.
                </CustomText>
              </View>
            </View>
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

                    cardValidation[row["ContactType"]] &&
                      (!copyAgent[row["ContactType"]] ||
                        [2, 48].includes(row["ContactType"])) &&
                      styles["card-validation"],
                  ]}
                >
                  <View style={styles["card-child"]}>
                    <View style={styles["card-header"]}>
                      <CustomText style={styles["card-Title"]}>
                        {row.ContactTypename}
                      </CustomText>

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
                                            { color: "#ffffff" },
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
                                            // setCopyAgent({
                                            //   ...copyAgent,
                                            //   [row["ContactType"]]: false,
                                            // });
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
                                              { color: "#ffffff" },
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
                                              { color: "#ffffff" },
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
                                  handleVendorSave(index);
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
                    </View>

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
                                    style={[{ fontSize: 11, color: "red" }]}
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
                                minHeight: Platform.OS === "web" ? 294 : null,
                                gridTemplateColumns: editCompany[
                                  row["ContactType"]
                                ]
                                  ? "repeat(1,1fr)"
                                  : "repeat(2,1fr)",
                                width:
                                  Platform.OS !== "web"
                                    ? editCompany[row["ContactType"]]
                                      ? "98%"
                                      : "50%"
                                    : null,
                              },
                            ]}
                          >
                            <>
                              <View
                                style={{
                                  flexDirection: "column",
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
                                          onPress={
                                            (e) => fnOpenVendorPage(row)
                                            // handleWebPageOpen(
                                            //   row,
                                            //   Platform.OS === "web" &&
                                            //     handleParamFromURL(
                                            //       document.location.href,
                                            //       "SessionId"
                                            //     ),
                                            //   "http://www.solutioncenter.biz/VendorChanges/Presentation/Webforms/VendorInfoChangeRequest_bootstrap.aspx?SessionId="
                                            // )
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
                                          // Platform.OS !== "web" && {
                                          //   flexDirection: "row",
                                          //   width:'90%',
                                          //   borderColor:'red',
                                          //   borderWidth:1,
                                          // },
                                        ]}
                                        ref={searchInputRef}
                                      >
                                        <InputField
                                          autoFocus={
                                            focusCompany[row["ContactType"]]
                                              ? true
                                              : false
                                          }
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
                                          {!validation[row["ContactType"]] &&
                                            row["AgentID"] && (
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
                                                        ? "#ffff00"
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
                                      {row.CompanyStreetAddr ? (
                                        <CustomText>
                                          {row.CompanyStreetAddr}
                                        </CustomText>
                                      ) : (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Company Address"}
                                        </CustomText>
                                      )}
                                      <CustomText>
                                        {`${row.CompanyCity}${
                                          row.CompanyCity && ","
                                        } ${row.CompanyState} ${
                                          row.CompanyZip
                                        }`}
                                      </CustomText>
                                      {!row.CompanyZip && (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Company Zip"}
                                        </CustomText>
                                      )}
                                      {!row.CompanyCity && (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Company City"}
                                        </CustomText>
                                      )}
                                      {!row.CompanyState && (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Company State"}
                                        </CustomText>
                                      )}
                                    </View>

                                    <View style={styles["card-item"]}>
                                      {row.CompPhone ? (
                                        <CustomText>{row.CompPhone}</CustomText>
                                      ) : (
                                        <CustomText
                                          bold={true}
                                          style={[
                                            styles["card-lablebold"],
                                            styles["labelBackground"],
                                          ]}
                                        >
                                          {"Cell Phone"}
                                        </CustomText>
                                      )}
                                    </View>

                                    {/* {[7, 2, 4, 17, 48, 49].includes(
                                      row["ContactType"]
                                    ) && (
                                      <> */}
                                    {queryString["IsEditRights"] == 1 ||
                                    !editCard[row["ContactType"]] ? (
                                      <View
                                        style={[
                                          styles["card-input"],
                                          styles["card-item"],
                                        ]}
                                      >
                                        <InputField
                                          validate={
                                            saveValidation[
                                              cardInfo[index] //["ContactType"]
                                            ] !== undefined
                                              ? saveValidation[
                                                  cardInfo[index]["ContactType"]
                                                ]["FileNumber"]
                                              : false
                                          }
                                          label={"Policy Number"}
                                          //autoFocus
                                          type="default"
                                          name={"Policy Number"}
                                          value={cardInfo[index]["FileNumber"]}
                                          placeholder={"Policy Number"}
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
                                        {[7, 2, 4, 17, 48, 49].includes(
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
                                              // style ={styles.InputField}
                                            />
                                          </View>
                                        )}
                                      </>
                                    )}
                                    {/* </>
                                    )} */}
                                  </>
                                )}
                              </View>

                              {!editCompany[row["ContactType"]] && (
                                <View
                                  style={{
                                    flexDirection: "column",
                                    // backgroundColor: "green",
                                    gap: 10,
                                  }}
                                >
                                  <View style={[styles["card-item"]]}>
                                    {/* <CustomText bold={true}>
                                      {row.AgentFNN}
                                    </CustomText> */}

                                    {row.AgentFNN && (
                                      <CustomText bold={true}>
                                        {row.AgentFNN}
                                      </CustomText>
                                    )}
                                    {!row.FirstName && (
                                      <CustomText
                                        bold={true}
                                        style={[
                                          styles["card-lablebold"],
                                          styles["labelBackground"],
                                        ]}
                                      >
                                        {"FirstName"}
                                      </CustomText>
                                    )}
                                    {!row.LastName && (
                                      <CustomText
                                        bold={true}
                                        style={[
                                          styles["card-lablebold"],
                                          styles["labelBackground"],
                                        ]}
                                      >
                                        {"LastName"}
                                      </CustomText>
                                    )}
                                  </View>

                                  {/* {row.Phone !== "" && ( */}
                                  <View style={styles["card-item"]}>
                                    {/* <CustomText

                                      >
                                        {row.Phone}
                                      </CustomText> */}
                                    {row.Phone ? (
                                      <CustomText>{row.Phone}</CustomText>
                                    ) : (
                                      <CustomText
                                        bold={true}
                                        style={[
                                          styles["card-lablebold"],
                                          styles["labelBackground"],
                                        ]}
                                      >
                                        {"Agent Cell Phone"}
                                      </CustomText>
                                    )}
                                  </View>
                                  {/* )} */}
                                  <View style={styles["card-item"]}>
                                    {/* <CustomText

                                    >
                                      {row.AgentEmail}
                                    </CustomText> */}
                                    {row.AgentEmail ? (
                                      <CustomText>{row.AgentEmail}</CustomText>
                                    ) : (
                                      <CustomText
                                        bold={true}
                                        style={[
                                          styles["card-lablebold"],
                                          styles["labelBackground"],
                                        ]}
                                      >
                                        {"Agent Email"}
                                      </CustomText>
                                    )}
                                  </View>
                                  <View
                                    style={[
                                      styles["card-item"],
                                      {
                                        display: "block",
                                      },
                                    ]}
                                  >
                                    {row.GroupEmail && (
                                      <>
                                        <CustomText
                                          style={[
                                            styles["card-text-underline"],
                                            { width: "fit-content" },
                                          ]}
                                          onPress={() => {
                                            let subject = "",
                                              body = "";
                                            const emailUrl = `mailto:${row.GroupEmail}`;
                                            //  Linking.openURL(emailUrl);
                                            window.open(emailUrl, "_self");
                                          }}
                                        >{`${row.GroupEmail}`}</CustomText>{" "}
                                        <CustomText
                                          style={{
                                            fontSize: 12,
                                            width: "fit-content",
                                          }}
                                        >
                                          {" (Group)"}
                                        </CustomText>
                                      </>
                                    )}
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
                                                row.AgentLicense || "#ffff00",
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
                                {
                                  flexBasis:
                                    Platform.OS !== "web"
                                      ? width * 2 + 20
                                      : null,
                                },
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
                                    undefined && Platform.OS === "web"
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
                                  ]["LastName"]
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
                            style={Platform.select({
                              web: {
                                padding: 10,
                                paddingTop: 0,
                                paddingBottom: 0,
                                flexDirection: "row",
                              },
                              android: {
                                padding: 0,
                                flexDirection: "row",
                              },
                              ios: {
                                padding: 0,
                                flexDirection: "row",
                              },
                            })}
                          >
                            <View
                              style={[
                                styles["card-input"],
                                styles["card-item"],
                                Platform.select({
                                  web: { width: "31%" },
                                  android: { flexBasis: 120 },
                                  ios: { flexBasis: 120 },
                                }),
                              ]}
                            >
                              <InputField
                                validate={
                                  // saveValidation[
                                  //   cardInfo[index]["ContactType"]
                                  // ] !== undefined
                                  //   ? saveValidation[
                                  //       cardInfo[index]["ContactType"]
                                  //     ]["Phone"]
                                  //   : false
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["Phone"]
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
                                Platform.select({
                                  web: { width: "68%", marginLeft: 9 },
                                  android: { flexBasis: width + 45 },
                                  ios: { flexBasis: width + 45 },
                                }),
                              ]}
                            >
                              <InputField
                                validate={
                                  // saveValidation[
                                  //   cardInfo[index]["ContactType"]
                                  // ] !== undefined
                                  //   ? saveValidation[
                                  //       cardInfo[index]["ContactType"]
                                  //     ]["AgentEmail"]
                                  //   : false
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["AgentEmail"]
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
                            {/* {row["ContactType"] !== 7 ? (
                              <View
                                style={[
                                  styles["card-input"],
                                  styles["card-item"],
                                ]}
                              >
                                <InputField
                                  validate={
                                    // saveValidation[
                                    //   cardInfo[index]["ContactType"]
                                    // ] !== undefined
                                    //   ? saveValidation[
                                    //       cardInfo[index]["ContactType"]
                                    //     ]["AgentEmail"]
                                    //   : false
                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["AgentLicense"]
                                  }
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
                            ) : null} */}
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
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["CompanyStreetAddr"]
                                }
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
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["CompanyZip"]
                                }
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
                                    index,
                                    "Vendor"
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
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["CompanyCity"]
                                }
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
                                validate={
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["CompanyState"]
                                }
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
                                  // saveValidation[
                                  //   cardInfo[index]["ContactType"]
                                  // ] !== undefined
                                  //   ? saveValidation[
                                  //       cardInfo[index]["ContactType"]
                                  //     ]["CompPhone"]
                                  //   : false
                                  saveValidation[
                                    cardInfo[index]["ContactType"]
                                  ]["CompPhone"]
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
                                    validate={
                                      // saveValidation[
                                      //   cardInfo[index]["ContactType"]
                                      // ] !== undefined
                                      //   ? saveValidation[
                                      //       cardInfo[index]["ContactType"]
                                      //     ]["AgentEmail"]
                                      //   : false
                                      saveValidation[
                                        cardInfo[index]["ContactType"]
                                      ]["CompanyLicense"]
                                    }
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
                            {[7, 2, 4, 17, 48, 49].includes(
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
                                    // saveValidation[
                                    //   cardInfo[index]["ContactType"]
                                    // ] !== undefined
                                    //   ? saveValidation[
                                    //       cardInfo[index]["ContactType"]
                                    //     ]["FileNumber"]
                                    //   : false

                                    saveValidation[
                                      cardInfo[index]["ContactType"]
                                    ]["FileNumber"]
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
                              { color: "#ffffff" },
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
                  </View>
                </View>
              ))}
              <View style={{ display: "none" }}>
                <Button
                  onPress={handleParentWindowSave}
                  title={"Parent Save"}
                />
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  const RenderContent = () => {
    return (
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View>
          {queryString["Page"] === "HazardInsurance" ? (
            <>{HazardInsurance()}</>
          ) : (
            <>{Vendors()}</>
          )}
        </View>
      </ScrollView>
    );
  };
  /////////////////////////////// Component declaration ends here /////////////////////////

  return (
    <>
      {Platform.OS === "ios" ? (
        <>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <View>
                {queryString["Page"] === "HazardInsurance" ? (
                  <>{HazardInsurance()}</>
                ) : (
                  <>{Vendors()}</>
                )}
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </>
      ) : (
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
          <View>
            {queryString["Page"] === "HazardInsurance" ? (
              <>{HazardInsurance()}</>
            ) : (
              <>{Vendors()}</>
            )}
          </View>
        </ScrollView>
      )}
    </>
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
      marginLeft: 0,
      marginRight: 0,
      borderColor: "#5e9cd3",
      borderWidth: 1,
      zIndex: -2,
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
    alignItems: "center",
    // ...Platform.select({
    //   web:{
    justifyContent: "space-between",
    //   },
    // }),
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
    maxWidth: 450,
    ...Platform.select({
      ios: {
        flexShrink: 1,
      },
      android: {
        //Need to check
        flexShrink: 1,
      },
    }),
  },
  "card-Title": {
    fontSize: Platform.OS === "web" ? 18 : 17,
    color: "#fff",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        width: "40%",
        //flexShrink:1
        flex: 1,
      },
      android: {
        width: "40%",
      },
    }),
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
          width: "50%",
          paddingTop: 10,
          gap: 10,
        },
  "card-item":
    Platform.OS !== "web"
      ? {
          flexBasis: width,
          marginLeft: 10,
          //paddingBottom: 5,
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
    ...Platform.select({
      android: {
        height: 15,
        width: 15,
      },
      ios: {
        height: 15,
        width: 15,
      },
    }),
  },
  "table-container": {
    padding: 0,
    marginTop: 30,
    margin: 10,
    marginLeft: 0,
    backgroundColor: "#fff",
    //width: Platform.OS === "web" ? "450px" : 500,
    width: 450,
    borderColor: "#9bc2e6",
    borderWidth: 1,
    // overflow:'scroll',
    //     ...Platform.select({
    //       android:{
    //         maxWidth:450,
    // overflow:'scroll'
    //       }
    //     })
  },
  "table-head": {
    //height: Platform.OS === "web" ? 40 : 50,
    backgroundColor: "#428bca",
    padding: 4,
    paddingBottom: 0,
    paddingTop: 0,
  },
  "table-wrapper": { flexDirection: "row" },
  "table-title": { flex: 1, backgroundColor: "#428bca" },
  "table-row": {
    flexDirection: "row",
    backgroundColor: "#FFF1C1",
    padding: 4, //10,
    paddingBottom: 0,
    paddingTop: 0,
    ...Platform.select({
      android: {
        overflow: "scroll",
      },
      ios: {
        overflow: "scroll",
      },
    }),
  },
  "table-text": {
    textAlign: "left",
    margin: Platform.OS === "web" ? 6 : 8,
    fontSize: 12,
  },
  "modal-container": {
    justifyContent: "center",
    // alignItems: Platform.OS === "web" ? "center" : null,
    marginTop: 10,
    overflowY: "auto",
    overflowX: "hidden",
    ...Platform.select({
      web: {
        maxHeight: "61vh",
        display: "block",
        flexDirection: "row", // null
        maxWidth: 440,
        flex: 1,
        margin: 15,
      },
      android: {
        maxWidth: null,
        margin: 5,
      },
      ios: {
        maxWidth: null,
        margin: 5,
      },
    }),
  },
  "modal-header": {
    backgroundColor: "#428bca",
    padding: 10,
    ...Platform.select({
      web: {
        display: "block",
      },
      android: {
        flexDirection: "row",
      },
      ios: {
        flexDirection: "row",
      },
    }),
  },
  "modal-footer": {
    backgroundColor: "#e4e9ee",
    padding: 14,
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    width: "100%",
    // ...Platform.select({
    //   web:{
    //     width:''
    //   }
    // })
  },

  "modal-header-title": {
    padding: 5,
    color: "#ffffff",
    fontSize: 18,
    ...Platform.select({
      web: {
        width: null,
      },
      android: {
        width: "89%",
      },
      ios: {
        width: "89%",
      },
    }),
  },
  "modal-close": {
    color: "#ffffff",
    fontWeight: "bolder",
    ...Platform.select({
      web: {
        position: "absolute",
        marginRight: 10,
        right: 0,
      },
      android: {
        marginLeft: 15,
      },
      ios: {
        marginLeft: 15,
      },
    }),
  },
  "search-drop-down": {
    backgroundColor: "#FFFFFF",
    maxHeight: 230,
    overflow: "scroll",
    boxShadow: "0px 0px 10px 0px rgb(0 0 0 / 10%)",
    //position: Platform.OS === "web" ? "fixed" : null, // Need to check
    width: Platform.OS === "web" ? 430 : "99%",
    zIndex: 1111111,
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
      web: {
        position: "fixed",
        marginTop: 55, // Need to check
      },
    }),
  },
  "grid-input": {
    padding: 0,
    color: "#51575d",
  },
  HoverBgColor: {
    backgroundColor: "#ff0000",
  },
  "remove-card-header": {
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        flexShrink: 1,
        flexDirection: "column",
      },
      android: {
        flexShrink: 1,
        flexDirection: "column",
      },
    }),
  },
  "card-disable": {
    backgroundColor: "#dad2d2",
    cursor: "not-allowed",
  },
  "card-validation": {
    borderColor: "red",
    borderWidth: 3,
  },
  labelBackground: {
    width: Platform.OS === "web" ? "fit-content" : null,
    backgroundColor: "#ffff00",
    marginTop: 5,
    ...Platform.select({
      android: {
        alignSelf: "flex-start",
      },
      ios: {
        alignSelf: "flex-start",
      },
    }),
  },
  "Grid-Cell-Border": {
    //borderTopWidth:1,
    borderRightWidth: 1,
    // borderLeftWidth:1,
    // borderBottomWidth:1,
    borderColor: "#89b7e0",
    padding: 0,

    // marginLeft:5,
    marginRight: 5,
    ...Platform.select({
      web: {
        borderStyle: "dotted",
      },
    }),
  },
  "table-row-bottom-border": {
    borderColor: "#89b7e0",
    borderBottomWidth: 1,
    paddingTop: 5,
    ...Platform.select({
      web: {
        borderStyle: "dotted",
      },
    }),
  },
  "table-row-LeftRight-border": {
    borderColor: "#89b7e0",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    ...Platform.select({
      web: {
        borderStyle: "dotted",
      },
    }),
  },
  "table-scroll": {
    ...Platform.select({
      android: {
        maxWidth: 450,
        overflow: "scroll",
      },
      ios: {
        maxWidth: 450,
        overflow: "scroll",
      },
    }),
  },
  "card-header-btn": {
    // flexDirection:'row',
    // ...Platform.select({
    //   ios:{
    //     maxWidth:'50%'
    //   },
    //   android:{
    //     alignItems:'flex-end'
    //   }
    // })
  },
});
