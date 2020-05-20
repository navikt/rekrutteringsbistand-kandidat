import throttle from 'lodash.throttle';
import { useState, useEffect } from 'react';

const erBredereEnn = (bredde: number) => window.innerWidth > bredde;

const useVinduErBredereEnn = (bredde: number) => {
    const [erBredere, setErBredere] = useState<boolean>(erBredereEnn(bredde));

    const onResizeWindow = throttle(() => {
        setErBredere(erBredereEnn(bredde));
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
