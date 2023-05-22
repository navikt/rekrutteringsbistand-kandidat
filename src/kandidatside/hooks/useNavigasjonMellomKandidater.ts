import { useEffect } from 'react';
import {
    KandidatsøkØkt,
    hentØktFraKandidatsøk,
    skrivKandidatnrTilKandidatsøkØkt,
    useKandidatsøkøkt,
} from '../søkekontekst';

const kandidatsøkProxy = `/kandidatsok-proxy`;

type Respons = {
    hits: {
        hits: Array<{
            _source: {
                arenaKandidatnr: string;
            };
        }>;
    };
};

const søk = async (query: object): Promise<Respons> => {
    const respons = await fetch(kandidatsøkProxy, {
        body: JSON.stringify(query),
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (respons.ok) {
        return await respons.json();
    } else {
        throw Error();
    }
};

const useNavigasjonMellomKandidater = (kandidatnr: string) => {
    const { økt, setØkt } = useKandidatsøkøkt();

    useEffect(() => {
        const blaTilNesteSide = async (økt: KandidatsøkØkt, nesteSide: number) => {
            const queryForNesteSide = {
                ...økt.query,
                from: (nesteSide - 1) * (økt.sidestørrelse ?? 1),
            };

            console.log('Blar til neste side med query:', queryForNesteSide);

            const kandidater = await søk(queryForNesteSide);
            const kandidaterPåSiden = kandidater.hits.hits.map(
                (hit) => hit._source.arenaKandidatnr
            );
            const searchParamsMedNesteSide = new URLSearchParams(økt.searchParams);

            searchParamsMedNesteSide.set('side', nesteSide.toString());

            const nyØkt: KandidatsøkØkt = {
                ...økt,
                kandidaterPåSiden,
                searchParams: searchParamsMedNesteSide.toString(),
                query: queryForNesteSide,
            };

            setØkt(nyØkt);
            console.log('Skriv tilbake til SessionStorage:', nyØkt);
        };

        const {
            kandidaterPåSiden,
            searchParams,
            sidestørrelse = 0,
            totaltAntallKandidater = 0,
        } = økt;

        const førsteKandidatPåSiden = kandidaterPåSiden?.at(0);
        const sisteKandidatPåSiden = kandidaterPåSiden?.at(-1);

        if (kandidatnr === sisteKandidatPåSiden) {
            console.log('Er på siste kandidat, sjekker om vi skal laste inn flere ...');

            const activeSearch = new URLSearchParams(searchParams);
            const currentPage = parseInt(activeSearch.get('side') ?? '1');
            const currentPageSize = kandidaterPåSiden?.length ?? 0;
            const totaltAntallVist = (currentPage - 1) * sidestørrelse + currentPageSize;
            const kanBlaTilNesteSide = totaltAntallVist < totaltAntallKandidater;

            if (kanBlaTilNesteSide) {
                console.log('Blar til neste side som er', currentPage + 1);

                blaTilNesteSide(økt, currentPage + 1);
            }
        } else if (kandidatnr === førsteKandidatPåSiden) {
            // TODO: Blaing til forrige side
        }

        skrivKandidatnrTilKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);
};

export default useNavigasjonMellomKandidater;
