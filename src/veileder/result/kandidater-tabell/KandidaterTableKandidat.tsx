import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';
import { MidlertidigUtilgjengeligState } from '../../kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import AppState from '../../AppState';
import TilgjengelighetFlagg from './tilgjengelighet-flagg/TilgjengelighetFlagg';
import Søkeresultat from '../../sok/Søkeresultat';
import './KandidaterTabell.less';
import ErLagtIKandidatListeIkon from './er-lagt-i-kandidatliste-ikon/ErLagtIKandidatListeIkon';
import { KandidatQueryParam } from '../../kandidatside/Kandidatside';
import { Checkbox } from 'nav-frontend-skjema';
import { lenkeTilKandidat } from '../../application/paths';

interface Props {
    kandidat: Søkeresultat;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    markert: boolean;
    nettoppValgt: boolean;
    setScrollPosition: (position: number) => void;
    kandidatlisteId: string;
    stillingsId: string;
    midlertidigUtilgjengeligMap: MidlertidigUtilgjengeligState;
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => void;
}

const KandidaterTableKandidat: FunctionComponent<Props> = ({
    kandidat,
    markert = false,
    nettoppValgt,
    setScrollPosition,
    kandidatlisteId,
    stillingsId,
    onKandidatValgt,
    midlertidigUtilgjengeligMap,
    hentMidlertidigUtilgjengeligForKandidat,
}) => {
    const onCheck = (kandidatnr) => {
        onKandidatValgt(!markert, kandidatnr);
    };

    const checkedClass = (markert, nettoppValgt) => {
        if (nettoppValgt) {
            return 'nettopp-valgt';
        } else if (markert) {
            return 'checked';
        }
        return null;
    };

    const kandidatnummer = kandidat.arenaKandidatnr;
    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
    const navn = `${etternavn}, ${fornavn}`;
    const fodselsnummer = kandidat.fodselsnummer;
    const innsatsgruppe = kandidat.servicebehov;
    const bosted = kandidat.poststed ? capitalizePoststed(kandidat.poststed) : '-';

    let klassenavn = 'kandidater-tabell__rad kandidater-tabell__rad--kandidat';
    const markertRadKlasse = checkedClass(markert, nettoppValgt);
    if (markertRadKlasse) {
        klassenavn += ' kandidater-tabell__' + markertRadKlasse;
    }

    return (
        <div className={klassenavn}>
            <div className="skjemaelement skjemaelement--horisontal text-hide">
                <Checkbox
                    label="&#8203;"
                    id={`marker-kandidat-${kandidatnummer}-checkbox`}
                    aria-label={`Marker kanidat med navn ${navn}`}
                    checked={markert}
                    onChange={() => {
                        onCheck(kandidat.arenaKandidatnr);
                    }}
                />
            </div>
            <div className="kandidater-tabell__tilgjengelighet">
                <TilgjengelighetFlagg
                    status={kandidat.midlertidigUtilgjengeligStatus}
                    merInformasjon={midlertidigUtilgjengeligMap[kandidatnummer]}
                    hentMerInformasjon={() =>
                        hentMidlertidigUtilgjengeligForKandidat(kandidat.aktorId, kandidatnummer)
                    }
                />
            </div>
            <div className="kandidater-tabell__navn-og-lagt-i-liste-ikon">
                <Link
                    className="kandidater-tabell__navn lenke"
                    to={lenkeTilKandidat(kandidatnummer, kandidatlisteId, stillingsId)}
                    onClick={() => setScrollPosition(window.pageYOffset)}
                    aria-label={`Se CV for ${navn}`}
                >
                    {navn}
                </Link>
                {kandidat.erLagtTilKandidatliste && (
                    <ErLagtIKandidatListeIkon className="kandidater-tabell__lagt-i-liste-ikon" />
                )}
            </div>
            <div className="kandidater-tabell__kolonne-tekst">{fodselsnummer}</div>
            <div className="kandidater-tabell__kolonne-tekst">{innsatsgruppe}</div>
            <div className="kandidater-tabell__kolonne-tekst">{bosted}</div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengeligMap: state.midlertidigUtilgjengelig,
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => {
        dispatch({ type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG', aktørId, kandidatnr });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableKandidat);
