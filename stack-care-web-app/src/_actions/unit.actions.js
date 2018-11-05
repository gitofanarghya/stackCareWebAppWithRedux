import { unitConstants } from '../_constants';
import { unitService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const unitActions = {
    getAllUnits,
    setUnit,
    getAllUnitDetails,
    setCurrentZone,
    setCommunity
};

function getAllUnits(id) {
    return (dispatch, getState) => {
        if(getState().units.allUnits !== null && getState().units.allUnits[getState().units.selectedCommunityId]) {
            dispatch(foundInCache())
        } else {
            dispatch(request(id));

            unitService.getAllUnits(id)
                .then(
                    allUnits => { 
                        dispatch(success(allUnits));
                        dispatch(getAllUnitDetails(allUnits))
                    },
                    error => {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                );
        }
    };

    function foundInCache() { return { type: unitConstants.UNITS_FOUND_IN_CACHE } }
    function request(id) { return { type: unitConstants.GET_ALL_UNITS_REQUEST, id } }
    function success(allUnits) { return { type: unitConstants.GET_ALL_UNITS_SUCCESS, allUnits } }
    function failure(error) { return { type: unitConstants.GET_ALL_UNITS_FAILURE, error } }
}

function setUnit(id) {
    return (dispatch, getState) => {
        dispatch(request(id))
        dispatch(setCurrentZone(getState().units.zones.filter(z => z.site_id === id)[0].id))
    }

    function request(id) { return { type: unitConstants.SET_UNIT, id } }
}

function getAllUnitDetails(allUnits) {
    return (dispatch, getState) => {
        if(false) {//getState().units.allUnitsDetails[getState().units.selectedCommunityId]) {
            dispatch(foundInCache())
            //dispatch(setCurrentZone(getState().units.allUnits[getState().units.selectedCommunityId].find(unit => unit.id === id).unitDetails.zones[0].id))
        } else {
            dispatch(request())
            unitService.getAllUnitDetails(allUnits)
            /*    .then(
                    allUnitsDetails => {
                        dispatch(success(allUnitsDetails));
                        //dispatch(setCurrentZone(unitDetails.zones[0].id));
                    },
                    error => {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                );*/
        }
    } 
    function foundInCache() { return { type: unitConstants.UNIT_DETAILS_FOUND_IN_CACHE } }
    function request() { return { type: unitConstants.GET_ALL_UNIT_DETAILS_REQUEST } }
    function success(unitDetails) { return { type: unitConstants.GET_ALL_UNIT_DETAILS_SUCCESS, unitDetails } }
    function failure(error) { return { type: unitConstants.GET_ALL_UNIT_DETAILS_FAILURE, error } }
}

function setCurrentZone(id) {
    return dispatch => {
        dispatch(request(id))
    }
    function request(id) { return { type: unitConstants.SET_CURRENT_ZONE, id } }
}

function setCommunity(id) {
    return dispatch => {
        dispatch(request(id))
        history.push(`/${id}`)
    }

    function request(id) { return {type: unitConstants.SET_COMMUNITY, id } }
}