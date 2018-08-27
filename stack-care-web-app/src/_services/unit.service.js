import { authHeader } from '../_helpers';
import { store } from '../_helpers'

export const unitService = {
    getAllUnits
};

function getAllUnits(id) {
    if(store.getState().units.allUnits === null || store.getState().units.allUnits.find(community => community.communityId === id) === undefined) {
        const requestOptions = {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: authHeader(),
            body: null
        };
    
        return fetch(`https://care-api-staging.appspot.com/units?community_id=${id}`, requestOptions)
            .then(handleResponse)
    } else {
        return "CACHED"
    }

    
}

function handleResponse(response) {
    return response.json().then(json => {
        const data = json
        if (!response.ok) {
            if (response.status === 403) {
                console.log("403")
                localStorage.removeItem('user')
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}