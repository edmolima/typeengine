import { execSync } from 'child_process';

try {
  execSync('npx typedoc --options typedoc.json', { stdio: 'inherit' });
  console.log('API documentation generated in docs/api');
} catch (err) {
  console.error('Failed to generate API docs:', err);
  process.exit(1);
}
