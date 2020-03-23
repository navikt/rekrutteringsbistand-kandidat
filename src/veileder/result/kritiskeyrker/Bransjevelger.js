import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

class Bransjevelger extends React.Component {

     render() {
         const {bransje} = this.props;
         return <div>
             <Ekspanderbartpanel
              className="ekspanderbartPanel--bransje"
              id="ekspanderbartpanel-bransje"
              tittel={bransje}
             >
                 content
             </Ekspanderbartpanel>
         </div>
     }
}

Bransjevelger.propTypes = {
    bransje: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Bransjevelger);