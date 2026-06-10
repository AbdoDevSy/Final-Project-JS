 const baseURL = 'http://127.0.0.1:8000/api/posts';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const params = {
        params: {
            'limit': 50
        }
    }

    axios.get(baseURL, config, params)
        .then(response => {
            console.log(response.data.data[0]['body']);
        })
        .catch(error => {
            console.error(error);
        });