import { Element } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import SorterbarKolonneheader from '../common/sorterbarKolonneheader/SorterbarKolonneheader';
import { KandidatlisteSorteringsfelt } from './Kandidatlistesortering';
import { useDispatch, useSelector } from 'react-redux';
import AppState from '../AppState';
import { ListeoversiktActionType } from './reducer/ListeoversiktAction';
import { nesteSorteringsretning, Retning } from '../common/sorterbarKolonneheader/Retning';

const ListeHeader: FunctionComponent = () => {
    const dispatch = useDispatch();

    const aktivtSorteringsfelt = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortField
    );
    const aktivRetning = useSelector(
        (state: AppState) => state.listeoversikt.sortering.sortDirection
    );

    const endreSortering = (sorteringsfelt: string) => {
        const endringPåAktivtFelt = aktivtSorteringsfelt === sorteringsfelt;

        if (endringPåAktivtFelt) {
            const nyRetning = nesteSorteringsretning(aktivRetning);
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
                    sortDirection: Retning.Stigende,
                },
            });
        }
    };

    return (
        <div className="liste-header liste-rad-innhold">
            <SorterbarKolonneheader
                tekst={'Dato opprettet'}
                sorteringsfelt={KandidatlisteSorteringsfelt.OpprettetTidspunkt}
                aktivtSorteringsfelt={aktivtSorteringsfelt}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-middels sorterbar-kolonne-header"
            />
            <SorterbarKolonneheader
                tekst={'Navn på kandidatliste'}
                sorteringsfelt={KandidatlisteSorteringsfelt.Tittel}
                aktivtSorteringsfelt={aktivtSorteringsfelt}
                aktivSorteringsretning={aktivRetning}
                onClick={endreSortering}
                className="kolonne-bred"
            />
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
