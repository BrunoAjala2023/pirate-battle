import {
  test,
  expect,
} from "@playwright/test";

test.describe("Pirate Battle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.locator(".screen"),
    ).toBeVisible({
      timeout: 15000,
    });
  });

  test("abre o menu principal", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", {
        name: "Jogar",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Ranking",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Histórico",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Opções",
      }),
    ).toBeVisible();
  });

  test("abre as opções", async ({
    page,
  }) => {
    await page.getByRole("button", {
      name: "Opções",
    }).click();

    await expect(
      page.getByRole("heading", {
        name: "Opções",
      }),
    ).toBeVisible();

    await expect(
      page.locator("select").first(),
    ).toBeVisible();

    await expect(
      page.locator("select").nth(1),
    ).toBeVisible();
  });

  test("abre o ranking", async ({
    page,
  }) => {
    await page.getByRole("button", {
      name: "Ranking",
    }).click();

    await expect(
      page.getByRole("heading", {
        name: /Ranking/,
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Captain Jack"),
    ).toBeVisible();
  });

  test("abre o histórico", async ({
    page,
  }) => {
    await page.getByRole("button", {
      name: "Histórico",
    }).click();

    await expect(
      page.getByRole("heading", {
        name: /Histórico/,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/1500 pontos/),
    ).toBeVisible();
  });

  test("inicia uma partida", async ({
    page,
  }) => {
    await page.getByRole("button", {
      name: "Jogar",
    }).click();

    await expect(
      page.locator(".hud"),
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(
      page.locator("canvas"),
    ).toBeVisible({
      timeout: 15000,
    });
  });
});