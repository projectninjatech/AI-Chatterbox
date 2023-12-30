export const dalleApiCall = async (message) => {
    try {

        console.log("User message",message)
        const response = await fetch('http://192.168.0.148:3000/dalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMsg: message,
            }),
        });

        let responseData = await response.json();
        console.log("Response Data", responseData);
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

