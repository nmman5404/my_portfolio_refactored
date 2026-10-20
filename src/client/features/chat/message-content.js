function safeHref(value) {
    if (!/^https?:\/\//i.test(value) || /[\s<>"`]/u.test(value)) return null;
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && url.hostname ? url.href : null;
    } catch {
        return null;
    }
}

/** Keep sentence punctuation outside links, preserving balanced URL brackets. */
function trimUrlPunctuation(value) {
    const openingBrackets = { ')': '(', ']': '[', '}': '{' };
    let end = value.length;
    while (end > 0) {
        const last = value[end - 1];
        if (/[.,!?;:'"’”»…]/u.test(last)) {
            end--;
            continue;
        }
        const opening = openingBrackets[last];
        if (!opening) break;
        const url = value.slice(0, end);
        const count = character => [...url].filter(value => value === character).length;
        if (count(last) <= count(opening)) break;
        end--;
    }
    return value.slice(0, end);
}

function readMarkdownLink(text, start) {
    const labelEnd = text.indexOf(']', start + 1);
    if (labelEnd < 0 || text[labelEnd + 1] !== '(' || text.slice(start, labelEnd).includes('\n')) return null;
    const destinationStart = labelEnd + 2;
    let depth = 1;
    for (let index = destinationStart; index < text.length; index++) {
        if (text[index] === '\n') return null;
        if (text[index] === '(') depth++;
        if (text[index] !== ')' || --depth > 0) continue;
        let destination = text.slice(destinationStart, index).trim();
        if (destination.startsWith('<') && destination.endsWith('>')) destination = destination.slice(1, -1);
        return {
            label: text.slice(start + 1, labelEnd),
            href: safeHref(destination),
            end: index + 1,
        };
    }
    return null;
}

function createLink(href) {
    const link = document.createElement('a');
    link.className = 'chat-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
}

function appendInline(parent, text, { links = true, bold = true } = {}) {
    const markers = links ? /\*\*|\[|https?:\/\/|\n/gi : /\*\*|\n/g;
    let cursor = 0;
    let match;
    while ((match = markers.exec(text))) {
        parent.append(document.createTextNode(text.slice(cursor, match.index)));
        let end = match.index + match[0].length;
        if (match[0] === '\n') {
            parent.append(document.createElement('br'));
        } else if (match[0] === '**' && bold) {
            const closing = text.indexOf('**', end);
            if (closing >= end && !text.slice(end, closing).includes('\n')) {
                const strong = document.createElement('strong');
                appendInline(strong, text.slice(end, closing), { links, bold: false });
                parent.append(strong);
                end = closing + 2;
            } else {
                parent.append(document.createTextNode(match[0]));
            }
        } else if (match[0] === '[') {
            const markdown = readMarkdownLink(text, match.index);
            if (markdown) {
                if (markdown.href) {
                    const link = createLink(markdown.href);
                    appendInline(link, markdown.label, { links: false, bold });
                    parent.append(link);
                } else {
                    parent.append(document.createTextNode(text.slice(match.index, markdown.end)));
                }
                end = markdown.end;
            } else {
                parent.append(document.createTextNode(match[0]));
            }
        } else if (/^https?:\/\//i.test(match[0])) {
            const candidate = /^[^\s<>"`]+/u.exec(text.slice(match.index))[0];
            const label = trimUrlPunctuation(candidate);
            const href = safeHref(label);
            if (href) {
                const link = createLink(href);
                link.textContent = label;
                parent.append(link, document.createTextNode(candidate.slice(label.length)));
            } else {
                parent.append(document.createTextNode(candidate));
            }
            end = match.index + candidate.length;
        } else {
            parent.append(document.createTextNode(match[0]));
        }
        cursor = end;
        markers.lastIndex = end;
    }
    parent.append(document.createTextNode(text.slice(cursor)));
}

/** Format model text with DOM nodes; model-provided HTML is never executed. */
export function renderMessageContent(text) {
    const fragment = document.createDocumentFragment();
    appendInline(fragment, String(text).replace(/\r\n?/g, '\n'));
    return fragment;
}
