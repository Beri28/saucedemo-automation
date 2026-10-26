import { CommonActions } from "../actions/CommonActions";

const ca = new CommonActions

export class LoginPage {
    username_field_identifier = '[data-test="username"]';
    password_field_identifier = '[data-test="password"]';
    password_censor_toggle = '[data-test="password-toggle"]';
    login_button_identifier = '[data-test="login-button"]';
    saucedemo_logo_identifier = '.login_logo';

    enterUsername(value) {
        ca.inputTextorPassword(this.username_field_identifier, value);
    }

    enterPassword(value) {
        ca.inputTextorPassword(this.password_field_identifier, value);
    }

    clickOnLogIn() {
        ca.clickOnElement(this.login_button_identifier);
    }

    saucedemoLogoisPresent() {
        ca.verifyElementIsVisible(this.saucedemo_logo_identifier);
    }

    togglePasswordCensor() {
        ca.clickOnElement(this.password_censor_toggle)
    }

    checkIfLoginWasSuccessful(){
        cy.url().should('eq','https://www.saucedemo.com/inventory.html')
    }

    login(username,password){
        this.enterUsername(username)
        this.enterPassword(password)
        this.clickOnLogIn()
    }
}