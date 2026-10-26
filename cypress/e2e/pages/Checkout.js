import { CommonActions } from "../actions/CommonActions";

const ca = new CommonActions

export class CheckoutPage {
    cancelButton = '[data-test="cancel"]'
    checkoutButton = '[data-test="checkout"]'
    continueButton = '[data-test="continue"]'
    finishButton = '[data-test="finish"]'
    firstName='[data-test="firstName"]'
    lastName='[data-test="lastName"]'
    postalCode='[data-test="postalCode"]'
    backToHome = '[data-test="back-to-products"]'
    generatePdf = '[data-test="generate-pdf-order"]'


    clickCancel(){
       ca.clickOnElement(this.cancelButton) 
    }

    clickContinue(){
        ca.clickOnElement(this.continueButton) 
    }

    clickFinish(){
        ca.clickOnElement(this.finishButton) 
    }

    navigateToCheckoutPage(){
        ca.clickCartIcon()
        ca.clickOnElement(this.checkoutButton)
    }

    navigateBackToProductsPage(){
        this.clickCancel()
        ca.clickOnElement('[data-test="continue-shopping"]')
    }

    verifyUserIsOnCheckoutPageStepOne(){
        cy.url().should('eq','https://www.saucedemo.com/checkout-step-one.html')
        ca.verifyElementHasRequiredText('[data-test="title"]','Checkout: Your Information')
        ca.verifyElementIsVisible('[data-test="checkout-info-container"]')
    }

    verifyUserIsOnCheckoutPageStepTwo(){
        cy.url().should('eq','https://www.saucedemo.com/checkout-step-two.html')
        ca.verifyElementHasRequiredText('[data-test="title"]','Checkout: Overview')
        ca.verifyElementIsVisible('[data-test="checkout-summary-container"]')
    }

    verifyUserIsOnCheckoutPageStepThree(){
        cy.url().should('eq','https://www.saucedemo.com/checkout-complete.html')
        ca.verifyElementHasRequiredText('[data-test="title"]','Checkout: Complete!')
        ca.verifyElementIsVisible('[data-test="checkout-complete-container"]')
    }

    verifyUserCanFillForm(){
        ca.verifyInputCanBeFilled(this.firstName,"berinyuy",'text')
        ca.verifyInputCanBeFilled(this.lastName,"jones",'text')
        ca.verifyInputCanBeFilled(this.postalCode,"01230",'text')
    }

    clearCheckoutForm(){
        cy.get(this.firstName).clear()
        cy.get(this.lastName).clear()
        cy.get(this.postalCode).clear()
    }

    fillCheckoutForm(firstName,lastName,postalCode){
        ca.inputTextorPassword(this.firstName,firstName)
        ca.inputTextorPassword(this.lastName,lastName)
        ca.inputTextorPassword(this.postalCode,postalCode)
        this.clickContinue()
    }

    ensureCartTotalMatchesItemsTotal(){
        let total=0.0
        cy.get('[data-test="inventory-item-price"]').each((el)=>{
            cy.wrap(el).invoke('text').then((text)=>{
                total=total + parseFloat(text.slice(1))
            })
        })
        cy.then(()=>{
            cy.get('[data-test="subtotal-label"]').invoke('text').then((text)=>{
                expect(text).to.contain(total)
            })
            let tax=0
            cy.get('[data-test="tax-label"]').invoke('text').then((text)=>{
                tax=parseFloat(text.slice(6))
            })
            cy.get('[data-test="total-label"]').invoke('text').then((text)=>{
                let grandtotal=parseFloat(text.slice(8))
                expect(grandtotal).to.eq(total+tax)
            })
        })
    }

    verifyUserCanDownloadOderDetails(){
        this.clickFinish()
        this.verifyUserIsOnCheckoutPageStepThree()

        cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
            command: 'Network.clearBrowserCache',
            })
        );

        cy.intercept('GET', '/assets/OrderReceipt-**').as('anyApiGet');
        cy.intercept('GET', '/assets/react-pdf.browser-**').as('anyApiGet2');

        ca.clickOnElement(this.generatePdf);

        cy.wait('@anyApiGet').then((interception) => {
        expect(interception.response.statusCode).to.be.within(200, 300);
        
        Cypress.log({ name: 'Captured URL', message: interception.request.url });
        });

        cy.wait('@anyApiGet2').then((interception) => {
        expect(interception.response.statusCode).to.be.within(200, 309);
        
        Cypress.log({ name: 'Captured URL', message: interception.request.url });
        });
    }

}