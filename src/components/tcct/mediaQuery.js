import React from 'react';
import MediaQuery from 'react-responsive';

const Mobile = props => <MediaQuery { ...props } maxWidth={767} />;
const Default = props => <MediaQuery { ...props } minWidth={768} />;

// const mediaQuery = WrappedComponent => props => {
//   const {mobile, ...passProps} = props;
//   return (mobile) ?
//     <Mobile><WrappedComponent { ...passProps }/></Mobile> :
//     <Default><WrappedComponent { ...passProps }/></Default>
// };

const mediaQuery = (WrappedMobile, WrappedDefault) => props => {
  const {mobile, ...passProps} = props;
  return (mobile) ?
    <Mobile><WrappedMobile { ...passProps }/></Mobile> :
    <Default><WrappedDefault { ...passProps }/></Default>
}

export default mediaQuery;
export {Mobile, Default};
