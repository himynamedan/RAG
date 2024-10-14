from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import PyPDF2
from neo4j import GraphDatabase
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import nltk
import openai
from openai import OpenAI
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

app = Flask(__name__)
CORS(app)  # Enable CORS

# Neo4j database connection
driver = None  # This will be initialized with user input

# Configure generative AI model
genai.configure(api_key="") #Put your google API key here

# Upload folder for PDFs
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

gemini_api_key = "" #Put your google API key here
genai.configure(api_key=gemini_api_key)

# Neo4j connection details
neo4j_uri = "" #Enter your Neo4j Bolt URL here
neo4j_username = "" #Enter your Neo4j username here
neo4j_password = "" #Enter your Neo4j password here

# Function to retrieve all data from Neo4j graph


def initialize_neo4j_driver(username, password, url):
    """Initialize Neo4j driver with user provided credentials."""
    global driver
    driver = GraphDatabase.driver(url, auth=(username, password))


def read_pdf(file_path):
    """Function to read text from a PDF file."""
    with open(file_path, 'rb') as pdf:
        pdf_reader = PyPDF2.PdfReader(pdf)
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
        print(text)
    return text


def get_answer(input_text):
    """Function to generate a Cypher query using a generative AI model."""
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 0,
        "max_output_tokens": 8192,
    }

    safety_settings = []

    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                                  generation_config=generation_config,
                                  safety_settings=safety_settings)

    prompt_parts = [
        "You are able to construct and perform CRUD operations to a Neo4j graph, based on the raw text provided to you using Cypher Queries. Create nodes and relationships in the graph, based on the text that will be provided to you. For everything about a node, update that specific node table, and add to its properties and don't make a new node. Make new nodes, only if new entity is required and a relationships in required between that node and the existing node. Don't repeat the variables of entities. If something about a node is given, don't create a new table, just create it the first time and after that just update it for new text data. For new entities, create a new node, and don't touch the existing node. Also check if the node already exists first. It it does not then make a new node. Use all the text provided, do not ignore or skip text if on the next line or anything else. Generate a full query for a large graph in neo4j. Note: Don't generate any extra text, just the cypher query, not even comments and headings, just the code.",
        "input:" + str(input_text)
    ]

    response = model.generate_content(prompt_parts)
    cypher_query = response.text.strip().replace("```cypher", "").replace("```", "")
    print(cypher_query)
    return cypher_query


def run_cypher_on_neo4j(query):
    """Function to execute a Cypher query on Neo4j and return results."""
    global driver
    driver = GraphDatabase.driver(
        neo4j_uri, auth=(neo4j_username, neo4j_password))

    with driver.session() as session:
        result = session.run(query)
        return result.data()


def generate_and_exec_cypher(input_text):
    """Generate and execute Cypher query on Neo4j."""
    query = get_answer(input_text)
    return run_cypher_on_neo4j(query)


def chatbot(input_text):
    """Process input text and return Neo4j query results."""
    response = generate_and_exec_cypher(input_text)
    return response


def extract_links(url):
    """Extract links from a given URL."""
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    links = []
    for link in soup.find_all("a", href=True):
        href = link["href"]
        absolute_url = urljoin(url, href)
        parsed_url = urlparse(absolute_url)
        if parsed_url.netloc == urlparse(url).netloc:
            links.append(absolute_url)
    return links


def scrape_further_domains(base_url, visited=set(), depth=3):
    """Scrape content recursively from a base URL and its linked pages."""
    if depth == 0:
        return ""
    links = extract_links(base_url)
    page_content = ""
    response = requests.get(base_url)
    soup = BeautifulSoup(response.content, "html.parser")
    paragraphs = soup.find_all("p")
    for paragraph in paragraphs:
        page_content += paragraph.get_text()
    for link in links:
        if link not in visited:
            print("Scraping:", link)
            visited.add(link)
            page_content += scrape_further_domains(link, visited, depth - 1)
    return page_content


@app.route('/process', methods=['POST'])
def process():
    try:
        if 'pdfFile' in request.files:
            file = request.files['pdfFile']
            if file.filename == '':
                return jsonify({'message': 'No selected file'}), 400
            if file and file.filename.endswith('.pdf'):
                file_path = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(file_path)
                try:
                    pdf_text = read_pdf(file_path)
                    response = chatbot(pdf_text)
                    return jsonify({'message': 'File uploaded successfully', 'text': response}), 200
                except Exception as e:
                    return jsonify({'message': 'Error reading PDF file', 'error': str(e)}), 500
            else:
                return jsonify({'message': 'Invalid file type'}), 400
        else:
            data = request.json
            input_text = data.get('text', '')
            neo4j_username = data.get('username', '')
            neo4j_password = data.get('password', '')
            neo4j_url = data.get('url', '')

            if not input_text:
                return jsonify({'message': 'No text provided'}), 400

            if not (neo4j_username and neo4j_password and neo4j_url):
                return jsonify({'message': 'Neo4j credentials are required'}), 400

            # Initialize Neo4j driver with user provided credentials
            initialize_neo4j_driver(neo4j_username, neo4j_password, neo4j_url)

            try:
                parsed_base_url = urlparse(input_text)
                if parsed_base_url.scheme and parsed_base_url.netloc:
                    print("Scraping base URL:", input_text)
                    collected_content = scrape_further_domains(input_text)
                    print("Collected content from all pages:\n", collected_content)
                    response = chatbot(collected_content)
                else:
                    response = chatbot(input_text)
                return jsonify({'message': 'Text processed successfully', 'text': response}), 200
            except Exception as e:
                return jsonify({'message': 'Error processing text', 'error': str(e)}), 500

    except Exception as e:
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500


# Replace with your Gemini API key
gemini_api_key = "" #Put your google API key here

# Configure Gemini API
genai.configure(api_key=gemini_api_key)

# Neo4j connection details
neo4j_uri = "" #Enter your Neo4j Bolt URL here
neo4j_username = "" #Enter your Neo4j username here
neo4j_password = "" #Enter your Neo4j password here

# Function to retrieve all data from Neo4j graph


def get_all_data_from_neo4j():
    driver = GraphDatabase.driver(
        neo4j_uri, auth=(neo4j_username, neo4j_password))
    cypher_query = "MATCH (n) MATCH (n)-[r]-() RETURN n,r"
    result_list = []

    with driver.session() as session:
        result = session.run(cypher_query)
        for record in result:
            result_list.append(record.data())

    driver.close()
    return str(result_list)

# Function to get Cypher query from Gemini API based on user question and Neo4j data


def get_cypher_query_from_gemini(question, neo4j_data):
    # Set up YOUR OpenAI API key

    client = OpenAI(
        api_key="") #Put your google API key here

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",

        # messages=[
        # {
        #    "role": "user",
        #    "content": "Answer the following question in one to two lines with the following data:\n"+str(neo4j_data),
        # },
        # {
        #    "role": "user",
        #    "content": "Answer the following:\n"+question,
        # }
        # ],
        messages=[
            {
                "role": "user",
                "content": "Take the following data:\n"+str(neo4j_data),
            },
            {
                "role": "user",
                "content": "Generate a valid cypher query in neo4j based on the data provided for the following question:\n"+question+"\nFirst check the properties of the node then check the relationships.\nDo not generate any extra words or data outside the data provided. Just give the code, no comments, no extra words",
            }
        ]
    )

    responses = response.choices[0].message.content

    print(responses)
    return responses


def split_into_chunks(data, num_chunks):
    """
    Splits the data into approximately equal chunks.
    """
    total_length = len(data)
    chunk_size = total_length // num_chunks

    chunks = []
    for i in range(num_chunks):
        if i == num_chunks - 1:
            chunks.append(data[i * chunk_size:])
        else:
            chunks.append(data[i * chunk_size: (i + 1) * chunk_size])
    print(chunks[0]+"\n"+chunks[1])
    return chunks


def merge_question_answer(question, oneWord):
    # Set up YOUR OpenAI API key

    client = OpenAI(
        api_key="sk-proj-h2NzUkVdlyJYmsZaPjJ2T3BlbkFJJt9LqxpwocewYpSh56kh")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",

        messages=[
            {
                "role": "user",
                "content": "Take the following answer"+oneWord,
            },
            {
                "role": "user",
                "content": "You are a friendly chat bot. Merge the answer with the following question to make a complete answer of one to two lines:\n"+question+"\nand do not return a question. If no answer is given, dont make an answer by yourself.",
            }
        ],

    )

    responses = response.choices[0].message.content

    print(responses)
    return responses

# Function to execute Cypher query on Neo4j database


def execute_cypher_query(query):
    driver = GraphDatabase.driver(
        neo4j_uri, auth=(neo4j_username, neo4j_password))
    result_list = []

    try:
        with driver.session() as session:
            result = session.run(query)
            for record in result:
                result_list.append(record.data())
    except:
        print("Connection is not stable")

    driver.close()

    # Extract and format the relevant part of the response
    if result_list:
        answer = ', '.join(
            [str(value) for record in result_list for key,
             value in record.items() if value is not None]
        )
    else:
        answer = "No results found."

    return answer


def merge_question_answer_nltk(question, answer):
    """
    Merges a question and a one-word answer into a full answer sentence using NLTK.

    Args:
        question: The user's question as a string.
        answer: The one-word answer returned by your existing code.

    Returns:
        A full answer sentence as a string, or the original question if merging is not possible.
    """

    # Tokenize the question into words (using NLTK's word_tokenize)
    question_tokens = nltk.word_tokenize(question)

    # Check if answer can be directly inserted without grammatical issues (handles simple cases)
    if answer.lower() in question_tokens and answer not in ('a', 'an', 'the'):
        return question  # No merging needed

    # Attempt to identify the noun phrase related to the answer (if possible)
    try:
        # Use NLTK's pos_tag to get part-of-speech tags
        tagged_tokens = nltk.pos_tag(question_tokens)

        # Find noun phrases (NN or NNS tags) within the question
        noun_phrases = []
        for i, (token, tag) in enumerate(tagged_tokens):
            if tag in ('NN', 'NNS'):
                # Check for multi-word noun phrases
                if i < len(tagged_tokens) - 1 and tagged_tokens[i + 1][1] in ('NN', 'NNS'):
                    noun_phrases.append(f"{token} {tagged_tokens[i + 1][0]}")
                else:
                    noun_phrases.append(token)

        # Find the noun phrase with the highest similarity to the answer (using Levenshtein distance)
        most_similar_phrase = None
        min_distance = float('inf')
        for phrase in noun_phrases:
            distance = nltk.edit_distance(phrase.lower(), answer.lower())
            if distance < min_distance:
                min_distance = distance
                most_similar_phrase = phrase

        if most_similar_phrase:
            # Replace the noun phrase with the answer and handle articles (a/an/the)
            answer_index = question_tokens.index(most_similar_phrase)
            articles = ['a', 'an', 'the']
            if question_tokens[answer_index - 1].lower() in articles:
                # Remove article if present before the phrase
                del question_tokens[answer_index - 1]
            question_tokens[answer_index] = answer
            # Join tokens back into a sentence
            return ' '.join(question_tokens)
    except (LookupError, IndexError):
        pass  # Handle potential NLTK resource download errors or invalid questions

    # Enhanced fallback for broader question types:
    # - Try identifying the verb phrase (if present) using part-of-speech tags
    verb_phrase = None
    for i, (token, tag) in enumerate(tagged_tokens):
        if tag.startswith('VB'):  # Check for verb-related tags (VB, VBP, VBG, etc.)
            verb_phrase = f"{token}"
            # Look for multi-word verb phrases
            for j in range(i + 1, len(tagged_tokens)):
                if tagged_tokens[j][1].startswith('VB'):
                    verb_phrase += f" {tagged_tokens[j][0]}"
                else:
                    break
            break  # Stop after finding the first verb phrase

    if verb_phrase:
        # Construct a full answer using the verb phrase and answer:
        return f"{verb_phrase} {answer}."
    else:
        # Default fallback (more generic):
        return f"The answer is {answer}."


@app.route('/ask', methods=['GET'])
def ask_question():
    user_question = request.args.get('question')

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    neo4j_data = get_all_data_from_neo4j()
    cypher_query = get_cypher_query_from_gemini(user_question, neo4j_data)
    oneWord = execute_cypher_query(cypher_query)
    fullAnswer = merge_question_answer(user_question, oneWord)
    print(fullAnswer)
    return jsonify({"question": user_question, "cypher_query": cypher_query, "result": fullAnswer})

@app.route('/clear-knowledge-graph', methods=['POST'])
def clear_knowledge_graph():
    print("Deleted")

    neo4j_uri = "" #Put your Bolt URL Here here
    neo4j_username = "" #Put your username here
    neo4j_password = "" #Put your Neo4j password here
    driver = GraphDatabase.driver(
        neo4j_uri, auth=(neo4j_username, neo4j_password))

    cypher_query = "MATCH (n) DETACH DELETE n"

    with driver.session() as session:
        session.run(cypher_query)
    driver.close()
    return jsonify({"status":"ok"})

if __name__ == '__main__':
    app.run(debug=True)
