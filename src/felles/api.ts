import { Feil, ResponseData, Suksess } from './common/remoteData';

export const createCallIdHeader = () => ({
    'Nav-CallId': Math.random()
        .toString(16)
        .substr(2),
});

export class SearchApiError {
    message: string;
    status: number;
    constructor(error) {
        this.message = error.message;
        this.status = error.status;
    }
}

export async function fetchJson(url: string, includeCredentials: boolean = false) {
    try {
        let response;
        if (includeCredentials) {
            response = await fetch(url, {
                credentials: 'include',
                headers: createCallIdHeader(),
            });
        } else {
            response = await fetch(url, { headers: createCallIdHeader() });
        }
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        let error;
        try {
            error = await response.json();
        } catch (e) {
            throw new SearchApiError({
                status: response.status,
                message: response.statusText,
            });
        }
        throw new SearchApiError({
            message: error.message,
            status: error.status,
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
}

export async function deleteJsonMedType<T>(
    url: string,
    bodyString?: string
): Promise<ResponseData<T>> {
    try {
        const response: unknown = await deleteReq(url, bodyString);
        return Suksess(<T>response);
    } catch (e) {
        if (e instanceof SearchApiError) {
            return Feil(e);
        } else {
            throw e;
        }
    }
}

const getCookie = name => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

export async function postJson(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                ...createCallIdHeader(),
            },
            mode: 'cors',
        });
        if (response.status === 200 || response.status === 201) {
            const contentType = response.headers.get('content-type');
            return contentType && contentType.includes('application/json')
                ? response.json()
                : response.text();
        } else if (response.status === 204) {
            return undefined;
        }
        throw new SearchApiError({
            status: response.status,
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
}

export async function putJson(url, bodyString?: string) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'PUT',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                ...createCallIdHeader(),
            },
            mode: 'cors',
        });
        if (response.status === 200 || response.status === 201) {
            return response.json();
        } else if (response.status === 204) {
            return undefined;
        }
        throw new SearchApiError({
            status: response.status,
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
}

export async function deleteReq(url: string, bodyString?: string) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'DELETE',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                ...createCallIdHeader(),
            },
            mode: 'cors',
        });

        if (response.status <= 202) {
            return response.json();
        } else if (response.status === 204) {
            return null;
        }
        throw new SearchApiError({
            status: response.status,
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
}

export async function deleteWithoutJson(url: string, bodyString?: string) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'DELETE',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                ...createCallIdHeader(),
            },
            mode: 'cors',
        });

        if (!response.ok) {
            throw new SearchApiError({
                status: response.status,
            });
        }
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
}
