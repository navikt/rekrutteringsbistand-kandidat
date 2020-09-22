import React, { FunctionComponent, ReactNode } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import StatusHjelpetekst from './StatusHjelpetekst';
import './../kandidatrad/Kandidatrad.less';

interface Props {
    kandidatliste: Kandidatliste;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' kandidatliste-kandidat__rad--vis-utfall-og-arkivering'
            : ' kandidatliste-kandidat__rad--vis-utfall';
    } else {
        return visArkiveringskolonne ? ' kandidatliste-kandidat__rad--vis-arkivering' : '';
    }
};

const Kolonnetittel = ({ className, children }: { className?: string; children: ReactNode }) => (
    <div className={className ? className : ''}>
        <Element className="kandidatliste-kandidat__rad__kolonne-tittel">{children}</Element>
    </div>
);

const ListeHeader: FunctionComponent<Props> = ({
    kandidatliste,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
}) => {
    const klassenavn =
        'kandidatliste-kandidat kandidatliste-kandidat__header' +
        (kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : '');

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(kandidatliste.stillingId !== null, visArkiveringskolonne);

    return (
        <div className={klassenavn}>
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div />
                <Kolonnetittel>Navn</Kolonnetittel>
                <Kolonnetittel>Fødselsnummer</Kolonnetittel>
                <Kolonnetittel>Lagt til av</Kolonnetittel>
                <Kolonnetittel>Lagt til</Kolonnetittel>
                <div className="kandidatliste-kandidat__kolonne-med-hjelpetekst">
                    <Element className="kandidatliste-kandidat__rad__kolonne-tittel">
                        Status
                    </Element>
                    <StatusHjelpetekst />
                </div>
                {kandidatliste.stillingId && <Kolonnetittel>Utfall</Kolonnetittel>}
                <Kolonnetittel>Notater</Kolonnetittel>
                <Kolonnetittel className="kandidatliste-kandidat__kolonne-midtstilt">
                    Info
                </Kolonnetittel>
                {visArkiveringskolonne && (
                    <Kolonnetittel className="kandidatliste-kandidat__kolonne-midtstilt">
                        Slett
                    </Kolonnetittel>
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
