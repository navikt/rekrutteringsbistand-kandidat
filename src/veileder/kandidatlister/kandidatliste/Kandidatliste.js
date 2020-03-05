import React from 'react';
import PropTypes from 'prop-types';
import { Kandidat, Notat } from '../PropTypes';
import SideHeader from './SideHeader';
import KnappeRad from './knappe-rad/KnappeRad';
import TomListe from './TomListe';
import ListeHeader from './liste-header/ListeHeader';
import '../../../felles/common/ikoner/ikoner.less';
import KandidatRad from './kandidatrad/KandidatRad';

export const VISNINGSSTATUS = {
    SKJUL_PANEL: 'SKJUL_PANEL',
    VIS_NOTATER: 'VIS_NOTATER',
    VIS_MER_INFO: 'VIS_MER_INFO',
};

const Kandidatliste = props => {
    const {
        kandidater,
        tittel,
        arbeidsgiver,
        opprettetAv,
        kandidatlisteId,
        stillingsId,
        kanEditere,
        alleMarkert,
        onCheckAlleKandidater,
        onToggleKandidat,
        onKandidatStatusChange,
        onKandidatShare,
        onEmailKandidater,
        onLeggTilKandidat,
        onVisningChange,
        opprettNotat,
        endreNotat,
        slettNotat,
        toggleErSlettet,
        beskrivelse,
    } = props;

    return (
        <div className="Kandidatliste">
            <SideHeader
                kandidater={kandidater}
                opprettetAv={opprettetAv}
                stillingsId={stillingsId}
                tittel={tittel}
                arbeidsgiver={arbeidsgiver}
                beskrivelse={beskrivelse}
            />
            {kandidater.length > 0 ? (
                <div className="detaljer">
                    <div className="wrapper">
                        <KnappeRad
                            arbeidsgiver={arbeidsgiver}
                            kanEditere={kanEditere}
                            kandidater={kandidater}
                            onEmailKandidater={onEmailKandidater}
                            onKandidatShare={onKandidatShare}
                            kandidatlisteId={kandidatlisteId}
                            onLeggTilKandidat={onLeggTilKandidat}
                            stillingsId={stillingsId}
                        />
                        <ListeHeader
                            alleMarkert={alleMarkert}
                            onCheckAlleKandidater={onCheckAlleKandidater}
                            stillingsId={stillingsId}
                        />
                        {kandidater.map(kandidat => (
                            <KandidatRad
                                key={kandidat.kandidatnr}
                                kandidat={kandidat}
                                endreNotat={endreNotat}
                                kanEditere={kanEditere}
                                kandidatlisteId={kandidatlisteId}
                                onKandidatStatusChange={onKandidatStatusChange}
                                onToggleKandidat={onToggleKandidat}
                                onVisningChange={onVisningChange}
                                opprettNotat={opprettNotat}
                                slettNotat={slettNotat}
                                toggleErSlettet={toggleErSlettet}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <TomListe
                    kandidatlisteId={kandidatlisteId}
                    stillingsId={stillingsId}
                    onLeggTilKandidat={onLeggTilKandidat}
                />
            )}
        </div>
    );
};

Kandidatliste.defaultProps = {
    arbeidsgiver: undefined,
    stillingsId: undefined,
    beskrivelse: undefined,
};

Kandidatliste.propTypes = {
    kandidater: PropTypes.arrayOf(
        PropTypes.shape({
            ...Kandidat,
            markert: PropTypes.bool,
            notaterVises: PropTypes.bool,
            notater: PropTypes.shape({
                kind: PropTypes.string,
                data: PropTypes.arrayOf(PropTypes.shape(Notat)),
            }),
        })
    ).isRequired,
    tittel: PropTypes.string.isRequired,
    arbeidsgiver: PropTypes.string,
    opprettetAv: PropTypes.shape({
        ident: PropTypes.string,
        navn: PropTypes.string,
    }).isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    stillingsId: PropTypes.string,
    kanEditere: PropTypes.bool.isRequired,
    alleMarkert: PropTypes.bool.isRequired,
    onCheckAlleKandidater: PropTypes.func.isRequired,
    onToggleKandidat: PropTypes.func.isRequired,
    onKandidatStatusChange: PropTypes.func.isRequired,
    onKandidatShare: PropTypes.func.isRequired,
    onEmailKandidater: PropTypes.func.isRequired,
    onLeggTilKandidat: PropTypes.func.isRequired,
    onVisningChange: PropTypes.func.isRequired,
    opprettNotat: PropTypes.func.isRequired,
    endreNotat: PropTypes.func.isRequired,
    slettNotat: PropTypes.func.isRequired,
    toggleErSlettet: PropTypes.func.isRequired,
    beskrivelse: PropTypes.string,
};

export default Kandidatliste;
