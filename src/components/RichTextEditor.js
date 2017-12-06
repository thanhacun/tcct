import React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
// REACT-DRAFT-WYSIWYG ============
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './richtextEditor.css';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

const RichTextEditor = props => {
  const { editorState, onEditorStateChange, label, value } = props;
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl value={value} disabled/>
      </FormGroup>
    </div>
  );
};

const enhanceEditor = compose(
  withState('editorState', 'updateValue', EditorState.createEmpty()),
  // withState('value', 'updateHTML', ''),
  withHandlers({
    onEditorStateChange: ({updateValue, ...props}) => (editorState) => {
      const rawHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      props.updateRawHTML(rawHTML);
      updateValue(editorState);
      // updateHTML(rawHTML);
    },
    updateHTML2Editor: ({updateValue, ...props}) => (editorState) => {
      const contentBlock = htmlToDraft(props.value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        updateValue(editorState);
      }
    }
  }),
  lifecycle({
    componentDidMount(){
      // [] NOTE: this update is very heavy if run many times - this case should
      // happen only one time in componentDidMount
      this.props.updateHTML2Editor();
      // if(this.props.syncHTMLtoEditor){
      //   this.props.updateHTML2Editor();
      // }
    }
  })
);

export default enhanceEditor(RichTextEditor);
