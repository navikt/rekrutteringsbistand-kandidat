
import { EventEmitter } from 'events';
import { sjekkTokenGaarUtSnart, SearchApiError } from './api';


export default class TokenChecker extends EventEmitter {
    // timeout callbackid
    timeoutId = undefined;
    // antall ms for hver timeout check
    interval = 60000;
    isPaused = false;

    constructor(interval) {
        super();
        this.interval = interval;
    }

    start() {
        this.isPaused = false;
        this.loop();
    }

    pause() {
        this.isPaused = true;
    }

    destroy() {
        this.clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.removeAllListeners();
    }

    gaarTokenUtSnart = async () => {
        const result = await sjekkTokenGaarUtSnart();
        return result.content;
    }

    timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    loop = async () => {
        if (this.isPaused) {
            return;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
        await this.timeout(this.interval);
        try {
            const gaarUtSnart = await this.gaarTokenUtSnart();
            if (gaarUtSnart && !this.isPaused) {
                this.dispatchTokenExpiresSoon();
            }
        } catch (e) {
            if (e instanceof SearchApiError) {
                if (e.status === 401) {
                    this.dispatchTokenExpired();
                }
            } else {
                throw e;
            }
        }
        this.loop();
    }


    dispatchTokenExpired() {
        this.emit('token_expired');
    }

    dispatchTokenExpiresSoon() {
        this.emit('token_expires_soon');
    }
}
