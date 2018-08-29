import {history} from './history'
const REFRESH_REQUEST = 'USERS_REFRESH_REQUEST'
const REFRESH_SUCCESS = 'USERS_REFRESH_SUCCESS'
const REFRESH_FAILURE = 'USERS_REFRESH_FAILURE'
const INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN'

const requestOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
        "grant_type": "refresh_token",
        "refresh_token": JSON.parse(localStorage.getItem('user')).refresh_token,
        "client_id": "rTZ61c51XXJriPBSoGReIeZ7W7MjWy"
    })
};

let buffer = []
const checkTokenExpirationMiddleware = store => next => action => {
    if (buffer.length > 20) {
        buffer.splice(0, buffer.length - 20);
    }
    buffer.push(action)
    console.log(buffer)
    if(action.type === INVALID_ACCESS_TOKEN) {
        let pos = buffer.map(e => e.type).indexOf(INVALID_ACCESS_TOKEN) - 1;
        let previousRequest = buffer[pos];
        store.dispatch(request())
        fetch(`https://care-api-staging.appspot.com/oauth2/tokens`, requestOptions)
            .then(response => response.json())
            .then(user => {
                if (user.access_token) {
                    localStorage.setItem('user', JSON.stringify(user));
                    store.dispatch(success(user))
                    history.push(window.location)
                }
            },
            error => {
                store.dispatch(failure(error.toString()));
            })
    } else if(action.type === (REFRESH_REQUEST || REFRESH_SUCCESS || REFRESH_FAILURE)) {
        next(action)
    } else {
        const token_expiration =
        JSON.parse(localStorage.getItem("user")) &&
        JSON.parse(localStorage.getItem("user"))["access_expiration"];
        const d = new Date(token_expiration + 'Z')   
        const now = new Date()
        if (d < now) {
            console.log("expired")
            store.dispatch({ type: INVALID_ACCESS_TOKEN })
        } else {
            return next(action)
        }
    }
};

function request() { return { type: REFRESH_REQUEST } }
function success(user) { return { type: REFRESH_SUCCESS, user } }
function failure(error) { return { type: REFRESH_FAILURE, error } }

export { checkTokenExpirationMiddleware as TokenMiddleware }