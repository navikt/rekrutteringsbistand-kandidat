import React, { FunctionComponent, ReactNode } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import './../kandidatrad/Kandidatrad.less';

interface Props {
    stillingsId: string | null;
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
        <Element className="kolonne-tittel">{children}</Element>
    </div>
);

const ListeHeader: FunctionComponent<Props> = ({
    stillingsId,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
}) => {
    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(stillingsId !== null, visArkiveringskolonne);

    return (
        <div className="kandidatliste-kandidat liste-header">
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div />
                <Kolonnetittel>Navn</Kolonnetittel>
                <Kolonnetittel>Fødselsnummer</Kolonnetittel>
                <Kolonnetittel>Lagt til av</Kolonnetittel>
                <Kolonnetittel>Lagt til</Kolonnetittel>
                <Kolonnetittel>Status</Kolonnetittel>
                {stillingsId && <Kolonnetittel>Utfall</Kolonnetittel>}
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
