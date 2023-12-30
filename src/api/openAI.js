export const openaiApiCall = async (newMessages) => {
    try {
        // var filteredMessages = newMessages.filter(message => {
        //     return message.role !== 'assistant' // Remove all the assistant messages and keep the user messages only
        // })

        // console.log("Filtered Messages",filteredMessages);
        const response = await fetch('http://192.168.0.148:3000/gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMsg: newMessages,
            }),
        });

        let responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

