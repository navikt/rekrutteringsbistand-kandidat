import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { filterTilQueryParams } from './filter-utils';
import { Kandidatlistefilter } from './../kandidatlistetyper';

const useFilterSomQueryParams = (filter: Kandidatlistefilter) => {
    const history = useHistory();
    const query = filterTilQueryParams(filter).toString();

    useEffect(() => {
        history.replace(`${history.location.pathname}?${query}`);
    }, [history, query]);
};

export default useFilterSomQueryParams;
