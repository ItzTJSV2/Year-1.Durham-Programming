from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


votes = 1
initTime = time.time()
profile = "/Users/maxtr/Library/Application Support/Firefox/Profiles/777xx6zr.default-release"

options = webdriver.FirefoxOptions()
options.profile = profile
options.set_preference("dom.webdriver.enabled", False)

driver = webdriver.Firefox(options=options)

driver.get("https://www.telegram.com/story/sports/high-school/2024/11/19/vote-for-the-hometeam-football-player-of-the-week/76430731007/")
time.sleep(1.5)

while True:
    element = driver.find_element(By.XPATH, "//h2[@class='gnt_ar_b_h2' and text()='Cast Your Vote']")
    driver.execute_script("arguments[0].scrollIntoView();", element)
    try:
        # Wait for the iframe to load
        iframe = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "iframe"))
        )
        driver.switch_to.frame(iframe)

        radio_button = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((
                By.XPATH, "//form[@id='PDI_form14667318']//input[@id='PDI_answer65155357' and @type='radio']"
            ))
        )
        radio_button.click()

        submitButton = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((
                By.XPATH, "//form[@id='PDI_form14667318']//button[@id='pd-vote-button14667318' and @type='submit']"
            ))
        )
        driver.execute_script("arguments[0].scrollIntoView();", submitButton)
        submitButton.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error! {e}")
        driver.refresh()
    finally:
        print(f"Time elapsed: {time.time() - initTime}s | Vote: {votes}")
        initTime = time.time()
        votes += 1
        driver.refresh()