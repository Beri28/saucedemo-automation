import { CommonActions } from "../../actions/CommonActions"
import { CartPage } from "../../pages/Cart"
import { CheckoutPage } from "../../pages/Checkout"
import { LoginPage } from "../../pages/Login"
import { ProductsPage } from "../../pages/Products"

const login_data_file_path='login/data.json'
const payment_info_file_path='checkout/data.json'

const ca = new CommonActions()
const checkoutPage = new CheckoutPage()
const loginPage = new LoginPage()
const cartPage = new CartPage()
const productPage = new ProductsPage()

describe("Checkout test",()=>{
    let testData=null
    let paymentInfo=null
    before(()=>{
        cy.fixture(login_data_file_path).then((data)=>{
            testData=data
        })

        cy.fixture(payment_info_file_path).then((data)=>{
            paymentInfo=data
        })

    })

    beforeEach(()=>{
        cy.visit('https://www.saucedemo.com/')
        loginPage.login(testData.username.standard_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        checkoutPage.navigateToCheckoutPage()
    })

    it("verify user can fill checkout form",()=>{
        checkoutPage.verifyUserCanFillForm()
    })

    it("verify user can't proceed to next checkout step without filling all info on the form",()=>{
        checkoutPage.clearCheckoutForm()
        checkoutPage.clickContinue()
        checkoutPage.verifyUserIsOnCheckoutPageStepOne()
    })

    it("verify filling the form with invalid info prevents user from proceeding to next step",()=>{
        checkoutPage.fillCheckoutForm("  ","  "," ")
        checkoutPage.verifyUserIsOnCheckoutPageStepOne()
    })

    it("verify clicking cancel button takes user back to products page",()=>{
        checkoutPage.clickCancel()
        cartPage.verifyUserIsOnCartPage()
    })

    it("verify clicking cart icon takes user back to cart page",()=>{
        ca.clickCartIcon()
        cartPage.verifyUserIsOnCartPage()
    })

    it("verify user can proceed to checkout step two after filling checkout info",()=>{
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.verifyUserIsOnCheckoutPageStepTwo()
    })

    it("verify total price shown on checkout step two matches total price for items in cart",()=>{
        checkoutPage.navigateBackToProductsPage()
        productPage.addAllProductsToCart()
        checkoutPage.navigateToCheckoutPage()
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.ensureCartTotalMatchesItemsTotal()
        
    })

    it("verify clicking cancel button(on checkout step 2) takes user to checkout step one",()=>{
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.clickCancel()
        checkoutPage.verifyUserIsOnCheckoutPageStepOne()
    })

    it("verify clicking the finish button takes user to next or final step ",()=>{
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.clickFinish()
        checkoutPage.verifyUserIsOnCheckoutPageStepThree()
    })

    it("verify user can't complete checkout process with an empty cart",()=>{
        ca.resetAppState()
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.clickFinish()
        checkoutPage.verifyUserIsOnCheckoutPageStepTwo()
    })

    it("verify clicking back home button takes user to product page",()=>{
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.clickFinish()
        ca.clickOnElement(checkoutPage.backToHome)
        productPage.verifyUserIsOnProductsPage()
    })

    it("verify user can download order details as pdf",()=>{
        checkoutPage.fillCheckoutForm(paymentInfo.paymentInfo.firstName,paymentInfo.paymentInfo.lastName,paymentInfo.paymentInfo.postalCode)
        checkoutPage.verifyUserCanDownloadOderDetails()
    })
})