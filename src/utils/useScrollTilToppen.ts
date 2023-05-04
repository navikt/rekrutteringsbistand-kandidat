import { useEffect } from 'react';

const useScrollTilToppen = (avhengighet: any) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [avhengighet]);
};

export default useScrollTilToppen;
