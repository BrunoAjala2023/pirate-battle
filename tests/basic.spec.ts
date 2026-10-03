import {
  test,
  expect,
} from "@playwright/test";

test.describe(
  "Pirate Battle",
  () => {
    test(
      "abre o menu principal",
      async ({ page }) => {
        await page.goto("/");


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
      },
    );

    test(
      "abre as opções",
      async ({ page }) => {
        await page.goto("/");

        await page.getByRole(
          "button",
          {
            name: "Opções",
          },
        ).click();

        await expect(
          page.getByText(
            "Duração da partida",
          ),
        ).toBeVisible();

        await expect(
          page.getByText(
            "Intervalo de spawn",
          ),
        ).toBeVisible();
      },
    );

    test(
      "abre o ranking",
      async ({ page }) => {
        await page.goto("/");

        await page.getByRole(
          "button",
          {
            name: "Ranking",
          },
        ).click();

        await expect(
          page.getByText("🏆 Ranking"),
        ).toBeVisible();
      },
    );

    test(
      "abre o histórico",
      async ({ page }) => {
        await page.goto("/");

        await page.getByRole(
          "button",
          {
            name: "Histórico",
          },
        ).click();

        await expect(
          page.getByText("📜 Histórico"),
        ).toBeVisible();
      },
    );
  },
);