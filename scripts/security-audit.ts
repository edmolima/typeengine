import { execSync } from 'child_process';

export function runSecurityAudit() {
  try {
    // Run npm audit (or pnpm audit)
    const audit = execSync('pnpm audit --json', { encoding: 'utf8' });
    console.log('Dependency audit results:', audit);
  } catch (err) {
    console.error('Security audit failed:', err);
  }

  try {
    // Run static analysis (example: eslint)
    const lint = execSync('pnpm exec eslint src/', { encoding: 'utf8' });
    console.log('Static analysis results:', lint);
  } catch (err) {
    console.error('Static analysis failed:', err);
  }
}
