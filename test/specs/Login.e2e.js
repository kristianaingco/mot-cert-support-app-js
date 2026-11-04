const { expect, browser, $ } = require('@wdio/globals');

describe("My Login application", () => {
    it("should login with valid credentials", async () => {
        await browser.url("http://localhost:3000/#/login");
        await $('input[name="email"]').setValue("admin@test.com");
        await $('input[name="password"]').setValue("password123");
        await $("button").click();

        const element = await $(".card-title");
        await expect(element).toHaveText("Projects");
    });
});
