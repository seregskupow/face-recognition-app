import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  AwesomeButton,
} from 'react-awesome-button';
import Background from '../utils/Background';
import 'react-awesome-button/dist/themes/theme-blue.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.initBackground = this.initBackground.bind(this);
  }

  componentDidMount() {
    this.initBackground();
  }

  initBackground() {
    const back = new Background(document.getElementById('home'));
    back.start();
  }

  render() {
    const { isAuth } = this.props;
    return (
      <section id="home">
        <div className="save-background" />
        <div className="home-wrapper">
          <h1>Recognize actors by photo</h1>
          <h3>over 1000 actors in our database</h3>
          <NavLink
            exact
            to={isAuth === true ? '/match' : '/auth'}
            className="menu-link"
          >
            <AwesomeButton type="primary" size="auto" button-hover-pressure="3">{isAuth === true ? 'Recognize actor' : 'Authorize to start'}</AwesomeButton>
          </NavLink>
        </div>
      </section>
    );
  }
}

Home.propTypes = {
  isAuth: PropTypes.bool.isRequired,
};
