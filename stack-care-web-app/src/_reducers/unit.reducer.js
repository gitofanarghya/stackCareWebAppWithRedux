import { unitConstants } from '../_constants';

const initialState = {
  requesting: false,
  allUnits: null,
  loaded: false,
  loadedUnitDetails: false,
  selectedUnitId: null,
  loadedCurrentZone: false,
  currentZone: null,
  zones: [],
  bulbs: [],
  switches: [],
  sensors: [],
  hubs: []
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
        loadedCurrentZone: false,
      };
    case unitConstants.UNITS_FOUND_IN_CACHE:
      return {
        ...state,
        requesting: false,
        loaded: true,
        loadedUnitDetails: true
      };
    case unitConstants.UNIT_DETAILS_FOUND_IN_CACHE:
      return {
        ...state,
        requesting:false,
        loadedUnitDetails: true
      }
    case unitConstants.GET_ALL_UNIT_DETAILS_REQUEST:
      return {
        ...state,
        requesting: true,
        loadedUnitDetails: false,
        loadedCurrentZone: false
      };
    case unitConstants.GET_ALL_UNIT_DETAILS_SUCCESS:
      return {
        ...state,
        requesting: false,
        loadedUnitDetails: true
      };
    case unitConstants.GET_ALL_UNIT_DETAILS_FAILURE:
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
          bulbs: state.bulbs.filter(bulb => bulb.zone_id === action.id),
          sensors: state.sensors.filter(sensor => sensor.zone_id === action.id),
          switches: state.switches.filter(swtch => swtch.zone_id === action.id)
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
    case unitConstants.GET_ALL_ZONES_SUCCESS:
      return {
        ...state,
        zones: [...state.zones, ...action.result]
      }
    case unitConstants.GET_ALL_BULBS_SUCCESS:
      return {
        ...state,
        bulbs: [...state.bulbs, ...action.result]
      }
    case unitConstants.GET_ALL_SENSORS_SUCCESS:
      return {
        ...state,
        sensors: [...state.sensors, ...action.result]
      }
    case unitConstants.GET_ALL_SWITCHES_SUCCESS:
      return {
        ...state,
        switches: [...state.switches, ...action.result]
      }
    case unitConstants.GET_ALL_HUBS_SUCCESS:
      return {
        ...state,
        hubs: [...state.hubs, ...action.result]
      }
    default:
      return state
  }
}