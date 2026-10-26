export class CommonActions {
   inputTextorPassword = (elementIdentifier,text)=>{
      cy.get(elementIdentifier).type(text)
   }

   verifyInputCanBeFilled = (elementIdentifier,text,inputType)=>{
      cy.get(elementIdentifier).type(text).should('have.value',text).type('{backspace}{backspace}').should('have.value',text.slice(0,-2)).and('have.attr','type',inputType)
   }

   clickOnElement = (elementIdentifier)=> {
      cy.get(elementIdentifier).click() 
   }

   verifyElementIsVisible = (elementIdentifier)=> {
      cy.get(elementIdentifier).should('be.visible')
   }

   verifyElementHasRequiredText = (elementIdentifier,text)=> {
      cy.get(elementIdentifier).should('be.visible').and("have.text",text)
   }

   assertElementHasRequiredLink = (elementIdentifier,link,text)=> {
      if(text !== undefined && text !== null){
         cy.get(elementIdentifier).should('be.visible').and("have.attr","href",link).and("have.text",text)
         return
      }
      cy.get(elementIdentifier).should('be.visible').and("have.attr","href",link)
   }

   iterateThroughArrayOfElements = (elementIdentifier , elementsParent) => {
   cy.get(`${elementsParent} > ${elementIdentifier}`).each(($el, index) => {
   // Assert text content of each <li>
   cy.wrap($el).should('contain.text', `Item ${index + 1}`);

   // Click on each <li> if needed
   cy.wrap($el).click();
   });

   }

   // check for footer presence
   // verify is visible
   // verify footer text content is accurate and updated
   // verify footer links exists
   doesPageHaveFooterContent = ()=>{
      this.verifyElementIsVisible('[data-test="footer"]')
      cy.get('[data-test="footer"]').should('have.css', 'background-color', '#132322')
      this.assertElementHasRequiredLink('[data-test="social-x"]',"https://x.com/saucelabs")
      this.assertElementHasRequiredLink('[data-test="social-facebook"]',"https://www.facebook.com/saucelabs")
      this.assertElementHasRequiredLink('[data-test="social-linkedin"]',"https://www.linkedin.com/company/sauce-labs/")
      this.verifyElementHasRequiredText('[data-test="footer-copy"]',"© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy")
   }

   //  verify user can see menu
   //  verify user can access menu items
   verifyMenuExistAndUserCanAccessIt = ()=>{
      this.verifyElementIsVisible('[data-test="open-menu"]')
      cy.get('[data-test="open-menu"]').siblings('#react-burger-menu-btn').click()
      this.verifyElementIsVisible('[data-test="close-menu"]')
      this.assertElementHasRequiredLink('[data-test="inventory-sidebar-link"]','#',"All Items")
      this.assertElementHasRequiredLink('[data-test="dynamic-catalog-sidebar-link"]','#',"Dynamic Catalog")
      this.assertElementHasRequiredLink('[data-test="about-sidebar-link"]','https://saucelabs.com/',"About")
      this.assertElementHasRequiredLink('[data-test="logout-sidebar-link"]','#',"Logout")
      this.assertElementHasRequiredLink('[data-test="reset-sidebar-link"]','#',"Reset App State")
      cy.get('[data-test="close-menu"]').siblings('#react-burger-cross-btn').click()
   }

   verifyMenuCanBeClosedAfterOpening = ()=>{
      cy.get('[data-test="open-menu"]').siblings('#react-burger-menu-btn').click()
      this.verifyElementIsVisible('[data-test="close-menu"]')
      cy.get('[data-test="close-menu"]').siblings('#react-burger-cross-btn').click()
      cy.get('[data-test="close-menu"]').should('not.be.visible')
   }

   // verify hovering over element changes text color

   assertPageIsScrollableVertically = () => {
      const devices = [
         { name: 'phone', width: 375, height: 812 },
         { name: 'iPad/tablet', width: 768, height: 1024 },
         { name: 'Desktop', width: 1280, height: 800 }
      ];

      devices.forEach((device) => {
         cy.viewport(device.width, device.height);

         cy.get('body').should('be.visible');

         cy.document().then((doc) => {
            const isScrollable = doc.documentElement.scrollHeight > doc.documentElement.clientHeight;

            if (isScrollable) {
               cy.window().its('scrollY').should('equal', 0);

               cy.scrollTo('bottom', { ensureScrollable: true });

               cy.window().its('scrollY').should('be.greaterThan', 0);
               cy.wait(2000)
               cy.scrollTo('top');
               cy.window().its('scrollY').should('equal', 0);
               cy.wait(2000)
            } else {
               cy.log(`Page content fits perfectly on ${device.name}. Skipping scroll test.`);
            }
            cy.wait(3000)
         });
      });
   };

   assertPageIsNotScrollableHorizontally = () => {
      const devices = [
         { name: 'iPhone X', width: 375, height: 812, shouldNotScrollX: true },
         { name: 'iPad Mini', width: 768, height: 1024, shouldNotScrollX: true },
         { name: 'Desktop', width: 1280, height: 800, shouldNotScrollX: true }
      ];

      devices.forEach((device) => {
         cy.viewport(device.width, device.height);

         cy.get('body').should('be.visible');

         if (device.shouldNotScrollX) {
            cy.scrollTo('right', { ensureScrollable: false }); 
            
            cy.window().its('scrollX').should('equal', 0);

            cy.document().then((doc) => {
               const totalWidth = doc.documentElement.scrollWidth;
               const visibleWidth = doc.documentElement.clientWidth;
               
               expect(totalWidth, `Page width (${totalWidth}px) should match viewport width (${visibleWidth}px)`).to.equal(visibleWidth);
            });
         }
      });
   };

   resetAppState(){
      cy.get('[data-test="open-menu"]').siblings('#react-burger-menu-btn').click()
      this.clickOnElement('[data-test="reset-sidebar-link"]')
      cy.get('[data-test="close-menu"]').siblings('#react-burger-cross-btn').click()
      cy.get('[data-test="shopping-cart-badge"]').should('not.exists')
   }

   clickCartIcon(){
      this.clickOnElement('[data-test="shopping-cart-link"]')
   }
}