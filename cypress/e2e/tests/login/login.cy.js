import { CommonActions } from "../../actions/CommonActions"
import { LoginPage } from "../../pages/Login"
import { ProductsPage } from "../../pages/Products"

let data_file_path = 'login/data.json'

const loginPage= new LoginPage()
const productsPage= new ProductsPage()
const ca = new CommonActions

describe("Login",()=>{
    let testData=null
    before(()=>{
        cy.fixture(data_file_path)
        .then((data)=>{
            testData=data
        })
    })
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com/')
    })

    it("Visit website",()=>{
        ca.verifyElementIsVisible('.login_logo')
    })

    it("Verify User name input is possible",()=>{
        loginPage.enterUsername("berinyuy")
        loginPage.enterUsername('{backspace}{backspace}')
        cy.get('[data-test=username]').should('have.value','beriny')
    })

    it("Verify Password input is possible",()=>{
        loginPage.enterPassword("berinyuy")
        loginPage.enterPassword('{backspace}{backspace}{backspace}')
        cy.get('[data-test=password]').should('have.value','berin')
    })

    it("Verify Password input is censored",()=>{
        loginPage.enterPassword("berinyuy")
        cy.get('[data-test=password]').should('have.attr', 'type', 'password')
    })
    
    it("Verify Password input can be uncensored",()=>{
        cy.get('[data-test=password]').should('have.attr', 'type', 'password')
        loginPage.enterPassword("berinyuy")
        cy.get('[data-test=password]').should('have.attr', 'type', 'password')

        loginPage.togglePasswordCensor()

        cy.get('[data-test=password]').should('have.attr', 'type', 'text')

        loginPage.togglePasswordCensor()

        cy.get('[data-test=password]').should('have.attr', 'type', 'password')

    })

    it("Verify submitting incomplete info or partially filled form is rejected",()=>{
        // First try
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').should("have.text",testData.messages.userNameRequired)
        
        // second try
        loginPage.enterUsername("beri")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').should("have.text",testData.messages.passwordRequired)
    })

    it("Verify Invalid username is rejected",()=>{
        // First try
        loginPage.enterUsername("😀😀😄")
        loginPage.enterPassword(testData.userPassword)
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').contains("Epic sadface: Username cannot consist only of emojis")
        
        // Second try
        loginPage.enterUsername("   ")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').contains("Epic sadface: Username must me atleast 3 characters")
        
        // Third try
        loginPage.enterUsername("b")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').contains("Epic sadface: Username must me atleast 3 characters")
        
        // Fourth try
        loginPage.enterUsername("moses")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').should("have.text",testData.messages.wrongCredentials)
    })

    it("Verify Wrong credentials are rejected",()=>{
       // First try
        loginPage.enterUsername(testData.username.standard_user)
        loginPage.enterPassword("ber123")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').contains("Epic sadface: Username and password do not match any user in this service") 
       
        // Second try
        loginPage.enterUsername("beri123")
        loginPage.enterPassword(testData.userPassword)
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').contains("Epic sadface: Username and password do not match any user in this service") 
    })

    it("Verify Correct credentials for standard user works",()=>{
        loginPage.login(testData.username.standard_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()

    })

    it("Verify Correct credentials for locked_out user works",()=>{
        loginPage.login(testData.username.locked_out_user,testData.userPassword)
        cy.get('[data-test="error"]').contains("Epic sadface: Sorry, this user has been locked out.")  
    })

    it("Verify Correct credentials for problem_user works",()=>{
        loginPage.login(testData.username.problem_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()
        cy.get('a > .inventory_item_img').each(($el, index) => {
            cy.wrap($el).should('have.attr','src','/assets/sl-404-Cq1a9k9X.jpg');
        });
        cy.get('[data-test="inventory-item-name"]').eq(0).invoke('text').then((productName) => {
            cy.get('[data-test="inventory-item-name"]').eq(0).click();
            cy.get('[data-test="inventory-item-name"]').should('not.have.text', productName);
        });
    })

    it("Verify Correct credentials for performance_glitch_user works",()=>{
        loginPage.login(testData.username.performance_glitch_user,testData.userPassword)
        const startTime = performance.now();

        cy.get('[data-test="shopping-cart-link"]').should('be.visible').then(() => {
            const endTime = performance.now();
            const elapsedTime = (endTime - startTime) / 1000;

            expect(elapsedTime).to.be.greaterThan(4);
            expect(elapsedTime).to.be.lessThan(6);
        });
        cy.get('[data-test="open-menu"]').should('be.visible');
        cy.get('[data-test="inventory-container"]').should('be.visible');
        productsPage.verifyUserIsOnProductsPage()

    })

    it("Verify Correct credentials for error_user works",()=>{
        loginPage.login(testData.username.error_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()
        cy.get('[data-test="open-menu"]').siblings('#react-burger-menu-btn').click()
        ca.clickOnElement('[data-test="reset-sidebar-link"]')
        cy.get('[data-test="close-menu"]').siblings('#react-burger-cross-btn').click()
        cy.get('.pricebar > button').each(($el, index) => {
            cy.wrap($el).click();
        });
        cy.get('[data-test="shopping-cart-badge"').should('have.text','3')
        // cy.get('[data-test="product-sort-container"]').select()
        // cy.get('.product_sort_container option').eq(0).click()
        // cy.on('window:alert', (text) => {
        //     expect(text).to.eq('Sorting is broken! This error has been reported to Backtrace.')
        //     done()
        // })
    })

    it("Verify Correct credentials for visual_user works",()=>{
        loginPage.login(testData.username.visual_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()
        cy.get('.primary_header > #shopping_cart_container').should('not.have.css', 'top', '10px').and('not.have.css', 'right', '20px')
        cy.get('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').should('have.css', 'right', '-20px')
    })

    it("Verify Clear error and validation messages with non technical terms",()=>{
        // First try
        loginPage.login(testData.username.standard_user,"ber123")
        cy.get('[data-test="error"]').should("have.text","Epic sadface: Username and password do not match any user in this service")

        // Second try
        loginPage.login("ber123",testData.userPassword)
        cy.get('[data-test="error"]').should("have.text","Epic sadface: Username and password do not match any user in this service")
        
        // Third try
        cy.get('[data-test="username"]').clear()
        loginPage.enterPassword(" ")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').should("have.text","Epic sadface: Username is required")
        
        // Fourth try
        cy.get('[data-test="password"]').clear()
        loginPage.enterUsername("beri")
        loginPage.clickOnLogIn()
        cy.get('[data-test="error"]').should("have.text","Epic sadface: Password is required")
    })

    it("Verify Auth session is created after log in",()=>{
        loginPage.login(testData.username.visual_user,testData.userPassword)
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()

        cy.reload()
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()

        cy.visit("https://www.saucedemo.com/")
        loginPage.checkIfLoginWasSuccessful()
        productsPage.verifyUserIsOnProductsPage()

    })
})