import { runCLI } from 'jest';
import type { Config } from '@jest/types';

export async function runTests() {
  const projectRoot = process.cwd(); 

  const jestConfig: Config.InitialOptions = {
    testEnvironment: 'node',
    verbose: true,
  };

  const result = await runCLI(
    {
      config: JSON.stringify(jestConfig),
      runInBand: true,
      _: [],          
      $0: 'jest',     
    },
    [projectRoot]
  );

  if (!result.results.success) {
    console.error('Tests failed');
    process.exit(1);
  } else {
    console.log('All tests passed!');
  }
}
