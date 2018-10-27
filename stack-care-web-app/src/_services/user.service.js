import { authHeader, history } from '../_helpers';

export const userService = {
    login,
    logout,
    register
};

function login(username, password) {
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            "grant_type": "password",
            "email": username,//"anarghya@stacklighting.com",
            "password": password,//"Abcd1234@",
            "client_id": "rTZ61c51XXJriPBSoGReIeZ7W7MjWy"
        })
    };

    return fetch(`https://care-api-staging.appspot.com/oauth2/tokens`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.access_token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                window.location.reload(true)
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.json().then(json => {
        const data = json
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}