import { combineReducers } from 'redux';

import { authentication } from './users.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  alert
});

export default rootReducer;