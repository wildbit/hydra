import React from 'react';
import Layout from 'containers/Layout';

const About = (props) => {
  return (
    <Layout {...props}>
      <p>
        This is information about this interface, how to set it up, and what it does. Ideally, it's loaded from a Markdown thing.
      </p>
  </Layout>
  );
};

export default About;
