import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
// @ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import Background from '@/utils/Background';
import 'react-awesome-button/dist/themes/theme-blue.css';

interface HomeProps {
  isAuth: boolean;
}
interface State {}
export default class Home extends Component<HomeProps, State> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {};
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
      <section id='home'>
        <div className='save-background' />
        <div className='home-wrapper'>
          <h1>Recognize actors by photo</h1>
          <h3>over 1000 actors in our database</h3>
          <Link href={isAuth === true ? '/match' : '/auth'}>
            <a className='menu-link'>
              <AwesomeButton
                type='primary'
                size='auto'
                button-hover-pressure='3'
              >
                {isAuth === true ? 'Recognize actor' : 'Authorize to start'}
              </AwesomeButton>
            </a>
          </Link>
        </div>
      </section>
    );
  }
}
