  export const config = {
    apiKey: "AIzaSyBrbNMXwOrljm_EJyxWWY8Fx_2YQdkeqto",
    authDomain: "voda-slav.firebaseapp.com",
    databaseURL: "https://voda-slav.firebaseio.com",
    projectId: "voda-slav",
    storageBucket: "voda-slav.appspot.com",
    messagingSenderId: "447205832578",
    appId: "1:447205832578:web:69b11a649da4662d86c19b",
  
    clientId: "447205832578-qa26mmfh3lmvokcosq4mlmh42oepitmk.apps.googleusercontent.com",
  
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly"
    ],
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
    ]
  }
  
  export const AccrualsTableConfig = {
    TableName: "Accruals",
    FieldsDictionary: {
      keyAttr: "Account",
      Account: "LS",
      dictionary: {
        Accrued: "NACH",
        Paid: "OPL",
        Debt: "DOLG",
      },
    },
  };
  
  export const AccountsTableConfig = {
    TableName: "Accounts",
    FieldsDictionary: {
      keyAttr: "Account",
      Account: "LS",
      dictionary: {
        Surname: "FAM",
        Name: "NAME",
        FName: "OTCH",
        // UserID: "",
        Street: "STREET",
        House: "HOUSE",
        Flat: "FLAT"
      },
    },
  }
  
  export const CountersTableConfig = {
    TableName: "Counters",
    FieldsDictionary: {
      keyAttr: "Account",
      Account: "ЛИЦЕВОЙ",
      dictionary: {
        BathCold: {
          ID: "ХВС ВАННА НОМЕР",
          Name: "$ХВС Ванна",
          LastReading: "ХВС ВАННЯ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        ToiletCold: {
          ID: "ХВС ТУАЛЕТ НОМЕР",
          Name: "$ХВС Туалет",
          LastReading: "ХВС ТУАЛЕТ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        KitchenCold: {
          ID: "ХВС КУХНЯ НОМЕР",
          Name: "$ХВС Кухня",
          LastReading: "ХВС КУХНЯ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        Watering: {
          ID: "ПОЛИВ НОМЕР",
          Name: "$Полив",
          LastReading: "ПОЛИВ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        BathHot: {
          ID: "ГВС ВАННА НОМЕР",
          Name: "$ГВС Ванна",
          LastReading: "ГВС ВАННЯ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        ToiletHot: {
          ID: "ГВС ТУАЛЕТ НОМЕР",
          Name: "$ГВС Туалет",
          LastReading: "ГВС ТУАЛЕТ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        KitchenHot: {
          ID: "ГВС КУХНЯ НОМЕР",
          Name: "$ГВС Кухня",
          LastReading: "ГВС КУХНЯ ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
        Watering: {
          ID: "ОБРАТКА НОМЕР",
          Name: "$Обратка",
          LastReading: "ОБРАТКА ПОКАЗ",
          LastReadingsDate: "$5November2020",
        },
      },
    },
  }