import { CommonActions } from "../../actions/CommonActions"
import { LoginPage } from "../../pages/Login"
import { ProductsPage } from "../../pages/Products"

const data_file_path='login/data.json'

const loginPage= new LoginPage()
const ca= new CommonActions()
const productsPage = new ProductsPage()

describe("Shopping test cases",()=>{
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

    it("verify products exist or are visible on the page",()=>{
        productsPage.verifyProductsExist()
    })

    it("verify clicking on a product name takes user to that product's detail page",()=>{
        productsPage.verifyProductsExist()
        productsPage.assertUserCanViewProductDetails(4,'name')
        productsPage.assertUserCanViewProductDetails(1,'name')
    })

    it("verify clicking on a product image takes user to that product's detail page",()=>{
        productsPage.verifyProductsExist()
        productsPage.assertUserCanViewProductDetails(0,'img')
        productsPage.assertUserCanViewProductDetails(2,'img')
    })

    it("Verify products page is scrollable(vertically)",()=>{
        productsPage.verifyProductsExist()
        ca.assertPageIsScrollableVertically()
    })
    
    it("verify products page is not horizontally scrollable",()=>{
        productsPage.verifyProductsExist()
        ca.assertPageIsNotScrollableHorizontally()
    })

    it("Verify product details page is scrollable",()=>{
        productsPage.verifyProductsExist()
        productsPage.openProductDetailsPage(2)
        ca.assertPageIsScrollableVertically()
    })

    it("verify product details page is not horizontally scrollable",()=>{
        productsPage.verifyProductsExist()
        productsPage.openProductDetailsPage(5)
        ca.assertPageIsNotScrollableHorizontally()
    })

    it("verify user can select and apply a sort option from list",()=>{
        productsPage.assertUserSelectAnySortOptionFromList()
    })

    it("verify user can access page menu and view menu items",()=>{
        ca.verifyMenuExistAndUserCanAccessIt()
    })

    it("verify user can close menu after opening",()=>{
        ca.verifyMenuCanBeClosedAfterOpening()
    })

    it("verify user can add a product to the cart ",()=>{
        productsPage.addSingleProductToCart('[data-test="add-to-cart-sauce-labs-backpack"]')
    })
    
    it("verify user can remove a product from the cart",()=>{
        productsPage.removeSingleProductFromCart('[data-test="add-to-cart-sauce-labs-backpack"]')
    })

    it("verify user can add all products to the cart",()=>{
        productsPage.addAllProductsToCart()
    })

    it("verify user can remove all products from the cart",()=>{
        productsPage.removeAllProductsFromCart()
    })

    it("verify clicking cart icon takes user to checkout page",()=>{
        productsPage.assertClickingCartIconRoutesToCartPage()
    })

})