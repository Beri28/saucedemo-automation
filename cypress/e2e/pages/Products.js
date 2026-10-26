import { CommonActions } from "../actions/CommonActions"

const ca = new CommonActions

export class ProductsPage {
    pageTitle = '[data-test="title"]'
    shoppingCart= '[data-test="shopping-cart-link"]'
    inventoryList= '[data-test="inventory-list"]'
    menuButton= '[data-test="open-menu"]'

    verifyUserIsOnProductsPage(){
        ca.verifyElementIsVisible(this.shoppingCart)
        ca.verifyElementIsVisible(this.menuButton)
        ca.verifyElementIsVisible('[data-test="active-option"]')
        cy.get(this.pageTitle).should('have.text',"Products")
        cy.url().should('eq',`https://www.saucedemo.com/inventory.html`)
    }

    verifyUserIsOnProductDetailsPage(productId){
         cy.url().should('eq',`https://www.saucedemo.com/inventory-item.html?id=${productId}`)
    }

    verifyProductsExist(){
        ca.verifyElementIsVisible(this.inventoryList)
        cy.get(this.inventoryList).children().should('have.length.at.least',1).and('be.visible')
    }

    addSingleProductToCart(elementIdentifier,keepState){
        if(!keepState){
            ca.resetAppState()
        }

        cy.get(elementIdentifier).invoke('text').then((text)=>{
            if(text==="Add to cart"){
                ca.clickOnElement(elementIdentifier)
            }
        })
        cy.then(()=>{
            cy.get(elementIdentifier).should('not.exists')
            if(!keepState){
                cy.get('[data-test="shopping-cart-badge"]').should('be.visible').and('have.text',1)
            }
        })
    }

    removeSingleProductFromCart(elementIdentifier){
        this.addSingleProductToCart(elementIdentifier)
        const removeBtnIdentifier= elementIdentifier.replace('add-to-cart',"remove")
        cy.get(removeBtnIdentifier).invoke('text').then((text)=>{
            if(text==="Remove"){
                ca.clickOnElement(removeBtnIdentifier)
            }
        })
        cy.then(()=>{
            cy.get(removeBtnIdentifier).should('not.exists')
            cy.get('[data-test="shopping-cart-badge"]').should('not.exists')
        })
    }

    addAllProductsToCart(){
        let items=0
        cy.get('.pricebar button').each(($el,index)=>{
            items=items+1
            cy.wrap($el).invoke('text').then((text)=>{
                if(text==="Add to cart"){
                    cy.wrap($el).click()
                }
            })
        }).then(()=>{
            cy.get('[data-test="shopping-cart-badge"]').should('have.text',items)
            cy.get('.pricebar button').each(($el,index)=>{
                cy.wrap($el).invoke('text').then((value)=>{
                    expect(value).to.equal("Remove")
                })
            })
        })
    }

    removeAllProductsFromCart(){
        this.addAllProductsToCart()
        cy.get('.pricebar button').each(($el)=>{
            cy.wrap($el).invoke('text').then((text)=>{
                if(text==="Remove"){
                    cy.wrap($el).click()
                }
            })
        }).then(()=>{
            cy.get('[data-test="shopping-cart-badge"]').should('not.exist',)
            cy.get('.pricebar button').each(($el,index)=>{
                cy.wrap($el).invoke('text').then((value)=>{
                    expect(value).to.equal("Add to cart")
                })
            })
        })
    }

    assertUserCanViewProductDetails(productId,method){
        let productInfo={}
        this.verifyProductsExist()
        cy.get(`[data-test="item-${productId}-title-link"] > [data-test="inventory-item-name"]`).invoke('text').then((text)=>{
            productInfo.name=text
        })
        cy.get(`[data-test="item-${productId}-title-link"]`).siblings('[data-test="inventory-item-desc"]').invoke('text').then((text)=>{
            productInfo.desc=text
        })
        cy.get(`[data-test="item-${productId}-title-link"]`)
        .closest('div')
        .siblings('.pricebar')
        .find('[data-test="inventory-item-price"]')
        .invoke('text')
        .then((text) => {
            productInfo.price = text;
        });
        cy.get(`[data-test="item-${productId}-img-link"] > img`).invoke('attr','src').then((src)=>{
            productInfo.image=src
        })
        if(method==='img'){
           ca.clickOnElement(`[data-test="item-${productId}-img-link"]`) 
        }else{
            ca.clickOnElement(`[data-test="item-${productId}-title-link"]`)
        }
        this.verifyUserIsOnProductDetailsPage(productId)
        cy.then(()=>{
            cy.log(productInfo)
            cy.get('[data-test="inventory-item-name"]').should('have.text',productInfo.name)
            cy.get('[data-test="inventory-item-desc"]').should('have.text',productInfo.desc)
            cy.get('[data-test="inventory-item-price"]').should('have.text',productInfo.price)
            cy.get('.inventory_details_img_container > img').should('have.attr','src',productInfo.image)
            ca.verifyElementIsVisible('[data-test="back-to-products"]')
            ca.verifyElementIsVisible('[data-test="add-to-cart"]')
            ca.clickOnElement('[data-test="back-to-products"]')
        })
    }

    openProductDetailsPage(productId){
       this.verifyProductsExist() 
       ca.clickOnElement(`[data-test="item-${productId}-title-link"]`)
       this.verifyUserIsOnProductDetailsPage(productId)
    }

    assertUserSelectAnySortOptionFromList(){
        cy.get('select[data-test="product-sort-container"]')
        .find('option')
        .then(($options) => {
            const optionTexts = [...$options].map(opt => opt.text);
            
            expect(optionTexts).to.deep.equal(['Name (A to Z)','Name (Z to A)','Price (low to high)', 'Price (high to low)']);
        });

        cy.get('[data-test="product-sort-container"] > option').should('have.length',4).each((el,i)=>{
            cy.get('select[data-test="product-sort-container"]').select(i).then(()=>{
                cy.wrap(el).invoke('text').then((text)=>{
                    cy.get('[data-test="active-option"]').should('have.text',text);
                })
            });
            cy.wait(500)
        })
    }

    assertClickingCartIconRoutesToCartPage(){
        ca.clickCartIcon()
        cy.url().should('eq','https://www.saucedemo.com/cart.html')
        ca.verifyElementHasRequiredText('[data-test="title"]',"Your Cart")
    }
    
}