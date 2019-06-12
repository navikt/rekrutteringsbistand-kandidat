
import { EventEmitter } from 'events';
import { SearchApiError } from '../../../felles/api.ts';
import { sjekkTokenGaarUtSnart } from '../../sok/api';

export default class TokenChecker extends EventEmitter {
    timeoutId = undefined;

    isPaused = false;

    intervalInMilliseconds;

    constructor(intervalInMilliseconds = 60000) {
        super();
        this.intervalInMilliseconds = intervalInMilliseconds;
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
    };

    timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    loop = async () => {
        if (this.isPaused) {
            return;
        }

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }

        await this.timeout(this.intervalInMilliseconds);

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
    };


    dispatchTokenExpired() {
        this.emit('token_expired');
    }

    dispatchTokenExpiresSoon() {
        this.emit('token_expires_soon');
    }
}
