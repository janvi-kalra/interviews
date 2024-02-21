import requests

# Grab data from API endpoint 
def fetch_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        manipulate_data(data)
    else:
        raise Exception('Could not grab data, failed with status code', response.status_code)

def manipulate_data(data):
    print(data)


# Example API URL from JSONPlaceholder
api_url = 'https://jsonplaceholder.typicode.com/todos'
result = fetch_data(api_url)