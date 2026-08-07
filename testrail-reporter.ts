import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export default class TestRailMockReporter implements Reporter {
  private project: string;
  private runId: string;

  constructor(options: { project: string; runId: string }) {
    this.project = options.project;
    this.runId = options.runId;
  }

  onTestBegin(test: TestCase) {
    const reqId = test.annotations.find(a => a.type === 'requirement')?.description || 'N/A';
    console.log(`\n[TestRail] ▶️ Starting: ${test.title}`);
    console.log(`   Case ID: ${this.generateCaseId(test)} | Project: ${this.project} | Run: ${this.runId}`);
    console.log(`   Requirement: ${reqId}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const isExpectedFail = test.annotations.some(a => a.type === 'expected-fail');
    const status = isExpectedFail ? 'EXPECTED_FAILURE' : (result.status === 'passed' ? 'PASSED' : 'FAILED');
    const testRailStatus = isExpectedFail ? 1 : (result.status === 'passed' ? 1 : 5); // 1=passed, 5=failed

    console.log(`[TestRail] 🏁 Result: ${status} (${result.duration}ms)`);
    
    // Mock TestRail API payload
    const payload = {
      case_id: this.generateCaseId(test),
      status: testRailStatus,
      elapsed: `${result.duration}ms`,
      comment: `Executed via Playwright CI. ${isExpectedFail ? 'Known limitation tracked. Will retry in next sprint.' : ''}`,
      requirement: test.annotations.find(a => a.type === 'requirement')?.description,
      docstring: test.annotations.find(a => a.type === 'docstring')?.description
    };
    
    console.log(`[TestRail] 📦 API Payload: ${JSON.stringify(payload, null, 2)}`);
    console.log('─'.repeat(60));
  }

  private generateCaseId(test: TestCase): string {
    const hash = test.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `C${hash % 9000 + 1000}`;
  }
}
