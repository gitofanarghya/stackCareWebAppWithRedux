import { eventConstants } from '../_constants';
import { communityUnitMap, groupBy } from '../_helpers'

const initialState = {
  requesting: false,
  allEvents: null,
  loadedEvents: false
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
        loadedEvents: false
      };
    case eventConstants.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        requesting: false,  
        allEvents: action.allEvents.filter(e => Date.parse(e.time_created)/1000 > new Date().getTime()/1000 - (7*24*3600)),
        loadedEvents: true
      };
    case eventConstants.GET_ALL_EVENTS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        loadedEvents: false
      };
    default:
      return state
  }
}