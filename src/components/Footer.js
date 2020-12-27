import React from 'react';

import { rhythm } from '../utils/typography';

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <div style={{ float: 'right' }}>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a
          href="https://developer.mozilla.org/en-US/profiles/zitup"
          target="_blank"
          rel="noopener noreferrer"
        >
          MDN
        </a>{' '}
        &bull;{' '}
        <a
          href="https://github.com/zitup"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </footer>
    );
  }
}

export default Footer;
