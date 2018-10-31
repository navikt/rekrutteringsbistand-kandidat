import React from 'react';
import { connect } from 'react-redux';
import { Element, Sidetittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import './Listedetaljer.less';

class Listedetaljer extends React.Component {
    state = {
        alleMarkert: false,
        kandidater: this.props.kandidatliste === undefined ? undefined :
            this.props.kandidatliste.kandidater.map((kandidat) => ({
                ...kandidat,
                markert: false
            }))
    };
    componentDidMount() {
        const { id } = this.props.match.params;
        console.log({ id });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.kandidatliste.kandidater !== nextProps.kandidatliste.kandidater) {
            this.setState({
                kandidater: nextProps.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false
                }))
            });
        }
    }

    onCheckAlleKandidater = (markert) => {
        this.setState({
            alleMarkert: markert,
            kandidater: this.state.kandidater.map((kandidat) => ({
                ...kandidat,
                markert
            }))
        });
    };

    onToggleKandidat = (kandidatnummer) => {
        this.setState({
            alleMarkert: false,
            kandidater: this.state.kandidater.map((kandidat) => {
                if (kandidat.kandidatnummer === kandidatnummer) {
                    return {
                        ...kandidat,
                        markert: !kandidat.markert
                    };
                }
                return kandidat;
            })
        });
    };

    render() {
        const { tittel, oppdragsgiver, opprettetAv, stillingsId } = this.props.kandidatliste;
        const { kandidater } = this.state;
        const SideHeader = () => (
            <div className="side-header">
                <div className="wrapper">
                    <div className="top">
                        <div className="header-side" />
                        <div className="tittel">
                            <Sidetittel>{tittel}</Sidetittel>
                        </div>
                        <div className="header-side">
                            Test
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="antall">
                            {kandidater.length === 1 ? '1 kandidat' : `${kandidater.length} kandidater`}
                        </div>
                        { oppdragsgiver &&
                        <div className="border-left">
                            Oppdragsgiver: {oppdragsgiver}
                        </div>
                        }
                        <div className="border-left">
                            { `Opprettet av: ${opprettetAv.navn} (${opprettetAv.ident})` }
                        </div>
                        <div className="border-left">
                            <a href={`/stillinger/${stillingsId}`}>
                                Se stillingsannonse
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
        const ListeHeader = () => (
            <div className="liste-rad liste-header">
                <div className="kolonne-checkboks">
                    <Checkbox
                        label="&#8203;" // <- tegnet for tom streng
                        className="text-hide"
                        checked={this.state.alleMarkert}
                        onChange={() => { this.onCheckAlleKandidater(!this.state.alleMarkert); }}
                    />
                </div>
                <div className="kolonne-bred"><Element>Navn</Element></div>
                <div className="kolonne-smal"><Element>Fødselsdato</Element></div>
                <div className="kolonne-bred"><Element>Lagt til av</Element></div>
                <div className="kolonne-bred"><Element>Aktivitetsplan</Element></div>
                <div className="kolonne-smal"><Element>Status</Element></div>
                <div className="kolonne-smal"><Element>Utfall</Element></div>
            </div>
        );
        const KandidatRad = ({ kandidat }) => (
            <div className={`liste-rad kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`} key={kandidat.kandidatnummer}>
                <div className="kolonne-checkboks">
                    <Checkbox
                        label="&#8203;" // <- tegnet for tom streng
                        className="text-hide"
                        checked={kandidat.markert}
                        onChange={() => { this.onToggleKandidat(kandidat.kandidatnummer); }}
                    />
                </div>
                <div className="kolonne-bred">{kandidat.navn}</div>
                <div className="kolonne-smal">Fødselsdato</div>
                <div className="kolonne-bred">Lagt til av</div>
                <div className="kolonne-bred">Aktivitetsplan</div>
                <div className="kolonne-smal">Status</div>
                <div className="kolonne-smal">Utfall</div>
            </div>
        );
        return (
            <div className="Listedetaljer">
                <SideHeader />
                <div className="detaljer">
                    <div className="wrapper">
                        <ListeHeader />
                        {kandidater.map((kandidat) => (
                            <KandidatRad kandidat={kandidat} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({
    kandidatliste: {
        tittel: 'Engasjert kokk på Burger King',
        oppdragsgiver: 'MAT Restaurant',
        opprettetAv: {
            navn: 'Aksel Wester',
            ident: 'Z999001'
        },
        stillingsId: '0101010101',
        kandidater: [
            {
                navn: 'Test Testesen',
                kandidatnummer: 'Z900550'
            },
            {
                navn: 'Test Testesen',
                kandidatnummer: 'Z900551'
            },
            {
                navn: 'Test Testesen',
                kandidatnummer: 'Z900552'
            }
        ]
    }
});
export default connect(mapStateToProps)(Listedetaljer);

