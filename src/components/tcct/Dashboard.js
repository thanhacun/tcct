import React from 'react';
import { connect } from 'react-redux';
import MarkdownPreview from 'react-markdown';
import { compose, lifecycle, branch } from 'recompose';

import { getAllUsersInfo } from '../../actions/userActions';
import { getAllThos } from '../../actions/tcctActions';

import busyLoading from '../busyLoading';

const dasboardContent = `

## Tính năng và công nghệ sử dụng trong ứng dụng ##

| Tính năng                             | Công nghệ              |
| ---                                   | ---                    |
| ~~Sử dụng Markdown~~                  | Fullstack Javascript   |
| ~~Đăng ký qua facebook và google  ~~    | Create-React-App       |
| ~~Cho phép bình luận~~                | Mongo database         |
| Cho phép đề nghị thơ mới              | Node.js as api server  |
| Themes: Sáng hoặc Tối                 | Redux                  |
|                                       | Algolia instant search |

`

const AllUsers = (props) => {
  const { users } = props;
  const UsersList = users.map((user, index) => {
    return (
      <li key={`user_${index}`}>
        {`email: ${user.profile.email} | admin: ${user.role.admin}`}
      </li>
    );
  });
  return (
    <ul>{UsersList}</ul>
  )
}

const Dashboard =  (props) => {
  const { allUsers, thos } = props;
  document.title = 'Admin dasboard';
  return ( props.role.admin &&
      <div className="container">
        <MarkdownPreview source={dasboardContent} />
        <section>
          <h2>Users information ({allUsers.length})</h2>
          <AllUsers users={allUsers} />
        </section>
        <section>
          <h2>Tho summary ({thos.length})</h2>
          <h3>Comments summary</h3>
        </section>
      </div>
    )
};

const mapStateToProps = store => store.user;

const mapDispatchToProps = dispatch => ({
  getAllUsersInfo: () => dispatch(getAllUsersInfo()),
  getAllThos: () => dispatch(getAllThos())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  compose(
    lifecycle({
      componentDidMount() {
        this.props.getAllThos();
        this.props.getAllUsersInfo();
      }
    }),
    branch(
      props => props.busy,
      busyLoading
    )
  )(Dashboard)
);
