/** Render the existing widget and keep its DOM details out of chat orchestration. */
export function createChatView() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatIconOpen = document.getElementById('chat-icon-open');
    const chatIconClose = document.getElementById('chat-icon-close');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatWarning = document.getElementById('chat-warning');
    const chatSendBtn = document.getElementById('chat-send-btn');
    let isChatOpen = false;

    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
            chatIconOpen.classList.add('scale-0', 'opacity-0');
            chatIconClose.classList.remove('scale-0', 'opacity-0');
            chatInput.focus();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            chatWindow.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
            chatIconOpen.classList.remove('scale-0', 'opacity-0');
            chatIconClose.classList.add('scale-0', 'opacity-0');
        }
    }

    function bindControls(sendMessage) {
        chatToggleBtn.addEventListener('click', toggleChat);
        chatCloseBtn.addEventListener('click', toggleChat);

        function handleInputKeypress(event) {
            if (event.key === 'Enter') sendMessage();
        }

        chatInput.addEventListener('keypress', handleInputKeypress);
        chatSendBtn.addEventListener('click', sendMessage);
    }

    function clearMessages() {
        chatMessages.innerHTML = '';
    }

    function renderMessage(text, sender) {
        const message = document.createElement('div');
        message.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';

        const bubble = document.createElement('div');
        if (sender === 'user') {
            bubble.className = 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm shadow-sm break-words';
        } else {
            bubble.className = 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm shadow-sm break-words';
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        }

        bubble.innerHTML = text;
        message.appendChild(bubble);
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start';
        indicator.innerHTML = `
            <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex space-x-1 shadow-sm">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function showLimitWarning() {
        chatWarning.classList.remove('hidden', 'text-green-500');
        chatWarning.classList.add('text-red-500');
    }

    function setWarningText(text) {
        chatWarning.innerText = text;
    }

    function showResetNotice(text) {
        chatWarning.classList.remove('text-red-500');
        chatWarning.classList.add('text-green-500');
        chatWarning.innerText = text;
    }

    function hideResetNotice() {
        chatWarning.classList.add('hidden');
        chatWarning.classList.remove('text-green-500');
        chatWarning.classList.add('text-red-500');
    }

    function showCooldownNotice(text) {
        chatWarning.innerText = text;
        chatWarning.classList.remove('hidden');
    }

    function hideWarning() {
        chatWarning.classList.add('hidden');
    }

    function getInputText() {
        return chatInput.value.trim();
    }

    function clearAndDisableInput() {
        chatInput.value = '';
        chatInput.disabled = true;
    }

    function restoreInput() {
        chatInput.disabled = false;
        chatInput.focus();
    }

    return {
        bindControls,
        clearMessages,
        renderMessage,
        showTypingIndicator,
        removeTypingIndicator,
        showLimitWarning,
        setWarningText,
        showResetNotice,
        hideResetNotice,
        showCooldownNotice,
        hideWarning,
        getInputText,
        clearAndDisableInput,
        restoreInput,
    };
}
