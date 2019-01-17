import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user, refreshed: true, refreshing: false } : {loggedIn: false, user: null, refreshed: true, refreshing: false };

export function authentication(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.REFRESH_REQUEST:
      return {
        ...state,
        refreshing: true,
        refreshed: false
      };
    case userConstants.REFRESH_SUCCESS:
      return {
        ...state,
        refreshed: true,
        refreshing: false
      };
    case userConstants.REFRESH_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {
        ...state,loggedIn: false, user: null, refreshed: true, refreshing: false };
    default:
      return state
  }
}