/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Expense App API
 * MVP 用の最小家計簿 API。
認証は JWT（Bearer トークン）方式。

 * OpenAPI spec version: 0.1.2
 */

export type GetTransactionsRecentParams = {
/**
 * 取得件数（最大20件）
 * @minimum 1
 * @maximum 20
 */
limit?: number;
};
