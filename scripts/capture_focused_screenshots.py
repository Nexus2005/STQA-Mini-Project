import time
import os
from playwright.sync_api import sync_playwright

def capture_focused():
    os.makedirs('Images', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1366, 'height': 820})
        page = context.new_page()

        # 1. Registration form with live checkmarks and password strength
        print("Navigating to /register...")
        page.goto('http://localhost:3000/register', wait_until='networkidle')
        time.sleep(1)
        # Type into inputs
        inputs = page.query_selector_all('input')
        if len(inputs) >= 4:
            inputs[0].fill('Omkar Ahirrao')
            inputs[1].fill('omkar@gmail.com')
            inputs[2].fill('9876543210')
            inputs[3].fill('Omkar@Safe2026')
        time.sleep(1)
        page.screenshot(path='Images/Screenshot_Registration_Form.png')
        print("Saved Screenshot_Registration_Form.png")

        # 2. Testing page - run all test cases
        print("Navigating to /testing...")
        page.goto('http://localhost:3000/testing', wait_until='networkidle')
        time.sleep(1)
        run_btn = page.query_selector('button:has-text("Run All 36 Test Cases")')
        if run_btn:
            run_btn.click()
            time.sleep(4)
        page.screenshot(path='Images/Screenshot_Test_Runner_Execution_Passed.png')
        print("Saved Screenshot_Test_Runner_Execution_Passed.png")

        # 3. Regex Sandbox tab - scroll down so the sandbox card fills the screen!
        sandbox_btn = page.query_selector('button:has-text("Live Regex Interactive Sandbox")')
        if not sandbox_btn:
            sandbox_btn = page.query_selector('button:has-text("Sandbox")')
        if sandbox_btn:
            sandbox_btn.click()
            time.sleep(1)
            page.evaluate("window.scrollTo(0, 310)")
            time.sleep(1)
            page.screenshot(path='Images/Screenshot_Live_Regex_Sandbox.png')
            print("Saved Screenshot_Live_Regex_Sandbox.png (scrolled to sandbox view)")

        # 4. Defect Log tab - scroll down so the bug reports fill the screen!
        defect_btn = page.query_selector('button:has-text("Defect Triage Log")')
        if not defect_btn:
            defect_btn = page.query_selector('button:has-text("Defect")')
        if defect_btn:
            defect_btn.click()
            time.sleep(1)
            page.evaluate("window.scrollTo(0, 310)")
            time.sleep(1)
            page.screenshot(path='Images/Screenshot_Defect_Triage_Log.png')
            print("Saved Screenshot_Defect_Triage_Log.png (scrolled to defect cards view)")

        browser.close()
        print("All focused screenshots captured successfully!")

if __name__ == '__main__':
    capture_focused()
