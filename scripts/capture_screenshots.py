import time
import os
from playwright.sync_api import sync_playwright

def capture():
    os.makedirs('Images', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        # 1. Testing Page
        print("Navigating to /testing...")
        page.goto('http://localhost:3000/testing', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='Images/Screenshot_Testing_Dashboard.png')

        # Click 'Run All 36 Test Cases'
        run_btn = page.query_selector('button:has-text("Run All 36 Test Cases")')
        if run_btn:
            print("Executing 36 Automated Test Cases...")
            run_btn.click()
            # Wait for execution of all 36 test cases
            time.sleep(5)
            page.screenshot(path='Images/Screenshot_Test_Runner_Execution_Passed.png')

        # Switch to Live Regex Sandbox tab
        sandbox_tab = page.query_selector('button:has-text("Live Regex Interactive Sandbox")')
        if not sandbox_tab:
            sandbox_tab = page.query_selector('button:has-text("Sandbox")')
        if sandbox_tab:
            print("Opening Live Regex Sandbox...")
            sandbox_tab.click()
            time.sleep(1)
            page.screenshot(path='Images/Screenshot_Live_Regex_Sandbox.png')

        # Switch to Defect Triage Log tab
        defect_tab = page.query_selector('button:has-text("Defect Triage Log")')
        if not defect_tab:
            defect_tab = page.query_selector('button:has-text("Defect")')
        if defect_tab:
            print("Opening Defect Triage Log...")
            defect_tab.click()
            time.sleep(1)
            page.screenshot(path='Images/Screenshot_Defect_Triage_Log.png')

        # 2. Registration Page
        print("Navigating to /register...")
        page.goto('http://localhost:3000/register', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='Images/Screenshot_Registration_Form.png')

        # 3. Prevention Protocols Page
        print("Navigating to /prevention...")
        page.goto('http://localhost:3000/prevention', wait_until='networkidle')
        time.sleep(1)
        page.screenshot(path='Images/Screenshot_Prevention_Protocols.png')

        browser.close()
        print("All screenshots successfully captured!")

if __name__ == '__main__':
    capture()
