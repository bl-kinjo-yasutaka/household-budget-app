import { defineConfig } from 'orval';

export default defineConfig({
  householdBudget: {
    input: {
      target: '../household-budget-api/specs/expense-api.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated/householdBudget.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      mock: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});