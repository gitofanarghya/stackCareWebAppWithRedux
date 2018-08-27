import { communityConstants } from '../_constants';
import { communityService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const communityActions = {
    getAllCommunities,
    setCommunity
};

function getAllCommunities() {
    return dispatch => {
        dispatch(request());

        communityService.getAllCommunities()
            .then(
                allCommunities => { 
                    dispatch(success(allCommunities));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: communityConstants.GET_ALL_COMMUNITIES_REQUEST } }
    function success(allCommunities) { return { type: communityConstants.GET_ALL_COMMUNITIES_SUCCESS, allCommunities } }
    function failure(error) { return { type: communityConstants.GET_ALL_COMMUNITIES_FAILURE, error } }
}

function setCommunity(id) {
    return dispatch => {
        dispatch(request(id))
        history.push(`/${id}`)
    }

    function request(id) { return {type: communityConstants.SET_COMMUNITY, id } }
}