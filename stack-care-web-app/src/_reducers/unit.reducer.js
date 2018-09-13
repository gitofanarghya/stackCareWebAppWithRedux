import { unitConstants } from '../_constants';

const initialState = {
  requesting: false,
  allUnits: null,
  loaded: false,
  loadedUnitDetails: false,
  selectedUnitId: null,
  loadedCurrentZone: false,
  currentZone: null
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
      return {
        ...state,
        requesting: false,  
        allUnits: {
          ...state.allUnits,
          [state.selectedCommunityId]: action.allUnits
        },
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
        selectedUnitId: action.id,
        loadedUnitDetails: false,
        loadedCurrentZone: false,
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
        loadedUnitDetails: true
      }
    case unitConstants.GET_UNIT_DETAILS_REQUEST:
      return {
        ...state,
        requesting: true,
        loadedUnitDetails: false,
        loadedCurrentZone: false,
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
    case unitConstants.SET_CURRENT_ZONE:
      return {
        ...state,
        loadedCurrentZone: true,
        currentZone: {
          zoneId: action.id,
          bulbs: state.allUnits[state.selectedCommunityId].find(unit => unit.id === state.selectedUnitId).unitDetails.bulbs.filter(bulb => bulb.zone_id === action.id),
          sensors: state.allUnits[state.selectedCommunityId].find(unit => unit.id === state.selectedUnitId).unitDetails.sensors.filter(sensor => sensor.zone_id === action.id),
          switches: state.allUnits[state.selectedCommunityId].find(unit => unit.id === state.selectedUnitId).unitDetails.switches.filter(swtch => swtch.zone_id === action.id)
        }
      }
    case unitConstants.SET_COMMUNITY:
      return {
        ...state,
        selectedCommunityId: action.id,
        loaded: false,
        loadedCurrentZone: false,
        loadedUnitDetails: false,
        selectedUnitId: null
      };
    default:
      return state
  }
}