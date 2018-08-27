import { communityConstants } from '../_constants';

const initialState = {
  requesting: false,
  allCommunities: null,
  loaded: false,
  selectedCommunity: null
}

export function communities(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case communityConstants.GET_ALL_COMMUNITIES_REQUEST:
      return {
        ...state,
        requesting: true,
        loaded: false
      };
    case communityConstants.GET_ALL_COMMUNITIES_SUCCESS:
      return {
        ...state,
        requesting: false,  
        allCommunities: action.allCommunities,
        loaded: true
      };
    case communityConstants.GET_ALL_COMMUNITIES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: action.error,
        loaded: false
      };
    case communityConstants.SET_COMMUNITY:
      return {
        ...state,
        selectedCommunity: state.allCommunities.find(community => community.id === action.id)
      };
    default:
      return state
  }
}