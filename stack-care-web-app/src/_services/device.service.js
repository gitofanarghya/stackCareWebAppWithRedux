import { authHeader } from '../_helpers';
import { environment } from '../_helpers';

export const deviceService = {
    deleteDevice,
    identifyDevice,
    getAllHubs,
    startAddingDevices
};
//new Date().toISOString().replace(/\..*$/, '') --> for sending current datetime with milliseconds trimmed 

function getAllHubs(unitId) {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://dm-dot-care-api-${environment()}.appspot.com/sites/${unitId}/hubs`, requestOptions)
        .then(handleHubResponse)
}

function deleteDevice(siteId, deviceType, deviceId) {
    deviceType = deviceType === 'bulb' ? 'bulbs' : deviceType === 'sensor' ? 'sensors' : 'switches'
    const requestOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://dm-dot-care-api-${environment()}.appspot.com/sites/${siteId}/${deviceType}/${deviceId}`, requestOptions)
        .then(handleResponse)
}

function startAddingDevices(siteId, hubs) {
    const promises = hubs.map(add)
    const results = Promise.all(promises)

    results.then(data => {
        console.log('add Device results: ', data)
    })

    const add = hub => {
        const requestOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            headers: authHeader(),
            body: JSON.stringify({
                "device_detect_on": true
              })
        }
        return fetch(`https://dm-dot-care-api-staging.appspot.com/sites/${siteId}/hubs/${hub.id}`, requestOptions)
            .then(handleResponse)
    }
    
}

function identifyDevice(siteId, deviceType, deviceId) {
    deviceType = deviceType === 'bulb' ? 'bulbs' : deviceType === 'sensor' ? 'sensors' : 'switches'
    const requestOptions = {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: JSON.stringify({
            "identify_time": new Date().toISOString().replace(/\..*$/, '')
        })
    };

    return fetch(`https://dm-dot-care-api-${environment()}.appspot.com/sites/${siteId}/${deviceType}/${deviceId}`, requestOptions)
        .then(handleResponse)
}

function handleResponse(response) {
    return response.json().then(json => {
        if (!response.ok) {
            if (response.status === 403) {
                console.log("403")
                localStorage.removeItem('user')
                window.location.reload(true);
            }

            const error = (json && json.message) || response.statusText;
            return Promise.reject(error);
        }
        return json;
    });
}

function handleHubResponse(response) {
    return response.json().then(json => {
        if (!response.ok) {
            if (response.status === 403) {
                console.log("User unauthorized for device ops!")
            }

            const error = (json && json.message) || response.statusText;
            return Promise.reject(error);
        }
        return json;
    });
}