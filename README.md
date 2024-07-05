# Food Truck Finder

Food Truck Finder is a web application that helps users locate the nearest food trucks in San Francisco. The application consists of a client-side Next.js app and a server-side Node.js app, both of which are containerized using Docker.

## Features

- Interactive map to find food trucks.
- Clustered map markers for better visualization.
- Clickable markers to view details of each food truck.
- Geolocation button to center the map on the user's current location.
- Responsive design for use on various devices.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

Follow these steps to set up and run the project:

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. Create an `.env` file in the root directory of the project and add the necessary environment variables:
    ```env
    NEXT_PUBLIC_DATA_SERVER_HOST=http://localhost
    NEXT_PUBLIC_DATA_SERVER_URL=/api/trucks
    MAP_ID=<your_google_maps_api_key>
    ```

3. Build and run the Docker containers using Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. Access the application:
    - The client app will be available at `http://localhost:3000`.
    - The server app will be available at `http://localhost:5000`.

## Next Steps

There is a lot of room for impovement:
- Iterate over components design for better UI
- Improve server apis security
- Add user model to store favorites places and other useful data
