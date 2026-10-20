import { renderMessageContent } from './message-content.js';

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

    function setChatOpen(open) {
        isChatOpen = open;
        chatToggleBtn.setAttribute('aria-expanded', String(open));
        chatWindow.setAttribute('aria-hidden', String(!open));
        chatWindow.inert = !open;
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
            if (chatWindow.contains(document.activeElement)) chatToggleBtn.focus();
        }
    }

    function open() {
        setChatOpen(true);
    }

    function bindControls(sendMessage) {
        chatToggleBtn.addEventListener('click', () => setChatOpen(!isChatOpen));
        chatCloseBtn.addEventListener('click', () => setChatOpen(false));

        function handleInputKeydown(event) {
            if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return;
            event.preventDefault();
            sendMessage();
        }

        chatInput.addEventListener('keydown', handleInputKeydown);
        chatSendBtn.addEventListener('click', () => sendMessage());
    }

    function clearMessages() {
        chatMessages.innerHTML = '';
    }

    function renderMessage(text, sender) {
        const message = document.createElement('div');
        message.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';

        const bubble = document.createElement('div');
        if (sender === 'user') {
            bubble.className = 'chat-bubble chat-bubble-user bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm shadow-sm break-words';
            bubble.textContent = text;
        } else {
            bubble.className = 'chat-bubble chat-bubble-bot bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm shadow-sm break-words';
            bubble.append(renderMessageContent(text));
        }

        message.appendChild(bubble);
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start';
        indicator.innerHTML = `
            <div class="chat-bubble chat-bubble-bot bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex space-x-1 shadow-sm">
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
        chatWarning.classList.remove('text-green-500');
        chatWarning.classList.add('text-red-500');
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
        chatSendBtn.disabled = true;
        chatWindow.setAttribute('aria-busy', 'true');
    }

    function restoreInput() {
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        chatWindow.setAttribute('aria-busy', 'false');
        if (isChatOpen) chatInput.focus();
    }

    return {
        open,
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
