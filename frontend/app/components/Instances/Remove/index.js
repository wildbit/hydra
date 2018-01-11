/**
*
* Remove
*
*/

import React from 'react';
import Modal from 'components/Modal';
import Header from 'components/Modal/Header';
import Title from 'components/Modal/Title';
import Body from 'components/Modal/Body';
import Footer from 'components/Modal/Footer';
import { compose, withHandlers, withState } from 'recompose';
import $ from 'jquery';

const Remove = ({ id, current, handleOnClick }) => {
  return (
    <Modal id={id}>
      <Header>
        <Title>Remove HAProxy Instance</Title>
      </Header>
      <Body>
        Are you sure you wish to remove {(current || {}).display_name}?
      </Body>
      <Footer>
        <button onClick={handleOnClick} className="btn btn-danger">Remove</button>
        <a href="#" data-dismiss="modal" aria-label="Cancel">Cancel</a>
      </Footer>
    </Modal>
  );
}

Remove.propTypes = {

};

const enhance = compose(
  withHandlers({
    handleOnClick: ({ id, current, onClick }) => event => {
      onClick(current, () => {
        $(`#${id}`).modal('hide');
      });
    },
  })
);

export default enhance(Remove);
