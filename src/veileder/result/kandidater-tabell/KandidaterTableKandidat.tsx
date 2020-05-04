import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';
import TilgjengelighetFlagg from './tilgjengelighet-flagg/TilgjengelighetFlagg';
import { Cv } from '../../cv/reducer/cvReducer';
import './KandidaterTabell.less';

interface Props {
    kandidat: Cv;
    onKandidatValgt: (markert: boolean, kandidatnr: string) => void;
    markert: boolean;
    nettoppValgt: boolean;
    setScrollPosition: (position: number) => void;
    kandidatlisteId: string;
    stillingsId: string;
}

const KandidaterTableKandidat: FunctionComponent<Props> = (props) => {
    const onCheck = (kandidatnr) => {
        props.onKandidatValgt(!props.markert, kandidatnr);
    };

    const checkedClass = (markert, nettoppValgt) => {
        if (nettoppValgt) {
            return 'nettopp-valgt';
        } else if (markert) {
            return 'checked';
        }
        return null;
    };

    const {
        kandidat,
        markert = false,
        nettoppValgt,
        setScrollPosition,
        kandidatlisteId,
        stillingsId,
    } = props;
    const kandidatnummer = kandidat.arenaKandidatnr;
    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
    const navn = `${etternavn}, ${fornavn}`;
    const fodselsnummer = kandidat.fodselsnummer;
    const innsatsgruppe = kandidat.servicebehov;
    const bosted = kandidat.poststed ? capitalizePoststed(kandidat.poststed) : '-';
    const linkTilKandidat = () => {
        if (kandidatlisteId) {
            return `/kandidater/kandidatliste/${kandidatlisteId}/cv?kandidatNr=${kandidatnummer}`;
        } else if (stillingsId) {
            return `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${kandidatnummer}`;
        }
        return `/kandidater/cv?kandidatNr=${kandidatnummer}`;
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
                <TilgjengelighetFlagg status={kandidat.midlertidigUtilgjengeligStatus} />
            </div>
            <div className="kandidater-tabell__kolonne-tekst">
                <Link
                    className="kandidater-tabell__navn lenke"
                    to={linkTilKandidat()}
                    onClick={() => setScrollPosition(window.pageYOffset)}
                    aria-label={`Se CV for ${navn}`}
                >
                    {navn}
                </Link>
            </div>
            <div className="kandidater-tabell__kolonne-tekst">{fodselsnummer}</div>
            <div className="kandidater-tabell__kolonne-tekst">{innsatsgruppe}</div>
            <div className="kandidater-tabell__kolonne-tekst">{bosted}</div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
});

export default connect(null, mapDispatchToProps)(KandidaterTableKandidat);
