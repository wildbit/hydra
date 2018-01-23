/**
*
* GithubCommit
*
*/

import React from 'react';
// import styled from 'styled-components';


const GithubCommit = ({ GIT_VERSION, GIT_COMMIT }) => {
  return (
    <a href={`https://github.com/wildbit/hydra/commit/${GIT_COMMIT}`} target="_blank">
      SHA: {GIT_VERSION}
    </a>
  );
}

export default GithubCommit;
