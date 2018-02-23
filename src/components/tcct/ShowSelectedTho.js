import React from 'react';
import { Image } from 'react-bootstrap';

const showSelectedTho = BasedComponent => ({thoObj, ...props}) => {
  const thoStyle = {
    container: {
      // border: 'solid 1px',
      // borderColor: 'lightgrey',
    },
    content: {
      padding: '5px',
      minHeight: '500px'
    },
  };
  // set current page title
  const { thoTitle } = props;
  document.title = thoTitle;

  return (
    <div style={thoStyle.container}>
      <div style={thoStyle.content}>
        {(thoObj && thoObj.imgUrl) &&
          <Image src={thoObj.imgUrl} responsive />
        }
        <BasedComponent thoObj={thoObj} {...props} />
      </div>
    </div>
  );
};

export default showSelectedTho;
