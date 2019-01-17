import { deviceConstants } from '../_constants';

const initialState = {
  unitId: null,
  hubs: [],
  requestingHubs: false,
  addingDevice: false,
  deletingDevice: false,
  identifyingDevice: false,
  devicesToBeAdded: [],
  deviceToBeDeleted: null,
  deviceToBeIdentified: null
}

export function device(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case deviceConstants.GET_ALL_HUBS_REQUEST:
      return {
            ...state,
            requestingHubs: true,
            unitId: action.unitId
        }
    case deviceConstants.GET_ALL_HUBS_SUCCESS:
      return {
            ...state,
            requestingHubs: false,
            hubs: action.hubs
        }
    case deviceConstants.GET_ALL_HUBS_FAILURE:
      return {
            ...state,
            requestingHubs: false,
            unitId: null
        }
    case deviceConstants.DELETE_DEVICE_REQUEST:
      return {
            ...state,
            deletingDevice: true,
            deviceToBeDeleted: action.deviceId
        };
    case deviceConstants.DELETE_DEVICE_SUCCESS:
      return {
            ...state,
            deletingDevice: false,
            deviceToBeDeleted: null
        };
    case deviceConstants.DELETE_DEVICE_FAILURE:
      return {
            ...state,
            deviceToBeDeleted: false,
            error: action.error,
        };
    case deviceConstants.ADD_DEVICE_REQUEST:
        return {
            ...state,
            addingDevice: true,
            hubIdToStartAdding: action.hubId
        };
    case deviceConstants.ADD_DEVICE_REQUEST_SUCCESS:
        return {
            ...state,
            addingDevice: true
        };
    case deviceConstants.ADD_DEVICE_REQUEST_FAILURE:
        return {
            ...state,
            addingDevice: false,
            error: action.error,
        }
    case deviceConstants.STOP_ADD_DEVICE_REQUEST:
        return {
            ...state,
            addingDevice: false,
            devicesToBeAdded: action.devicesToBeAdded
        };
    case deviceConstants.STOP_ADD_DEVICE_REQUEST_SUCCESS:
        return {
            ...state,
            addingDevice: false
        };
    case deviceConstants.STOP_ADD_DEVICE_REQUEST_FAILURE:
        return {
            ...state,
            addingDevice: true,
            error: action.error,
        }
    default:
        return state
    }
}