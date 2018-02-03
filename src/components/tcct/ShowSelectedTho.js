import React from 'react';

const showSelectedTho = BasedComponent => ({thoObj, ...props}) => {
  const thoStyle = {
    container: {
      // border: 'solid 1px',
      // borderColor: 'lightgrey',
    },
    content: (thoObj && thoObj.imgUrl) ? {
      padding: '5px',
      backgroundImage: `url(${thoObj.imgUrl})`,
      backgroundSize: 'cover',
      fontWeight: 'bold',
      minHeight: '500px'
    } : {
      padding: '5px',
      minHeight: '500px'
    }
  };
  // Manipulate document title
  const { thoTitle } = props;
  document.title = thoTitle;

  return (
    <div style={thoStyle.container}>
      <div style={thoStyle.content}>
        <BasedComponent thoObj={thoObj} {...props} />
      </div>
    </div>
  );
};

export default showSelectedTho;
