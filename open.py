from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("openai-env"))

completion = client.chat.completions.create(
model="gpt-3.5-turbo",
messages=[
        {"role": "system", "content":"You are able to construct and perform CRUD operations to a Neo4j graph, based on the raw text provided to you using Cypher Queries. Create nodes and relationships in the graph, based on the text that will be provided to you. For everything about a node, update that specific node table, and add to its properties and don't make a new node. Make new nodes, only if new entity is required and a relationships in required between that node and the existing node. Don't repeat the variables of entities. If something about a node is given, don't create a new table, just create it the first time and after that just update it for new text data. For new entities, create a new node, and don't touch the existing node. Also check if the node already exists first. It it does not then make a new node. Use all the text provided, do not ignore or skip text if on the next line or anything else. Generate a full query for a large graph in neo4j. Note: Don't generate any extra text, just the cypher query, not even comments and headings, just the code."},
        {"role": "user", "content": "Generate it for the following: " + "PAFIAST is located in Haripur"}
    ]
    )

print(completion.choices[0].message)