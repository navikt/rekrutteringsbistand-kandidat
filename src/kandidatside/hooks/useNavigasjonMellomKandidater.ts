import { useEffect } from 'react';
import { skrivKandidatnrTilKandidatsøkØkt } from '../søkekontekst';

const useNavigasjonmellomKandidater = (kandidatnr: string) => {
    useEffect(() => {
        skrivKandidatnrTilKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);
};

export default useNavigasjonmellomKandidater;
