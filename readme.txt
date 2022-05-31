#To find elements with no IDs
https://stackoverflow.com/questions/53165242/how-do-i-click-a-button-that-has-no-id-using-apifys-puppeteer

#To click on checkbox
https://www.youtube.com/watch?v=IkZSNrWKlqk&ab_channel=KanielOutis
#To check if checkbox OR anything is "Checked/Existed" before executing. Will skip if its "Checked/Existed"
https://stackoverflow.com/a/18833267
Example:

let self_identity_disability = await page.$x(`//input[@id="67772ae36794100008ef69bccb3e00b4"][@aria-checked="false"]`)
        if (self_identity_disability.length > 0) {
            await self_identity_disability[0].focus()
            await self_identity_disability[0].click()
        }

#Upload File
https://blog.executeautomation.com/fileupload-testing-with-puppeteer/

#Clear Inputs
PS: (You need to await ".focus" before ".click" -- https://evanhalley.dev/post/clearing-input-field-puppeteer/
if (element instanceof ElementHandle)
https://stackoverflow.com/questions/46204003/trigger-click-in-typescript-property-click-does-not-exist-on-type-element
#Clear Inputs (Second method, by selecting all)
https://github.com/segmentio/nightmare/issues/810#issuecomment-493570444

#Use XPath to find div locations (Works when querySelector doesnt work and showing ...is not a valid selector error)
https://www.youtube.com/watch?v=27ILXN6Z7D0&t=1516s&ab_channel=CodingwithIndy (Time: 27:26 - 28:45)
#Get the value after [0] from Xpath location
https://stackoverflow.com/questions/32310645/how-to-select-the-second-element-with-same-attribute-id-in-an-xpath

#To click on the XPath location 
https://stackoverflow.com/questions/58087966/how-to-click-element-in-puppeteer-using-xpath

#To click on dropdown with XPath location
https://stackoverflow.com/questions/50542570/select-dropdown-using-xpath-in-puppeteer
