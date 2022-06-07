# How To Run The App
- Docker compose has a problem with kafka image itself so it's not working correctly with docker so follow this steps
- First install some dependencies mysql, elasticsearch, redis, kafka, node 14 and yarn and then run 
 ``` bash
yarn
``` 
- Then run
``` bash
yarn migrate
``` 
- To run the app use
``` bash
yarn start
``` 
- To run the worker that responsible for create the applications use  
``` bash
yarn application_worker
``` 
- To run the worker that responsible for create the chats use  
``` bash
yarn chat_worker
``` 
- To run the worker that responsible for create the messages use  
``` bash
yarn message_worker
``` 
- Don't forget to update .env file with the correct hosts url
# System Design
### The flow of the app
- Extract classes (Application, Chat, Message)
- Application has a relation 1 to many with a chat  
- Chat has a relation 1 to many with a message  
- Creation of the application, chat and message depends on kafka, every model has own topic and own worker 
  to pull from the related topic and create it on mysql.
- I've created a topic and worker for every model to handle race conditions and there's no model is dependent
  on other one if the topic/worker is failed or consumed many requests and avoid single point of failure.
- Handling returning chat_number & message_number to the user on creation proccess is dependent on redis,
  store the value of last creation chat_number for the application as a key & value on redis like this 
  key is `application:<application_token>` and value is a number and increase it every time of chat creation,
  and store the value of last creation message_number for the chat on specific application as a key & value
  like this key is `chat:<application_tkon>|<chat_number>` and value is a number and increase it every time of
  message creation.
- After the creation of a message it'll be stored on elastic index with related application_token and chat_number,
  so we can search for a message a specific chat by application_token & chat_number
- For updating `chats_count` & `messages_count` you can run the next command and will update the values from redis
``` bash
yarn update_chats_messages_count
```

- Create the application
```curl
curl -X POST \
  http://localhost:3000/applications/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"name":"test6"}'
```
- Get the application
```curl
curl -X GET \
  http://localhost:3000/applications/<application_token> \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json'
```
- Create chat for application
```curl
curl -X POST \
  http://localhost:3000/applications/<application_token>/chats \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json'
```
- Get chats for application
```curl
curl -X GET \
  http://localhost:3000/applications/<application_token>/chats/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json'
```
- Create message for chat
```curl
curl -X POST \
  http://localhost:3000/applications/<application_token>/chats/<chat_number>/messages/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"body": "error on all message"}'
```
- Update message for chat
```curl
curl -X PUT \
  http://localhost:3000/applications/<application_token>/chats/<chat_number>/messages/<message_number> \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"body": "error message"}'
```
- Get Messages for chat
```curl
curl -X GET \
  http://localhost:3000/applications/<application_token>/chats/<chat_number>/messages \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json'
```
- Search for message for chat
```curl
curl -X GET \
  'http://localhost:3000/search?application_token=<application_token>&chat_number=<chat_number>&body=<message_body>' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json'
```