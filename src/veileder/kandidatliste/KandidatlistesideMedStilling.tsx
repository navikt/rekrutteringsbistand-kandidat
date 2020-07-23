import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Kandidatlisteside from './Kandidatlisteside';

type Props = RouteComponentProps<{
    id: string;
}>;

const KandidatlistesideMedStilling: FunctionComponent<Props> = (props) => {
    const id = props.match.params.id;

    return <Kandidatlisteside stillingsId={id} />;
};

export default KandidatlistesideMedStilling;
