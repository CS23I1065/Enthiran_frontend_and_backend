# schemes/scraper.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import logging
from sklearn.metrics.pairwise import cosine_similarity

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize models
kw_model = KeyBERT(SentenceTransformer("all-MiniLM-L6-v2"))
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_keywords(sentence):
    """Extracts meaningful keywords while maintaining query context"""
    # Extract keywords with different n-gram ranges to capture both terms and phrases
    keywords_single = kw_model.extract_keywords(
        sentence,
        keyphrase_ngram_range=(1, 1),
        use_mmr=True,
        diversity=0.7,
        top_n=3
    )
    
    keywords_phrases = kw_model.extract_keywords(
        sentence,
        keyphrase_ngram_range=(2, 3),
        use_mmr=True,
        diversity=0.7,
        top_n=2
    )
    
    # Combine single terms and phrases while maintaining original query context
    all_keywords = [kw[0] for kw in keywords_single + keywords_phrases]
    search_terms = list(dict.fromkeys([sentence] + all_keywords))  # Remove duplicates while keeping order
    
    return " ".join(search_terms)

def calculate_relevance(scheme_text, query, model):
    """Calculate semantic similarity between scheme and query"""
    # Encode texts
    query_embedding = model.encode([query])
    scheme_embedding = model.encode([scheme_text])
    
    # Calculate cosine similarity
    similarity = cosine_similarity(query_embedding, scheme_embedding)[0][0]
    return similarity

def filter_schemes(schemes, query, similarity_threshold=0.3):
    """Filter schemes based on semantic similarity to query"""
    relevant_schemes = []
    
    for scheme in schemes:
        # Combine name and description for better context
        scheme_text = f"{scheme['name']} {scheme['description']}"
        
        # Calculate relevance
        similarity = calculate_relevance(scheme_text, query, sentence_model)
        
        if similarity > similarity_threshold:
            # Convert float32 to standard Python float
            scheme['relevance_score'] = float(similarity)  # Convert to float
            relevant_schemes.append(scheme)
    
    # Sort by relevance
    relevant_schemes.sort(key=lambda x: x['relevance_score'], reverse=True)
    return relevant_schemes

def scrape_schemes(user_query):
    """Extracts keywords, searches, and scrapes relevant schemes"""
    
    # Get meaningful keywords while preserving query context
    search_query = extract_keywords(user_query)
    logger.info(f"🔍 Search query expanded to: {search_query}")

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        driver.get("https://www.myscheme.gov.in/search")

        search_bar = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "query"))
        )
        search_bar.clear()
        search_bar.send_keys(search_query)

        search_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='Search']"))
        )
        search_button.click()

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "p-4"))
        )

        # Scrape results
        schemes = []
        for item in driver.find_elements(By.CLASS_NAME, "p-4"):
            try:
                name = item.find_element(By.TAG_NAME, "a").text
                description = item.find_element(By.CLASS_NAME, "line-clamp-2").text
                link = item.find_element(By.TAG_NAME, "a").get_attribute("href")
                schemes.append({"name": name, "description": description, "link": link})
            except Exception as e:
                logger.warning(f"Failed to scrape an item: {e}")

        # Filter and rank schemes by relevance
        relevant_schemes = filter_schemes(schemes, user_query)
        
        return relevant_schemes

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return []
    finally:
        driver.quit()