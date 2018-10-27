import { authHeader } from '../_helpers';

export const communityService = {
    getAllCommunities
};

function getAllCommunities() {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        headers: authHeader(),
        body: null
    };

    return fetch(`https://care-api-prod.appspot.com/communities?get_all=1`, requestOptions)
        .then(handleResponse)
}

function handleResponse(response) {
    return response.json().then(json => {
        const data = json.filter(community => community.name !== 'Test community') // filtering all test communities cause its irritating!!
        if (!response.ok) {
            if (response.status === 403) {
                console.log("403")
                localStorage.removeItem('user')
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        localStorage.setItem('user', JSON.stringify({
            ...JSON.parse(localStorage.getItem('user')),
            allCommunities: data
        }))
        return data;
    });
}