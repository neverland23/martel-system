import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormText,
  Input,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import Footer from "../../components/Footer/Footer.js";

import loginImage from "../../assets/registerImage.svg";
import RLogo from "../../components/Icons/RLogo.js";
import { registerUser } from "../../actions/auth.js";
import hasToken from "../../services/authService";

const Register = (props) => {
  const [state, setState] = useState({ username: '', password: ''} )

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value })
  }

  const doRegister = (event) => {
    event.preventDefault();
    props.dispatch(registerUser({
      creds: state,
      history: props.history,
    }))
  }

  const { from } = props.location.state || { from: { pathname: '/app' } }

  if (hasToken(JSON.parse(localStorage.getItem('authenticated')))) {
    return (
      <Redirect to={from} />
    );
  }

  return (
    <div className="auth-page">
      <Container className="col-12">
        <Row className="d-flex align-items-center">
          <Col xs={12} lg={6} className="left-column">
            <Widget className="widget-auth widget-p-lg">
              <div className="d-flex align-items-center justify-content-between py-3">
                <p className="auth-header mb-0">Sign Up</p>
                <div className="logo-block">
                  <RLogo />
                  <p className="mb-0">Martel System</p>
                </div>
              </div>
              <div className="auth-info my-2">
                <p>This is the Progressive Web Application for Real-Eastate Investor</p>
              </div>
              <form onSubmit={(event => doRegister(event))}>
                <FormGroup className="my-3">
                  <FormText>Username</FormText>
                  <Input
                    id="username"
                    className="input-transparent pl-3"
                    value={state.username}
                    onChange={(event) => changeCred(event)}
                    type="text"
                    required
                    name="username"
                    placeholder="superdad"
                  />
                </FormGroup>
                <FormGroup  className="my-3">
                  <div className="d-flex justify-content-between">
                    <FormText>Password</FormText>
                    {/* <Link to="/error">Forgot password?</Link> */}
                  </div>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={state.password}
                    onChange={(event => changeCred(event))}
                    type="password"
                    required
                    name="password"
                    placeholder="Place your password here"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button className="rounded-pill my-3" type="submit" color="secondary-red">Sign Up</Button>
                </div>
                <p className="dividing-line my-3">&#8195;Or&#8195;</p>
                <Link to="/login">Enter the account</Link>
              </form>
            </Widget>
          </Col>
          <Col xs={0} lg={6} className="right-column">
            <div>
              <img src={loginImage} alt="Error page" />
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Register));
