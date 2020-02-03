import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faKey, faPhone, faHome } from '@fortawesome/free-solid-svg-icons';
import * as KEYS from '../Constants/re-captcha-keys';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';
import * as ROUTES from '../Constants/routes';
import './sign-up.css'

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirmedPassword: "",
      name: "",
      phone: "",
      counterID: ""
    }
  }

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  handleConfirmedPasswordChange = (e) => {
    this.setState({
      confirmedPassword: e.target.value
    })
  }

  handlePhoneChange = (e) => {
    this.setState({
      phone: e.target.value
    })
  }

  handleCounterIDChange = (e) => {
    this.setState({
      counterID: e.target.value
    })
  }

  verifyCaptcha = (value) => {
    console.log("Captch value:", value)
  }

  render() {
    return(
      <div className = "sign-up">
        <div className = "sign-up-form">
          <div className = "sign-up-form-header">
            <h1>Реєстрація</h1>
            <h4>Усі поля обов'язкові для заповнення</h4>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "text" placeholder = "Ваше ім'я" value = {this.state.name} onChange = {this.handleNameChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faUser} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "email" placeholder = "Ваш E-Mail" value = {this.state.email} onChange = {this.handleEmailChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faEnvelope} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "password" placeholder = "Пароль" value = {this.state.password} onChange = {this.handlePasswordChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faKey} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "password" placeholder = "Підтвердіть пароль" value = {this.state.confirmedPassword} onChange = {this.handleConfirmedPasswordChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faKey} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "tel" placeholder = "Номер телефону" value = {this.state.phone} onChange = {this.handlePhoneChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faPhone} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <div className = "sign-up-form-block">
            <div className = "sign-up-form-block-input">
              <input type = "text" placeholder = "Особовий рахунок" value = {this.state.counterID} onChange = {this.handleCounterIDChange}></input>
              <FontAwesomeIcon className = "sign-up-form-block-input-icon" icon = {faHome} />
            </div>
            <div className = "sign-up-form-block-tooltip"></div>
          </div>
          <ReCAPTCHA sitekey = {KEYS.SITE_KEY} onChange = {this.verifyCaptcha} />
          <div className = "sign-up-form-button">
            <span>Зареєструватись</span>
          </div>
          <div className = "sign-up-form-links">
            {/* <a href = "/signin">Я вже реєструвався</a> */}
            <Link to = {ROUTES.SIGN_IN} >Я вже реєструвався(-лась)</Link>
          </div>
        </div>
      </div>
    )
  }
}