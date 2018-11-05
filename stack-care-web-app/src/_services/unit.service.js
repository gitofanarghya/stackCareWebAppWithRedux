import { authHeader } from '../_helpers';
import { store } from '../_helpers'
import {unitConstants} from '../_constants'

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

    return fetch(`https://care-api-prod.appspot.com/units?community_id=${id}`, requestOptions)
        .then(handleResponse)
    
}

function getAllUnitDetails(allUnits) {
    const zones = allUnits.map(requestZones)
    const zoneResults = Promise.all(zones)

    const bulbs = allUnits.map(requestBulbs)
    const bulbsResults = Promise.all(bulbs)

    const sensors = allUnits.map(requestSensors)
    const sensorsResults = Promise.all(sensors)

    const switches = allUnits.map(requestSwitches)
    const switchesResults = Promise.all(switches)

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

    bulbsResults.then(data => {
        
        new Promise(resolve => {
            const result = []
            data.map(d => {
                d.map(i => {
                    result.push(i)
                })
            })
            resolve(result)
        }).then(result => store.dispatch({type: unitConstants.GET_ALL_BULBS_SUCCESS, result }))
        
    })

    sensorsResults.then(data => {
            
        new Promise(resolve => {
            const result = []
            data.map(d => {
                d.map(i => {
                    result.push(i)
                })
            })
            resolve(result)
        }).then(result => store.dispatch({type: unitConstants.GET_ALL_SENSORS_SUCCESS, result }))
        
    })

    switchesResults.then(data => {
            
        new Promise(resolve => {
            const result = []
            data.map(d => {
                d.map(i => {
                    result.push(i)
                })
            })
            resolve(result)
        }).then(result => store.dispatch({type: unitConstants.GET_ALL_SWITCHES_SUCCESS, result }))
        
    })

    const results = Promise.all([zones, bulbs, sensors, switches])
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
    return fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${unit.id}/zones`, options).then(data => data.json())
}
const requestBulbs = unit => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };
    return fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${unit.id}/bulbs`, options).then(data => data.json())
}
const requestSensors = unit => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };
    return fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${unit.id}/sensors`, options).then(data => data.json())
}
const requestSwitches = unit => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };
    return fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${unit.id}/switches`, options).then(data => data.json())
}

const aggregate = async (allUnits, options) => {
    const buf = await allUnits.map(async element => {
        const zoneres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${element.id}/zones`, options)
        const zones = await zoneres.json()
        const bulbres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${element.id}/bulbs`, options)
        const bulbs = await bulbres.json()
        const sensorres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${element.id}/sensors`, options)
        const sensors = await sensorres.json()
        const switchres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${element.id}/switches`, options)
        const switches = await switchres.json()
        return {
            id: element.id,
            details: {
                zones: zones,
                bulbs: bulbs,
                sensors: sensors,  
                switches: switches
            }
        }
    })
    return buf
}

const requestUnitDetails = async (options, id) => {
    const zoneres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${id}/zones`, options)
    const zones = await zoneres.json()
    const bulbres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${id}/bulbs`, options)
    const bulbs = await bulbres.json()
    const sensorres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${id}/sensors`, options)
    const sensors = await sensorres.json()
    const switchres = await fetch( `https://dm-dot-care-api-prod.appspot.com/sites/${id}/switches`, options)
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