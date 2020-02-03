import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Constants/routes';
import './sign-in.css'

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: "",
      password: ""
    }
  }

  handleLoginChange = (e) => {
    this.setState({
      login: e.target.value
    })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  render() {
    return(
      <div className = "sign-in">
        <div className = "sign-in-form">
          <div className = "sign-in-form-header">
            <h1>Вхід до особового кабінету</h1>
          </div>
          <div className = "sign-in-form-block">
            <div className = "sign-in-form-block-input">
              <input type = "text" placeholder = "E-Mail/Номер телефону/Особовий рахунок" value = {this.state.name} onChange = {this.handleLoginChange}></input>
              <FontAwesomeIcon className = "sign-in-form-block-input-icon" icon = {faUser} />
            </div>
            <div className = "sign-in-form-block-tooltip"></div>
          </div>
          <div className = "sign-in-form-block">
            <div className = "sign-in-form-block-input">
              <input type = "password" placeholder = "Пароль" value = {this.state.password} onChange = {this.handlePasswordChange}></input>
              <FontAwesomeIcon className = "sign-in-form-block-input-icon" icon = {faKey} />
            </div>
            <div className = "sign-in-form-block-tooltip"></div>
          </div>
          <div className = "sign-in-form-button">
            <span>Увійти</span>
          </div>
          <div className = "sign-in-form-links">
            {/* <a href = "/signin">Я вже реєструвався</a> */}
            <Link to = {'/'}>Нагадати пароль</Link>
            <Link to = {ROUTES.SIGN_UP} >Я ще не реєструвався(-лась)</Link>
          </div>
        </div>
      </div>
    )
  }
}