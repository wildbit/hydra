import React from 'react';
import Layout from 'components/Layout';

const About = () => {
  return (
    <Layout hideSidebar={true} model={{}}>
      <p>
        This is information about this interface, how to set it up, and what it does. Ideally, it's loaded from a Markdown thing.
      </p>
    </Layout>
    );
};

export default About;
