// テストの手順フロー

// 【操作と検証すること】
// 登録：登録した英単語が一覧に表示される
// 編集：変更後の日本語訳が表示される
// 学習：英単語と、答えを表示した後の日本語訳が確認できる
// 削除：削除した単語が一覧から消える

import { test, expect } from "@playwright/test";

test('単語の登録・編集・学習・削除が一連の流れで動作する', async ({ page }) => {
    // テストで使う単語
    const word = `e2e-test-${Date.now()}`;
    const originalMeaning = 'テスト用の意味';
    const updatedMeaning = '変更後の意味';
    const example = 'This is an E2E test.';

    // 1. アプリを開く
    await page.goto('http://localhost:5173/');

    // 2.登録フォームを取得
    const registrationForm = page.locator('form').filter({
        has: page.getByRole('heading', { name: '単語を登録', exact: true}),
    })

    // 単語を登録する
    await expect(registrationForm).toHaveCount(1);
    await registrationForm.getByLabel('英単語').fill(word);
    await registrationForm
        .getByRole('textbox', { name: '日本語訳', exact: true})
        .fill(originalMeaning);
    await registrationForm.getByLabel('例文').fill(example);

    // 実際のセレクト欄のラベル・選択肢に合わせて調整する
    await registrationForm.getByLabel('品詞').selectOption('noun');
    await registrationForm.getByLabel('英語のレベル').selectOption('Eiken-3');

    await page.getByRole('button', { name: /Create登録/ }).click();

    // 登録結果を確認する
    const vocabulary = page.locator('article').filter({
        hasText: word,
    });

    await expect(vocabulary).toBeVisible();
    await expect(vocabulary).toContainText(originalMeaning);
    await expect(vocabulary).toContainText(example);

    // 3. 登録した単語を編集する
    await vocabulary.getByRole('button', { name: '編集' }).click();

    const editForm = page.locator('form').filter({
        has: page.getByRole('heading', { name: '単語を編集', exact: true }),
    });
    await expect(editForm).toHaveCount(1);
    await editForm.getByLabel('日本語訳', { exact: true }).fill(updatedMeaning);

    await editForm.getByRole('button', { name: '変更を保存' }).click();

    // 更新後の内容を確認する
    await expect(vocabulary).toContainText(updatedMeaning);
    await expect(vocabulary).not.toContainText(originalMeaning);

    // 4. 学習モードで表示する
    await page.getByRole( 'button', { name: '単語を使った文章を考えてみよう' }).click();

    // 登録した単語が学習画面にあることを確認する
    await expect(page.getByRole('heading', { name: word })).toBeVisible();

    // 答えを表示する
    await page.getByRole('button', { name: '答えを見る' }).click();

    // 編集後の日本語訳が表示されることを確認する
    await expect(page.getByText(updatedMeaning)).toBeVisible();

    // 学習を終了して一覧に戻る
    await page.getByRole('button', { name: '学習を終了して一覧に戻る'}).click();

    // 5. 登録した単語を削除する
    await page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
    });

    await vocabulary.getByRole('button', { name: '削除' }).click();

    // 一覧から消えたことを確認する
    await expect(vocabulary).toHaveCount(0);
});