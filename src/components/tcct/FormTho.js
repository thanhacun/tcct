import React from 'react';
import { compose, withHandlers, withState, branch } from 'recompose';
import { Form, FormGroup, FormControl, ControlLabel, ButtonToolbar, Button,
  OverlayTrigger, Tooltip } from 'react-bootstrap';

import RichTextEditor from '../RichTextEditor';
import busyLoading from '../busyLoading';
import FontAwesome from '@fortawesome/react-fontawesome';

const FormTho = ({dataState, selectedIndex, ...props}) => {
  // either load data from tho to edit or allow to input new data
  const { index, title, content, footer, imgUrl, mediaUrl } = dataState;
  const { onChange, onSubmit, onReset, updateRawHTML, onDelete, onRefresh, user } = props;
  const isAdmin = user && user.userEmail && user.role.admin;
  // [] NOTE: shallow compare, may affect performance
  const isChange = !(JSON.stringify(dataState) === JSON.stringify(props.selectedTho));
  const refreshTip = (
    <Tooltip id="refreshTip">
      <strong>May need to REFRESH</strong> after saving new data
    </Tooltip>
  );

  return (
    <Form onSubmit={onSubmit} >
      <FormGroup>
        <ControlLabel>STT</ControlLabel>
        <FormControl type="number" name="index" value={index}
          placeholder={props.nbHits + 1 || 0} onChange={onChange} required
          disabled={!!props.nbHits}></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Tiêu đề</ControlLabel>
        <FormControl type="text" value={title} name="title"
          onChange={onChange} required></FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Nội dung</ControlLabel>
          <RichTextEditor label="Code HTML tự sinh"
            updateRawHTML={(rawHTML) => updateRawHTML(rawHTML)}
            value={content}
            // syncHTMLtoEditor={selectedIndex >= 1}
            // syncHTMLtoEditor={true}
          />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Ghi chú</ControlLabel>
        <FormControl type="text" value={footer} name="footer"
          onChange={onChange} ></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Hình minh họa</ControlLabel>
        <FormControl type="text" name="imgUrl" value={imgUrl} onChange={onChange} ></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Media link (YouTube, SoundCloud)</ControlLabel>
        <FormControl type="text" name="mediaUrl" value={mediaUrl} onChange={onChange} ></FormControl>
      </FormGroup>
      <ButtonToolbar>
        <Button type="submit" bsStyle="warning" disabled={!isAdmin || !isChange}>
          <FontAwesome icon={`save`} /></Button>
        <Button bsStyle="danger" onClick={onDelete} disabled={!isAdmin}>
          <FontAwesome icon={`trash-alt`}/></Button>
        <Button bsStyle="primary" type="reset" onClick={onReset} disabled={!isChange}>
          <FontAwesome icon={`times`}/></Button>
        { props.refreshHits &&
          <OverlayTrigger placement="top" overlay={refreshTip}>
            <Button bsStyle="info" onClick={onRefresh}><FontAwesome icon={`sync-alt`}/></Button>
          </OverlayTrigger>
        }
      </ButtonToolbar>
    </Form>
  )
}

const formHandlers = withHandlers({
  onChange: props => (e) => {
    props.updateTho({...props.dataState, [e.target.name]: e.target.value});
  },
  onSubmit: props => (e) => {
    e.preventDefault();
    if (props.user.userEmail && props.user.role.admin){
      console.log(props.dataState);
      props.modifyTho(props.dataState, 'save');
      //[] TODO: reset after adding new file, not reset if update
    }
  },
  onDelete: props => (e) => {
    const result = window.confirm("Có chắc chắn xóa?");
    if (result && props.user.userEmail && props.user.role.admin) {
      props.modifyTho(props.dataState, 'delete');
    }
  },
  onReset: props => () => {
    props.updateTho({...props.selectedTho});
  },
  updateRawHTML: props => (rawHTML) => props.updateTho({...props.dataState, content: rawHTML}),
  onRefresh: props => () => window.location.reload()
});

const thoState = compose(
  withState('dataState', 'updateTho', props => props.selectedTho),
  formHandlers
);

export default branch(
  (props) => props.busy,
  busyLoading,
  thoState
  )(FormTho);
