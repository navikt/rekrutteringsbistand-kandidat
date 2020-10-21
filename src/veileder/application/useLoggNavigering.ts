import { sendEvent } from '../amplitude/amplitude';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const statiskeStierSomSkalLogges = ['/', '/kandidater', '/kandidater/lister'];
const begynnelsenAvStierSomSkalLogges = [
    '/kandidater/lister/detaljer',
    '/kandidater/lister/stilling',
    '/kandidater/kandidat/',
];

const useLoggNavigering = () => {
    const history = useHistory();
    const pathname = history.location.pathname;

    const loggNavigering = (side: string) => {
        sendEvent('app', 'sidevisning', {
            side,
        });
    };

    useEffect(() => {
        if (statiskeStierSomSkalLogges.includes(pathname)) {
            loggNavigering(pathname);
        } else {
            const begynnelsenAvSti = begynnelsenAvStierSomSkalLogges.find((sti) =>
                pathname.startsWith(sti)
            );

            if (begynnelsenAvSti) {
                loggNavigering(begynnelsenAvSti);
            }
        }
    }, [pathname]);
};

export default useLoggNavigering;
