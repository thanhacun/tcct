import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Form, FormGroup, FormControl, ControlLabel, ButtonToolbar, Button,
  OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap';

import FontAwesome from '@fortawesome/react-fontawesome';
import ReactMarkdown from 'react-markdown';

const ctrlSHandler = (e, action, fireAction) => {
  // [] TODO: more general function to handle special combination
  // action is a function
  // fireAction: boolean check to fire action or not
  if (e.ctrlKey && e.keyCode === 83) {
    // user click CTRL-S combination
    e.preventDefault();
    // and it's OK to fire the action
    fireAction && action(e);

  }
}
// NOTE: busyLoading is handled in IndexTho
const FormTho = ({dataState, fieldLock, selectedIndex, ...props}) => {
  // either load data from tho to edit or allow to input new data
  const { index, title, content, footer, imgUrl, mediaUrl, postedUser} = dataState;
  const { onChange, onSubmit, onReset, onDelete, onRefresh, unlockField, user } = props;
  const isAdmin = user && user.userEmail && user.role.admin;
  // [] NOTE: shallow compare, may affect performance
  const isChange = !(JSON.stringify(dataState) === JSON.stringify(props.selectedTho));
  const refreshTip = (
    <Tooltip id="refreshTip">
      <strong>May need to REFRESH</strong> after saving new data
    </Tooltip>
  );

  return (
    <Form onSubmit={onSubmit} onKeyDown={(e) => ctrlSHandler(e, onSubmit, isChange)}>
        <FormGroup>
          <ControlLabel>STT</ControlLabel>
          <InputGroup>
            <InputGroup.Button>
              <Button onClick={unlockField}><FontAwesome icon={fieldLock ? `toggle-off` : `toggle-on`}/></Button>
            </InputGroup.Button>
            <FormControl type="number" name="index" value={index}
              placeholder={props.nbHits + 1 || 0} onChange={onChange} required
              disabled={fieldLock} ></FormControl>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Tiêu đề</ControlLabel>
          <FormControl type="text" value={title || ''} name="title"
            onChange={onChange} required></FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Nội dung (Markdown)</ControlLabel>
          <FormControl componentClass="textarea" value={content || ''} name="content"
            onChange={onChange} required style={{minHeight: "250px"}}/>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Preview (CTRL-S to save)</ControlLabel>
          <ReactMarkdown source={content || ''} />
        </FormGroup>
      <FormGroup>
        <ControlLabel>Ghi chú</ControlLabel>
        <FormControl type="text" value={footer || ''} name="footer"
          onChange={onChange} ></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Hình minh họa</ControlLabel>
        <FormControl type="text" name="imgUrl" value={imgUrl || ''} onChange={onChange} ></FormControl>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Media link (YouTube, SoundCloud)</ControlLabel>
        <FormControl type="text" name="mediaUrl" value={mediaUrl || ''} onChange={onChange} ></FormControl>
      </FormGroup>
      <strong>{`Posted by: ${(postedUser && postedUser.local && postedUser.local.email) || user.userEmail}`}</strong>
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
      //[X] TODO: index has to be the next highest number
      props.modifyTho({
        ...props.dataState,
        index: props.dataState.index || props.nbHits + 1,
        postedUser: props.user._id,
        _id: props.dataState._id
      }, 'save');
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
  onRefresh: props => () => window.location.reload(),
  unlockField: props => () => props.toggleLock(currentState => !currentState)
});

export default compose(
  withState('dataState', 'updateTho', props => props.selectedTho),
  withState('fieldLock', 'toggleLock', true),
  formHandlers
)(FormTho);
