import React, { FunctionComponent } from 'react';
import { erKobletTilStilling, Kandidatliste, Kandidatlistestatus } from '../domene/Kandidatliste';
import { KandidatSorteringsfelt } from '../kandidatsortering';
import { nesteSorteringsretning, Retning } from '../../common/sorterbarKolonneheader/Retning';
import SorterbarKolonneheader from '../../common/sorterbarKolonneheader/SorterbarKolonneheader';
import { Kandidatsortering } from '../reducer/kandidatlisteReducer';
import { Checkbox, Label } from '@navikt/ds-react';
import css from './ListeHeader.module.css';
import './Kandidatrad.less';
import classNames from 'classnames';

interface Props {
    kandidatliste: Kandidatliste;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' kandidatkandidat__radliste---vis-utfall-og-arkivering'
            : ' kandidatliste-kandidat__rad--vis-utfall';
    } else {
        return visArkiveringskolonne
            ? ' kandidatliste-kandidat__rad--vis-arkivering'
            : ' kandidatliste-kandidat__rad';
    }
};

const Kolonne: FunctionComponent<{
    tekst: string;
    className?: string;
}> = ({ tekst, className, children }) => {
    return (
        <Label
            role="columnheader"
            as="div"
            size="small"
            className={classNames(className, css.kolonneTittel)}
        >
            {tekst}
            {children}
        </Label>
    );
};

const ListeHeader: FunctionComponent<Props> = ({
    kandidatliste,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
    sortering,
    setSortering,
}) => {
    const klassenavn =
        'kandidatliste-kandidat kandidatliste-kandidat__header' +
        (kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : '');

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(erKobletTilStilling(kandidatliste), visArkiveringskolonne);

    const endreSortering = (sorteringsfeltIndex: number) => {
        const endringPåAktivtFelt = sortering?.felt === sorteringsfeltIndex;

        const felt = KandidatSorteringsfelt[KandidatSorteringsfelt[sorteringsfeltIndex]];
        const retning = endringPåAktivtFelt
            ? nesteSorteringsretning(sortering?.retning || null)
            : Retning.Stigende;

        setSortering({ felt, retning });
    };

    const aktivtSorteringsfelt = sortering?.felt ?? null;
    const aktivSorteringsretning = sortering?.retning ?? null;

    return (
        <div role="rowgroup" className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <div />
                <Checkbox
                    className="text-hide"
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                >
                    &#8203;
                </Checkbox>
                <SorterbarKolonneheader
                    tekst="Navn"
                    sorteringsfelt={KandidatSorteringsfelt.Navn}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Fødselsnr."
                    sorteringsfelt={KandidatSorteringsfelt.Fødselsnummer}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til av"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilAv}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilTidspunkt}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst={erKobletTilStilling(kandidatliste) ? 'Status/hendelser' : 'Status'}
                    sorteringsfelt={KandidatSorteringsfelt.StatusOgHendelser}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <Kolonne tekst="Notater" />
                <Kolonne tekst="Info" className={css.kolonneMidtstilt} />
                {visArkiveringskolonne && (
                    <Kolonne tekst="Slett" className={css.kolonneHøyrestilt} />
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
