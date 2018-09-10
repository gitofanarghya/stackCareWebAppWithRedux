import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';

const styles = theme => ({
  root: {
    flexGrow: 1,
    borderRadius: '5px',
    padding: '5px',
    margin: 'auto'
  }
});

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    backgroundColor: "#ffffff",
    minHeight: 50
  }),
  singleValue: (base, state) => ({
    ...base, 
    color: "white",
    border: "none",
  })
}

class IntegrationReactSelect extends Component {


  handleChange = value => {
    if(value) {
        this.props.setCommunity(value.value)  
    }
  };
  
  render() {
    const { classes, allCommunities } = this.props;

    const suggestions = allCommunities ? allCommunities.map(suggestion => ({
      value: suggestion.id,
      label: suggestion.name,
    })) : null

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            className="searchBar"
            isClearable
            isSearchable
            placeholder="Search for a community"
            options={suggestions}
            styles={customStyles}
            onChange={this.handleChange}
          />
        </NoSsr>  
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const SearchBar = (withStyles(styles)(IntegrationReactSelect));