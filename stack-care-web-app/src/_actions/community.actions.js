import { communityConstants } from '../_constants';
import { communityService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const communityActions = {
    getAllCommunities
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