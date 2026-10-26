import { CommonActions } from "../../actions/CommonActions"
import { CartPage } from "../../pages/Cart"
import { CheckoutPage } from "../../pages/Checkout"
import { LoginPage } from "../../pages/Login"
import { ProductsPage } from "../../pages/Products"

const data_file_path='login/data.json'

const loginPage= new LoginPage()
const ca= new CommonActions()
const productsPage = new ProductsPage()
const cartPage = new CartPage()
const checkoutPage = new CheckoutPage()


describe("Cart tests",()=>{
    let testData=null
    before(()=>{
        cy.fixture(data_file_path).then((data)=>{
            testData=data
        })

    })

    beforeEach(()=>{
        cy.visit('https://www.saucedemo.com/')
        loginPage.login(testData.username.standard_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()
    })

    it("verify refreshing the page doesn't clear the cart",()=>{
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
        cartPage.assertPageReloadDoesnotClearCart()
    })

    it("verify user can go back to products page",()=>{
        cartPage.goBackToProductPage()
        productsPage.verifyUserIsOnProductsPage()
    })

    it("verify user can proceed from cart page to checkout page",()=>{
        cartPage.goToCheckoutPage()
        checkoutPage.verifyUserIsOnCheckoutPageStepOne()
    })

    it("verify quantity for each product in the cart is 1",()=>{
        productsPage.addAllProductsToCart()
        cartPage.assertAllProductsInCartHaveQty1()
    })

    it("verify removing a product from cart updates ui and descrement cart items count",()=>{
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
        cartPage.removeSingleProductFromCart('[data-test="remove-sauce-labs-backpack"]',1,1)
        cartPage.goBackToProductPage()
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
        cy.wait(2000)
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-bike-light"]',true)
        cy.wait(2000)
        cartPage.removeSingleProductFromCart('[data-test="remove-sauce-labs-backpack"]',2,2)
    })

    it("verify user can access page menu and view menu items",()=>{
        ca.verifyMenuExistAndUserCanAccessIt()
    })

    it("verify user can close menu after opening",()=>{
        ca.verifyMenuCanBeClosedAfterOpening()
    })

    it("verify number of items in the cart is same as the number shown on the cart icon",()=>{
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
        ca.clickCartIcon()
        cartPage.assertItemsInCartMatchesCartBadgeNumber()

        cartPage.goBackToProductPage()
        productsPage.addAllProductsToCart()
        ca.clickCartIcon()
        cartPage.assertItemsInCartMatchesCartBadgeNumber()

        ca.resetAppState()
        cartPage.assertItemsInCartMatchesCartBadgeNumber(true)
    })

    it("verify that for an empty cart, user is not able to proceed to checkout",()=>{
        cartPage.assertForEmptyCartUsercantProceedToCheckout()
    })

    it("Verify cart page is scrollable vertically",()=>{
        ca.clickCartIcon()
        cartPage.verifyUserIsOnCartPage()
        ca.assertPageIsScrollableVertically()

        // cartPage.goBackToProductPage()
        // productsPage.addAllProductsToCart()
        // ca.clickCartIcon()
        // ca.assertPageIsScrollableVertically()
    })

    it("Verify cart page is not scrollable horizontally",()=>{
        ca.clickCartIcon()
        cartPage.verifyUserIsOnCartPage()
        ca.assertPageIsScrollableVertically()

        cartPage.goBackToProductPage()
        productsPage.addAllProductsToCart()
        ca.clickCartIcon()
        ca.assertPageIsNotScrollableHorizontally()
    })

})