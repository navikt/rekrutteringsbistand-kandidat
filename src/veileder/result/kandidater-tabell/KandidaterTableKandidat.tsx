import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';
import { MidlertidigUtilgjengeligState } from '../../cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import AppState from '../../AppState';
import TilgjengelighetFlagg from './tilgjengelighet-flagg/TilgjengelighetFlagg';
import Søkeresultat from '../../sok/Søkeresultat';
import './KandidaterTabell.less';
import ErLagtIKandidatListeIkon from './er-lagt-i-kandidatliste-ikon/ErLagtIKandidatListeIkon';
import { KandidatQueryParam } from '../../kandidat/Kandidatside';

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
    visMidlertidigUtilgjengeligPopover: boolean;
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
    visMidlertidigUtilgjengeligPopover,
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

    const linkTilKandidat = () => {
        const path = `/kandidater/kandidat/${kandidatnummer}/cv`;

        if (kandidatlisteId)
            return path + `?${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
        if (stillingsId) return path + `?${KandidatQueryParam.StillingId}=${stillingsId}`;

        return path;
    };

    let klassenavn = 'kandidater-tabell__rad kandidater-tabell__rad--kandidat';
    const markertRadKlasse = checkedClass(markert, nettoppValgt);
    if (markertRadKlasse) {
        klassenavn += ' kandidater-tabell__' + markertRadKlasse;
    }

    return (
        <div className={klassenavn}>
            <div className="skjemaelement skjemaelement--horisontal text-hide">
                <input
                    type="checkbox"
                    id={`marker-kandidat-${kandidatnummer}-checkbox`}
                    className="skjemaelement__input checkboks"
                    aria-label={`Marker kandidat med navn ${navn}`}
                    checked={markert}
                    onChange={() => {
                        onCheck(kandidat.arenaKandidatnr);
                    }}
                />
                <label
                    className="skjemaelement__label"
                    htmlFor={`marker-kandidat-${kandidatnummer}-checkbox`}
                    aria-hidden="true"
                >
                    Marker kandidat med navn {navn}
                </label>
            </div>
            <div className="kandidater-tabell__tilgjengelighet">
                <TilgjengelighetFlagg
                    status={kandidat.midlertidigUtilgjengeligStatus}
                    visMidlertidigUtilgjengeligPopover={visMidlertidigUtilgjengeligPopover}
                    merInformasjon={midlertidigUtilgjengeligMap[kandidatnummer]}
                    hentMerInformasjon={() =>
                        hentMidlertidigUtilgjengeligForKandidat(kandidat.aktorId, kandidatnummer)
                    }
                />
            </div>
            <div className="kandidater-tabell__navn-og-lagt-i-liste-ikon">
                <Link
                    className="kandidater-tabell__navn lenke"
                    to={linkTilKandidat()}
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
    visMidlertidigUtilgjengeligPopover:
        state.search.featureToggles['vis-midlertidig-utilgjengelig-popover'],
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => {
        dispatch({ type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG', aktørId, kandidatnr });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableKandidat);
