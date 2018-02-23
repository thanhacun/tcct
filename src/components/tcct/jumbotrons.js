// randomize a jumbotron from the list of options
import React from 'react';
import { Jumbotron } from 'react-bootstrap';

import { Default } from './mediaQuery';
import { randomListElement } from '../../utils/common_tools.js';

const jbStyles = [
  {
    backgroundImage: 'url(https://i.imgur.com/BTS3ukW.jpg?2)',
    opacity: '0.7',
    backgroundSize: 'cover',
    color: 'black',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  {
    backgroundImage: 'url(https://i.imgur.com/zFku8m1.jpg)',
    opacity: '0.7',
    backgroundSize: 'cover',
    color: 'black',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  }
];

const jbStyle = randomListElement(jbStyles);

const JB01 = () => {
  return (
    <Default>
      <Jumbotron style={jbStyle}>
        <div>
          <h3 className="text-center">
            <span style={{backgroundColor: 'rgba(248, 248, 248, 0.5)'}}>
              Trời hừng sáng rộn ràng<br />
              Mây ráng chiều thanh thản<br/>
              Cả cuộc đời trong sáng<br/>
              Chí không để lụi tàn...<br/>
            </span>
          </h3>
        </div>
      </Jumbotron>
    </Default>
  )
}

const jbList = [JB01];

export default randomListElement(jbList);
