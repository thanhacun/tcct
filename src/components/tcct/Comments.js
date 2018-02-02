import React from 'react';
import { compose, withHandlers, withState, branch, lifecycle } from 'recompose';
import { Form, FormControl, Button } from 'react-bootstrap';

import busyLoading from '../busyLoading';

const Comments = ({getThoComments, postThoComment, thoIndex, comments, ...props}) => {
  const { onChange, onSubmit, onDelete, commentState } = props;
  const commentsList = comments.map((comment, index) => {
    return (
      <div key={`comment_${index}`}>
        <p style={{borderLeft: "solid 1px lightgrey", paddingLeft: "3px"}}>{comment.text}</p>
        {/* [X] TODO: using user profile*/}
        <cite style={{paddingLeft: "5px"}}>{`${comment.postedUser.profile.email}
          gửi lúc: ${new Date(comment.postedAt || null).toLocaleString()} | `}</cite>
        <Button bsStyle="link" onClick={() => onDelete(comment._id)}
          disabled={(!props.user.profile) || (props.user.profile.email !== comment.postedUser.profile.email)}>Xóa</Button>
      </div>
    )
  })
  return (
    <div>
      <h3>Bình luận</h3>
      {commentsList}
      <Form onSubmit={onSubmit}>
        <FormControl componentClass="textarea"
          value={commentState} onChange={onChange}/>
        <Button className="pull-right" type="submit" disabled={!props.user.userEmail}
          bsStyle="link">Gửi bình luận</Button>
        <div className="clearfix"></div>
      </Form>
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
    }
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
