# How To Run The Challenge
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