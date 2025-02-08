from webScraper import main as retrieve_flashcards
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime
import json

# Replace 'path/to/your-service-account.json' with the path to your Firebase service account JSON file
cred = credentials.Certificate("../python_firebase_keys.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def fs_add_flashcard(module: str, chapter_number:int, chapter_name:str, data:dict):
    db.collection(module).document(str(chapter_number)).collection("flashcard_data").add(data)
    db.collection(module).document("chapter_mapping").set({chapter_name: chapter_number}, merge=True)


def fs_scrape_and_add_flashcard(url:str, module:str, chapter_number:int, chapter_name:str):
    flashcard_list = retrieve_flashcards(url)
    # print(flashcard_list)
    module_name = module
    chapter_name = chapter_name
    for flashcard in flashcard_list:
        # Add the chapter_name to the flashcard object
        # Add the flashcard object to the Firestore collection hierarchy
        db.collection(module_name).document(str(chapter_number)).collection("flashcard_database").add(flashcard)

    # Store chapter_name : chapter_order mapping here
    db.collection(module_name).document("chapter_mapping").set({chapter_name: chapter_number}, merge=True)

# # Function to add a new flashcard
# def add_flashcard(module_name:str, flashcard_obj:dict):
#     flashcard_ref = db.collection('modules').document(module_name).collection('flashcards').document()
#     flashcard_ref.set({
#     })

# Function to fetch all flashcards for a module and chapter

def get_chapter_number(module_name, chapter_name):
    """
    Takes in module name and chapter_name, uses the mapping in firebase to get the order.
    """
    chapters_ref = db.collection(module_name).document("chapter_mapping").get()
    if chapters_ref.exists:
        chapter_number = chapters_ref.get(chapter_name)
        if chapter_number is not None:
            return chapter_number
        return -1
    return -1


def fs_get_flashcards(module_name, chapter_name):
    # Query the Firestore collection for flashcards with the given module_name and chapter_name
    # Query the Firestore collection for chapters with the given module_name
    chapter_number = get_chapter_number(module_name,chapter_name)
    if chapter_number == -1:
        return "Chapter does not exist!"
    chapters_ref = db.collection(module_name).document(str(chapter_number))
    
    # Get the flashcard_database sub-collection
    flashcards_ref = chapters_ref.collection("flashcard_data")
    flashcards_docs = flashcards_ref.stream()

    # Convert the flashcards to a list of dictionaries
    flashcards_list = [{"id": doc.id, **doc.to_dict()} for doc in flashcards_docs]

    if len(flashcards_list) == 0:
        return "Chapter has no flashcards yet."
    return flashcards_list

def fs_update_flashcard(module_name, chapter_name, flashcard_id, new_flashcard_obj):
    # Query the Firestore collection for flashcards with the given module_name and chapter_name
    # Query the Firestore collection for chapters with the given module_name
    chapter_number = get_chapter_number(module_name,chapter_name)
    if chapter_number == -1:
        print("Chapter does not exist!")
        return "Chapter does not exist!"
    chapters_ref = db.collection(module_name).document(str(chapter_number))
    
    # Get the flashcard_database sub-collection
    flashcards_ref = chapters_ref.collection("flashcard_database")
    flashcard_ref = flashcards_ref.document(flashcard_id)
    flashcard_ref.update(new_flashcard_obj)
    return "Flashcard updated!"

def fs_login(id):
    """
    When a user logs in, fetches user info from DB.
    If first time login, create a new collection for them
    """
    user_ref = db.collection('users').document(id)
    user = user_ref.get()

    if user.exists:
        user_data = user.to_dict()
        return user_data
    else:
        # If the user does not exist, create a new document for them
        user_ref.set({
            'uid': id,
            # add any other user info you want to store
        })
        return {'uid': id}

def fs_get_modules(id):
    modules_ref = db.collection('modules')
    query = modules_ref.where('userID', '==', id)
    docs = query.stream()

    matching_docs = []
    for doc in docs:
        matching_docs.append(doc.to_dict())

    return matching_docs


def fs_add_modules(module_name:str, id:str):
    """
    Add a module to Firestore
    """

    # Get a reference to the "modules" collection
    modules_ref = db.collection('modules')

    # Generate a unique document ID
    doc_ref = modules_ref.document()

    # Get the current date and time
    current_date = datetime.now()

    # Create the data dictionary for the document
    data = {
        'moduleName': module_name,
        'userID': id,
        'dateCreated': current_date,
        'chapterMapping': {}  # Assuming an empty chapter mapping initially
    }

    # Set the data in the document
    doc_ref.set(data)

    # Print the document ID for reference
    print("Added module with ID:", doc_ref.id)

def fs_add_chapter(chapterName:str, moduleName:str, id:str):
    """
    Add a chapter to Firestore
    """
    # Create a new chapters doc
    new_chapter_ref = db.collection('chapters').add({
        'chapterName': chapterName,
        'flashcards':[]
    })
    chapterId = new_chapter_ref[1].id

    # Get a reference to the "modules" collection
    modules_ref = db.collection('modules')
    query = modules_ref.where('userID', '==', id).where('moduleName', '==', moduleName)
    docs = query.stream()
    try:
        doc = next(docs)
        db.collection('modules').document(doc.id).update({
            'chapterMapping': firestore.ArrayUnion([
                {
                    'chapterName': chapterName, 
                    'chapterID': chapterId
                }])
        })
    except StopIteration:
        return "Module does not exist!"




    # Create the data dictionary for the document
    # data = {
    #     'chapterName': chapterName,
    #     'userID': id,
    #     'dateCreated': current_date,
    #     'chapterMapping': {}  # Assuming an empty chapter mapping initially
    # }




# Example usage

# if __name__ == "__main__":
#     # Replace with the URL you want to scrape
#     url_to_scrape = "https://precious-lilac-ec3.notion.site/CardCraft-Example-9dca5a06650540b687a8c48c565d1b89"  
#     scrape_and_add_flashcard(url_to_scrape)