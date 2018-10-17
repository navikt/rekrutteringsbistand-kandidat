import { EventEmitter } from 'events';


export default class TokenChecker extends EventEmitter {
    // timeout callbackid
    timeoutId;
    // antall ms for hver timeout check
    interval;
    expirationTime;
    tokenName;

    constructor(interval, tokenName) {
        super();
        this.interval = interval;
        this.tokenName = tokenName;
    }

    /**
     * Initiate the token check
     * @param {} getToken Function to grab token from browser
     * @param {*} expirationTime Expiration time in ms
     */
    initiate(expirationTime) {
        if (expirationTime === undefined) {
            throw new Error('Error: mangler gyldig utløpstid');
        }
        this.expirationTime = expirationTime;
        this.refresh();
    }

    getToken() {
        const cookie = document.cookie;
        if (!cookie) return undefined;
        return cookie
            .split(';')
            .filter((v) => v.indexOf(this.tokenName) !== -1)
            .pop()
            .split(`${this.tokeNName}=`)
            .pop();
    }

    destroy() {
        this.clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.removeAllListeners();
    }

    refresh() {
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        const token = this.getToken();
        if (token === undefined) {
            this.dispatchNoToken();
        }
        this.timeoutId = setTimeout(() => {
            const hasNoToken = token === undefined;
            const tokenExpired = token && Date.now() > this.expirationTime;
            if (hasNoToken) {
                this.dispatchNoToken();
            } else if (tokenExpired) {
                this.dispatchTokenExpired();
            }
            this.refresh();
        }, this.interval);
    }

    dispatchNoToken() {
        console.log('dispatching token missing');
        this.emit('token_missing');
    }

    dispatchTokenExpired() {
        console.log('dispatching token expired');
        this.emit('token_expired');
    }
}
