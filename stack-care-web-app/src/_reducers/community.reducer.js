import { communityConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  requesting: false,
  allCommunities: user ? user.allCommunities : null,
  loaded: false
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
    default:
      return state
  }
}