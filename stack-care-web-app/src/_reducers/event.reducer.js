import { eventConstants } from '../_constants';

const initialState = {
  requesting: false,
  allEvents: null,
  loaded: false
}

export function events(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case eventConstants.GET_ALL_EVENTS_REQUEST:
      return {
        ...state,
        requesting: true,
        loaded: false
      };
    case eventConstants.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        requesting: false,  
        allEvents: action.allEvents,
        loaded: true
      };
    case eventConstants.GET_ALL_EVENTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        loaded: false
      };
    default:
      return state
  }
}