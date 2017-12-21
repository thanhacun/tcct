import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Form, FormGroup, FormControl, ControlLabel, ButtonToolbar, Button } from 'react-bootstrap';

import RichTextEditor from '../RichTextEditor';

const FormTho = ({dataState, selectedIndex, ...props}) => {
  // either load data from tho to edit or allow to input new data
  // const newTho = {index: '', title: '', content: '', footer: '', imgUrl: ''}
  // const tho = (existedTho) ? existedTho : props.tho;
  const { index, title, content, footer, imgUrl } = dataState;
  const { onChange, onSubmit, onReset, updateRawHTML, onDelete, user } = props;
  const isAdmin = user && user.userEmail && user.role.admin;
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <ControlLabel>STT</ControlLabel>
        <FormControl type="number" name="index" value={index}
          // placeholder={this.props.tho.length + 1}
          onChange={onChange} required></FormControl>
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
        <FormControl type="text" name="imgUrl" value={imgUrl}
          onChange={onChange} ></FormControl>
      </FormGroup>
      <ButtonToolbar>
        <Button type="submit" bsStyle="warning" disabled={!isAdmin}>Thêm/Lưu</Button>
        <Button bsStyle="danger" onClick={onDelete}
          disabled={!isAdmin}>Xóa</Button>
        <Button bsStyle="primary" type="reset" onClick={onReset}>Reset</Button>
      </ButtonToolbar>
    </Form>
  )
}

const formHandlers = withHandlers({
  onChange: props => (e) => {
    props.updateTho({...props.dataState, [e.target.name]: e.target.value})
  },
  onSubmit: props => (e) => {
    e.preventDefault();
    if (props.user.userEmail && props.user.role.admin){
      props.modifyTho(props.dataState, 'save')
      //[] TODO: reset after adding new file, not reset if update
      // props.onReset();
    }
  },
  onDelete: props => (e) => {
    const result = window.confirm("Có chắc chắn xóa?");
    if (result && props.user.userEmail && props.user.role.admin) {
      props.modifyTho(props.dataState, 'delete');
    }
  },
  onReset: props => () => props.updateTho({index: '', title: '', content: '', footer: '', imgUrl: ''}),
  updateRawHTML: props => (rawHTML) => props.updateTho({...props.dataState, content: rawHTML}),
});

const thoState = withState('dataState', 'updateTho', props => props.selectedTho);

export default compose(thoState, formHandlers)(FormTho);
