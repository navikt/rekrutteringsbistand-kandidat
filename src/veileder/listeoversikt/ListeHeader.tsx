import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import SorterbarKolonneheader from './SorterbarKolonneheader';
import {
    KandidatlisteSorteringsfelt,
    KandidatlisteSorteringsretning,
} from './Kandidatlistesortering';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../AppState';
import { ListeoversiktActionType } from './reducer/ListeoversiktAction';

const ListeHeader: FunctionComponent = () => {
    const dispatch = useDispatch();

    // TODO: Prøv med Kandidatlistestate
    const aktivtSorteringsfelt = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortField
    );
    const aktivRetning = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortDirection
    );

    const endreSortering = (sorteringsfelt: KandidatlisteSorteringsfelt) => {
        const endringPåAktivtFelt = aktivtSorteringsfelt === sorteringsfelt;

        if (endringPåAktivtFelt) {
            const nyRetning = nesteSorteringsretning();
            const felt = nyRetning === null ? null : aktivtSorteringsfelt;
            dispatch({
                type: ListeoversiktActionType.SET_SORTERING,
                sortering: { sortField: felt, sortDirection: nyRetning },
            });
        } else {
            dispatch({
                type: ListeoversiktActionType.SET_SORTERING,
                sortering: {
                    sortField: sorteringsfelt,
                    sortDirection: KandidatlisteSorteringsretning.Stigende,
                },
            });
        }
    };

    const nesteSorteringsretning = (): null | KandidatlisteSorteringsretning => {
        const retninger = [
            null,
            KandidatlisteSorteringsretning.Stigende,
            KandidatlisteSorteringsretning.Synkende,
        ];
        const aktivIndex = retninger.indexOf(aktivRetning);
        return aktivIndex === retninger.length - 1 ? retninger[0] : retninger[aktivIndex + 1];
    };

    const hentSorteringsretning = (
        felt: KandidatlisteSorteringsfelt
    ): null | KandidatlisteSorteringsretning => {
        if (felt === aktivtSorteringsfelt) {
            return aktivRetning;
        } else {
            return null;
        }
    };

    return (
        <div className="liste-header liste-rad-innhold">
            <SorterbarKolonneheader
                tekst={'Dato opprettet'}
                sorteringsfelt={KandidatlisteSorteringsfelt.OpprettetTidspunkt}
                sorteringsretning={hentSorteringsretning(
                    KandidatlisteSorteringsfelt.OpprettetTidspunkt
                )}
                onClick={endreSortering}
                className="kolonne-middels"
            />
            <div className="kolonne-bred">
                <Element>Navn på kandidatliste</Element>
            </div>
            <div className="kolonne-middels">
                <Element>Antall kandidater</Element>
            </div>
            <div className="kolonne-bred">
                <Element>Veileder</Element>
            </div>
            <div className="kolonne-middels__finn-kandidater">
                <Element>Finn kandidater</Element>
            </div>
            <div className="kolonne-smal">
                <Element>Rediger</Element>
            </div>
            <div className="kolonne-smal">
                <Element>Meny</Element>
            </div>
        </div>
    );
};

export default ListeHeader;
