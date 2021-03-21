import React from 'react';
import Layout from '../components/Layout';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <main>
          <h1>Not Found</h1>
          <p>
            快跟他说，你的博客挂啦 👉{' '}
            <a href="https://github.com/zitup/overblog/issues">
              https://github.com/zitup/overblog/issues
            </a>
          </p>
        </main>
      </Layout>
    );
  }
}

export default NotFoundPage;
