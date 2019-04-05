import ColorAssignment from "../util/ColorAssignment";
import data from '../data/fakeData.json'

const getDataForDate = (date) => {
  // let idx = data.findIndex(k => k.date === date);
  // return data[idx]["data"];
  let idx = data.findIndex(k => k.date === "2019-03-04");
  return data[idx]["data"].map((obj) => {
    obj["humidity"] = obj["humidity"] * (Math.random() * (1.1 - 0.9) + 0.9);
    obj["pest-level"] = obj["pest-level"] * (Math.random() * (1.1 - 0.9) + 0.9);
    return obj;
   });
}

const viz = (state = {}, action) => {
  console.log(action.type)
  switch (action.type) {
    case 'CHANGE_DATA_DISPLAYED':
      return {
        ...state,
        dataDisplayed: action.dataToDisplay,
        colorFunc: action.colorFunc,
        assignFunc: (data, id) => (data[id-1][action.dataToDisplay])
      }
    case 'CHANGE_DATE':
      return {
        ...state,
        dateString: action.dateString,
        activeData: getDataForDate(action.dateString)
      }
    case 'TOGGLE_NOTES':
      return {
        ...state,
        detailNotesToggled: !state.detailNotesToggled
      }
    case 'SET_MAP':
      return {
        ...state,
        globalMap: action.globalMap
      }
    case 'SHOW_DETAILS_FOR_FIELD':
      return {
        ...state,
        field: action.field,
        detailNotesToggled: true
      }
    default:
      return {
        title: "Amazing",
        dataDisplayed: "pest-level",
        dateString: "2019-03-12",
        data: data,
        activeData: getDataForDate("2019-03-12"),
        colorFunc: ColorAssignment("red", 0, 100),
        assignFunc: (data, id) => (data[id-1]["pest-level"]),
        detailNotesToggled: false,
        globalMap: null
      }
  }
}

export default viz
