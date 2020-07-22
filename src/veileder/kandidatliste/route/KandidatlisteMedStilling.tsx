import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import KandidatlisteRoute from './KandidatlisteRoute';

type Props = RouteComponentProps<{
    id: string;
}>;

const KandidatlisteMedStilling: FunctionComponent<Props> = (props) => {
    const id = props.match.params.id;

    return <KandidatlisteRoute stillingsId={id} />;
};

export default KandidatlisteMedStilling;
