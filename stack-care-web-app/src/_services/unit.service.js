import { authHeader } from '../_helpers';
import { store } from '../_helpers'

export const unitService = {
    getAllUnits,
    getUnitDetails
};

function getAllUnits(id) {

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
    
}

function getUnitDetails(id) {
    
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return requestUnitDetails(requestOptions, id)

}

const requestUnitDetails = async (options, id) => {
    const zoneres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${id}/zones`, options)
    const zones = await zoneres.json()
    const bulbres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${id}/bulbs`, options)
    const bulbs = await bulbres.json()
    const sensorres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${id}/sensors`, options)
    const sensors = await sensorres.json()
    const switchres = await fetch( `https://dm-dot-care-api-staging.appspot.com/sites/${id}/switches`, options)
    const switches = await switchres.json()
    return {
        zones: zones,
        bulbs: bulbs,
        sensors: sensors,  
        switches: switches
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