import config from "../config/config";

export const geminiApiCall = async (newMessages) => {
    try {
        var filteredMessages = newMessages.filter(message => {
            return message.role !== 'model' // Remove all the assistant messages and keep the user messages only
        })

        console.log("Filtered Messages",newMessages);
        const response = await fetch(config.gemini, {
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

