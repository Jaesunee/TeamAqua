import requests
import pprint

from bs4 import BeautifulSoup, NavigableString, Tag
from selenium import webdriver
from selenium.webdriver.chrome.service import Service




import time

def main(url):
    htmlBody = scrape_url(url)
    extracted_text = []
    extract_tags(htmlBody,extracted_text)
    qna_bank = parse_questions_and_answers(extracted_text)
    return qna_bank

def scrape_url(url):
    # Set up the Selenium driver (replace 'path/to/chromedriver' with the path to your ChromeDriver)
    chrome_service = Service(executable_path='../chromedriver')
    driver = webdriver.Chrome(service=chrome_service)
    # Navigate to the URL
    driver.get(url)
    # Wait for the JavaScript to load the content (you can adjust the sleep time as needed)
    time.sleep(5)
    # Get the page source (including the JavaScript-rendered content)
    page_source = driver.page_source
    # Close the driver
    driver.quit()

    # Now, you can use Beautiful Soup to parse the content
    soup = BeautifulSoup(page_source, 'html.parser')
    mydivs = soup.find("div", {"class": "whenContentEditable"})
    mydivs = soup.select_one("main")
    return mydivs

def extract_tags(element, result):
    if isinstance(element, Tag):
        has_tag_children = any(isinstance(child, Tag) for child in element.contents)
        if not has_tag_children:
            content = element.get_text(strip=True)
            if content.startswith('?q') or content.startswith('?a'):
                # Check if inside result
                if content not in result:
                    result.append(content)
        else:
            content = element.get_text(strip=True)
            if content.startswith('?q') or content.startswith('?a'):
                if content not in result:
                    result.append(content)
        for child in element.contents:
            extract_tags(child, result)
    return result

def parse_questions_and_answers(input:list):
    # Data structure planning in DB
    # Will require a Module 
    question_and_answer_bank = []
    first = True
    current_question = {"prompt": "", "answer":[], "hint":[]}
    for str in input:
        # New question, clear current_question
        if str.startswith("?q"):
            # If current_question is not empty, add to qna bank
            if current_question:
                if not first: # Does not append the first one
                    question_and_answer_bank.append(current_question)
                else:
                    first = False
                current_question = {
                    "prompt":str.replace("?q", ""),
                    "answer":[],
                    "hint":[]
                }
        elif str.startswith("?a"):
            parsed_answer = str.replace("?a", "")
            current_question["answer"].append(parsed_answer)
        elif str.startswith("?h"):
            # Not implemented yet
            current_question["hint"].append(str.replace("?h", ""))
    # pprint.pprint(question_and_answer_bank)
    return question_and_answer_bank
    


        



    

# if __name__ == "__main__":
#     url_to_scrape = "https://precious-lilac-ec3.notion.site/CardCraft-Example-9dca5a06650540b687a8c48c565d1b89"  # Replace with the URL you want to scrape
#     main(url_to_scrape)