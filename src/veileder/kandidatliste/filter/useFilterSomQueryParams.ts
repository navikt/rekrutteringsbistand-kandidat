import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { filterTilQueryParams } from './filter-utils';
import { Kandidatlistefilter } from './../kandidatlistetyper';

const useFilterSomQueryParams = (filter: Kandidatlistefilter) => {
    const history = useHistory();

    useEffect(() => {
        const query = filterTilQueryParams(filter).toString();
        history.replace(`${history.location.pathname}?${query}`);
    }, [history, filter]);
};

export default useFilterSomQueryParams;
