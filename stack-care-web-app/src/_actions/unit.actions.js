import { unitConstants } from '../_constants';
import { unitService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const unitActions = {
    getAllUnits,
    setUnit
};

function getAllUnits(id) {
    return dispatch => {
        dispatch(request(id));

        unitService.getAllUnits(id)
            .then(
                allUnits => { 
                    if(allUnits === "CACHED") dispatch(foundInCache())
                    else dispatch(success(allUnits));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function foundInCache() { return { type: unitConstants.UNITS_FOUND_IN_CACHE } }
    function request(id) { return { type: unitConstants.GET_ALL_UNITS_REQUEST, id } }
    function success(allUnits) { return { type: unitConstants.GET_ALL_UNITS_SUCCESS, allUnits } }
    function failure(error) { return { type: unitConstants.GET_ALL_UNITS_FAILURE, error } }
}

function setUnit(id) {
    return dispatch => {
        dispatch(request(id))
    }

    function request(id) { return { type: unitConstants.SET_UNIT, id } }
}

function getUnitDetails(id) {
    return dispatch => {
        dispatch(request(id))
        unitService.getUnitDetails(id)
            .then(
                unitDetails => { 
                    if(unitDetails === "CACHED") dispatch(foundInCache())
                    else dispatch(success(unitDetails));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    }
    function foundInCache() { return { type: unitConstants.UNIT_DETAILS_FOUND_IN_CACHE } }
    function request(id) { return { type: unitConstants.GET_UNIT_DETAILS_REQUEST, id } }
    function success(unitDetails) { return { type: unitConstants.GET_UNIT_DETAILS_SUCCESS, unitDetails } }
    function failure(error) { return { type: unitConstants.GET_UNIT_DETAILS_FAILURE, error } }
}