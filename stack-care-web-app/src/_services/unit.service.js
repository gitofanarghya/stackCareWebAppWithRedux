import { authHeader } from '../_helpers';
import { store } from '../_helpers'
import {unitConstants} from '../_constants'
import { environment } from '../_helpers';

export const unitService = {
    getAllUnits,
    getAllUnitDetails
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

    return fetch(`https://care-api-${environment()}.appspot.com/units?community_id=${id}`, requestOptions)
        .then(handleResponse)
    
}

function getAllUnitDetails(allUnits) {
    const zones = allUnits.map(requestZones)
    const zoneResults = Promise.all(zones)

    const devices = allUnits.map(requestDevices)
    const devicesResults = Promise.all(devices)

    zoneResults.then(data => {
        
        new Promise(resolve => {
            const result = []
            data.map(d => {
                d.map(i => {
                    result.push(i)
                })
            })
            resolve(result)
        }).then(result => store.dispatch({type: unitConstants.GET_ALL_ZONES_SUCCESS, result }))
        
    })

    devicesResults.then(data => {
        
        new Promise(resolve => {
            const result = []
            data.map(d => {
                d.map(i => {
                    result.push(i)
                })
            })
            resolve(result)
        }).then(result => store.dispatch({type: unitConstants.GET_ALL_DEVICES_SUCCESS, result }))
        
    })
    const results = Promise.all([zones, devices])
    results.then(data => {
        const a = setTimeout(() => store.dispatch({ type: unitConstants.GET_ALL_UNIT_DETAILS_SUCCESS }), 2000)    
    }) 
}

const requestZones = unit => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };
    return fetch( `https://dm-dot-care-api-${environment()}.appspot.com/sites/${unit.id}/zones`, options).then(data => data.json())
}
const requestDevices = unit => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };
    return fetch( `https://dm-dot-care-api-${environment()}.appspot.com/sites/${unit.id}/devices`, options).then(data => data.json())
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