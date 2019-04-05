import ColorAssignment from "../util/ColorAssignment";

export const changeDate = (dateString) => ({
  type: 'CHANGE_DATE',
  dateString: dateString,
})

export const changeDataDisplayed = (dataToDisplay) => {
  var colorFunc;
  switch (dataToDisplay) {
    case "humidity":
      colorFunc = ColorAssignment("blue", 0.0, 1.0);
      break;
    default:
      colorFunc = ColorAssignment("red", 0, 100);
      break;
  }
  return ({
    type: 'CHANGE_DATA_DISPLAYED',
    dataToDisplay: dataToDisplay,
    colorFunc: colorFunc
  })
}

export const toggleNotes = () => ({
  type: 'TOGGLE_NOTES'
})

export const setMap = (map) => ({
  type: 'SET_MAP',
  globalMap: map
})

export const showDetailsFor = (field) => ({
  type: 'SHOW_DETAILS_FOR_FIELD',
  field: field,
})