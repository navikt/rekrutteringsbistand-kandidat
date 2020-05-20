import throttle from 'lodash.throttle';
import { useState, useEffect } from 'react';

const useVinduErBredereEnn = (bredde: number) => {
    const [erBredere, setErBredere] = useState<boolean>(window.innerWidth > bredde);

    const onResizeWindow = throttle(() => {
        setErBredere(window.innerWidth > bredde);
    }, 200);

    useEffect(() => {
        window.addEventListener('resize', onResizeWindow);

        return () => {
            window.removeEventListener('resize', onResizeWindow);
        };
    }, [onResizeWindow]);

    return erBredere;
};

export default useVinduErBredereEnn;
