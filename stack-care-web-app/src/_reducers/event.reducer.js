import { eventConstants } from '../_constants';
import { communityUnitMap, groupBy } from '../_helpers'

const initialState = {
  requesting: false,
  allEvents: null,
  loadedEvents: false,
  eventsWithCommunityId: null
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
        eventsWithCommunityId: eventsByCommunityCalculator(action.allEvents.filter(e => Date.parse(e.time_created)/1000 > new Date().getTime()/1000 - (7*24*3600)), communityUnitMap),
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

function eventsByCommunityCalculator(events, map) {
  const eventsByUnitID = groupBy(events, "unit_id")
  const eventsWithCommunityId = events.map(e => {
    const arr = map.filter(u => u.unitID === e.unit_id)
    const communityId = arr[0] ? arr[0].communityID : null
    return {
      ...e,
      community_id: communityId
    }
  })
  return eventsWithCommunityId
}