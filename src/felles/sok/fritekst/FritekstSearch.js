import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'pam-frontend-knapper';
import './Fritekst.less';

class FritekstSearch extends React.Component {
    onFritekstChange = (e) => {
        this.props.setFritekstSokeord(e.target.value);
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onSearch();
    };

    onSearch = () => {
        this.props.search();
    };

    render() {
        const { fritekstSokeord } = this.props;
        return (
            <form className="fritekst__search skjemaelement--pink" onSubmit={this.onSubmit}>
                <input
                    id={'fritekstsok-input'}
                    value={fritekstSokeord}
                    onChange={this.onFritekstChange}
                    className="skjemaelement__input"
                    placeholder="Fritekstsøk"
                />
                <Knapp
                    aria-label="fritekstsøk"
                    className="search-button"
                    id="fritekstsok-knapp"
                    htmlType="submit"
                >
                    <i className="search-button__icon" />
                </Knapp>
            </form>
        );
    }
}

FritekstSearch.propTypes = {
    search: PropTypes.func.isRequired,
    setFritekstSokeord: PropTypes.func.isRequired,
    fritekstSokeord: PropTypes.string.isRequired
};

export default FritekstSearch;
