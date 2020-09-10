import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Kandidatlisteside from './Kandidatlisteside';

type Props = RouteComponentProps<{
    listeid: string;
}>;

const KandidatlistesideUtenStilling: FunctionComponent<Props> = (props) => {
    const id = props.match.params.listeid;

    return <Kandidatlisteside kandidatlisteId={id} />;
};

export default KandidatlistesideUtenStilling;
