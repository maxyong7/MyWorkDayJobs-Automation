import puppeteer, { customQueryHandlerNames, ElementHandle } from 'puppeteer'
import * as secrets from './secrets'
//import { username, password, resume, first_name } from './secrets'
const fs = require('fs')
const cookiesFilePath = './cookies1.json'

const randomIntFromInterval = (min: number, max: number) => { // min inclusive and max exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

let sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
    let sleep_duration = randomIntFromInterval(min, max);
    console.log('waiting for', sleep_duration / 1000, 'seconds');
    await page.waitForTimeout(sleep_duration);// simulate some quasi human behaviour
}

let create_acc = async (page: puppeteer.Page) => { //To Create Account
    try {
        await page.click('button[data-automation-id="createAccountLink"]')
        await sleep_for(page, 1000, 2000)
        await page.type('#input-10', secrets.username, { delay: 50 })
        await page.type('#input-11', secrets.password, { delay: 50 })
        await page.type('#input-12', secrets.password, { delay: 50 })
        const terms_and_conditions = await page.$x(`//input[@data-automation-id="createAccountCheckbox"]`)
        if (terms_and_conditions.length > 0) {
            await terms_and_conditions[0].click()
        }
        const create_account = await page.$x(`//div[@data-automation-id="click_filter"]`)
        await create_account[0].click()
        await sleep_for(page, 2000, 3000)

    }

    catch (e) {
        console.log("Error in Auth:", e);
    }
}

let sign_in = async (page: puppeteer.Page) => { //To Upload Resume
    try {
        await page.type('#input-6', secrets.username)
        await sleep_for(page, 1000, 1500);
        await page.type('#input-7', secrets.password)
        await sleep_for(page, 1000, 1500);
        await page.click('button[data-automation-id="signInSubmitButton"]')
        await page.waitForNavigation({ waitUntil: 'networkidle2' })

        // Save Session Cookies
        const cookiesObject = await page.cookies()
        // Write cookies to temp file to be used in other profile pages
        fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject),
            function () {
                try {
                    console.log('Session has been successfully saved')
                } catch (e) {
                    console.log('The file could not be written.', e)
                }

            }
        )
    } catch (e) {
        console.log("Error in sign_in:", e)
    }
}

let start_your_application = async (page: puppeteer.Page) => { //To Upload Resume
    try {
        await page.waitForXPath(`//button[@data-automation-id="utilityMenuButton"]`, { timeout: 0 })
        const autofill_with_resume = await page.$x(`//a[@data-automation-id="autofillWithResume"]`)
        if (autofill_with_resume.length > 0) {
            autofill_with_resume[0].focus()
            autofill_with_resume[0].click()
            await sleep_for(page, 1000, 2000);
        }
    } catch (e) {
        console.log("Error in Start Your Application:", e);
    }
}

let upload = async (page: puppeteer.Page) => { //To Upload Resume
    try {
        // Save Session Cookies
        const cookiesObject = await page.cookies()
        // Write cookies to temp file to be used in other profile pages
        fs.writeFile(cookiesFilePath, JSON.stringify(cookiesObject),
            function () {
                try {
                    console.log('Session has been successfully saved')
                } catch (e) {
                    console.log('The file could not be written.', e)
                }

            }
        )
        //Check if the page is "Autofill with Resume" page
        await page.waitForXPath(`//span[@data-automation-id="followUs"]`, { timeout: 0 })
        const upload_page_check = await page.$x('//div[@data-automation-id="file-upload-drop-zone"]')
        if (upload_page_check.length > 0) {
            await page.click('.css-8puu83')
            await sleep_for(page, 1000, 1500);
            const [fileChooser] = await Promise.all([
                page.waitForFileChooser(),
                page.click('#input-1'), // some button that triggers file selection
            ])
            await fileChooser.accept([secrets.resume])

            //Will not click "Continue" if user set "true" in "secrets.auto_click_continue_on_each_page"
            if (secrets.auto_click_continue_on_each_page) {
                await sleep_for(page, 1000, 1500);
                const continue_button_1 = await page.$x(`//button[@data-automation-id="bottom-navigation-next-button"]`)
                await continue_button_1[0].click()
            }

        }
    } catch (e) {
        console.log("Error in Upload:", e);
    }
}


let my_info = async (page: puppeteer.Page) => { //To Fill in "My Information" Page
    try {
        await page.waitForXPath(`//div[@data-automation-id="previousWorker"]/div[2]/div`, { timeout: 0 })
        // const employed_before = `//div[@data-automation-id="previousWorker"]/div[2]/div`
        // await page.waitForSelector(employed_before)
        // await page.click(employed_before)

        //Select "No" for "Have you been employed before"
        const employed_before = await page.$x(`//div[@data-automation-id="previousWorker"]/div[2]/div`)
        await employed_before[0].click()
        await sleep_for(page, 200, 300)
        //Select "Country"
        const country_drop = await page.$x(`//button[@data-automation-id="countryDropdown"]`)
        await country_drop[0].focus()
        await country_drop[0].click()
        const united_states = await page.$x(`//li[@data-value="bc33aa3152ec42d4995f4791a106ed09"]`)
        await page.waitForXPath(`//li[@data-value="bc33aa3152ec42d4995f4791a106ed09"]`, { timeout: 0 })
        //Select "United States"
        await united_states[0].click()
        await sleep_for(page, 500, 700);
        //Select "First Name"
        const f_name = await page.$x(`//input[@data-automation-id="legalNameSection_firstName"]`)
        await f_name[0].focus()
        await f_name[0].click({ clickCount: 4 })
        await f_name[0].press('Backspace')
        await f_name[0].type(secrets.first_name)
        //Select "Last Name"
        const l_name = await page.$x(`//input[@data-automation-id="legalNameSection_lastName"]`)
        await l_name[0].focus()
        await l_name[0].click({ clickCount: 4 })
        await l_name[0].press('Backspace')
        await l_name[0].type(secrets.last_name)
        //Select "Address Line 1"
        const address_line = await page.$x(`//input[@data-automation-id="addressSection_addressLine1"]`)
        await address_line[0].focus()
        await address_line[0].click({ clickCount: 4 })
        await address_line[0].press('Backspace')
        await address_line[0].type(secrets.address_line_1)
        //Select "City"
        const city = await page.$x(`//input[@data-automation-id="addressSection_city"]`)
        await city[0].focus()
        await city[0].click({ clickCount: 4 })
        await city[0].press('Backspace')
        await city[0].type(secrets.city)
        //Select "State"
        const state = await page.$x(`//button[@data-automation-id="addressSection_countryRegion"]`)
        await state[0].focus()
        await state[0].click()
        await page.waitForXPath(`//li[@data-value="02f3984b69ba450080e456fe733f6741"]`, { timeout: 0 })
        const minnesota_state = await page.$x(`//li[@data-value="02f3984b69ba450080e456fe733f6741"]`)
        await minnesota_state[0].click()
        //Select "Postal Code"
        const postal_code = await page.$x(`//input[@data-automation-id="addressSection_postalCode"]`)
        await sleep_for(page, 400, 500)
        await postal_code[0].focus()
        await postal_code[0].click({ clickCount: 4 })
        await postal_code[0].press('Backspace')
        await postal_code[0].type(secrets.postal_code)
        //Change "Phone Device Type" to "Personal Cell"
        const phone_device_type = await page.$x(`//button[@data-automation-id="phone-device-type"]`)
        await phone_device_type[0].focus()
        await phone_device_type[0].click()
        await page.waitForXPath(`(//ul[@role="listbox"])[2]/li[4]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const personal_cell = await page.$x(`(//ul[@role="listbox"])[2]/li[4]`)
        await personal_cell[0].click()
        await sleep_for(page, 400, 500)
        //Select "Phone Number"
        const phone_number = await page.$x(`//input[@data-automation-id="phone-number"]`)
        await phone_number[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await phone_number[0].press('Backspace')
        await phone_number[0].type(secrets.phone_number)

        if (secrets.auto_click_continue_on_each_page) {
            await sleep_for(page, 500, 800)
            const save_and_continue_1 = await page.$x(`//button[@data-automation-id="bottom-navigation-next-button"]`)
            await save_and_continue_1[0].focus()
            await save_and_continue_1[0].click()
        }


    } catch (e) {
        console.log("Error in 'My Information' page:", e);
    }
}

let my_experience = async (page: puppeteer.Page) => { //To Fill in "My Information" Page
    try {
        //Wait till page loads
        await page.waitForXPath(`//button[@data-automation-id="utilityMenuButton"]`, { timeout: 0 })
        // const job_title = await page.$x(`//input[@data-automation-id="jobTitle"]`)
        // //job_title[0] is "Job Title" in "Work Experience 1"; job_title[1] is "Job Title" in "Work Experience 2" and so on...
        // const company = await page.$x(`//input[@data-automation-id="company"]`)
        // //company[0] is "Company" in "Work Experience 1"; company[1] is "Company" in "Work Experience 2" and so on...
        // const job_location = await page.$x(`//input[@data-automation-id="location"]`)
        // //job_location[0] is "Location" in "Work Experience 1"; job_location[1] is "Location" in "Work Experience 2" and so on...
        // const date = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        // //date[0] is "From: Month" in "Work Experience 1", date[1] is "From: Year" in "Work Experience 1"
        // //date[2] is "To: Month" in "Work Experience 1", date[3] is "To: Year" in "Work Experience 1";
        // //date[3] is "From: Month" in "Work Experience 2", date[4] is "From: Year" in "Work Experience 2"
        // //date[5] is "To: Month" in "Work Experience 2", job_date[6] is "To: Year" in "Work Experience 2" and so on...
        // //date[16] is "From: Year" in "Education 1", date[17] is "To: Year" in "Education 1", 
        // const role_description = await page.$x(`//textarea[@data-automation-id="description"]`)
        // //role_description[0] is "Role Description" in "Work Experience 1"; role_description[1] is "Role Description" in "Work Experience 2" and so on...



        await sleep_for(page, 2500, 3000)
        const job_title_1 = await page.$x(`(//input[@data-automation-id="jobTitle"])[1]`)
        const job_title_5 = await page.$x(`(//input[@data-automation-id="jobTitle"])[5]`)
        //job_title_1[0] is "Job Title" in "Work Experience 1"
        if (job_title_1.length < 1) {
            await page.waitForXPath(`//button[@aria-label="Add Work Experience"]`)
            const add_another_work = await page.$x(`//button[@aria-label="Add Work Experience"]`)
            await add_another_work[0].click()
            await page.waitForXPath(`(//input[@data-automation-id="jobTitle"])[1]`)
            await sleep_for(page, 200, 300)
        }
        //"Job Title" in "Work Experience 1"
        const job_title_1_true = await page.$x(`(//input[@data-automation-id="jobTitle"])[1]`)
        await job_title_1_true[0].focus()
        await job_title_1_true[0].click({ clickCount: 4 })
        await job_title_1_true[0].press('Backspace')
        await job_title_1_true[0].type(secrets.job_title1)
        //"Company" in "Work Experience 1"
        const company_1 = await page.$x(`(//input[@data-automation-id="company"])[1]`)
        await company_1[0].focus()
        await company_1[0].click({ clickCount: 4 })
        await company_1[0].press('Backspace')
        await company_1[0].type(secrets.company_name1)
        //"Location" in "Work Experience 1"
        const job_location_1 = await page.$x(`(//input[@data-automation-id="location"])[1]`)
        await job_location_1[0].focus()
        await job_location_1[0].click({ clickCount: 4 })
        await job_location_1[0].press('Backspace')
        await job_location_1[0].type(secrets.company_location1)
        //"From: Month" in "Work Experience 1"
        const date = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        await date[0].focus()
        await date[0].click({ clickCount: 1 })
        await date[0].press('Backspace')
        await date[0].type(secrets.work_from_month1)
        //"From: Year" in "Work Experience 1"
        await date[1].focus()
        await date[1].click({ clickCount: 1 })
        await date[1].press('Backspace')
        await date[1].type(secrets.work_from_year1)
        //"To: Month" in "Work Experience 1"
        await date[2].focus()
        await date[2].click({ clickCount: 1 })
        await date[2].press('Backspace')
        await date[2].type(secrets.work_till_month1)
        //"From: Year" in "Work Experience 1"
        await date[3].focus()
        await date[3].click({ clickCount: 1 })
        await date[3].press('Backspace')
        await date[3].type(secrets.work_till_year1)
        //"Role Description" in "Work Experience 1"
        const role_description = await page.$x(`//textarea[@data-automation-id="description"]`)
        await role_description[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await role_description[0].press('Backspace')
        await role_description[0].type(secrets.work_description1)

        const job_title_2 = await page.$x(`(//input[@data-automation-id="jobTitle"])[2]`)
        //job_title_2[0] is "Job Title" in "Work Experience 2"
        if (job_title_2.length < 1) {
            await page.waitForXPath(`//button[@aria-label="Add Another Work Experience"]`)
            const add_another_work = await page.$x(`//button[@aria-label="Add Another Work Experience"]`)
            await add_another_work[0].click()
            await page.waitForXPath(`(//input[@data-automation-id="jobTitle"])[2]`)
            await sleep_for(page, 200, 300)
        }
        //"Job Title" in "Work Experience 2"
        const job_title_2_true = await page.$x(`(//input[@data-automation-id="jobTitle"])[2]`)
        await job_title_2_true[0].focus()
        await job_title_2_true[0].click({ clickCount: 4 })
        await job_title_2_true[0].press('Backspace')
        await job_title_2_true[0].type(secrets.job_title2)
        //"Company" in "Work Experience 2"
        const company_2 = await page.$x(`(//input[@data-automation-id="company"])[2]`)
        await company_2[0].focus()
        await company_2[0].click({ clickCount: 4 })
        await company_2[0].press('Backspace')
        await company_2[0].type(secrets.company_name2)
        //"Location" in "Work Experience 2"
        const job_location_2 = await page.$x(`(//input[@data-automation-id="location"])[2]`)
        await job_location_2[0].focus()
        await job_location_2[0].click({ clickCount: 4 })
        await job_location_2[0].press('Backspace')
        await job_location_2[0].type(secrets.company_location2)
        //"From: Month" in "Work Experience 2"
        const date_2 = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        await date_2[4].focus()
        await date_2[4].click({ clickCount: 1 })
        await date_2[4].press('Backspace')
        await date_2[4].type(secrets.work_from_month2)
        //"From: Year" in "Work Experience 2"
        await date_2[5].focus()
        await date_2[5].click({ clickCount: 1 })
        await date_2[5].press('Backspace')
        await date_2[5].type(secrets.work_from_year2)
        //"To: Month" in "Work Experience 2"
        await date_2[6].focus()
        await date_2[6].click({ clickCount: 1 })
        await date_2[6].press('Backspace')
        await date_2[6].type(secrets.work_till_month2)
        //"From: Year" in "Work Experience 2"
        await date_2[7].focus()
        await date_2[7].click({ clickCount: 1 })
        await date_2[7].press('Backspace')
        await date_2[7].type(secrets.work_till_year2)
        //"Role Description" in "Work Experience 2"
        const role_description_2 = await page.$x(`//textarea[@data-automation-id="description"]`)
        await role_description_2[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await role_description_2[0].press('Backspace')
        await role_description_2[0].type(secrets.work_description2)

        const job_title_3 = await page.$x(`(//input[@data-automation-id="jobTitle"])[3]`)
        //job_title_3[0] is "Job Title" in "Work Experience 3"
        if (job_title_3.length < 1) {
            const add_another_work = await page.$x(`//button[@aria-label="Add Another Work Experience"]`)
            await add_another_work[0].click()
            await page.waitForXPath(`(//input[@data-automation-id="jobTitle"])[3]`)
            await sleep_for(page, 200, 300)
        }
        //"Job Title" in "Work Experience 3"
        const job_title_3_true = await page.$x(`(//input[@data-automation-id="jobTitle"])[3]`)
        await job_title_3_true[0].focus()
        await job_title_3_true[0].click({ clickCount: 4 })
        await job_title_3_true[0].press('Backspace')
        await job_title_3_true[0].type(secrets.job_title2)
        //"Company" in "Work Experience 3"
        const company_3 = await page.$x(`(//input[@data-automation-id="company"])[3]`)
        await company_3[0].focus()
        await company_3[0].click({ clickCount: 4 })
        await company_3[0].press('Backspace')
        await company_3[0].type(secrets.company_name3)
        //"Location" in "Work Experience 3"
        const job_location_3 = await page.$x(`(//input[@data-automation-id="location"])[3]`)
        await job_location_3[0].focus()
        await job_location_3[0].click({ clickCount: 4 })
        await job_location_3[0].press('Backspace')
        await job_location_3[0].type(secrets.company_location3)
        //"From: Month" in "Work Experience 3"
        const date_3 = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        await date_3[8].focus()
        await date_3[8].click({ clickCount: 1 })
        await date_3[8].press('Backspace')
        await date_3[8].type(secrets.work_from_month3)
        //"From: Year" in "Work Experience 3"
        await date_3[9].focus()
        await date_3[9].click({ clickCount: 1 })
        await date_3[9].press('Backspace')
        await date_3[9].type(secrets.work_from_year3)
        //"To: Month" in "Work Experience 3"
        await date_3[10].focus()
        await date_3[10].click({ clickCount: 1 })
        await date_3[10].press('Backspace')
        await date_3[10].type(secrets.work_till_month3)
        //"To: Year" in "Work Experience 3"
        await date_3[11].focus()
        await date_3[11].click({ clickCount: 1 })
        await date_3[11].press('Backspace')
        await date_3[11].type(secrets.work_till_year3)
        //"Role Description" in "Work Experience 3"
        const role_description_3 = await page.$x(`//textarea[@data-automation-id="description"]`)
        await role_description_3[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await role_description_3[0].press('Backspace')
        await role_description_3[0].type(secrets.work_description3)

        const job_title_4 = await page.$x(`(//input[@data-automation-id="jobTitle"])[4]`)
        //job_title_4[0] is "Job Title" in "Work Experience 4"
        if (job_title_4.length < 1) {
            const add_another_work = await page.$x(`//button[@aria-label="Add Another Work Experience"]`)
            await add_another_work[0].click()
            await page.waitForXPath(`(//input[@data-automation-id="jobTitle"])[4]`)
            await sleep_for(page, 200, 300)
        }
        //"Job Title" in "Work Experience 4"
        const job_title_4_true = await page.$x(`(//input[@data-automation-id="jobTitle"])[4]`)
        await job_title_4_true[0].focus()
        await job_title_4_true[0].click({ clickCount: 4 })
        await job_title_4_true[0].press('Backspace')
        await job_title_4_true[0].type(secrets.job_title2)
        //"Company" in "Work Experience 4"
        const company_4 = await page.$x(`(//input[@data-automation-id="company"])[4]`)
        await company_4[0].focus()
        await company_4[0].click({ clickCount: 4 })
        await company_4[0].press('Backspace')
        await company_4[0].type(secrets.company_name4)
        //"Location" in "Work Experience 4"
        const job_location_4 = await page.$x(`(//input[@data-automation-id="location"])[4]`)
        await job_location_4[0].focus()
        await job_location_4[0].click({ clickCount: 4 })
        await job_location_4[0].press('Backspace')
        await job_location_4[0].type(secrets.company_location4)
        //"From: Month" in "Work Experience 4"
        const date_4 = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        await date_4[12].focus()
        await date_4[12].click({ clickCount: 1 })
        await date_4[12].press('Backspace')
        await date_4[12].type(secrets.work_from_month4)
        //"From: Year" in "Work Experience 4"
        await date_4[13].focus()
        await date_4[13].click({ clickCount: 1 })
        await date_4[13].press('Backspace')
        await date_4[13].type(secrets.work_from_year4)
        //"To: Month" in "Work Experience 4"
        await date_4[14].focus()
        await date_4[14].click({ clickCount: 1 })
        await date_4[14].press('Backspace')
        await date_4[14].type(secrets.work_till_month4)
        //"From: Year" in "Work Experience 4"
        await date_4[15].focus()
        await date_4[15].click({ clickCount: 1 })
        await date_4[15].press('Backspace')
        await date_4[15].type(secrets.work_till_year4)
        //"Role Description" in "Work Experience 4"
        const role_description_4 = await page.$x(`//textarea[@data-automation-id="description"]`)
        await role_description_4[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await role_description_4[0].press('Backspace')
        await role_description_4[0].type(secrets.work_description4)

        //"School or University" in "Education 1"
        const university = await page.$x(`//input[@data-automation-id="school"]`)
        //university[0] is "School or University" in "Education 1"
        await university[0].focus()
        await university[0].click({ clickCount: 4 })
        await university[0].press('Backspace')
        await university[0].type(secrets.university_name)
        //"Degree" in "Education 1"
        const degree = await page.$x(`//button[@data-automation-id="degree"]`)
        if (degree.length > 0) {
            await degree[0].focus()
            await degree[0].click()
            await page.waitForXPath(`//li[@data-value="57383ba9fd08019a4b458b69d11bc732"]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const bachelor_of_arts = await page.$x(`//li[@data-value="57383ba9fd08019a4b458b69d11bc732"]`)
            await bachelor_of_arts[0].click()
            await sleep_for(page, 400, 500)
        }
        //"GPA" in "Education 1"
        const gpa = await page.$x(`//input[@data-automation-id="gpa"]`)
        if (gpa.length > 0) {
            await gpa[0].focus()
            await gpa[0].click({ clickCount: 4 })
            await gpa[0].press('Backspace')
            await gpa[0].type(secrets.gpa)
        }
        //"From: Year" in "Education 1"
        const date_5 = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        await date_5[16].focus()
        await date_5[16].click({ clickCount: 4 })
        await date_5[16].press('Backspace')
        await date_5[16].type(secrets.university_from_year)
        //"To: Year" in "Education 1"
        await date_5[17].focus()
        await date_5[17].click({ clickCount: 4 })
        await date_5[17].press('Backspace')
        await date_5[17].type(secrets.university_till_year)

        //"Add" Button in "Language"
        let add_language = await page.$x(`//button[@aria-label="Add Languages"]`)
        //add_language[0] is button "Add" in "Languages"
        if (add_language.length > 0) {
            await add_language[0].click()
            // // "Language" in "Language 1"
            await page.waitForXPath(`//button[@data-automation-id="language"]`, { timeout: 0 })
            const language_section = await page.$x(`(//button[@data-automation-id="language"])[1]`)
            // await language_section[0].focus(),
            await language_section[0].click()
            // "Chinese" in "Language" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f218225950012888eb4c6acc00d90d"]`, { timeout: 0 })
            const language_chinese = await page.$x(`//li[@data-value="14f218225950012888eb4c6acc00d90d"]`)
            await language_chinese[0].click()
            // "This is my native language" checkbox in "Language 1"
            const native_language_check = await page.$x(`//input[@data-automation-id="nativeLanguage"]`)
            await native_language_check[0].click()
            // "Comprehension" in "Language 1"
            const language_comprehension_1 = await page.$x(`//button[@data-automation-id="languageProficiency-0"]`)
            await language_comprehension_1[0].focus()
            await language_comprehension_1[0].click()
            // "Fluent" in "Comprehension" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_1 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_1[0].click()
            // "Overall" in "Language 1"
            await sleep_for(page, 100, 200)
            const language_overall_1 = await page.$x(`//button[@data-automation-id="languageProficiency-1"]`)
            await language_overall_1[0].focus()
            await language_overall_1[0].click()
            // "Fluent" in "Overall" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_2 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_2[0].click()
            // "Reading" in "Language 1"
            const language_reading_1 = await page.$x(`//button[@data-automation-id="languageProficiency-2"]`)
            await language_reading_1[0].focus()
            await language_reading_1[0].click()
            // "Fluent" in "Reading" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_3 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_3[0].click()
            // "Speaking" in "Language 1"
            const language_speaking_1 = await page.$x(`//button[@data-automation-id="languageProficiency-3"]`)
            await language_speaking_1[0].focus()
            await language_speaking_1[0].click()
            // "Fluent" in "Speaking" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_4 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_4[0].click()
            // "Writing" in "Language 1"
            const language_writing_1 = await page.$x(`//button[@data-automation-id="languageProficiency-4"]`)
            await sleep_for(page, 100, 200)
            await language_writing_1[0].focus()
            await language_writing_1[0].click()
            // "Fluent" in "Writing" in "Language 1"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_5 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_5[0].click()


            // "Add another" language in "Language"
            const add_another_language = await page.$x(`//button[@aria-label="Add Another Languages"]`)
            await add_another_language[0].click()
            // "Language" in "Language 2"
            await page.waitForXPath(`(//button[@data-automation-id="language"])[2]`, { timeout: 0 })
            const language_section_2 = await page.$x(`(//button[@data-automation-id="language"])[2]`)
            await language_section_2[0].focus()
            await language_section_2[0].click()
            // "English" in "Language" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f21822595001ce3bfa5d6acc000a0e"]`, { timeout: 0 })
            const language_english = await page.$x(`//li[@data-value="14f21822595001ce3bfa5d6acc000a0e"]`)
            await language_english[0].click()
            // "Comprehension" in "Language 2"
            const language_comprehension_2 = await page.$x(`//button[@data-automation-id="languageProficiency-0"]`)
            await language_comprehension_2[1].focus()
            await language_comprehension_2[1].click()
            await sleep_for(page, 100, 200)
            // "Fluent" in "Comprehension" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_6 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_6[0].click()
            // "Overall" in "Language 2"
            const language_overall_2 = await page.$x(`//button[@data-automation-id="languageProficiency-1"]`)
            await language_overall_2[1].click()
            await language_overall_2[1].focus()
            await sleep_for(page, 100, 200)
            // "Fluent" in "Overall" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_7 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_7[0].click()
            // "Reading" in "Language 2"
            const language_reading_2 = await page.$x(`//button[@data-automation-id="languageProficiency-2"]`)
            await language_reading_2[1].click()
            await language_reading_2[1].focus()
            await sleep_for(page, 100, 200)
            // "Fluent" in "Reading" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_8 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_8[0].click()
            // "Speaking" in "Language 2"
            const language_speaking_2 = await page.$x(`//button[@data-automation-id="languageProficiency-3"]`)
            await language_speaking_2[1].click()
            await language_speaking_2[1].focus()
            await sleep_for(page, 100, 200)
            // "Fluent" in "Speaking" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_9 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_9[0].click()
            // "Writing" in "Language 2"
            const language_writing_2 = await page.$x(`//button[@data-automation-id="languageProficiency-4"]`)
            await sleep_for(page, 100, 200)
            await language_writing_2[1].focus()
            await language_writing_2[1].click()
            // "Fluent" in "Writing" in "Language 2"
            await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
            const language_comprehension_fluent_10 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
            await language_comprehension_fluent_10[0].click()
        }

        //"Linked-in Profile"
        const linked_in_url = await page.$x(`//input[@data-automation-id="linkedinQuestion"]`)
        if (linked_in_url.length > 0) {
            await linked_in_url[0].focus()
            await linked_in_url[0].click({ clickCount: 4 })
            await linked_in_url[0].press('Backspace')
            await linked_in_url[0].type(secrets.linked_in_profile)
        }

        if (secrets.auto_click_continue_on_each_page) {
            await sleep_for(page, 500, 800)
            const save_and_continue_1 = await page.$x(`//button[@data-automation-id="bottom-navigation-next-button"]`)
            await save_and_continue_1[0].focus()
            await save_and_continue_1[0].click()
        }
        // //Go to "Skills" to do it manually
        // const add_skills = await page.$x(`//ul[@data-automation-id="selectedItemList"]`)
        // await add_skills[1].focus()


    } catch (e) {
        console.log("Error in 'My Experience' page:", e);
    }
}

let application_questions = async (page: puppeteer.Page) => {
    try {
        //Select "What are your salary expectation"
        await page.waitForXPath(`//button[@data-automation-id="utilityMenuButton"]`, { timeout: 0 })
        await sleep_for(page, 2500, 3000)
        const salary_expectation = await page.$x(`//input[@data-automation-id="500f494a214d01376a4367d6fc01f245"]`)
        if (salary_expectation.length > 0) {
            await salary_expectation[0].focus()
            await salary_expectation[0].click({ clickCount: 4 })
            await salary_expectation[0].press('Backspace')
            await salary_expectation[0].type(secrets.salary_expectation)
        }

        //Select "Are you 18 or older?"
        const are_you_older = await page.$x(`//button[@data-automation-id="57383ba9fd0801c5b1459a70d11b2e34"]`)
        if (are_you_older.length > 0) {
            await are_you_older[0].focus()
            await are_you_older[0].click()
            //Choose "Yes"
            await page.waitForXPath(`//li[@data-value="57383ba9fd0801bace96116ad11b5433"]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const yes_answer_1 = await page.$x(`//li[@data-value="57383ba9fd0801bace96116ad11b5433"]`)
            await yes_answer_1[0].click()
            await sleep_for(page, 400, 500)
        }

        //Select "Are you related to...."
        const related_to = await page.$x(`//button[@data-automation-id="500f494a214d013de54967d6fc01f345"]`)
        if (related_to.length > 0) {
            await related_to[0].focus()
            await related_to[0].click()
            //Choose "No"
            await page.waitForXPath(`//li[@data-value="14f218225950013b235b6a21ac0151f0"]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const no_answer_1 = await page.$x(`//li[@data-value="14f218225950013b235b6a21ac0151f0"]`)
            await no_answer_1[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Will you now or in the future require sponsorship..."
        const require_sponsorship = await page.$x(`//button[@data-automation-id="500f494a214d018d598e67d6fc01f745"]`)
        if (require_sponsorship.length > 0) {
            await require_sponsorship[0].focus()
            await require_sponsorship[0].click()
            //Choose "Yes"
            await page.waitForXPath(`//li[@data-value="14f218225950014ce9c55f21ac01ecef"]`, { timeout: 0 })
            const yes_answer_1 = await page.$x(`//li[@data-value="14f218225950014ce9c55f21ac01ecef"]`)
            await yes_answer_1[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Do you require sponsorship to work in the US?"
        const require_sponsorship_now = await page.$x(`//button[@data-automation-id="57383ba9fd08010ca8579a70d11b3134"]`)
        if (require_sponsorship_now.length > 0) {
            await require_sponsorship_now[0].focus()
            await require_sponsorship_now[0].click()
            //Choose "No"
            await page.waitForXPath(`//li[@data-value="57383ba9fd0801c12e2c136ad11b7a33"]`, { timeout: 0 })
            const no_answer_1 = await page.$x(`//li[@data-value="57383ba9fd0801c12e2c136ad11b7a33"]`)
            await no_answer_1[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Are you able to perform the essential functions of the position for which you are applying with or without reasonable accommodation?"
        const perform_essential_function = await page.$x(`//button[@data-automation-id="57383ba9fd08019a367d9a70d11b3434"]`)
        if (perform_essential_function.length > 0) {
            await perform_essential_function[0].focus()
            await perform_essential_function[0].click()
            //Choose "Yes"
            await page.waitForXPath(`//li[@data-value="57383ba9fd0801bda932126ad11b6233"]`, { timeout: 0 })
            const no_answer_1 = await page.$x(`//li[@data-value="57383ba9fd0801bda932126ad11b6233"]`)
            await no_answer_1[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Are you now, or willing to become, fully vaccinated against COVID-19?..."
        const vaccinated = await page.$x(`//button[@data-automation-id="61332d9243d501a94a29fbeffc014944"]`)
        if (vaccinated.length > 0) {
            await vaccinated[0].focus()
            await vaccinated[0].click()
            //Choose "Yes"
            await page.waitForXPath(`//li[@data-value="61332d9243d50145dca47bedfc014544"]`, { timeout: 0 })
            const yes_answer_2 = await page.$x(`//li[@data-value="61332d9243d50145dca47bedfc014544"]`)
            await yes_answer_2[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Are you willing and able to travel out of town or over night for this position as necessary?"
        const willing_travel = await page.$x(`//button[@data-automation-id="500f494a214d0122869e67d6fc01fa45"]`)
        if (willing_travel.length > 0) {
            await willing_travel[0].focus()
            await willing_travel[0].click()
            //Choose "Yes"
            await page.waitForXPath(`//li[@data-value="14f218225950014071b76621ac0130f0"]`, { timeout: 0 })
            const yes_answer_3 = await page.$x(`//li[@data-value="14f218225950014071b76621ac0130f0"]`)
            await yes_answer_3[0].click()
            await sleep_for(page, 400, 500)
        }

        //Will not click "Continue" if user set "true" in "secrets.auto_click_continue_on_each_page"
        if (secrets.auto_click_continue_on_each_page) {
            await sleep_for(page, 500, 800)
            const save_and_continue_1 = await page.$x(`//button[@data-automation-id="bottom-navigation-next-button"]`)
            await save_and_continue_1[0].focus()
            await save_and_continue_1[0].click()
        }


    } catch (e) {
        console.log("Error in 'Application Questions' page:", e);
    }
}

let voluntary_disclosure = async (page: puppeteer.Page) => {
    try {
        //Select "Gender"
        await page.waitForXPath(`//button[@data-automation-id="gender"]`, { timeout: 0 })
        const gender = await page.$x(`//div[@data-automation-id="formField-gender"]/div/div/div[1]`)
        if (gender.length > 0) {
            await gender[0].focus()
            await gender[0].click()
            //Choose "Male"
            await page.waitForXPath(`//div[@data-automation-widget="wd-popup"]/div/div/ul/li[3]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const male = await page.$x(`//div[@data-automation-widget="wd-popup"]/div/div/ul/li[3]`)
            await male[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Hispanic or Latino?"
        const his_or_lat = await page.$x(`//button[@data-automation-id="hispanicOrLatino"]`)
        if (his_or_lat.length > 0) {
            await his_or_lat[0].focus()
            await his_or_lat[0].click()
            //Choose "No"
            await page.waitForXPath(`//li[@data-value="2"]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const voluntary_no_answer_1 = await page.$x(`//li[@data-value="2"]`)
            await voluntary_no_answer_1[0].click()
        }
        //Select "Race/Ethnicity"
        await sleep_for(page, 1000, 1500)
        const race_ethnicity = await page.$x(`//button[@data-automation-id="ethnicityDropdown"]`)
        if (race_ethnicity.length > 0) {
            await race_ethnicity[0].focus()
            await race_ethnicity[0].click()
            await sleep_for(page, 400, 500)
            //Choose "Asian"
            await page.waitForXPath(`//div[@data-automation-widget="wd-popup"]/div/div/ul/li[3]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const asian = await page.$x(`//div[@data-automation-widget="wd-popup"]/div/div/ul/li[3]`)
            await asian[0].click()
            await sleep_for(page, 400, 500)
        }
        //Select "Veteran Status"
        const veteran_status = await page.$x(`//button[@data-automation-id="veteranStatus"]`)
        if (veteran_status.length > 0) {
            await veteran_status[0].focus()
            await veteran_status[0].click()
            await sleep_for(page, 400, 500)
            //Choose "I am not a Veteran"
            await page.waitForXPath(`//li[@data-value="a79c6915500f01221fa8b905b205660a"]`, { timeout: 0 })
            await sleep_for(page, 400, 500)
            const not_veteran = await page.$x(`//li[@data-value="a79c6915500f01221fa8b905b205660a"]`)
            await sleep_for(page, 400, 500)
            await not_veteran[0].click()
            await sleep_for(page, 100, 200)
        }
        //Select "Agree to terms and conditions" checkbox
        let terms_and_conditions = await page.$x(`//input[@data-automation-id="agreementCheckbox"][@aria-checked="false"]`)
        if (terms_and_conditions.length > 0) {
            await terms_and_conditions[0].focus()
            await terms_and_conditions[0].click()
        }


    } catch (e) {
        console.log("Error in 'Voluntary Disclosure' page:", e);
    }
}

let self_identity = async (page: puppeteer.Page) => {
    try {
        //Select "Language"
        await page.waitForXPath(`//button[@data-automation-id="language"]`, { timeout: 0 })
        const self_identity_language = await page.$x(`//button[@data-automation-id="language"]`)
        await self_identity_language[0].focus()
        await self_identity_language[0].click()
        //Choose "English"
        await page.waitForXPath(`//li[@data-value="English"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const male = await page.$x(`//li[@data-value="English"]`)
        await male[0].click()
        //Select "Name"
        const self_identity_name = await page.$x(`//input[@data-automation-id="name"]`)
        await self_identity_name[0].focus()
        await self_identity_name[0].click()
        await self_identity_name[0].type(`${secrets.last_name} ${secrets.first_name}`)
        //Select "Date"
        const self_identity_date = await page.$x(`//div[@data-automation-id="dateIcon"]`)
        await self_identity_date[0].focus()
        await self_identity_date[0].click()
        await page.waitForXPath(`//button[@data-automation-id="datePickerSelectedToday"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const self_identity_date_picker = await page.$x(`//button[@data-automation-id="datePickerSelectedToday"]`)
        await self_identity_date_picker[0].click()
        await sleep_for(page, 400, 500)
        //Select "Disability" checkbox
        let self_identity_disability = await page.$x(`//input[@id="67772ae36794100008ef69bccb3e00b4"][@aria-checked="false"]`)
        if (self_identity_disability.length > 0) {
            await self_identity_disability[0].focus()
            await self_identity_disability[0].click()
        }

        //Will not click "Continue" if user set "true" in "secrets.auto_click_continue_on_each_page"
        if (secrets.auto_click_continue_on_each_page) {
            await sleep_for(page, 500, 800)
            const save_and_continue_1 = await page.$x(`//button[@data-automation-id="bottom-navigation-next-button"]`)
            await save_and_continue_1[0].focus()
            await save_and_continue_1[0].click()
        }
    } catch (e) {
        console.log("Error in 'Self Identity' page:", e);
    }
}

let main_actual = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
        const page = await browser.newPage();
        //const URL = 'https://collegeboard.wd1.myworkdayjobs.com/en-US/Careers/login?redirect=%2Fen-US%2FCareers%2Fjob%2FNew-York%252C-NY%2FTechnical-Support-Specialist---Pre-AP-Programs_REQ000647%2Fapply%2FautofillWithResume%3Fsource%3DLinkedIn'
        //const URL = 'https://collegeboard.wd1.myworkdayjobs.com/en-US/Careers/login?redirect=%2Fen-US%2FCareers%2Fjob%2FNew-York%252C-NY%2FTechnical-Support-Specialist---Pre-AP-Programs_REQ000647%2Fapply%2FautofillWithResume%3Fsource%3DLinkedIn'
        const URL = 'https://sleepnumber.wd5.myworkdayjobs.com/sleepnumber/login?redirect=%2Fsleepnumber%2Fjob%2FMinneapolis-MN%2FDigital-Marketing-Software-Engineer_R13861%2Fapply%3Futm_campaign%3Dcorporate_fy22%26utm_medium%3Djobad%26utm_content%3Dpj_board%26utm_source%3Djobadx%26p_uid%3DHDIerdTm1J%26p_sid%3Dh15W7Ib%26ss%3Dpaid%26source%3DProgrammatic_Paid'
        //https://bbinsurance.wd1.myworkdayjobs.com/en-US/Careers/login?redirect=%2Fen-US%2FCareers%2Fjob%2FRemote%252C-FL%252C-USA%2FSummer-Intern---IT-Remote_R22_0000001795%2Fapply%2FautofillWithResume
        await page.setViewport({
            width: 1280, height: 800,
            deviceScaleFactor: 1,
        });
        //If want to use pre-saved cookies
        if (secrets.check_for_cookie) {
            //Check for Cookies
            const previousSession = fs.existsSync('cookies1.json')
            if (previousSession) {

                console.log('if exist')
                // If file exist load the cookies
                const cookiesString = fs.readFileSync('cookies1.json');
                const parsedCookies = JSON.parse(cookiesString);
                if (parsedCookies.length !== 0) {
                    for (let cookie of parsedCookies) {
                        await page.setCookie(cookie)
                    }
                    console.log('Session has been loaded in the browser')
                    await page.goto(URL, { waitUntil: 'networkidle2' });
                    await upload(page)
                    await my_info(page)
                    await my_experience(page)
                    await application_questions(page)
                    await voluntary_disclosure(page)
                    await self_identity(page)
                }
            }
        }

        await page.goto(URL, { waitUntil: 'networkidle2' });
        //Check if account already exist from "secrets.account_exist"
        if (secrets.account_exist) {
            await sign_in(page)
        }
        else {
            await create_acc(page)
        }
        await sleep_for(page, 1000, 2000);
        await start_your_application(page)
        await sleep_for(page, 1000, 2000);
        await upload(page)
        await my_info(page)
        await my_experience(page)
        await application_questions(page)
        await voluntary_disclosure(page)
        await self_identity(page)

    } catch (e) {
        console.log(e);
    }
}

let main = async () => {
    await main_actual();
}

main(); //bootstrap