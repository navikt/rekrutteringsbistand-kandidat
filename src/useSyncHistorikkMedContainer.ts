import { useEffect } from 'react';
import { useHistory } from 'react-router';

export const useSyncHistorikkMedContainer = () => {
    const history = useHistory();
    useEffect(() => {
        history.replace(window.location.pathname);
    }, [window.location.pathname]);
};
