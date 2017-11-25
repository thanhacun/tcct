// [ ] TODO: using recompose to handle busy loading
// [X] TODO: integrated richtext editor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose, lifecycle, branch } from 'recompose';

import { Form, FormGroup, ControlLabel, Jumbotron, Row, Col, FormControl,
  Button, ButtonToolbar} from 'react-bootstrap';
import RichTextEditor from '../RichTextEditor';
import busyLoading from '../busyLoading';

import ThoIndex from './ThoIndex';
import { modifyTho, saveDraftTho, getTho } from '../../actions/tcctActions';

//TODO: handleChange is not DRY, how to rewrite it?

class ThoEdit extends Component {
  constructor(props){
    super(props);
    this.state = {index: '', title: '', content: '', footer: '', imgUrl: '', syncHTMLtoEditor: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIndexClick = this.handleIndexClick.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount(){
    this.props.getTho();
    this.setState(this.props.draft || this.state);
  }

  handleChange(e, type){
    this.setState({[type]: e.target.value});
  }

  handleSubmit(e){
    // [X] TODO: check user role
    // [] TODO: check real user
    // [] TODO: add user role
    if (this.props.user.userEmail && this.props.user.role.admin) {
      this.props.modifyTho(this.state, 'save'); // submit new Tho
      this.resetForm(); // reset the form
    } else {
      //TODO: DRY
      this.props.saveDraftTho(this.state)
      this.props.goTo('/login');
    }
    e.preventDefault();

  }

  handleUpdateRawHTML(rawHTML){
    this.setState({content: rawHTML}, () => rawHTML);
  }

  handleIndexClick(selectedIndex){
    const selectedID = this.props.tho.reduce((returnID, currentTho, currentID) => {
      return (currentTho.index === selectedIndex) ? currentID : returnID;
    }, 0);
    this.setState({ ...this.props.tho[selectedID], syncHTMLtoEditor: true}, () =>{
      // turnoff syncHTMLtoEditor to make sure updateHTML2Editor happen only
      // one time during componentWillUpdate lifecycle
      this.setState({syncHTMLtoEditor: false})
    });
  }

  resetForm(){
    this.setState({index: '', title: '', content: '', footer: '', imgUrl: '', syncHTMLtoEditor: true}, () => {
      // turnoff syncHTMLtoEditor to make sure updateHTML2Editor happen only
      // one time during componentDidUpdate lifecycle
      this.setState({syncHTMLtoEditor: false})
    })
  }

  render(){
    if (this.props.tho.busy){
      return(
        busyLoading(<div></div>)
      );
    } else {
      return (
      <div className="container">
        <Jumbotron className="text-center">
          <h2>TCCT - Kim Bồng Miêu</h2>
          <p>Nhập, sửa các bài thơ</p>
          <code>Khi sửa, chỉ nên sửa ở giao diện máy tính</code>
        </Jumbotron>
        {/* recompose branch here to show busy loading or content */}

        <Row>
          <Col md={4}><ThoIndex
            tho={this.props.tho}
            indexOnClick={(selectedID, selectedIndex) => this.handleIndexClick(selectedIndex)} /></Col>
          <Col md={8}>
            <h2>Nhập liệu</h2>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>STT</ControlLabel>
                <FormControl type="number" value={this.state.index} placeholder={this.props.tho.length + 1}
                  onChange={(e) => this.handleChange(e, 'index')} required></FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Tiêu đề</ControlLabel>
                <FormControl type="text" value={this.state.title}
                  onChange={(e) => this.handleChange(e, 'title')} required></FormControl>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Nội dung</ControlLabel>
                  <RichTextEditor label="Code HTML tự sinh"
                    updateRawHTML={(rawHTML) => this.handleUpdateRawHTML(rawHTML)}
                    value={this.state.content} 
                    syncHTMLtoEditor={this.state.syncHTMLtoEditor}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Ghi chú</ControlLabel>
                <FormControl type="text" value={this.state.footer}
                  onChange={(e) => this.handleChange(e, 'footer')} ></FormControl>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Hình minh họa</ControlLabel>
                <FormControl type="text" value={this.state.imgUrl}
                  onChange={(e) => this.handleChange(e, 'imgUrl')} ></FormControl>
              </FormGroup>
              <ButtonToolbar>
                <Button type="submit" bsStyle="warning">Thêm/Lưu</Button>
                <Button bsStyle="danger"
                  onClick={() => this.props.modifyTho(this.state, 'delete')} >Xóa</Button>
                <Button bsStyle="primary" type="reset" onClick={this.resetForm}>Reset</Button>
              </ButtonToolbar>
            </Form>
          </Col>
          <Col md={8} mdOffset={4}></Col>
        </Row>
      </div>
    )
    }
  }
}

const mapStateToProps = state => state.tcct;
const mapDispatchToProps = dispatch => ({
  modifyTho: (modifiedTho, modifyAction) => dispatch(modifyTho(modifiedTho, modifyAction)),
  saveDraftTho: (newTho) => dispatch(saveDraftTho(newTho)),
  goTo: (path) => dispatch(push(path)),
  getTho: () => dispatch(getTho())
})

export default connect(mapStateToProps, mapDispatchToProps)(ThoEdit);
