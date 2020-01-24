import * as React from 'react';

interface Props {
    cv: any;
    appContext: string;
    antallKandidater: number;
    tilbakeLink: string;
    gjeldendeKandidat?: number;
    forrigeKandidat?: string;
    nesteKandidat?: string;
    fantCv?: boolean;
    visNavigasjon?: boolean;
}

declare class VisKandidatPersonalia extends React.Component<Props> {
    render(): JSX.Element;
}

export default VisKandidatPersonalia;
