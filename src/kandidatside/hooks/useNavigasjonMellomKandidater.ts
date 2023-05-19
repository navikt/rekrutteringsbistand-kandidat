import { useEffect } from 'react';
import { hentØktFraKandidatsøk, skrivKandidatnrTilKandidatsøkØkt } from '../søkekontekst';

const kandidatsøkProxy = `/kandidatsok-proxy`;

const useNavigasjonMellomKandidater = (kandidatnr: string) => {
    useEffect(() => {
        const økt = hentØktFraKandidatsøk();

        if (økt) {
            const {
                kandidaterPåSiden,
                searchParams,
                sidestørrelse = 0,
                totaltAntallKandidater = 0,
            } = økt;

            const sisteKandidatPåSiden = kandidaterPåSiden?.at(-1);

            if (kandidatnr === sisteKandidatPåSiden) {
                console.log('Er på siste kandidat, sjekker om vi skal laste inn flere ...');

                const activeSearch = new URLSearchParams(searchParams);
                const currentPage = parseInt(activeSearch.get('side') ?? '1');
                const currentPageSize = kandidaterPåSiden?.length ?? 0;
                const totaltAntallVist = (currentPage - 1) * sidestørrelse + currentPageSize;
                const kanBlaTilNesteSide = totaltAntallVist < totaltAntallKandidater;

                if (kanBlaTilNesteSide) {
                    const nesteSide = currentPage + 1;

                    console.log('Blar til neste side som er', nesteSide);
                }
            }
        }

        skrivKandidatnrTilKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);
};

export default useNavigasjonMellomKandidater;
