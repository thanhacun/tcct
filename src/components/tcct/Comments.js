import React from 'react';
import { compose, withHandlers, withState, branch, lifecycle } from 'recompose';
import { Form, FormControl, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import FontAwesome from '@fortawesome/react-fontawesome';
import busyLoading from '../busyLoading';

const Comment = ({comment, index, ...props}) => {
  const { isCommentedUser, isAdmin, onDelete, showSpoiler, toggleSpoilerShow, onSubmit } = props;
  const commentBlockStyle = (index % 2) ? {
    paddingLeft: "3px", borderLeft: "solid 1px lightgrey"
  } : {
    paddingLeft: "3px", backgroundColor: "lightgrey"
  }
  return (
    <div key={`comment_${index}`} style={commentBlockStyle}>
      <em>
        <u>{`${comment.postedUser.profile.email} gửi lúc:
          ${new Date(comment.postedAt || null).toLocaleString()} `}</u>
        {isCommentedUser &&
          <Button style={{padding: "0px"}} bsStyle="link"
            onClick={() => onDelete(comment._id)}>{` | X`}</Button>
        }
        {isAdmin &&
          <Button style={{padding: "0px"}} bsStyle="link"
            onClick={(e) => onSubmit(e, true, comment)}>{` | S`}</Button>
        }
        {(comment.spoiler) &&
            <span className="text-danger">{` | Spoiler `}
              <Button style={{padding: "0px"}} bsStyle="link" onClick={toggleSpoilerShow}>
                <FontAwesome className="text-danger" icon={(showSpoiler) ? 'chevron-up' : 'chevron-down'} /></Button>
            </span>
        }
      </em>
      {(!comment.spoiler || showSpoiler) &&
        <ReactMarkdown source={comment.text} />
      }
    </div>
  )
}

const EnhancedComment = compose(
  withState('showSpoiler', 'spoilerHandle', false),
  withHandlers({
    toggleSpoilerShow: props => () => props.spoilerHandle(currentStatus => !currentStatus)
  })
)(Comment);

const Comments = ({getThoComments, postThoComment, thoIndex, comments, ...props}) => {
  const { onChange, onSubmit, onDelete, commentState, toggleCommentShow, commentShow, user } = props;
  const isLogin = user.profile && user.profile.email;
  const isAdmin = user.role.admin;
  const commentsList = comments.map((comment, index) => {
    const isCommentedUser = user.profile && (user.profile.email === comment.postedUser.profile.email);
    return (
      <EnhancedComment key={`comment_${index}`} comment={comment} index={index} isCommentedUser={isCommentedUser}
        isAdmin={isAdmin} onDelete={onDelete} onSubmit={onSubmit}/>
    )
  });

  return (
    <div>
      <Button bsStyle="link" bsSize="large" onClick={toggleCommentShow}>
        {commentShow ? `Ẩn bình luận` : `Hiện bình luận`} {` (${comments.length})`}</Button>
      {commentShow && commentsList}
      {commentShow &&
      <Form onSubmit={onSubmit}>
        <FormControl componentClass="textarea" value={commentState} onChange={onChange}
          placeholder={isLogin ? `Bình luận của bạn (có thể dùng Markdown)` : `Login để bình luận`}
          disabled={!isLogin}/>
        <Button className="pull-right" type="submit" bsStyle="link"
          disabled={!props.user.userEmail || !commentState}>Gửi</Button>
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
    onSubmit: props => (e, isSpoiler = false, comment = null) => {
      e.preventDefault();
      if (isSpoiler && comment) {
        // admin mark a comment spoiler => save spoiler data by admin
        props.postThoComment(props.thoIndex, {
          ...comment,
          spoiler: true
        }, 'save')
      } else if (props.user.userEmail){
        props.postThoComment(props.thoIndex, {
          text: props.commentState,
          postedUser: props.user._id,
        }, 'save');
        props.commentHandle('');
      }
    },
    onDelete: props => (commentId) => {
      window.confirm("Có chắc chắn xóa?") &&
        props.postThoComment(props.thoIndex, {_id: commentId}, 'delete')
    },
    toggleCommentShow: props => () => props.commentShowHandle(currentStatus => !currentStatus),
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
