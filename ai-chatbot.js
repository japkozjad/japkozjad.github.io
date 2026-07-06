document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");

    if (!chatHistory || !chatInput || !chatSendBtn) return;

    let responsesData = null;
    let currentContext = null;
    let botState = "base";
    let angryTarget = null;

    fetch('/assets/bot-responses.json')
        .then(res => res.json())
        .then(data => {
            responsesData = data;
        })
        .catch(err => console.error("Failed to boot ApplyAI core:", err));

    function appendMessage(text, isBot = false) {
        if (text === null || text === undefined || text === "") text = "...";
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble", isBot ? "bot-message" : "user-message");

        let formattedText = String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        formattedText = formattedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
        formattedText = formattedText.replace(/:([a-zA-Z0-9_]+):/g, '<img src="/assets/site/emotes/$1.webp" alt=":$1:" class="chat-emote" title=":$1:" draggable="false">');

        if (isBot) {
            bubble.classList.add("has-avatar");
            bubble.innerHTML = `
                <img src="/assets/site/chatbot/apply.png" class="chat-avatar" draggable="false">
                <div class="chat-message-content">
                    <p>${formattedText}</p>
                </div>
            `;
        } else {
            bubble.innerHTML = `<p>${formattedText}</p>`;
        }

        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function getRandomResponse(arr, nameTag = "") {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * arr.length);
        return String(arr[randomIndex]).replace(/%name%/g, nameTag);
    }

    function matchPatterns(patterns, text) {
        if (!patterns || !Array.isArray(patterns)) return false;
        return patterns.some(patternStr => {
            try {
                return new RegExp(patternStr, 'i').test(text);
            } catch (e) {
                return false;
            }
        });
    }

    function checkNonLoreModule(moduleObj, text) {
        if (!moduleObj || typeof moduleObj !== 'object') return null;
        for (const subKey in moduleObj) {
            const item = moduleObj[subKey];
            if (item && item.patterns && matchPatterns(item.patterns, text)) {
                return getRandomResponse(item.responses);
            }
        }
        return null;
    }

    function generateResponse(userInput) {
        if (!responsesData) return "System error: I forgot my brain :p";
        const text = userInput.trim();

        if (botState === "angry") {
            const apologyPatterns = responsesData.apologize_keywords || ["\\b(sorry|apologize|apologies|my bad)\\b"];
            if (matchPatterns(apologyPatterns, text)) {
                const prevTarget = angryTarget || "them";
                botState = "base";
                angryTarget = null;
                return getRandomResponse(responsesData.apologize_responses, prevTarget) || `Fine. Just don't talk like that about ${prevTarget} again. :smokepuff:`;
            }
            const activeTag = currentContext && responsesData.meta_characters?.[currentContext]?.tag ? responsesData.meta_characters[currentContext].tag : (angryTarget || "them");
            return getRandomResponse(responsesData.angry_responses, activeTag) || "I ain't goin' to answer until you apologize!";
        }

        const { meta_characters, character_lore, intents_map } = responsesData;

        if (meta_characters) {
            let foundOtherChar = false;
            for (const key in meta_characters) {
                if (key !== "apply" && matchPatterns([meta_characters[key].names], text)) {
                    currentContext = key;
                    foundOtherChar = true;
                    break;
                }
            }
            if (!foundOtherChar) {
                const maintainsContext = /\b(she|her|he|him|his|they|them|their)\b/i.test(text);
                if (!maintainsContext && /\b(apply|you|yourself|your|u)\b/i.test(text)) {
                    currentContext = "apply";
                }
            }
        }

        if (!currentContext && meta_characters?.apply) {
            currentContext = "apply";
        }

        const activeTag = currentContext && meta_characters?.[currentContext]?.tag ? meta_characters[currentContext].tag : "them";

        if (currentContext && character_lore && character_lore[currentContext] && Array.isArray(intents_map)) {
            const lore = character_lore[currentContext];

            for (const intent of intents_map) {
                if (matchPatterns(intent.patterns, text)) {
                    let targetKey = intent.key;

                    if (currentContext === "apply") {
                        if (targetKey === "you_like" && (!lore.you_like || lore.you_like.length === 0)) targetKey = "likes";
                        if (targetKey === "you_dislike" && (!lore.you_dislike || lore.you_dislike.length === 0)) targetKey = "dislikes";
                    }

                    const res = getRandomResponse(lore[targetKey], activeTag);
                    if (res) {
                        const triggers = Array.isArray(lore.anger_triggers) ? lore.anger_triggers : ["rude_answer", "nsfw_request"];
                        if (triggers.includes(targetKey)) {
                            botState = "angry";
                            angryTarget = activeTag;
                        }
                        return res;
                    }
                }
            }
        }

        const nonLoreSections = [
            responsesData.japkozjad_info,
            responsesData.site_questions,
            responsesData.small_talk
        ];

        for (const section of nonLoreSections) {
            const res = checkNonLoreModule(section, text);
            if (res) return res;
        }

        const fallbacks = responsesData.fallback_responses || responsesData.generic_responses?.default_responses;
        return getRandomResponse(fallbacks) || "Huh?";
    }

    function handleSend() {
        const query = chatInput.value.trim();
        if (query === "") return;

        appendMessage(query, false);
        chatInput.value = "";

        setTimeout(() => {
            const botAnswer = generateResponse(query);
            appendMessage(botAnswer, true);
        }, 500);
    }

    chatSendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
});