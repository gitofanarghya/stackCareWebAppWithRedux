import { combineReducers } from 'redux';

import { authentication } from './users.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { communities } from './community.reducer';
import { events } from './event.reducer';
import { units } from './unit.reducer'

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  communities,
  units,
  events
});

export default rootReducer;