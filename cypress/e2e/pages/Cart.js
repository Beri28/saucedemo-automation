import { CommonActions } from "../actions/CommonActions"

const ca=new CommonActions

export class CartPage {
    cartIcon= '[data-test="shopping-cart-link"]'
    cartIconBadge= '[data-test="shopping-cart-badge"]'
    checkoutButton = '[data-test="checkout"]'
    inventoryItem = '[data-test="inventory-item"]'
    continueShoppingButton = '[data-test="continue-shopping"]'
    cartBadge = '[data-test="shopping-cart-badge"]'

    verifyUserIsOnCartPage(){
        cy.url().should('eq','https://www.saucedemo.com/cart.html')
        ca.verifyElementHasRequiredText('[data-test="title"]',"Your Cart")
    }

    assertPageReloadDoesnotClearCart(){
        ca.verifyElementHasRequiredText(this.cartIconBadge,1)
        cy.reload()
        ca.clickCartIcon()
        cy.reload()
        ca.verifyElementHasRequiredText(this.cartIconBadge,1)
        ca.verifyElementIsVisible('[data-test="remove-sauce-labs-backpack"]')
        cy.get('[data-test="inventory-item"]').should('have.length',1).and('be.visible')
    }

    goBackToProductPage(){
        ca.clickCartIcon()
        this.verifyUserIsOnCartPage()
        ca.clickOnElement(this.continueShoppingButton)
    }

    goToCheckoutPage(){
        ca.clickCartIcon()
        this.verifyUserIsOnCartPage()
        ca.clickOnElement(this.checkoutButton)
    }

    assertAllProductsInCartHaveQty1(){
        ca.clickCartIcon()
        this.verifyUserIsOnCartPage()
        cy.get('[data-test="item-quantity"]').should('have.length',6).invoke('text').each((val)=>{
            expect(val).to.equal('1')
        })
    }

    removeSingleProductFromCart(removeBtnIdentifier,variant,itemsInCart){
        ca.clickCartIcon()
        this.verifyUserIsOnCartPage()
        if(variant===2){
            cy.get(this.cartBadge).should('be.visible').and('have.text',itemsInCart)
            cy.get(this.inventoryItem).should('have.length',itemsInCart).and('be.visible')
            ca.clickOnElement(removeBtnIdentifier)
            cy.get(this.cartBadge).should('be.visible').and('have.text',itemsInCart-1)
            cy.get(this.inventoryItem).should('have.length',itemsInCart-1).and('be.visible')
        }else{
            cy.get(this.cartBadge).should('be.visible').and('have.text',1)
            cy.get(this.inventoryItem).should('have.length',1).and('be.visible')
            cy.wait(2000)
            ca.clickOnElement(removeBtnIdentifier)
            cy.get(this.cartBadge).should('not.exists')
            cy.get(this.inventoryItem).should('not.exists')
        }
    }

    assertItemsInCartMatchesCartBadgeNumber(isCartEmpty){
        if(isCartEmpty){
            cy.get(this.cartBadge).should('not.exists')
            cy.get(this.inventoryItem).should('not.exists')
            return
        }

        let badgeNumber=0
        cy.get(this.cartBadge).invoke('text').then((value)=>{
            badgeNumber=parseInt(value)
        })
        cy.then(()=>{
            cy.get(this.inventoryItem).should('have.length',badgeNumber).and('be.visible')
        })
    }

    assertForEmptyCartUsercantProceedToCheckout(){
        ca.resetAppState()
        ca.clickCartIcon()
        this.verifyUserIsOnCartPage()
        cy.get(this.inventoryItem).should('not.exists')
        ca.clickOnElement(this.checkoutButton)
        this.verifyUserIsOnCartPage()
    }
}