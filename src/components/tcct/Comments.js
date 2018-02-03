import React from 'react';
import { compose, withHandlers, withState, branch, lifecycle } from 'recompose';
import { Form, FormControl, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import busyLoading from '../busyLoading';

const Comments = ({getThoComments, postThoComment, thoIndex, comments, ...props}) => {
  const { onChange, onSubmit, onDelete, commentState, toggleCommentShow, commentShow } = props;
  const commentsList = comments.map((comment, index) => {
    const citeMarkdown = `  \n*&nbsp;&nbsp;${comment.postedUser.profile.email} gửi lúc:
    ${new Date(comment.postedAt || null).toLocaleString()}*`;
    return (
      <div key={`comment_${index}`} style={{borderLeft: "solid 1px lightgrey", paddingLeft: "3px"}}>
        <ReactMarkdown source={comment.text + citeMarkdown}  />
        <Button className="pull-right" bsStyle="link" onClick={() => onDelete(comment._id)}
          disabled={(!props.user.profile) || (props.user.profile.email !== comment.postedUser.profile.email)}>Xóa</Button>
      </div>
    )
  })
  return (
    <div>
      <Button bsStyle="link" bsSize="large" onClick={toggleCommentShow}>
        {commentShow ? `Ẩn bình luận` : `Hiện bình luận`}</Button>
      { commentShow && commentsList }
      {commentShow &&
      <Form onSubmit={onSubmit}>
        <FormControl componentClass="textarea" placeholder={`Có thể dùng markdown`}
          value={commentState} onChange={onChange}/>
        <Button className="pull-right" type="submit" bsStyle="link"
          disabled={!props.user.userEmail || !commentState}>Gửi bình luận</Button>
        <div className="clearfix"></div>
      </Form>
      }
    </div>
  );
};

const EnhancedComments = compose(
  lifecycle({
    componentDidMount(){
      this.props.getThoComments(this.props.thoIndex);
    }
  }),
  withState('commentState', 'commentHandle', ''),
  withState('commentShow', 'commentShowHandle', false),
  withHandlers({
    onChange: props => (e) => props.commentHandle(e.target.value),
    onSubmit: props => (e) => {
      e.preventDefault();
      if (props.user.userEmail){
        props.postThoComment(props.thoIndex, {
          text: props.commentState,
          postedUser: props.user._id
        }, 'save');
        props.commentHandle('');
      }
    },
    onDelete: props => (commentId) => {
      window.confirm("Có chắc chắn xóa?") &&
        props.postThoComment(props.thoIndex, {_id: commentId}, 'delete')
    },
    toggleCommentShow: props => () => props.commentShowHandle(currentStatus => !currentStatus)

  }),
  branch(
    props => props.busy,
    busyLoading
  )
)(Comments)
// props to handle comment onSubmit
// load comments on componentDidMount
// busyloading when get CommentSchema

export default EnhancedComments;
