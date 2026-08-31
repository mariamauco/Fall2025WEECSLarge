# Fall2025WEECSLarge
This project is about creating a waste sorting system that can detect objects such as cans, bottles, cardboard, paper, from a camera or image, classify them into categories, and inform the user on the best way to dispose of it.


To clone and start the app:

For Ubunutu:
1. Go into your directory and clone:
`git clone https://github.com/your-username/Fall2025WEECSLarge`

2. Go into the project directory:
`cd Fall2025WEECSLarge`

3. Start all development services with Docker:
`docker compose --profile dev up --build`

4. Open the React app at `http://localhost:3001`.

The development services are React on port `3001`, Express on port `5050`, and
Flask on port `5055`. Stop them with `Ctrl+C`.

To run the production stack:
`docker compose --profile prod up --build -d`

Open the production app at `http://localhost:3000`. Stop it with:
`docker compose --profile prod down`
