import puppeteer, { customQueryHandlerNames, ElementHandle } from 'puppeteer'
import * as secrets from './secrets'
//import { username, password, resume, first_name } from './secrets'

const randomIntFromInterval = (min: number, max: number) => { // min inclusive and max exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

let sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
    let sleep_duration = randomIntFromInterval(min, max);
    console.log('waiting for', sleep_duration / 1000, 'seconds');
    await page.waitForTimeout(sleep_duration);// simulate some quasi human behaviour
}

// let authenticate = async (page: puppeteer.Page) => { ////To Create Account
//     // $x('//input[@data-automation-id="email"]')
//     try {
//         // const username_inputs = await page.$x('//input[@data-automation-id="email"]')
//         // if (username_inputs.length > 0) {
//         //     await username_inputs[0].focus();
//         //     await page.keyboard.type(username);
//         // }
//         await page.click('button[data-automation-id="createAccountLink"]')
//         //await page.waitForNavigation({ waitUntil: 'networkidle2' })
//         await sleep_for(page, 1000, 2000)
//         await page.type('#input-10', username, { delay: 50 })
//         await page.type('#input-11', password, { delay: 50 })
//         await page.type('#input-12', password, { delay: 50 })
//         await page.click('#input-14', { clickCount: 1 })
//         await page.click('button[data-automation-id="createAccountSubmitButton"]')

//     }

//     catch (e) {
//         console.log("Error in Auth:", e);
//     }
// }

let sign_in = async (page: puppeteer.Page) => { //To Upload Resume
    try {
        await page.type('#input-6', secrets.username)
        await sleep_for(page, 1000, 1500);
        await page.type('#input-7', secrets.password)
        await sleep_for(page, 1000, 1500);
        await page.click('button[data-automation-id="signInSubmitButton"]')
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
    } catch (e) {
        console.log("Error in sign_in:", e)
    }
}

let upload = async (page: puppeteer.Page) => { //To Upload Resume
    try {
        await page.click('.css-8puu83')
        await sleep_for(page, 1000, 1500);
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#input-1'), // some button that triggers file selection
        ])
        await fileChooser.accept([secrets.resume]);
        await sleep_for(page, 1000, 1500);
        await page.click('button[data-automation-id="bottom-navigation-next-button"]')
        await page.waitForNavigation({ waitUntil: 'load' })
        await sleep_for(page, 1000, 1500);
    } catch (e) {
        console.log("Error in Upload:", e);
    }
}

let my_info = async (page: puppeteer.Page) => { //To Fill in "My Information" Page
    try {
        await page.waitForSelector('#input-2')
        // const employed_before = `//div[@data-automation-id="previousWorker"]/div[2]/div`
        // await page.waitForSelector(employed_before)
        // await page.click(employed_before)

        //Select "No" for "Have you been employed before"
        const employed_before = await page.$x(`//div[@data-automation-id="previousWorker"]/div[2]/div`)
        //Select "Country"
        const country_drop = await page.$x(`//button[@data-automation-id="countryDropdown"]`)
        //Select "United States"
        // const united_states = await page.$x(`//li[@data-value="bc33aa3152ec42d4995f4791a106ed09"]`)
        //Change to correct "First Name"
        // const f_name = await page.$x(`//input[@data-automation-id="legalNameSection_firstName"]`)
        //Select "No" for "Have you been employed before"
        await employed_before[0].click()
        await sleep_for(page, 200, 300)
        //Select "Country"
        // await country_drop[0].focus(),
        await country_drop[0].click()
        const united_states = await page.$x(`//li[@data-value="bc33aa3152ec42d4995f4791a106ed09"]`)
        await page.waitForXPath(`//li[@data-value="bc33aa3152ec42d4995f4791a106ed09"]`, { timeout: 0 })
        //Select "United States"
        await united_states[0].click()
        await sleep_for(page, 500, 700);
        //Select "First Name"
        // await page.waitForXPath(`//input[@data-automation-id="legalNameSection_firstName"]`, { timeout: 0 })
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
        await page.waitForXPath(`//li[@data-value="14f21822595001311f1e0d69cc00640b"]`, { timeout: 0 })
        await sleep_for(page, 100, 200)
        const personal_cell = await page.$x(`//li[@data-value="14f21822595001311f1e0d69cc00640b"]`)
        await personal_cell[0].click()
        //Select "Phone Number"
        const phone_number = await page.$x(`//input[@data-automation-id="phone-number"]`)
        await phone_number[0].focus()
        await page.keyboard.down('ControlLeft')
        await page.keyboard.press('a')
        await page.keyboard.up('ControlLeft')
        await phone_number[0].press('Backspace')
        await phone_number[0].type(secrets.phone_number)


    } catch (e) {
        console.log("Error in 'My Information' page:", e);
    }
}

let my_experience = async (page: puppeteer.Page) => { //To Fill in "My Information" Page
    try {
        //Wait till user checks finish
        await page.waitForXPath(`//input[@data-automation-id="company"]`, { timeout: 0 })
        const job_title = await page.$x(`//input[@data-automation-id="jobTitle"]`)
        //job_title[0] is "Job Title" in "Work Experience 1"; job_title[1] is "Job Title" in "Work Experience 2" and so on...
        const company = await page.$x(`//input[@data-automation-id="company"]`)
        //company[0] is "Company" in "Work Experience 1"; company[1] is "Company" in "Work Experience 2" and so on...
        const job_location = await page.$x(`//input[@data-automation-id="location"]`)
        //job_location[0] is "Location" in "Work Experience 1"; job_location[1] is "Location" in "Work Experience 2" and so on...
        const date = await page.$x(`//div[@data-automation-id="spinnerDisplay"]`)
        //date[0] is "From: Month" in "Work Experience 1", date[1] is "From: Year" in "Work Experience 1"
        //date[2] is "To: Month" in "Work Experience 1", date[3] is "To: Year" in "Work Experience 1";
        //date[3] is "From: Month" in "Work Experience 2", date[4] is "From: Year" in "Work Experience 2"
        //date[5] is "To: Month" in "Work Experience 2", job_date[6] is "To: Year" in "Work Experience 2" and so on...
        //date[16] is "From: Year" in "Education 1", date[17] is "To: Year" in "Education 1", 
        const role_description = await page.$x(`//textarea[@data-automation-id="description"]`)
        //role_description[0] is "Role Description" in "Work Experience 1"; role_description[1] is "Role Description" in "Work Experience 2" and so on...
        const university = await page.$x(`//input[@data-automation-id="school"]`)
        //university[0] is "School or University" in "Education 1"
        // const language_section = await page.$x(`(//button[@data-automation-id="language"])[1]`)
        // //language_section[0] is "Language" in "Language 1"
        // const language_chinese = await page.$x(`//li[@data-value="14f218225950012888eb4c6acc00d90d"]`)
        // //language_chinese[0] is "Chinese" in "Language -dropdown"
        // const native_language_check = await page.$x(`//input[@data-automation-id="nativeLanguage"]`)
        // //native_language_check[0] is checkbox for "This is my native language"
        // const language_comprehension_1 = await page.$x(`//button[@data-automation-id="languageProficiency-0"]`)
        // //language_comprehension_1[0] is "Comprehension" dropdown menu in "Language 1"
        // const language_comprehension_fluent_1 = await page.$x(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`)
        // //language_comprehension_fluent_1[0] is "Fluent" in "Comprehension -dropdown" in "Language 1"
        // const language_overall_1 = await page.$x(`//button[@data-automation-id="languageProficiency-1"]`)
        // //language_overall_1[0] is "Overall" dropdown menu in "Language 1"
        // const language_reading_1 = await page.$x(`//button[@data-automation-id="languageProficiency-2"]`)
        // //language_reading_1[0] is "Reading" dropdown menu in "Language 1"
        // const language_speaking_1 = await page.$x(`//button[@data-automation-id="languageProficiency-3"]`)
        // //language_speaking_1[0] is "Speaking" dropdown menu in "Language 1"
        // const language_writing_1 = await page.$x(`//button[@data-automation-id="languageProficiency-4"]`)
        // //language_writing_1[0] is "Writing" dropdown menu in "Language 1"
        // const add_another_language = await page.$x(`//button[@aria-label="Add Another Languages"]`)
        // //add_another_language[0] is "Add Another" in "Language"
        // const language_section_2 = await page.$x(`(//button[@data-automation-id="language"])[2]`)
        // //language_section[0] is "Language" in "Language 2"
        // const language_english = await page.$x(`//li[@data-value="14f21822595001ce3bfa5d6acc000a0e"]`)
        // //language_english[0] is "English" in "Language -dropdown"

        // // "Language" in "Language 1"
        //await page.waitForXPath(`//button[@data-automation-id="language"]`, { timeout: 0 })
        //await language_section[0].focus()
        //await language_section[0].click().
        // // "Chinese" in "Language" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f218225950012888eb4c6acc00d90d"]`, { timeout: 0 })
        //await language_chinese[0].click()
        // // "This is my native language" checkbox in "Language 1"
        //await native_language_check[0].click()
        // // "Comprehension" in "Language 1"
        //await language_comprehension_1[0].focus()
        //await language_comprehension_1[0].click()
        // // "Fluent" in "Comprehension" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Overall" in "Language 1"
        //await language_overall_1[0].focus()
        //await language_overall_1[0].click()
        // // "Fluent" in "Overall" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Reading" in "Language 1"
        //await language_reading_1[0].focus()
        //await language_reading_1[0].click()
        // // "Fluent" in "Reading" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Speaking" in "Language 1"
        //await language_speaking_1[0].focus()
        //await language_speaking_1[0].click()
        // // "Fluent" in "Speaking" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Writing" in "Language 1"
        //await language_writing_1[0].focus()
        //await language_writing_1[0].click()
        // // "Fluent" in "Writing" in "Language 1"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Add another" language in "Language"
        //await add_another_language[0].click()
        // // "Language" in "Language 2"
        //await page.waitForXPath(`(//button[@data-automation-id="language"])[2]`, { timeout: 0 })
        //await language_section_2[0].focus()
        //await language_section_2[0].click()
        // // "English" in "Language" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f21822595001ce3bfa5d6acc000a0e"]`, { timeout: 0 })
        //await language_english[0].click()
        // // "Comprehension" in "Language 2"
        //await language_comprehension_1[1].focus()
        //await language_comprehension_1[1].click()
        // // "Fluent" in "Comprehension" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Overall" in "Language 2"
        //await language_overall_1[1].focus()
        //await language_overall_1[1].click()
        // // "Fluent" in "Overall" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Reading" in "Language 2"
        //await language_reading_1[1].focus()
        //await language_reading_1[1].click()
        // // "Fluent" in "Reading" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Speaking" in "Language 2"
        //await language_speaking_1[1].focus()
        //await language_speaking_1[1].click()
        // // "Fluent" in "Speaking" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()
        // // "Writing" in "Language 2"
        //await language_writing_1[1].focus()
        //await language_writing_1[1].click()
        // // "Fluent" in "Writing" in "Language 2"
        //await page.waitForXPath(`//li[@data-value="14f2182259500125f6ee6169cc00c30b"]`, { timeout: 0 })
        //await language_comprehension_fluent_1[0].click()

        await Promise.all([
            //"Job Title" in "Work Experience 1"
            // await job_title[0].focus(),
            // await job_title[0].click({ clickCount: 1 }),
            // await page.evaluate( () => document.( 'selectall', false, null ) ),
            // await page.keyboard.down('ControlLeft'),
            // await page.keyboard.down('a'),
            // await job_title[0].press('a'),
            // await job_title[0].press('KeyA'),
            // await page.keyboard.down('Control'),
            // await page.keyboard.down('a'),
            // await page.keyboard.press('Backspace'),
            // await page.keyboard.up('Control'),
            // await page.keyboard.up('a'),
            await job_title[0].click({ clickCount: 4 }),
            // await job_title[0].press('Home')
            // await page.keyboard.down('Shift')
            // await job_title[0].press('End')
            // await page.keyboard.up('Shift')
            await job_title[0].press('Backspace'),
            await job_title[0].type(secrets.job_title1),
            //"Company" in "Work Experience 1"
            await company[0].focus(),
            await company[0].click({ clickCount: 4 }),
            await company[0].press('Backspace'),
            await company[0].type(secrets.company_name1),
            //"Location" in "Work Experience 1"
            await job_location[0].focus(),
            await job_location[0].click({ clickCount: 4 }),
            await job_location[0].press('Backspace'),
            await job_location[0].type(secrets.company_location1),
            //"From: Month" in "Work Experience 1"
            await date[0].focus(),
            await date[0].click({ clickCount: 1 }),
            await date[0].press('Backspace'),
            await date[0].type(secrets.work_from_month1),
            //"From: Year" in "Work Experience 1"
            await date[1].focus(),
            await date[1].click({ clickCount: 1 }),
            await date[1].press('Backspace'),
            await date[1].type(secrets.work_from_year1),
            //"To: Month" in "Work Experience 1"
            await date[2].focus(),
            await date[2].click({ clickCount: 1 }),
            await date[2].press('Backspace'),
            await date[2].type(secrets.work_till_month1),
            //"From: Year" in "Work Experience 1"
            await date[3].focus(),
            await date[3].click({ clickCount: 1 }),
            await date[3].press('Backspace'),
            await date[3].type(secrets.work_till_year1),
            //"Role Description" in "Work Experience 1"
            await role_description[0].focus(),
            await page.keyboard.down('ControlLeft'),
            await page.keyboard.press('a'),
            await page.keyboard.up('ControlLeft'),
            await role_description[0].press('Backspace'),
            await role_description[0].type(secrets.work_description1),

            //"Job Title" in "Work Experience 2"
            await job_title[1].focus(),
            await job_title[1].click({ clickCount: 4 }),
            await job_title[1].press('Backspace'),
            await job_title[1].type(secrets.job_title2),
            //"Company" in "Work Experience 2"
            await company[1].focus(),
            await company[1].click({ clickCount: 4 }),
            await company[1].press('Backspace'),
            await company[1].type(secrets.company_name2),
            //"Location" in "Work Experience 2"
            await job_location[1].focus(),
            await job_location[1].click({ clickCount: 4 }),
            await job_location[1].press('Backspace'),
            await job_location[1].type(secrets.company_location2),
            //"From: Month" in "Work Experience 2"
            await date[4].focus(),
            await date[4].click({ clickCount: 1 }),
            await date[4].press('Backspace'),
            await date[4].type(secrets.work_from_month2),
            //"From: Year" in "Work Experience 2"
            await date[5].focus(),
            await date[5].click({ clickCount: 1 }),
            await date[5].press('Backspace'),
            await date[5].type(secrets.work_from_year2),
            //"To: Month" in "Work Experience 2"
            await date[6].focus(),
            await date[6].click({ clickCount: 1 }),
            await date[6].press('Backspace'),
            await date[6].type(secrets.work_till_month2),
            //"From: Year" in "Work Experience 2"
            await date[7].focus(),
            await date[7].click({ clickCount: 1 }),
            await date[7].press('Backspace'),
            await date[7].type(secrets.work_till_year2),
            //"Role Description" in "Work Experience 2"
            await role_description[1].focus(),
            await page.keyboard.down('ControlLeft'),
            await page.keyboard.press('a'),
            await page.keyboard.up('ControlLeft'),
            await role_description[1].press('Backspace'),
            await role_description[1].type(secrets.work_description2),

            //"Job Title" in "Work Experience 3"
            await job_title[2].focus(),
            await job_title[2].click({ clickCount: 4 }),
            await job_title[2].press('Backspace'),
            await job_title[2].type(secrets.job_title3),
            //"Company" in "Work Experience 3"
            await company[2].focus(),
            await company[2].click({ clickCount: 4 }),
            await company[2].press('Backspace'),
            await company[2].type(secrets.company_name3),
            //"Location" in "Work Experience 3"
            await job_location[2].focus(),
            await job_location[2].click({ clickCount: 4 }),
            await job_location[2].press('Backspace'),
            await job_location[2].type(secrets.company_location3),
            //"From: Month" in "Work Experience 3"
            await date[8].focus(),
            await date[8].click({ clickCount: 1 }),
            await date[8].press('Backspace'),
            await date[8].type(secrets.work_from_month3),
            //"From: Year" in "Work Experience 3"
            await date[9].focus(),
            await date[9].click({ clickCount: 1 }),
            await date[9].press('Backspace'),
            await date[9].type(secrets.work_from_year3),
            //"To: Month" in "Work Experience 3"
            await date[10].focus(),
            await date[10].click({ clickCount: 1 }),
            await date[10].press('Backspace'),
            await date[10].type(secrets.work_till_month3),
            //"To: Year" in "Work Experience 3"
            await date[11].focus(),
            await date[11].click({ clickCount: 1 }),
            await date[11].press('Backspace'),
            await date[11].type(secrets.work_till_year3),
            //"Role Description" in "Work Experience 3"
            await role_description[2].focus(),
            await page.keyboard.down('ControlLeft'),
            await page.keyboard.press('a'),
            await page.keyboard.up('ControlLeft'),
            await role_description[2].press('Backspace'),
            await role_description[2].type(secrets.work_description3),

            //"Job Title" in "Work Experience 4"
            await job_title[3].focus(),
            await job_title[3].click({ clickCount: 4 }),
            await job_title[3].press('Backspace'),
            await job_title[3].type(secrets.job_title4),
            //"Company" in "Work Experience 4"
            await company[3].focus(),
            await company[3].click({ clickCount: 4 }),
            await company[3].press('Backspace'),
            await company[3].type(secrets.company_name4),
            //"Location" in "Work Experience 4"
            await job_location[3].focus(),
            await job_location[3].click({ clickCount: 4 }),
            await job_location[3].press('Backspace'),
            await job_location[3].type(secrets.company_location4),
            //"From: Month" in "Work Experience 4"
            await date[12].focus(),
            await date[12].click({ clickCount: 1 }),
            await date[12].press('Backspace'),
            await date[12].type(secrets.work_from_month4),
            //"From: Year" in "Work Experience 4"
            await date[13].focus(),
            await date[13].click({ clickCount: 1 }),
            await date[13].press('Backspace'),
            await date[13].type(secrets.work_from_year4),
            //"To: Month" in "Work Experience 4"
            await date[14].focus(),
            await date[14].click({ clickCount: 1 }),
            await date[14].press('Backspace'),
            await date[14].type(secrets.work_till_month4),
            //"From: Year" in "Work Experience 4"
            await date[15].focus(),
            await date[15].click({ clickCount: 1 }),
            await date[15].press('Backspace'),
            await date[15].type(secrets.work_till_year4),
            //"Role Description" in "Work Experience 4"
            await role_description[3].focus(),
            await page.keyboard.down('ControlLeft'),
            await page.keyboard.press('a'),
            await page.keyboard.up('ControlLeft'),
            await role_description[3].press('Backspace'),
            await role_description[3].type(secrets.work_description4),

            //"School or University" in "Education 1"
            await university[0].focus(),
            await university[0].click({ clickCount: 4 }),
            await university[0].press('Backspace'),
            await university[0].type(secrets.university_name),
            //"From: Year" in "Education 1"
            await date[16].focus(),
            await date[16].click({ clickCount: 4 }),
            await date[16].press('Backspace'),
            await date[16].type(secrets.university_from_year),
            //"To: Year" in "Education 1"
            await date[17].focus(),
            await date[17].click({ clickCount: 4 }),
            await date[17].press('Backspace'),
            await date[17].type(secrets.university_till_year),
        ])
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
        await linked_in_url[0].focus()
        await linked_in_url[0].click({ clickCount: 4 })
        await linked_in_url[0].press('Backspace')
        await linked_in_url[0].type(secrets.linked_in_profile)

        //Go to "Skills" to do it manually
        const add_skills = await page.$x(`//ul[@data-automation-id="selectedItemList"]`)
        await add_skills[1].focus()


    } catch (e) {
        console.log("Error in 'My Experience' page:", e);
    }
}

let application_questions = async (page: puppeteer.Page) => {
    try {
        //Select "What are your salary expectation"
        await page.waitForXPath(`//input[@data-automation-id="500f494a214d01376a4367d6fc01f245"]`, { timeout: 0 })
        const salary_expectation = await page.$x(`//input[@data-automation-id="500f494a214d01376a4367d6fc01f245"]`)
        await salary_expectation[0].focus()
        await salary_expectation[0].click({ clickCount: 4 })
        await salary_expectation[0].press('Backspace')
        await salary_expectation[0].type(secrets.salary_expectation)

        //Select "Are you related to...."
        const related_to = await page.$x(`//button[@data-automation-id="500f494a214d013de54967d6fc01f345"]`)
        await related_to[0].focus()
        await related_to[0].click()
        //Choose "No"
        await page.waitForXPath(`//li[@data-value="14f218225950013b235b6a21ac0151f0"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const no_answer_1 = await page.$x(`//li[@data-value="14f218225950013b235b6a21ac0151f0"]`)
        await no_answer_1[0].click()
        await sleep_for(page, 400, 500)
        //Select "Will you now or in the future require sponsorship..."
        const require_sponsorship = await page.$x(`//button[@data-automation-id="500f494a214d018d598e67d6fc01f745"]`)
        await require_sponsorship[0].focus()
        await require_sponsorship[0].click()
        //Choose "Yes"
        await page.waitForXPath(`//li[@data-value="14f218225950014ce9c55f21ac01ecef"]`, { timeout: 0 })
        const yes_answer_1 = await page.$x(`//li[@data-value="14f218225950014ce9c55f21ac01ecef"]`)
        await yes_answer_1[0].click()
        await sleep_for(page, 400, 500)
        //Select "Are you now, or willing to become, fully vaccinated against COVID-19?..."
        const vaccinated = await page.$x(`//button[@data-automation-id="61332d9243d501a94a29fbeffc014944"]`)
        await vaccinated[0].focus()
        await vaccinated[0].click()
        //Choose "Yes"
        await page.waitForXPath(`//li[@data-value="61332d9243d50145dca47bedfc014544"]`, { timeout: 0 })
        const yes_answer_2 = await page.$x(`//li[@data-value="61332d9243d50145dca47bedfc014544"]`)
        await yes_answer_2[0].click()
        await sleep_for(page, 400, 500)
        //Select "Are you willing and able to travel out of town or over night for this position as necessary?"
        const willing_travel = await page.$x(`//button[@data-automation-id="500f494a214d0122869e67d6fc01fa45"]`)
        await willing_travel[0].focus()
        await willing_travel[0].click()
        //Choose "Yes"
        await page.waitForXPath(`//li[@data-value="14f218225950014071b76621ac0130f0"]`, { timeout: 0 })
        const yes_answer_3 = await page.$x(`//li[@data-value="14f218225950014071b76621ac0130f0"]`)
        await yes_answer_3[0].click()
        await sleep_for(page, 400, 500)


    } catch (e) {
        console.log("Error in 'Application Questions' page:", e);
    }
}

let voluntary_disclosure = async (page: puppeteer.Page) => {
    try {
        //Select "Gender"
        await page.waitForXPath(`//button[@data-automation-id="gender"]`, { timeout: 0 })
        const gender = await page.$x(`//button[@data-automation-id="gender"]`)
        await gender[0].focus()
        await gender[0].click()
        //Choose "Male"
        await page.waitForXPath(`//li[@data-value="14f21822595001ab3cb24369cc009e0b"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const male = await page.$x(`//li[@data-value="14f21822595001ab3cb24369cc009e0b"]`)
        await male[0].click()
        await sleep_for(page, 400, 500)
        //Select "Hispanic or Latino?"
        const his_or_lat = await page.$x(`//button[@data-automation-id="hispanicOrLatino"]`)
        await his_or_lat[0].focus()
        await his_or_lat[0].click()
        //Choose "No"
        await page.waitForXPath(`//li[@data-value="2"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const voluntary_no_answer_1 = await page.$x(`//li[@data-value="2"]`)
        await voluntary_no_answer_1[0].click()
        //Select "Race/Ethnicity"
        await page.waitForXPath(`//button[@data-automation-id="ethnicityDropdown"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const race_ethnicity = await page.$x(`//button[@data-automation-id="ethnicityDropdown"]`)
        await race_ethnicity[0].focus()
        await race_ethnicity[0].click()
        await sleep_for(page, 400, 500)
        //Choose "Asian"
        await page.waitForXPath(`//li[@data-value="14f21822595001871e9b7169cc00d40b"]`, { timeout: 0 })
        await sleep_for(page, 400, 500)
        const asian = await page.$x(`//li[@data-value="14f21822595001871e9b7169cc00d40b"]`)
        await asian[0].click()
        await sleep_for(page, 400, 500)
        //Select "Veteran Status"
        const veteran_status = await page.$x(`//button[@data-automation-id="veteranStatus"]`)
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
        //Select "Agree to terms and conditions" checkbox
        //const yes = await page.waitForXPath(".btn-yes:not([disabled])");
        let terms_and_conditions = await page.$x(`//input[@data-automation-id="agreementCheckbox"][@aria-checked="false"]`)
        if (terms_and_conditions.length > 0) {
            await terms_and_conditions[0].focus()
            await terms_and_conditions[0].click()
        }

        // for (const terms_and_conditions of await page.$x(`//input[@data-automation-id="agreementCheckbox"]`)) {
        //     if (!await terms_and_conditions.evaluate(aria => aria.(":true")) {
        //         await terms_and_conditions.click();
        //     }
        // }


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
    } catch (e) {
        console.log("Error in 'Self Identity' page:", e);
    }
}

let main_actual = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
        const page = await browser.newPage();

        const URL = 'https://collegeboard.wd1.myworkdayjobs.com/en-US/Careers/login?redirect=%2Fen-US%2FCareers%2Fjob%2FNew-York%252C-NY%2FTechnical-Support-Specialist---Pre-AP-Programs_REQ000647%2Fapply%2FautofillWithResume%3Fsource%3DLinkedIn'
        //https://sleepnumber.wd5.myworkdayjobs.com/sleepnumber/login?redirect=%2Fsleepnumber%2Fjob%2FMinneapolis-MN%2FDigital-Marketing-Software-Engineer_R13861%2Fapply%3Futm_campaign%3Dcorporate_fy22%26utm_medium%3Djobad%26utm_content%3Dpj_board%26utm_source%3Djobadx%26p_uid%3DHDIerdTm1J%26p_sid%3Dh15W7Ib%26ss%3Dpaid%26source%3DProgrammatic_Paid
        //https://bbinsurance.wd1.myworkdayjobs.com/en-US/Careers/login?redirect=%2Fen-US%2FCareers%2Fjob%2FRemote%252C-FL%252C-USA%2FSummer-Intern---IT-Remote_R22_0000001795%2Fapply%2FautofillWithResume
        await page.setViewport({
            width: 1280, height: 800,
            deviceScaleFactor: 1,
        });
        await page.goto(URL, { waitUntil: 'networkidle2' });
        await sleep_for(page, 1000, 2000);
        //await authenticate(page)
        await sign_in(page)
        //await upload(page)
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