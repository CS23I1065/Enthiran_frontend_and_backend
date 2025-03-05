from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options  # Import Options for headless mode
import time
import json

# Configure Chrome to run in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in background
chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
chrome_options.add_argument("--window-size=1920,1080")  # Set window size

# Initialize WebDriver with headless options
driver = webdriver.Chrome(options=chrome_options)
driver.get("https://myscheme.gov.in/search")

# List to store all scraped schemes
schemes_data = []

# Function to scrape schemes from a single page
def scrape_schemes():
    scheme_elements = driver.find_elements(By.CLASS_NAME, "mx-auto")
    print(f"Found {len(scheme_elements)} schemes on this page.")

    for item in scheme_elements:
        try:
            # Extract scheme name
            name = item.find_element(By.CSS_SELECTOR, "h2 a").text  # Updated selector
            link = item.find_element(By.CSS_SELECTOR, "h2 a").get_attribute("href")

            # Extract scheme description
            description = item.find_element(By.CSS_SELECTOR, "span.text-\\[\\#24262B\\]").text

            # Store the data in a dictionary
            scheme = {
                "name": name,
                "link": link,
                "description": description
            }
            schemes_data.append(scheme)

            print(f"Name: {name}")
            print(f"Link: {link}")
            print(f"Description: {description}")
            print("-" * 50)

        except Exception as e:
            print(f"Skipping item due to error: {e}")

# Scrape the first page
scrape_schemes()

# Handle pagination (limit to 10 pages)
page_count = 1
while page_count < 10:  # Limit to 10 pages
    try:
        # Wait for the "Next" button to be clickable
        next_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "svg.ml-2.text-darkblue-900.cursor-pointer"))
        )
        
        # Scroll into view
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", next_button)
        
        # Add a small delay to ensure the button is ready to be clicked
        time.sleep(1)
        
        # Click the "Next" button using ActionChains to avoid interception
        ActionChains(driver).move_to_element(next_button).click().perform()

        # Wait for the next page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "mx-auto"))
        )

        # Scrape the next page
        scrape_schemes()

        # Increment page count
        page_count += 1

    except Exception as e:
        print("No more pages or error clicking the next button:", e)
        break

# Save the scraped data to a JSON file
with open("schemes.json", "w", encoding="utf-8") as f:
    json.dump(schemes_data, f, indent=4, ensure_ascii=False)

print("Data saved to schemes.json")

driver.quit()