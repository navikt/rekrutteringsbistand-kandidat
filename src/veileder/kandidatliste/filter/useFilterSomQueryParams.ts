import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { filterTilQueryParams } from './filter-utils';
import { Kandidatlistefilter } from './../kandidatlistetyper';

const useFilterSomQueryParams = (filter: Kandidatlistefilter) => {
    const history = useHistory();
    const query = filterTilQueryParams(filter).toString();

    useEffect(() => {
        if (query.length > 0) {
            history.replace(`${history.location.pathname}?${query}`);
        }
    }, [history, query, filter]);
};

export default useFilterSomQueryParams;
