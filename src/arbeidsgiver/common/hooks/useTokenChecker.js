import { useEffect, useRef } from 'react';
import TokenChecker from './tokenCheck';

export default (expiresCallback, expiredCallback) => {
    const tokenChecker = useRef(new TokenChecker());

    const onExpire = () => {
        expiredCallback();
        tokenChecker.current.pause();
    };

    useEffect(() => {
        tokenChecker.current.on('token_expires_soon', expiresCallback);
        tokenChecker.current.on('token_expired', onExpire);
        tokenChecker.current.start();
        return () => tokenChecker.current.destroy();
    }, []);
};
