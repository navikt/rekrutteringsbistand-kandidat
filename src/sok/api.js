/* eslint-disable no-underscore-dangle */

export class SearchApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

async function post(query) {
    let response;
    try {
        response = await fetch('http://localhost:9010/pam-jobbprofil-api/sok', {
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function fetchKandidater(query = {}) {
    const resultat = await post({ ...query, type: 10 });
    return resultat;
}

export async function fetchKandidatInfo(id) {
    const resultat = await fetch(`http://localhost:9010/pam-jobbprofil-api/janzzid/${id}`);
    return resultat.json();
}
