import { deviceConstants, unitConstants } from '../_constants'
import { deviceService } from '../_services'
import { alertActions } from '.'
import { store } from '../_helpers'

export const deviceActions = {
    deleteDevice,
    startAddingDevices,
    getAllHubs
}

function deleteDevice(siteId, deviceType, deviceId) {
    return dispatch => {
        dispatch(request());

        deviceService.deleteDevice(siteId, deviceType, deviceId)
            .then(
                ok => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: deviceConstants.DELETE_DEVICE_REQUEST } }
    function success() { return { type: deviceConstants.DELETE_DEVICE_SUCCESS } }
    function failure(error) { return { type: deviceConstants.DELETE_DEVICE_FAILURE, error } }

}

function getAllHubs(unitId) {
    return dispatch => {
        dispatch(request());

        deviceService.getAllHubs(unitId)
            .then(
                hubs => { 
                    dispatch(success(hubs));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(unitId) { return { type: deviceConstants.GET_ALL_HUBS_REQUEST, unitId } }
    function success(hubs) { return { type: deviceConstants.GET_ALL_HUBS_SUCCESS, hubs } }
    function failure(error) { return { type: deviceConstants.GET_ALL_HUBS_FAILURE, error } }
 
}

function startAddingDevices(siteId) {
    console.log(store())
    
    /*
    return dispatch => {
        dispatch(request());

        window.setTimeout(() => dispatch(refreshDevices()), 1000)
        window.setTimeout(() => dispatch(refreshDevices()), 2000)
        window.setTimeout(() => dispatch(refreshDevices()), 3000)
        window.setTimeout(() => dispatch(refreshDevices()), 4000)

        deviceService.startAddingDevices(siteId, hubs)
            .then(
                ok => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: deviceConstants.ADD_DEVICE_REQUEST } }
    function success() { return { type: deviceConstants.ADD_DEVICE_SUCCESS } }
    function failure(error) { return { type: deviceConstants.ADD_DEVICE_FAILURE, error } }
    function refreshDevices() { return { type: unitConstants.GET_ALL_UNIT_DETAILS_REQUEST } }
*/
}