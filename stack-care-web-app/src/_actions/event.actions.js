import { eventConstants } from '../_constants';
import { eventService } from '../_services';
import { alertActions } from '.';

export const eventActions = {
    getAllEvents
};

function getAllEvents() {
    return dispatch => {
        dispatch(request());

        eventService.getAllEvents()
            .then(
                allEvents => { 
                    dispatch(success(allEvents));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: eventConstants.GET_ALL_EVENTS_REQUEST } }
    function success(allEvents) { return { type: eventConstants.GET_ALL_EVENTS_SUCCESS, allEvents } }
    function failure(error) { return { type: eventConstants.GET_ALL_EVENTS_FAILURE, error } }
}