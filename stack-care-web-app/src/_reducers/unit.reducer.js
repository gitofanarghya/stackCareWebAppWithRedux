import { unitConstants } from '../_constants';

const initialState = {
  requesting: false,
  allUnits: null,
  loaded: false,
  selectedUnit: null,
  selectedCommunityId: null,
  loadedUnitDetails: false,
  selectedUnitId: null
}

export function units(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case unitConstants.GET_ALL_UNITS_REQUEST:
      return {
        ...state,
        requesting: true,
        loaded: false,
        selectedCommunityId: action.id
      };
    case unitConstants.GET_ALL_UNITS_SUCCESS:
      const units = {
        [state.selectedCommunityId]: action.allUnits
      }
      const allUnits = state.allUnits === null ? units : {...state.allUnitsunits, units}
      return {
        ...state,
        requesting: false,  
        allUnits: allUnits,
        loaded: true
      };
    case unitConstants.GET_ALL_UNITS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        loaded: false
      };
    case unitConstants.SET_UNIT:
      return {
        ...state,
        selectedUnit: state.allUnits[state.selectedCommunityId].find(unit => unit.id === action.id)
      };
    case unitConstants.UNITS_FOUND_IN_CACHE:
      return {
        ...state,
        requesting: false,
        loaded: true
      };
    case unitConstants.UNIT_DETAILS_FOUND_IN_CACHE:
      return {
        ...state,
        requesting:false,
        loaded: true
      }
    case unitConstants.GET_UNIT_DETAILS_REQUEST:
      return {
        ...state,
        requesting: true,
        loadedUnitDetails: false,
        selectedUnitId: action.id
      };
    case unitConstants.GET_UNIT_DETAILS_SUCCESS:
      const a = state.allUnits
      a[state.selectedCommunityId].find(unit => unit.id === state.selectedUnitId).unitDetails = action.unitDetails
      return {
        ...state,
        requesting: false,  
        allUnits: a,
        loadedUnitDetails: true
      };
    case unitConstants.GET_UNIT_DETAILS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        loadedUnitDetails: false
      }
    default:
      return state
  }
}