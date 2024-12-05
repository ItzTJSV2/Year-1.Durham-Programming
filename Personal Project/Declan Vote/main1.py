import threading
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

votes = 1
differenceVotes = -1
profile = "/Users/maxtr/Library/Application Support/Firefox/Profiles/777xx6zr.default-release"
thread_count = 0
pause = False
shutdown = False 
lock = threading.Condition()


def check_difference():
    global differenceVotes
    options = webdriver.FirefoxOptions()
    options.profile = profile
    options.set_preference("dom.webdriver.enabled", False)

    driver = webdriver.Firefox(options=options)
    driver.get("https://www.telegram.com/story/sports/high-school/2024/11/19/vote-for-the-hometeam-football-player-of-the-week/76430731007/")
    time.sleep(1.5)
    try:
        element = driver.find_element(By.XPATH, "//h2[@class='gnt_ar_b_h2' and text()='Cast Your Vote']")
        driver.execute_script("arguments[0].scrollIntoView();", element)
        # Wait for iframe
        iframe = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.TAG_NAME, "iframe"))
        )
        driver.switch_to.frame(iframe)
        viewResults = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((
                By.XPATH, "//form[@id='PDI_form14667318']//a[@class='css-view-results pds-view-results' and text()='View Results']"
            ))
        )
        viewResults.click()
        time.sleep(2)
        allVotes = driver.find_elements(By.CLASS_NAME, "pds-feedback-votes")
        differenceVotes = int(''.join(x for x in allVotes[0].get_attribute('innerHTML') if x.isdigit())) - int(''.join(y for y in allVotes[1].get_attribute('innerHTML') if y.isdigit()))
    except Exception as e:
        print(f"Checking error: {e}")
        driver.quit()
        check_difference()
    finally:
        print(f"Checked Difference: {differenceVotes}")
        driver.quit()
        if differenceVotes < 6000:
            return
        check_difference()
        
def vote_process(thread_id):
    global votes, differenceVotes, pause

    initTime = time.time()
    options = webdriver.FirefoxOptions()
    options.profile = profile
    options.set_preference("dom.webdriver.enabled", False)

    driver = webdriver.Firefox(options=options)
    driver.get("https://www.telegram.com/story/sports/high-school/2024/11/19/vote-for-the-hometeam-football-player-of-the-week/76430731007/")
    time.sleep(1.5)

    try:
        while True:
            # Pause logic
            with lock:
                if shutdown:
                    print(f"Thread {thread_id + 1} - Exiting due to shutdown.")
                    break
                while pause:
                    print(f"Thread {thread_id + 1} - Paused.")
                    lock.wait()  # Wait until notified to resume

            try:
                element = driver.find_element(By.XPATH, "//h2[@class='gnt_ar_b_h2' and text()='Cast Your Vote']")
                driver.execute_script("arguments[0].scrollIntoView();", element)

                # Wait for iframe
                iframe = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "iframe"))
                )
                driver.switch_to.frame(iframe)

                # For Declan
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

                allVotes = driver.find_elements(By.CLASS_NAME, "pds-feedback-votes")
                with lock:
                    differenceVotes = int(''.join(x for x in allVotes[0].get_attribute('innerHTML') if x.isdigit())) - int(''.join(y for y in allVotes[1].get_attribute('innerHTML') if y.isdigit()))

            except Exception as e:
                print(f"Thread {thread_id + 1} - Error! {e}")
                driver.refresh()
            finally:
                print(f"Thread {thread_id + 1} - Time elapsed: {time.time() - initTime}s | Vote: {votes} | Difference: {differenceVotes}")
                initTime = time.time()
                with lock:
                    votes += 1
                driver.refresh()

    finally:
        driver.quit()


def monitor_threads():
    global pause, differenceVotes
    while True:
        try:
            with lock:
                if shutdown:
                    print("Monitor thread exiting due to shutdown.")
                    break

                # Adjust pause based on differenceVotes
                elif differenceVotes > 8000:
                    print("Pausing threads due to high differenceVotes.")
                    pause = True
                    check_difference()
                elif differenceVotes < 6000:
                    print("Resuming threads due to low differenceVotes.")
                    pause = False
                    lock.notify_all()  # Notify all threads to resume

            time.sleep(5)  # Monitor interval
        except Exception as e:
            print("Anyways.")


if __name__ == "__main__":
    try:
        monitor_thread = threading.Thread(target=monitor_threads)
        monitor_thread.start()

        threads = []
        for i in range(5):
            t = threading.Thread(target=vote_process, args=(i,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

    except KeyboardInterrupt:
        print("Shutting down...")
        with lock:
            shutdown = True
            pause = False  # Resume all threads to ensure clean exit
            lock.notify_all()  # Notify threads to stop waiting

        # Wait for monitor thread to finish
        monitor_thread.join()

        print("All threads finished. Exiting.")
